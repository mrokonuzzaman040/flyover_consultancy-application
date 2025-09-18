import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy | Flyover Consultancy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Privacy Policy</h1>
      <p className="mt-3 text-gray-700">Your privacy matters. This is a placeholder for your actual policy content.</p>
    </div>
  );
}

