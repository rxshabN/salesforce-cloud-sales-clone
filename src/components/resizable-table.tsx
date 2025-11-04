"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { ArrowDown, ArrowUp, ChevronDown } from "lucide-react";

interface Column {
  key: string;
  label: React.ReactNode;
  minWidth?: number;
  defaultWidth?: number;
  hasDropdown?: boolean;
  isSortable?: boolean;
}

interface ResizableTableProps {
  columns: Column[];
  children?: React.ReactNode;
  onSort?: (columnKey: string, direction: "asc" | "desc") => void;
  sortColumn?: string | null;
  sortDirection?: "asc" | "desc";
}

export default function ResizableTable({
  columns,
  children,
  onSort,
  sortColumn: externalSortColumn,
  sortDirection: externalSortDirection,
}: ResizableTableProps) {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(
    () => {
      const widths: Record<string, number> = {};
      columns.forEach((col) => {
        widths[col.key] = col.defaultWidth || 150;
      });
      return widths;
    }
  );

  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
  const [hoveredResizer, setHoveredResizer] = useState<string | null>(null);
  const [internalSortColumn, setInternalSortColumn] = useState<string | null>(
    null
  );
  const [internalSortDirection, setInternalSortDirection] = useState<
    "asc" | "desc"
  >("asc");

  const sortColumn =
    externalSortColumn !== undefined ? externalSortColumn : internalSortColumn;
  const sortDirection =
    externalSortDirection !== undefined
      ? externalSortDirection
      : internalSortDirection;

  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  const handleMouseDown = (e: React.MouseEvent, columnKey: string) => {
    e.preventDefault();
    setResizingColumn(columnKey);
    startXRef.current = e.clientX;
    startWidthRef.current = columnWidths[columnKey];
  };

  const handleDoubleClick = (columnKey: string) => {
    
    setColumnWidths((prev) => ({
      ...prev,
      [columnKey]: 200,
    }));
  };

  const handleSort = (columnKey: string) => {
    const column = columns.find((c) => c.key === columnKey);
    if (column?.isSortable === false) return;

    const newDirection =
      sortColumn === columnKey && sortDirection === "asc" ? "desc" : "asc";

    if (onSort) {
      
      onSort(columnKey, newDirection);
    } else {
      
      setInternalSortColumn(columnKey);
      setInternalSortDirection(newDirection);
    }
  };

  useEffect(() => {
    if (!resizingColumn) return;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startXRef.current;
      const newWidth = Math.max(
        columns.find((col) => col.key === resizingColumn)?.minWidth || 80,
        startWidthRef.current + diff
      );
      setColumnWidths((prev) => ({
        ...prev,
        [resizingColumn]: newWidth,
      }));
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizingColumn, columns]);

  return (
    <div className="bg-white mx-8 mt-4 rounded-lg shadow-sm overflow-visible">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="relative px-3 py-2 text-left bg-gray-50 group"
                  style={{ width: columnWidths[column.key] }}
                  onMouseEnter={() => setHoveredColumn(column.key)}
                  onMouseLeave={() => setHoveredColumn(null)}
                >
                  <button
                    onClick={() => handleSort(column.key)}
                    className="flex justify-between items-center gap-1 text-sm font-normal text-gray-700 w-full"
                    disabled={column.isSortable === false}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {column.label}
                      {column.isSortable !== false &&
                        hoveredColumn === column.key &&
                        sortColumn === column.key &&
                        (sortDirection === "asc" ? (
                          <ArrowUp className="w-4 h-4 text-[#0176d3]" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-[#0176d3]" />
                        ))}
                    </div>
                    {column.hasDropdown && (
                      <ChevronDown className="w-4 h-4 text-[#0176d3]" />
                    )}
                  </button>

                  <div
                    className="absolute top-0 right-0 w-2 h-full cursor-col-resize group/resizer z-10"
                    onMouseDown={(e) => handleMouseDown(e, column.key)}
                    onDoubleClick={() => handleDoubleClick(column.key)}
                    onMouseEnter={() => setHoveredResizer(column.key)}
                    onMouseLeave={() => setHoveredResizer(null)}
                  >
                    
                    <div
                      className={`absolute right-0 top-0 h-full transition-all ${
                        hoveredResizer === column.key ||
                        resizingColumn === column.key
                          ? "w-1 bg-[#0176d3]"
                          : "w-0.5 bg-transparent"
                      }`}
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}
