import type { Metadata } from "next";
import Link from 'next/link';
import "./globals.css";

export const metadata: Metadata = {
  title: "小遣い父さんのブログ日記",
  description: "日々のお小遣い稼ぎや節約術を綴るブログ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
        <header className="bg-white shadow-md">
          <nav className="container mx-auto px-4 py-4">
            <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-indigo-600">
              小遣い父さんのブログ日記
            </Link>
          </nav>
        </header>

        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="bg-gray-800 text-white py-6 mt-auto">
          <div className="container mx-auto px-4 flex justify-center items-center">
            <nav className="flex space-x-6">
              <Link href="/pp" className="hover:text-indigo-400 transition-colors">
                プライバシーポリシー
              </Link>
              <Link href="/contact" className="hover:text-indigo-400 transition-colors">
                お問い合わせ
              </Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
