"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import React from "react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      href: "/",
      icon: <Image src="/home.png" alt="Home" width={45} height={45} />,
      label: "Home",
    },
    {
      href: "/contacts",
      icon: <Image src="/contacts.png" alt="Contacts" width={45} height={45} />,
      label: "Contacts",
    },
    {
      href: "/accounts",
      icon: <Image src="/accounts.png" alt="Accounts" width={45} height={45} />,
      label: "Accounts",
    },
    {
      href: "/sales",
      icon: <Image src="/sales.png" alt="Sales" width={45} height={45} />,
      label: "Sales",
    },
    {
      href: "/service",
      icon: <Image src="/service.png" alt="Service" width={45} height={45} />,
      label: "Service",
    },
    {
      href: "/marketing",
      icon: (
        <Image src="/marketing.png" alt="Marketing" width={45} height={45} />
      ),
      label: "Marketing",
    },
    {
      href: "/commerce",
      icon: <Image src="/commerce.png" alt="Commerce" width={45} height={45} />,
      label: "Commerce",
    },
    {
      href: "/generative-canvas",
      icon: (
        <Image
          src="/generative-canvas.png"
          alt="Generative Canvas"
          width={50}
          height={50}
        />
      ),
      label: "Generative Canvas",
    },
    {
      href: "/your-account",
      icon: (
        <Image
          src="/your-account.png"
          alt="Your Account"
          width={50}
          height={50}
          className="text-white"
        />
      ),
      label: "Your Account",
    },
  ];

  return (
    <aside className="w-[76px] bg-[#002775] flex flex-col items-center py-2 gap-2.5 fixed left-0 top-0 bottom-0 z-40">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <React.Fragment key={item.href}>
            <Link
              href={item.href}
              className={`w-fit h-fit rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-150 ${
                isActive
                  ? "border-2 border-white"
                  : "border-2 border-transparent hover:border-white"
              }`}
            >
              {item.icon}
            </Link>
            <span className="text-white font-semibold text-[10px] text-center leading-tight">
              {item.label}
            </span>
          </React.Fragment>
        );
      })}
    </aside>
  );
}
