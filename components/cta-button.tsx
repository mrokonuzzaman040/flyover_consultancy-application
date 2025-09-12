"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type Props = {
  href?: string;
  className?: string;
  children?: React.ReactNode;
};

export default function CtaButton({ href = "/book-consultation", className, children }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center justify-center rounded-md bg-brand text-white px-5 py-2.5 text-sm font-semibold shadow-sm transition-colors",
        "hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand/40",
        isActive && "ring-2 ring-brand/40",
        className
      )}
    >
      {children ?? "Book a Free Consultation"}
    </Link>
  );
}
