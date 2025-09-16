import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">Page not found</h1>
      <p className="mt-3 text-gray-700">Sorry, we couldn’t find the page you are looking for.</p>
      <Link href="/" className="mt-6 inline-block rounded-md bg-brand px-4 py-2 text-white">Go home</Link>
    </div>
  );
}
