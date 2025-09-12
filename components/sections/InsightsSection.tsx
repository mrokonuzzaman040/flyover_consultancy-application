"use client";

import Link from "next/link";

const articles = [
  {
    id: 1,
    author: "Study Abroad Expert",
    readTime: "5 min read",
    title: "Top Universities in Canada for International Students",
    excerpt: "Discover the best Canadian universities and their admission requirements for international students."
  },
  {
    id: 2,
    author: "Visa Consultant",
    readTime: "7 min read",
    title: "Student Visa Application Guide 2024",
    excerpt: "Complete step-by-step guide to successfully apply for your student visa."
  },
  {
    id: 3,
    author: "Career Counselor",
    readTime: "4 min read",
    title: "Scholarship Opportunities You Shouldn't Miss",
    excerpt: "Explore various scholarship programs available for international students."
  },
  {
    id: 4,
    author: "Education Advisor",
    readTime: "6 min read",
    title: "Living Costs in Popular Study Destinations",
    excerpt: "Budget planning guide for students planning to study abroad."
  }
];

export default function InsightsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Insights to Keep You Ahead
        </h2>
        <Link href="/resources" className="text-sm font-semibold text-brand">
          View all
        </Link>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((article) => (
          <article key={article.id} className="card p-5">
            <div className="text-sm text-gray-500">
              {article.author} • {article.readTime}
            </div>
            <h3 className="mt-2 text-lg font-semibold text-gray-900">
              {article.title}
            </h3>
            <p className="mt-1 text-sm text-gray-700">
              {article.excerpt}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}