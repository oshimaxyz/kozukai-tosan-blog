import Image from "next/image";
import { client } from '@/sanity/client';

// Interface for our Sanity Post data
interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string; // Use publishedAt
}

// Async function to fetch posts from Sanity
async function getPosts() {
  try {
    const query = `*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      "excerpt": body[0].children[0].text, // Assuming first block's first child text as excerpt
      publishedAt // Fetch publishedAt timestamp
    }`;
    const posts: Post[] = await client.fetch(query, {}, { next: { revalidate: 1 } }); // Revalidate data every 1 second
    return posts;
  } catch (error) {
    console.error("Error fetching posts from Sanity:", error);
    return [];
  }
}

// --- Formatted Date Component ---
function FormattedDate({ date, postId }: { date: string, postId: string }) {
  try {
    return (
      <p className="text-gray-500 text-sm mb-6">
        投稿日: {new Date(date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric' })}
      </p>
    );
  } catch (error) {
    // Temporarily render the error message for debugging
    if (error instanceof Error) {
      return <p className="text-red-500">Date Error: {error.message}</p>;
    }
    return <p className="text-red-500">An unknown error occurred in FormattedDate.</p>;
  }
}

// The main page component
export default async function Home() {
  const posts = await getPosts();

  const selfIntroduction = "40代大手IT企業勤務の会社員です。小学生の娘がいる小遣い制の父です。2021年3月から副業（ブログ、クラウドワークス、Kindle出版）に取り組んでいます。ブログ、Twitter、stand.fm（音声ラジオ）で役立つビジネス情報を発信しています。Webライターもやっていますので、興味のある方は「お問い合わせ」からご連絡ください。";

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">小遣い父さんのブログ日記</h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            ビジネスマンのためのAIニュース
          </h2>
          <p className="text-lg md:text-xl text-blue-100">
            AIニュース
          </p>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <main className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content Area (Posts) */}
        <div className="md:col-span-2">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center md:text-left">
            最新の投稿
          </h3>
          
          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"> {/* Adjusted for 2 columns in main content */}
              {posts.map((post) => (
                <a 
                  key={post._id} 
                  href={`/posts/${post.slug}`} 
                  className="block bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="p-6">
                    <h4 
                      className="text-xl font-semibold text-gray-900 mb-2"
                    > {post.title} </h4>
                    {post.publishedAt && <FormattedDate date={post.publishedAt} postId={post._id} />} {/* Add date rendering */}
                    <div 
                      className="text-gray-600 text-sm"
                    > {post.excerpt} </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">記事の読み込みに失敗したか、投稿がありません。</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="md:col-span-1 bg-white rounded-lg shadow-md p-6">
          <h4 className="text-xl font-semibold text-gray-900 mb-4">プロフィール</h4>
          <Image 
            src="/profile.jpeg" 
            alt="Profile Picture" 
            width={96} 
            height={96} 
            className="rounded-full mx-auto mb-4"
          />
          <p className="text-gray-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: selfIntroduction }}></p>
        </aside>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} 小遣い父さんのブログ日記. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
