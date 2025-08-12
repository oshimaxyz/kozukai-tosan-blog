const { client } = require('../src/sanity/client');

const targetTitle = '次世代AIの幕開け：OpenAIが発表した画期的な新モデルが示す未来の形';

async function getPostByTitle() {
  try {
    const query = `*[_type == "post" && title == $targetTitle][0] {
      _id,
      "slug": slug.current,
      title,
      body
    }`;
    const post = await client.fetch(query, { targetTitle });
    if (post) {
      console.log(JSON.stringify(post, null, 2));
    } else {
      console.log(`Post with title "${targetTitle}" not found.`);
    }
  } catch (error) {
    console.error('Error fetching post:', error);
  }
}

getPostByTitle();
