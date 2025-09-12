import { Star } from "lucide-react";

export default function StarRating({ value = 5 }: { value?: number }) {
  const rounded = Math.round(value);
  return (
    <div className="flex items-center gap-0.5 text-brand">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={"h-4 w-4 " + (i < rounded ? "fill-current" : "opacity-30")} />
      ))}
    </div>
  );
}

