"use client";

import { useState } from "react";
import { Search, ChevronDown, MoreHorizontal, Download } from "lucide-react";

interface Column {
  key: string;
  label: string;
  render?: (value: any, item: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  searchPlaceholder?: string;
}

export function DataTable({ columns, data, searchPlaceholder = "Search..." }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="rounded-xl border border-border bg-card backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex items-center px-3 py-1.5 rounded-md bg-primary/5 border border-border text-sm font-medium hover:bg-primary/10 transition-colors text-foreground">
            Filters <ChevronDown className="ml-2 h-4 w-4" />
          </button>
          <button className="flex items-center px-3 py-1.5 rounded-md bg-primary/5 border border-border text-sm font-medium hover:bg-primary/10 transition-colors text-foreground">
            <Download className="mr-2 h-4 w-4" /> Export
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted text-muted-foreground border-b border-border">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-4 font-semibold tracking-wider">
                  {col.label}
                </th>
              ))}
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-muted-foreground">
                  No data found.
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-border hover:bg-muted/50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-foreground whitespace-nowrap">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                    <button className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-primary/10">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-border flex justify-between items-center text-sm text-muted-foreground bg-muted">
        <div>Showing 1 to {data.length} of {data.length} entries</div>
        <div className="flex gap-1">
          <button className="px-3 py-1 rounded border border-border hover:bg-primary/5 disabled:opacity-50" disabled>Previous</button>
          <button className="px-3 py-1 rounded bg-primary text-primary-foreground border border-primary">1</button>
          <button className="px-3 py-1 rounded border border-border hover:bg-primary/5 disabled:opacity-50" disabled>Next</button>
        </div>
      </div>
    </div>
  );
}
