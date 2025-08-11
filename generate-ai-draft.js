// generate-ai-draft.js
// このスクリプトはAIニュースの下書きを生成し、Sanityに保存します。

const { createClient } = require('@sanity/client');
const { micromark } = require('micromark');
const { JSDOM } = require('jsdom');
const { htmlToBlocks } = require('@portabletext/block-tools');
const { Schema } = require('@sanity/schema');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// --- APIクライアント設定 ---
// 重要: 以下の環境変数を設定してください。
// 1. Sanity APIトークン:
//    export SANITY_API_TOKEN='YOUR_SANITY_API_TOKEN_HERE'
// 2. Gemini APIキー:
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
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- Sanity スキーマ定義 (簡易版) ---
const defaultSchema = Schema.compile({
  name: 'myBlog',
  types: [
    {
      type: 'document',
      name: 'post',
      fields: [
        { title: 'Title', type: 'string', name: 'title' },
        { title: 'Body', name: 'body', type: 'array', of: [{ type: 'block' }] },
        { title: 'Slug', name: 'slug', type: 'slug', options: { source: 'title', maxLength: 96 } },
        { title: 'Published at', name: 'publishedAt', type: 'datetime' },
      ],
    },
  ],
});

const blockContentType = defaultSchema.get('post').fields.find((field) => field.name === 'body').type;

/**
 * Gemini APIを使用して、指定されたトピックに関するブログ記事を生成します。
 * @param {string} topic - 記事のトピック。
 * @returns {Promise<{title: string, content: string}>} 生成された記事のタイトルとコンテンツ。
 */
async function generateArticle(topic) {
  console.log(`Generating article for topic: ${topic}...`);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `
以下のトピックに関するブログ記事を生成してください。

トピック: ${topic}

記事の構成は以下のようにしてください。
- 読者の興味を引くタイトル
- 記事の本文（Markdown形式、1500字程度）
  - 背景説明
  - 最新情報
  - 今後の見通し

出力は以下のJSON形式でお願いします。
{
  "title": "記事のタイトル",
  "content": "記事の本文（Markdown形式）"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();    console.log('Gemini API Response:', text);    if (!text) {      throw new Error('Gemini API returned an empty response.');    }    let jsonString;    try {      jsonString = text.match(/```json\n([\s\S]*?)```/)[1];    } catch (e) {      throw new Error('Could not extract JSON from Gemini API response. Response was: ' + text);    }    const article = JSON.parse(jsonString);
    console.log('Article generated successfully.');
    return article;
  } catch (error) {
    console.error('Error generating article with Gemini:', error);
    throw new Error('Failed to generate article.');
  }
}


/**
 * AIが生成した記事をSanityに下書きとして保存します。
 */
async function generateAndSaveAIDraft() {
  try {
    if (!process.env.SANITY_API_TOKEN || !process.env.GEMINI_API_KEY) {
      throw new Error('API keys for Sanity and Gemini must be set as environment variables.');
    }

    // 1. 記事を生成 (将来的にはトレンド検知の結果を渡す)
    const topic = 'AIの最新トレンド'; // 仮のトピック
    const { title: newsTitle, content: newsContent } = await generateArticle(topic);

    // 2. MarkdownをPortable Textに変換
    console.log('Converting Markdown to Portable Text...');
    const html = String(micromark(newsContent));
    console.log('micromark output:', html);
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const blocks = await htmlToBlocks(document.body.innerHTML, blockContentType, {
      parseHtml: (htmlString) => new JSDOM(htmlString).window.document,
    });
    console.log('Conversion successful.');

    // 3. Sanityに保存するドキュメントを作成
    const draftSlug = topic
      .replace(/[^a-zA-Z0-9\s-]/g, '') // 英数字、スペース、ハイフン以外を削除
      .replace(/\s+/g, '-') // スペースをハイフンに置換
      .toLowerCase() + `-${Date.now()}`;
    const doc = {
      _type: 'post',
      _id: 'drafts.' + draftSlug, // 下書きとして保存
      title: newsTitle,
      slug: {
        _type: 'slug',
        current: draftSlug,
      },
      body: blocks,
      publishedAt: new Date().toISOString(),
    };

    // 4. Sanityにドキュメントを作成
    console.log('Saving draft to Sanity...');
    const result = await client.create(doc);
    console.log('AI news draft created in Sanity with ID:', result._id);
    console.log('View it at:', `https://kozukai-tosan-blog.sanity.studio/desk/post;${result._id}`);

  } catch (error) {
    console.error('Error in generateAndSaveAIDraft:', error.message);
  }
}

generateAndSaveAIDraft();
