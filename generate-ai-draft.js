// generate-ai-draft.js
// このスクリプトはAIニュースの下書きを生成し、Sanityに保存します。
// ニュースの取得と要約のロジックは、あなたが実装する必要があります。

const { createClient } = require('@sanity/client');

// --- Sanity クライアント設定 ---
// 重要: Sanity APIトークンを環境変数として設定してください。
// 例: export SANITY_API_TOKEN='YOUR_SANITY_API_TOKEN_HERE'
// または、スクリプト実行時に: SANITY_API_TOKEN='YOUR_SANITY_API_TOKEN_HERE' node generate-ai-draft.js
const client = createClient({
  projectId: 'ck8ysor6', // あなたのSanityプロジェクトID
  dataset: 'production', // あなたのSanityデータセット
  apiVersion: '2025-08-10', // 最新の日付を使用
  useCdn: false, // 書き込みにはfalseを設定
  token: process.env.SANITY_API_TOKEN, // 環境変数からトークンを取得
});

async function generateAndSaveAIDraft() {
  try {
    // --- ステップ1: AIニュースの取得と要約 ---
    // ここに、ニュースAPI、RSSフィード、またはウェブスクレイピングを統合します。
    // デモンストレーションのため、プレースホルダーのコンテンツを使用します。
    const newsTitle = "最新AI技術のブレイクスルー：〇〇が発表"; // 実際のニュースタイトルに置き換えてください
    const newsSummary = "〇〇社が開発した新しいAIモデルは、自然言語処理の精度を飛躍的に向上させ、これまでの課題を解決する可能性を秘めています。この技術は、〇〇分野での応用が期待されます。"; // 実際のニュース要約に置き換えてください
    const newsSourceUrl = "https://example.com/ai-news-source"; // 実際のニュースソースURLに置き換えてください

    // --- ステップ2: Sanityドキュメントの準備 ---
    const draftTitle = `AIニュース速報: ${newsTitle}`;
    const draftSlug = `ai-news-${Date.now()}`;

    const doc = {
      _type: 'post',
      _id: 'post-' + draftSlug,
      title: draftTitle,
      slug: {
        _type: 'slug',
        current: draftSlug,
      },
      body: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: newsSummary,
            },
          ],
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: `\n\n情報源: ${newsSourceUrl}`,
            },
          ],
        },
      ],
      publishedAt: new Date().toISOString(),
    };

    // --- ステップ3: Sanityにドキュメントを作成 ---
    const result = await client.create(doc);
    console.log('AI news draft created in Sanity with ID:', result._id);
    console.log('View it at:', `https://kozukai-tosan-blog.sanity.studio/desk/post;${result._id}`);

  } catch (error) {
    console.error('Error generating or saving AI news draft:', error.message);
  }
}

generateAndSaveAIDraft();