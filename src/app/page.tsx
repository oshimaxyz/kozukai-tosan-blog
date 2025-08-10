import { client } from '../sanity/client';

// Interface for our Post data
interface Post {
  _id: string;
  title: string;
  publishedAt: string; // Assuming you have a publishedAt field in Sanity
}

// Async function to fetch posts from Sanity
async function getPosts() {
  // GROQ query to fetch all posts, ordered by publication date
  const posts = await client.fetch<Post[]>(`*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    publishedAt
  }`);
  return posts;
}

// The main page component
export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">My Awesome Blog</h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Ideas, Stories, and Insights
          </h2>
          <p className="text-lg md:text-xl text-blue-100">
            Welcome to my personal space on the web.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Latest Posts
        </h3>
        
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                <div className="p-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h4>
                  {/* You can add more details here, like an excerpt or date */}
                  {/* <p className="text-gray-600">{new Date(post.publishedAt).toLocaleDateString()}</p> */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No blog posts yet. Check back soon!</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} My Awesome Blog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
