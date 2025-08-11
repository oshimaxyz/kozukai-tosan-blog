import { client } from '@/sanity/client';
import { PortableText } from '@portabletext/react';

interface Post {
  _id: string;
  title: string;
  body: any[]; // Portable Text is a complex array type
}

// This tells Next.js which pages to statically generate at build time.
export async function generateStaticParams() {
  const query = `*[_type == "post"]{
    "slug": slug.current
  }`;
  const slugs = await client.fetch(query);
  return slugs.map((s: { slug: string }) => ({
    slug: s.slug,
  }));
}

// Async function to fetch a single post data from Sanity
async function getPost(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    body
  }`;
  const post: Post = await client.fetch(query, { slug });
  return post;
}

// The main page component for a single post
export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    return <div>Post not found.</div>; // Or a proper 404 component
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <a href="/" className="text-2xl font-bold text-gray-800">ビジネスマンのためのAIニュース</a>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <article className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
            {post.title}
          </h1>
          <div className="prose prose-lg max-w-none text-gray-800">
            <PortableText value={post.body} />
          </div>
        </article>
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
