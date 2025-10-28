"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface Column {
  key: string
  label: string
  minWidth?: number
  defaultWidth?: number
}

interface ResizableTableProps {
  columns: Column[]
  children?: React.ReactNode
}

export default function ResizableTable({ columns, children }: ResizableTableProps) {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
    const widths: Record<string, number> = {}
    columns.forEach((col) => {
      widths[col.key] = col.defaultWidth || 150
    })
    return widths
  })

  const [resizingColumn, setResizingColumn] = useState<string | null>(null)
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null)
  const [hoveredResizer, setHoveredResizer] = useState<string | null>(null)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const startXRef = useRef<number>(0)
  const startWidthRef = useRef<number>(0)

  const handleMouseDown = (e: React.MouseEvent, columnKey: string) => {
    e.preventDefault()
    setResizingColumn(columnKey)
    startXRef.current = e.clientX
    startWidthRef.current = columnWidths[columnKey]
  }

  const handleDoubleClick = (columnKey: string) => {
    // Auto-fit: set to a reasonable default width
    setColumnWidths((prev) => ({
      ...prev,
      [columnKey]: 200,
    }))
  }

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(columnKey)
      setSortDirection("asc")
    }
  }

  useEffect(() => {
    if (!resizingColumn) return

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startXRef.current
      const newWidth = Math.max(
        columns.find((col) => col.key === resizingColumn)?.minWidth || 80,
        startWidthRef.current + diff,
      )
      setColumnWidths((prev) => ({
        ...prev,
        [resizingColumn]: newWidth,
      }))
    }

    const handleMouseUp = () => {
      setResizingColumn(null)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [resizingColumn, columns])

  return (
    <div className="bg-white mx-8 mt-4 rounded-lg shadow-sm overflow-visible">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="w-12 px-4 py-3 bg-gray-50">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="relative px-4 py-3 text-left bg-gray-50 group"
                  style={{ width: columnWidths[column.key] }}
                  onMouseEnter={() => setHoveredColumn(column.key)}
                  onMouseLeave={() => setHoveredColumn(null)}
                >
                  <button
                    onClick={() => handleSort(column.key)}
                    className="flex items-center gap-1 text-sm font-normal text-gray-700 hover:text-[#0176d3] w-full"
                  >
                    {column.label}
                    {hoveredColumn === column.key &&
                      sortColumn === column.key &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4 text-[#0176d3]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#0176d3]" />
                      ))}
                    {hoveredColumn === column.key && sortColumn !== column.key && (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  <div
                    className="absolute top-0 right-0 w-2 h-full cursor-col-resize group/resizer z-10"
                    onMouseDown={(e) => handleMouseDown(e, column.key)}
                    onDoubleClick={() => handleDoubleClick(column.key)}
                    onMouseEnter={() => setHoveredResizer(column.key)}
                    onMouseLeave={() => setHoveredResizer(null)}
                  >
                    {/* Blue resize indicator line - more prominent when hovering or resizing */}
                    <div
                      className={`absolute right-0 top-0 h-full transition-all ${
                        hoveredResizer === column.key || resizingColumn === column.key
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
  )
}
