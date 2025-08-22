require('dotenv').config();
const { createClient } = require('@sanity/client');
const { micromark } = require('micromark');
const { JSDOM } = require('jsdom');
const { htmlToBlocks } = require('@portabletext/block-tools');
const { Schema } = require('@sanity/schema');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const xml2js = require('xml2js');
const { default: fetch } = require('node-fetch');

// --- APIクライアント設定 ---
// 重要: 以下の環境変数を設定してください。
// 1. Sanity APIトークン:
//    export SANITY_API_TOKEN='YOUR_SANITY_API_TOKEN_HERE'
// 2. Gemini APIキー (自動モードでのみ必要):
//    export GEMINI_API_KEY='YOUR_GEMINI_API_KEY_HERE'

// Sanity クライアント
const client = createClient({
  projectId: 'ck8ysor6', // あなたのSanityプロジェクトID
  dataset: 'production', // あなたのSanityデータセット
  apiVersion: '2025-08-10', // 最新の日付を使用
  useCdn: false, // 書き込みにはfalseを設定
  token: process.env.SANITY_API_TOKEN,
});

// Gemini クライアント
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// RSSフィードのURL
const RSS_FEED_URL = 'https://news.yahoo.co.jp/rss/topics/it.xml';

// --- Sanity スキーマ定義 (簡易版) ---
const defaultSchema = Schema.compile({
  name: 'myBlog',
  types: [
    {
      type: 'document',
      name: 'post',
      fields: [
        { title: 'Title', type: 'string', name: 'title' },
        {
          title: 'Body',
          name: 'body',
          type: 'array',
          of: [{ type: 'block' }],
        },
        { title: 'Slug', name: 'slug', type: 'slug', options: { source: 'title', maxLength: 96 } },
        { title: 'Published at', name: 'publishedAt', type: 'datetime' },
      ],
    },
  ],
});

const blockContentType = defaultSchema.get('post').fields.find((field) => field.name === 'body').type;

/**
 * 指定されたタイトルとMarkdownコンテンツからSanityの下書きを作成します。
 * @param {string} title - 記事のタイトル。
 * @param {string} markdownContent - 記事の本文 (Markdown形式)。
 */
async function saveDraftToSanity(title, markdownContent) {
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error('Sanity APIトークンが環境変数に設定されていません。');
  }

  console.log('MarkdownをPortable Textに変換しています...');
  const html = String(micromark(markdownContent));
  const dom = new JSDOM(html);
  const blocks = await htmlToBlocks(dom.window.document.body.innerHTML, blockContentType, {
    parseHtml: (htmlString) => new JSDOM(htmlString).window.document,
  });
  console.log('変換に成功しました。');

  const draftSlug = title
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase() + `-${Date.now()}`;

  const doc = {
    _type: 'post',
    _id: 'drafts.' + draftSlug,
    title: title,
    slug: { _type: 'slug', current: draftSlug },
    body: blocks,
    publishedAt: new Date().toISOString(),
  };

  console.log('Sanityに下書きを保存しています...');
  const result = await client.create(doc);
  console.log('Sanityに下書きが作成されました。 ID:', result._id);
  console.log('確認用URL:', `https://kozukai-tosan-blog.sanity.studio/desk/post;${result._id}`);
}

/**
 * RSSフィードを取得し、パースします。
 */
async function fetchAndParseRss() {
  // ... (この関数の内容は変更なし)
  console.log('Fetching and parsing RSS feed...');
  try {
    const response = await fetch(RSS_FEED_URL);
    const rssContent = await response.text();
    const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });
    const result = await parser.parseStringPromise(rssContent);
    return result.rss.channel.item;
  } catch (error) {
    console.error('Error fetching or parsing RSS feed:', error.message);
    return [];
  }
}

/**
 * Gemini APIを使用して、指定されたトピックに関するブログ記事を生成します。
 */
async function generateArticle(topic, link) {
    if (!genAI) {
        throw new Error('Gemini APIキーが設定されていません。自動生成はできません。');
    }
  // ... (この関数の内容は変更なし)
  console.log(`Generating article for topic: ${topic} from ${link}...`);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `
以下のトピックに関するブログ記事を生成してください。

トピック: ${topic}
元記事のリンク: ${link}

記事の構成は以下のようにしてください。
- 読者の興味を引くタイトル
- 記事の本文（Markdown形式、1500字程度）
  - 背景説明
  - 最新情報
  - 今後の見通し
  - 関連リンク（ソースURL）

固有名詞や引用部分はオリジナルの文章にリライト（SEOペナルティ対策）してください。

出力は以下のJSON形式でお願いします。
{
  "title": "記事のタイトル",
  "content": "記事の本文（Markdown形式）"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    let jsonString;
    try {
      jsonString = text.match(/```json\n([\s\S]*?)```/)[1];
    } catch (e) {
      throw new Error('Could not extract JSON from Gemini API response. Response was: ' + text);
    }
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error generating article with Gemini:', error);
    throw new Error('Failed to generate article.');
  }
}

/**
 * RSSからAI関連の記事を検索し、自動生成してSanityに保存します。
 */
async function runAutomatedDraftCreation() {
  console.log('自動モードで実行します...');
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini APIキーが環境変数に設定されていません。');
  }

  const articles = await fetchAndParseRss();
  if (articles.length === 0) {
    console.log('RSSフィードに記事が見つかりませんでした。');
    return;
  }

  const aiKeywords = ['AI', '人工知能', '機械学習', 'ディープラーニング', 'LLM'];
  let targetArticle = null;

  console.log(`ITニュースフィードからAI関連の記事を検索しています... (キーワード: ${aiKeywords.join(', ')})`);
  for (const article of articles) {
    const title = article.title || '';
    if (aiKeywords.some(keyword => title.includes(keyword))) {
      targetArticle = article;
      console.log(`AI関連の記事を見つけました: ${targetArticle.title}`);
      break; // 最初に見つかった記事を対象とする
    }
  }

  if (targetArticle) {
    const { title, content } = await generateArticle(targetArticle.title, targetArticle.link);
    await saveDraftToSanity(title, content);
  } else {
    console.log('本日のITニュースフィードにAI関連の記事は見つかりませんでした。');
  }
}

/**
 * メイン処理
 */
async function main() {
  try {
    const args = process.argv.slice(2);
    const titleIndex = args.indexOf('--title');
    const contentIndex = args.indexOf('--content');

    let title = null;
    let content = null;

    if (titleIndex !== -1 && args[titleIndex + 1]) {
      title = args[titleIndex + 1];
    }
    if (contentIndex !== -1 && args[contentIndex + 1]) {
      content = args[contentIndex + 1];
    }

    if (title && content) {
      console.log('手動モードで実行します。');
      await saveDraftToSanity(title, content);
    } else {
      await runAutomatedDraftCreation();
    }
  } catch (error) {
    console.error('エラーが発生しました:', error.message);
  }
}

main();

