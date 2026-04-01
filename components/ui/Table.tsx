import React from "react";

interface Column<T> {
  header: string;
  render: (row: T, index: number) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export default function Table<T>({
  data,
  columns,
  loading,
  emptyMessage = "No data found",
  onRowClick,
}: Readonly<TableProps<T>>) {

  const renderContent = () => {
    if (loading) {
      return Array.from({ length: 10 }).map((_, i) => (
        <tr key={`loading-${i}`} className="animate-pulse">
          {columns.map((_, j) => (
            <td key={`cell-${j}`} className="px-6 py-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </td>
          ))}
        </tr>
      ));
    }

    if (data.length === 0) {
      return (
        <tr>
          <td
            colSpan={columns.length}
            className="text-center py-12 text-gray-500 italic"
          >
            {emptyMessage}
          </td>
        </tr>
      );
    }

    return data.map((row, i) => (
      <tr
        key={i}
        onClick={() => onRowClick?.(row)}
        className={`
          group transition-colors duration-150
          ${onRowClick ? "cursor-pointer hover:bg-blue-50/50" : "hover:bg-gray-50/50"}
        `}
      >
        {columns.map((col, j) => (
          <td
            key={j}
            className={`px-6 py-4 text-sm text-gray-600 whitespace-nowrap ${col.className || ""}`}
          >
            {col.render(row, i)}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div className="w-full">
      <div className="relative overflow-hidden bg-white border-none rounded-none">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/80 backdrop-blur-sm sticky top-0 border-b border-gray-200 z-10">
              <tr>
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className={`
                      px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider
                      ${col.className || ""}
                    `}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {renderContent()}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-2 text-center text-xs text-gray-400 sm:hidden">
        ← Swipe to view more →
      </p>
    </div>
  );
}