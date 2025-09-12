"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import LoadingAnimation, { ImageSkeleton } from "./loading-animation";

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  aspectRatio?: string;
  priority?: boolean;
  sizes?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  placeholder?: "blur" | "skeleton" | "logo";
  onLoad?: () => void;
  onError?: () => void;
}

export default function LazyImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  aspectRatio = "aspect-video",
  priority = false,
  sizes,
  objectFit = "cover",
  placeholder = "logo",
  onLoad,
  onError
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  const renderPlaceholder = () => {
    switch (placeholder) {
      case "skeleton":
        return <ImageSkeleton className={className} aspectRatio={aspectRatio} />;
      case "logo":
        return (
          <div className={`${aspectRatio} bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center ${className}`}>
            <LoadingAnimation size="sm" showText={false} />
          </div>
        );
      case "blur":
      default:
        return (
          <div className={`${aspectRatio} bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center ${className}`}>
            <LoadingAnimation size="sm" showText={false} />
          </div>
        );
    }
  };

  const renderErrorState = () => (
    <div className={`${aspectRatio} bg-gray-100 rounded-lg overflow-hidden flex flex-col items-center justify-center ${className}`}>
      <div className="w-8 h-8 mb-2 opacity-50">
        <Image
          src="/logo.png"
          alt="Flyover Consultancy"
          width={32}
          height={32}
          className="object-contain grayscale"
        />
      </div>
      <p className="text-xs text-gray-500">Image unavailable</p>
    </div>
  );

  if (hasError) {
    return renderErrorState();
  }

  return (
    <div className={`relative ${fill ? "" : aspectRatio} ${className}`}>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10"
          >
            {renderPlaceholder()}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className={fill ? "absolute inset-0" : "w-full h-full"}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          className={`${objectFit === "cover" ? "object-cover" : `object-${objectFit}`} ${fill ? "" : "w-full h-full"} rounded-lg`}
          priority={priority}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
        />
      </motion.div>
    </div>
  );
}

// Specialized component for university cards
export function UniversityImage({
  src,
  alt,
  className = ""
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <LazyImage
      src={src}
      alt={alt}
      fill
      className={className}
      aspectRatio="aspect-[4/3]"
      objectFit="cover"
      placeholder="logo"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}

// Specialized component for hero images
export function HeroImage({
  src,
  alt,
  className = ""
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <LazyImage
      src={src}
      alt={alt}
      fill
      className={className}
      priority
      objectFit="cover"
      placeholder="skeleton"
      sizes="100vw"
    />
  );
}

// Specialized component for profile/team images
export function ProfileImage({
  src,
  alt,
  size = "md",
  className = ""
}: {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32"
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden ${className}`}>
      <LazyImage
        src={src}
        alt={alt}
        fill
        objectFit="cover"
        placeholder="logo"
        sizes="(max-width: 768px) 96px, 128px"
      />
    </div>
  );
}