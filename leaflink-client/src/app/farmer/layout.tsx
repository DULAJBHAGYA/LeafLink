"use client";

import React from "react";
import Link from "next/link";

export default function FarmerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Farmer Navigation Header */}
      <nav className="bg-green-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-white text-xl font-bold">Farmer Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/farmer/dashboard"
                className="text-white hover:text-green-200 px-3 py-2 rounded-md"
              >
                Dashboard
              </Link>
              <Link
                href="/farmer/teabatch"
                className="text-white hover:text-green-200 px-3 py-2 rounded-md"
              >
                Tea Batches
              </Link>
              <Link
                href="/farmer/teabatch/add"
                className="text-white hover:text-green-200 px-3 py-2 rounded-md"
              >
                Add Batch
              </Link>
              <Link
                href="/farmer/profile"
                className="text-white hover:text-green-200 px-3 py-2 rounded-md"
              >
                Profile
              </Link>
              <Link
                href="/"
                className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4">{children}</main>
    </div>
  );
}
