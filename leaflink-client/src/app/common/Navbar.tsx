"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-transparent py-4 fixed w-full z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <Image
            src="/images/logo.png"
            alt="LeafLink Logo"
            width={120}
            height={120}
            className="rounded-full"
          />
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-10">
          <Link href="/" className="text-gray-800 hover:text-gray-700 text-xl font-medium">
            Home
          </Link>
          <Link href="/features" className="text-gray-800 hover:text-gray-700 text-xl font-medium">
            Features
          </Link>
          <Link href="/howitworks" className="text-gray-800 hover:text-gray-700 text-xl font-medium">
            How It Works
          </Link>
          <Link href="/about" className="text-gray-800 hover:text-gray-700 text-xl font-medium">
            About
          </Link>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex space-x-4">
          <Link
            href="/login"
            className="px-4 py-2 text-gray-800 font-medium sm:text-lg md:text-xl hover:backdrop-blur-[5px] rounded-xl hover:text-gray-900"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-gray-800 text-gray-300 sm:text-lg md:text-xl font-medium rounded-xl hover:bg-gray-900 transition"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-800 focus:outline-none"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Side Navbar */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)}></div>
          <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-xl z-60">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <Image
                  src="/images/logo.png"
                  alt="LeafLink Logo"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
              <nav className="space-y-4">
                <Link 
                  href="/" 
                  className="block py-2 text-gray-800 hover:text-green-900 text-xl font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/features" 
                  className="block py-2 text-gray-800 hover:text-green-900 text-xl font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  href="/howitworks" 
                  className="block py-2 text-gray-800 hover:text-green-900 text-xl font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How It Works
                </Link>
                <Link 
                  href="/about" 
                  className="block py-2 text-gray-800 hover:text-green-900 text-xl font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </nav>
              <div className="mt-8 space-y-4">
                <Link
                  href="/login"
                  className="block w-full text-center px-4 py-2 text-gray-800 font-medium text-lg rounded-xl border border-gray-300 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block w-full text-center px-4 py-2 bg-gray-800 text-gray-300 font-medium text-lg rounded-xl hover:bg-gray-900 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}