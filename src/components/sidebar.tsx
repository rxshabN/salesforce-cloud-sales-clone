"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Building2, TrendingUp, Heart, Target, ShoppingCart, Grid3x3, UserCircle } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/contacts", icon: Users, label: "Contacts" },
    { href: "/accounts", icon: Building2, label: "Accounts" },
    { href: "/sales", icon: TrendingUp, label: "Sales" },
    { href: "/service", icon: Heart, label: "Service" },
    { href: "/marketing", icon: Target, label: "Marketing" },
    { href: "/commerce", icon: ShoppingCart, label: "Commerce" },
    { href: "/generative-canvas", icon: Grid3x3, label: "Generative Canvas" },
  ]

  return (
    <aside className="w-[68px] bg-[#002775] flex flex-col items-center py-2 gap-1 fixed left-0 top-0 bottom-0 z-40">
      {menuItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`w-12 h-12 rounded flex flex-col items-center justify-center cursor-pointer transition-all duration-150 ${
              isActive ? "border-2 border-white" : "border-2 border-transparent hover:border-white"
            }`}
          >
            <Icon className="w-5 h-5 text-white" />
            <span className="text-white text-[10px] mt-0.5 text-center leading-tight">{item.label}</span>
          </Link>
        )
      })}

      <Link
        href="/your-account"
        className="w-12 h-12 border-2 border-transparent hover:border-white transition-all duration-150 rounded flex flex-col items-center justify-center cursor-pointer"
      >
        <UserCircle className="w-5 h-5 text-white" />
        <span className="text-white text-[10px] mt-0.5 text-center leading-tight">Your Account</span>
      </Link>
    </aside>
  )
}
