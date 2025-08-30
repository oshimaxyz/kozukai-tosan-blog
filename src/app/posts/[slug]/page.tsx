import { client } from '@/sanity/client';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import Link from 'next/link';

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

// Define the shape of a Post
interface Post {
  _id: string;
  title: string;
  body: PortableTextBlock[];
  publishedAt: string;
}

// Define the shape of the props for our Page component
interface PageProps {
  params: {
    slug: string;
  };
}

// This tells Next.js which pages to statically generate at build time.
export async function generateStaticParams() {
  const query = `*[_type == "post"]{"slug": slug.current}`;
  const slugs: { slug: string }[] = await client.fetch(query);
  return slugs.map((s) => ({ slug: s.slug }));
}

// Async function to fetch a single post data from Sanity
async function getPost(slug: string): Promise<Post> {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    body,
    publishedAt
  }`;
  const post = await client.fetch(query, { slug });
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
          <Link href="/" className="text-2xl font-bold text-gray-800">ビジネスマンのためのAIニュース</Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <article className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
            {post.title}
          </h1>
          {post.publishedAt && <FormattedDate date={post.publishedAt} postId={post._id} />}
          <div className="prose prose-lg max-w-none text-gray-800">
            <PortableText
              value={post.body}
              components={{
                marks: {
                  link: ({ children, value }) => {
                    const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
                    return (
                      <a
                        href={value.href}
                        rel={rel}
                        target={rel ? '_blank' : undefined}
                        className="text-blue-600 hover:underline"
                      >
                        {children}
                      </a>
                    );
                  },
                },
              }}
            />
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