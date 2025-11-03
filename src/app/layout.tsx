import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import ToDoList from "@/components/to-do-list";
import { ToastProvider } from "@/components/toast-provider";

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans antialiased bg-[#f3f2f2] overflow-hidden h-screen`}
        style={{
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <ToastProvider>
          <Header />
          <Sidebar />
          <main className="fixed top-[92px] left-[76px] right-0 bottom-12 overflow-hidden">
            {children}
          </main>
          <ToDoList />
        </ToastProvider>
      </body>
    </html>
  );
}
