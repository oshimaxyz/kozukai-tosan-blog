require('dotenv').config();
const { createClient } = require('@sanity/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { micromark } = require('micromark');
const { JSDOM } = require('jsdom');
const { htmlToBlocks } = require('@portabletext/block-tools');
const { Schema } = require('@sanity/schema');

// --- APIクライアント設定 ---
const client = createClient({
  projectId: 'ck8ysor6',
  dataset: 'production',
  apiVersion: '2025-08-10',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

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
      ],
    },
  ],
});
const blockContentType = defaultSchema.get('post').fields.find((field) => field.name === 'body').type;

/**
 * Converts Sanity Portable Text array to plain text.
 * @param {Array} blocks - Portable Text blocks
 * @returns {string}
 */
function portableTextToPlainText(blocks = []) {
  return blocks
    .map(block => {
      if (block._type !== 'block' || !block.children) {
        return '';
      }
      return block.children.map(child => child.text).join('');
    })
    .join('\n\n');
}

const TARGET_POST_ID = 'aigpt-5-openai-1754911826690'; // 対象記事のID

async function addSummaryAndOpinion() {
  try {
    if (!process.env.SANITY_API_TOKEN || !process.env.GEMINI_API_KEY) {
      throw new Error('SANITY_API_TOKEN and GEMINI_API_KEY must be set as environment variables.');
    }
    if (!genAI) {
        throw new Error('Gemini API client not initialized. Check GEMINI_API_KEY.');
    }

    // 1. 記事の取得
    console.log('Fetching post...');
    const post = await client.fetch(`*[_id == $id][0]{_id, title, body}`, { id: TARGET_POST_ID });
    if (!post) {
      console.error('Post not found.');
      return;
    }
    console.log(`Post found: ${post.title}`);

    // 2. Portable Textをプレーンテキストに変換
    const plainTextContent = portableTextToPlainText(post.body);
    console.log('Converted Portable Text to plain text for Gemini.');

    // 3. Geminiで要約と「持論」を生成
    console.log('Generating summary and opinion with Gemini...');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `
以下の記事を要約し、その内容に基づいたあなたの「持論」を述べてください。

出力は以下のJSON形式でお願いします。
{
  "summary": "記事の要約（Markdown形式）",
  "opinion": "あなたの持論（Markdown形式）"
}

記事内容:
${plainTextContent}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    let jsonString;
    try {
      jsonString = text.match(/```json\n([\s\S]*?)```/)[1];
    } catch (e) {
      throw new Error('Could not extract JSON from Gemini API response. Response was: ' + text);
    }

    const { summary, opinion } = JSON.parse(jsonString);
    console.log('Summary and opinion generated.');

    // 4. 生成された内容をPortable Textに変換
    const newContentMarkdown = `
## まとめ

${summary}

## 私の持論

${opinion}
`;
    console.log('Converting generated Markdown to Portable Text...');
    const html = String(micromark(newContentMarkdown));
    const dom = new JSDOM(html);
    const newBlocks = await htmlToBlocks(dom.window.document.body.innerHTML, blockContentType, {
      parseHtml: (htmlString) => new JSDOM(htmlString).window.document,
    });
    console.log('Conversion successful.');

    // 5. 記事を更新
    const updatedBody = [...post.body, ...newBlocks];
    console.log('Updating post in Sanity...');
    const patchResult = await client.patch(TARGET_POST_ID).set({ body: updatedBody }).commit();
    console.log('Post updated successfully:', patchResult._id);

  } catch (error) {
    console.error('Error in addSummaryAndOpinion:', error.message);
  }
}

addSummaryAndOpinion();
