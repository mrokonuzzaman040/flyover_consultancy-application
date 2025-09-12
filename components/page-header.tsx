import Image from "next/image";
import Reveal from "@/components/ui/reveal";

type Props = {
  title: string;
  subtitle?: string;
  image?: string; // public path
};

export default function PageHeader({ title, subtitle, image }: Props) {
  return (
    <section className="relative overflow-hidden">
      <div className="relative h-56 sm:h-64 md:h-72">
        {image ? (
          <>
            <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-black/50" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-brand to-brand-700" />
        )}
        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="text-white max-w-4xl">
                <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl drop-shadow-lg">{title}</h1>
                {subtitle ? <p className="mt-3 text-base sm:text-lg text-white/95 drop-shadow max-w-3xl">{subtitle}</p> : null}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

