"use client";

import React from "react";
import { Input } from "@/components/ui/input";

type ListToolbarProps = {
  searchPlaceholder?: string;
  search: string;
  onSearchChange: (value: string) => void;
  children?: React.ReactNode; // filters
  actions?: React.ReactNode; // right-aligned actions
};

export default function ListToolbar({
  searchPlaceholder = "Search...",
  search,
  onSearchChange,
  children,
  actions,
}: ListToolbarProps) {
  return (
    <div className="bg-white border rounded-lg p-3 sm:p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1">
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full"
        />
      </div>
      <div className="flex items-center gap-2">
        {children}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}

