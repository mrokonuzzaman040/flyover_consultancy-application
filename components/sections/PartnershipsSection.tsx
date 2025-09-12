"use client";

export default function PartnershipsSection() {
  const partners = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Partner ${i + 1}`
  }));

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">Our Industry Partnerships</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {partners.map((partner) => (
          <div key={partner.id} className="flex h-16 items-center justify-center rounded-md border bg-white text-sm font-semibold text-gray-700">
            {partner.name}
          </div>
        ))}
      </div>
    </section>
  );
}