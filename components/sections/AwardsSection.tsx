"use client";

export default function AwardsSection() {
  const awards = [
    {
      title: "Award Title 1",
      description: "Recognition for excellence in student services."
    },
    {
      title: "Award Title 2", 
      description: "Recognition for excellence in student services."
    },
    {
      title: "Award Title 3",
      description: "Recognition for excellence in student services."
    },
    {
      title: "Award Title 4",
      description: "Recognition for excellence in student services."
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">Awards & Achievements</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {awards.map((award, i) => (
          <div key={i} className="card p-5">
            <div className="text-gray-900 font-semibold">{award.title}</div>
            <p className="mt-1 text-sm text-gray-700">{award.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}