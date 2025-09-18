"use client";

import React from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
      {description ? (
        <p className="text-slate-500 mb-4">{description}</p>
      ) : null}
      {action ? action : null}
    </div>
  );
}

