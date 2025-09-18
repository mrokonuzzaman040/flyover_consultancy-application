"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface DropdownItem {
  label: string;
  href: string;
}

interface DropdownMenuProps {
  children: ReactNode;
  items: DropdownItem[];
  isOpen: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
}

export function DropdownMenu({ 
  children, 
  items, 
  isOpen, 
  onMouseEnter, 
  onMouseLeave, 
  className = "" 
}: DropdownMenuProps) {
  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
      
      {isOpen && items && items.length > 0 && (
        <div 
          className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="py-2">
            {items.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-brand/10 hover:text-brand transition-colors duration-150"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface MobileDropdownMenuProps {
  children: ReactNode;
  items: DropdownItem[];
  isOpen: boolean;
  onItemClick?: () => void;
}

export function MobileDropdownMenu({ 
  children, 
  items, 
  isOpen, 
  onItemClick 
}: MobileDropdownMenuProps) {
  return (
    <div>
      {children}
      
      {isOpen && (
        <div className="mt-2 ml-4 animate-in slide-in-from-top-2 duration-200">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            <div className="py-1">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-brand/10 hover:text-brand transition-colors duration-150 touch-manipulation min-h-[44px] flex items-center"
                  onClick={onItemClick}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
