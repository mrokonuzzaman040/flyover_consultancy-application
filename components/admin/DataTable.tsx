"use client";

import React from "react";

type Column<T> = {
  key: string;
  header: string;
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
  hideOn?: "sm" | "md" | "lg" | "xl";
  render?: (row: T, index: number) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T, index: number) => string;
  empty?: React.ReactNode;
};

export default function DataTable<T>({ columns, data, rowKey, empty }: DataTableProps<T>) {
  const visibilityClass = (bp?: Column<T>["hideOn"]) => {
    if (!bp) return "";
    switch (bp) {
      case "sm":
        return "hidden sm:table-cell";
      case "md":
        return "hidden md:table-cell";
      case "lg":
        return "hidden lg:table-cell";
      case "xl":
        return "hidden xl:table-cell";
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white border rounded-lg">
        {empty || (
          <div className="p-8 text-center text-slate-500">No items found.</div>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white border rounded-lg -mx-3 sm:mx-0">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider ${
                  col.headerClassName || ""
                } ${visibilityClass(col.hideOn)}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.map((row, i) => (
            <tr key={rowKey(row, i)} className="hover:bg-slate-50">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-3 align-middle text-sm text-slate-700 ${
                    col.cellClassName || ""
                  } ${visibilityClass(col.hideOn)}`}
                >
                  {col.render ? (col.render(row, i) as React.ReactNode) : String((row as Record<string, unknown>)[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

