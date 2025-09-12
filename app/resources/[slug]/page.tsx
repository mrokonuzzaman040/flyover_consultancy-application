import type { Metadata } from "next";

export const metadata: Metadata = { title: "Article | Flyover" };

export default function ArticlePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="text-sm text-gray-500">Author • Jan 1, 2025 • 5 min read</div>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">Article Title</h1>
      <div className="prose prose-gray mt-6">
        <p>Article content will be rendered from markdown with a generated table of contents.</p>
      </div>
    </div>
  );
}

