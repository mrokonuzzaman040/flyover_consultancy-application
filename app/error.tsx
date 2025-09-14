"use client";
import Link from "next/link";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">Something went wrong</h1>
      <p className="mt-3 text-gray-700">Please try again later.</p>
      {process.env.NODE_ENV === "development" && (
        <pre className="mt-4 text-left text-xs text-gray-500">{error?.stack}</pre>
      )}
      <Link href="/" className="mt-6 inline-block rounded-md bg-brand px-4 py-2 text-white">Go home</Link>
    </div>
  );
}
