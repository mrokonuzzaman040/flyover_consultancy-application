"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface LoadingAnimationProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-16 h-16",
  lg: "w-24 h-24",
  xl: "w-32 h-32"
};

const textSizes = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg"
};

export default function LoadingAnimation({ 
  size = "md", 
  showText = true, 
  className = "" 
}: LoadingAnimationProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Logo with pulse and rotate animation */}
      <motion.div
        className={`relative ${sizeClasses[size]} mb-3`}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 360]
        }}
        transition={{
          scale: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          },
          rotate: {
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }
        }}
      >
        <Image
          src="/logo.png"
          alt="Flyover Consultancy"
          fill
          className="object-contain"
          priority
        />
      </motion.div>

      {/* Loading dots animation */}
      <div className="flex space-x-1 mb-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-brand-600 rounded-full"
            animate={{
              y: [0, -8, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Loading text */}
      {showText && (
        <motion.p
          className={`text-gray-600 font-medium ${textSizes[size]}`}
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Loading...
        </motion.p>
      )}
    </div>
  );
}

// Skeleton loader component for images
export function ImageSkeleton({ 
  className = "",
  aspectRatio = "aspect-video"
}: {
  className?: string;
  aspectRatio?: string;
}) {
  return (
    <div className={`${aspectRatio} bg-gray-100 rounded-lg overflow-hidden ${className}`}>
      <div className="w-full h-full flex items-center justify-center">
        <LoadingAnimation size="sm" showText={false} />
      </div>
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ["-100%", "100%"]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}

// Full page loading component
export function PageLoading() {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <LoadingAnimation size="xl" showText={true} />
    </div>
  );
}

// Inline loading component for buttons
export function ButtonLoading({ size = "sm" }: { size?: "sm" | "md" }) {
  return (
    <motion.div
      className={`inline-flex items-center ${size === "sm" ? "w-4 h-4" : "w-5 h-5"}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <div className={`${size === "sm" ? "w-4 h-4" : "w-5 h-5"} border-2 border-current border-t-transparent rounded-full`} />
    </motion.div>
  );
}