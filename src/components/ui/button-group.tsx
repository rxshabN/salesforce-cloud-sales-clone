"use client"

import { ChevronDown } from "lucide-react"
import type { ReactNode } from "react"

interface ButtonGroupProps {
  buttons: Array<{
    label: string
    onClick?: () => void
    hasDropdown?: boolean
  }>
}

export function ButtonGroup({ buttons }: ButtonGroupProps) {
  return (
    <div className="inline-flex items-center border border-[#c9c9c9] rounded-full bg-white overflow-hidden">
      {buttons.map((button, index) => (
        <div key={index} className="flex items-center">
          <button
            onClick={button.onClick}
            className="px-4 py-1.5 text-[#0176d3] font-normal hover:bg-[#f3f3f3] transition-colors flex items-center gap-1"
          >
            {button.label}
            {button.hasDropdown && <ChevronDown className="w-4 h-4" />}
          </button>
          {index < buttons.length - 1 && <div className="w-px h-6 bg-[#c9c9c9]" />}
        </div>
      ))}
    </div>
  )
}

interface IconButtonGroupProps {
  children: ReactNode
}

export function IconButtonGroup({ children }: IconButtonGroupProps) {
  return <div className="flex items-center gap-1">{children}</div>
}

interface IconButtonProps {
  icon: ReactNode
  onClick?: () => void
  hasDropdown?: boolean
}

export function IconButton({ icon, onClick, hasDropdown }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 rounded-full border border-[#c9c9c9] bg-white flex items-center justify-center text-[#0176d3] hover:bg-[#f3f3f3] hover:border-[#0176d3] transition-all relative"
    >
      {icon}
      {hasDropdown && <ChevronDown className="w-3 h-3 absolute -bottom-0.5 -right-0.5 bg-white rounded-full" />}
    </button>
  )
}

interface GroupedIconButtonsProps {
  buttons: Array<{
    icon: ReactNode
    onClick?: () => void
  }>
  disabled?: boolean
}

export function GroupedIconButtons({ buttons, disabled = false }: GroupedIconButtonsProps) {
  return (
    <div className="inline-flex items-center border border-[#c9c9c9] rounded-full bg-white overflow-hidden">
      {buttons.map((button, index) => (
        <div key={index} className="flex items-center">
          <button
            onClick={button.onClick}
            disabled={disabled}
            className={`w-8 h-8 flex items-center justify-center transition-colors ${
              disabled ? "text-[#c9c9c9] cursor-not-allowed" : "text-[#0176d3] hover:bg-[#f3f3f3]"
            }`}
          >
            {button.icon}
          </button>
          {index < buttons.length - 1 && <div className="w-px h-6 bg-[#c9c9c9]" />}
        </div>
      ))}
    </div>
  )
}
