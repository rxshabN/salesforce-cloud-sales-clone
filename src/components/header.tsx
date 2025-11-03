"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, HelpCircle, Settings, Bell, User } from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <>
      <header className="bg-[#066afe] h-11 flex items-center justify-between px-4 text-white fixed top-0 left-[76px] right-0 z-50">
        <div className="flex items-center gap-4">
          {/* Empty space - logo moved to white bar */}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span>Days left in Starter trial:</span>
            <span className="font-semibold bg-[#faffbd] text-[#181818] px-2 py-0.5 rounded">
              18
            </span>
          </div>
          <Button className="bg-white text-[#3e6afe] hover:bg-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 h-8 px-4 text-sm font-semibold rounded-3xl">
            Buy Now
          </Button>
        </div>
      </header>

      <div className="bg-white h-12 flex items-center justify-between px-4 fixed top-11 left-[76px] right-0 z-50">
        <div className="flex items-center gap-4">
          <Image
            src="/salesforce-logo.png"
            alt="Salesforce Logo"
            width={45}
            height={45}
          />
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 w-[400px]">
          <div className="relative group hover:rounded-lg hover:shadow-black hover:shadow-sm hover:-translate-y-0.5 transition-all duration-150">
            {" "}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#706e6b] pointer-events-none" />
            <Input
              placeholder="Search..."
              className="rounded-lg w-full pl-10 bg-white border border-black h-9 text-sm text-[#181818] placeholder:text-[#706e6b]"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <HelpCircle className="w-5 h-5 cursor-pointer text-[#706e6b] hover:text-[#0176d3] hover:-translate-y-0.5 transition-all duration-150" />
          <Settings className="w-5 h-5 cursor-pointer text-[#706e6b] hover:text-[#0176d3] hover:-translate-y-0.5 transition-all duration-150" />
          <div className="relative hover:-translate-y-0.5 transition-all duration-150">
            <Bell className="w-5 h-5 cursor-pointer text-[#706e6b] hover:text-[#0176d3]" />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              2
            </span>
          </div>
          <div className="w-8 h-8 bg-[#706e6b] rounded-full flex items-center justify-center cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </>
  );
}
