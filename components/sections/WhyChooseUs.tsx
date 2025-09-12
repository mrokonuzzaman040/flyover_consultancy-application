"use client";

export default function WhyChooseUs() {
  const features = [
    "End-to-end FREE assistance",
    "22,000+ success stories", 
    "550+ global partners",
    "Transparent, ethical guidance"
  ];

  return (
    <section className="section-muted">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Why Choose Us</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <div key={i} className="card p-5">
              <div className="text-gray-900 font-semibold">{feature}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}