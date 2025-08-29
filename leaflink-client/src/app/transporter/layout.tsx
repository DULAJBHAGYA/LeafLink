"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TransporterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navLinks = [{ href: "/transporter/dashboard", label: "Dashboard" }];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-white text-xl font-bold">
                Transporter Portal
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? "bg-purple-700 text-white"
                        : "text-purple-100 hover:bg-purple-500 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/"
                className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 text-sm font-medium"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4">{children}</main>
    </div>
  );
}
