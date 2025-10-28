"use client"

import { useState } from "react"

export default function ToDoList() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className="bg-white border-t border-[#dddbda] h-12 flex items-center px-4 cursor-pointer hover:bg-[#f3f2f2] hover:shadow-md transition-all duration-150 fixed bottom-0 z-40"
      style={{ left: "68px", right: 0 }}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-[#706e6b] rounded"></div>
        </div>
        <span className="text-sm text-[#181818]">To Do List</span>
      </div>
    </div>
  )
}
