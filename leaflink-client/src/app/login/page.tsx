"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-0 relative overflow-hidden">
      <div className="bg-transparent rounded-none shadow-none w-full h-screen overflow-hidden relative z-10">
        <div className="flex flex-col md:flex-row h-full relative">
          {/* Left Side - Text Content with Background Image */}
          <div className="md:w-2/3 text-gray-800 sm:p-12 md:p-20 flex flex-col justify-center relative overflow-hidden">
            {/* Background Image only for left side */}
            <div 
              className="absolute inset-0 bg-no-repeat bg-cover bg-center"
              style={{ 
                backgroundImage: "url('/images/tea_leaves.jpg')",
                zIndex: -1
              }}
            />
            <div className="absolute inset-0 bg-white bg-opacity-80"></div>
            
            {/* Curved wave divider - visible only on md and up */}
            <div className="hidden md:block absolute right-0 top-0 h-full w-32 z-20 overflow-visible">
              <svg 
                className="absolute right-0 top-0 h-full w-full" 
                viewBox="0 0 100 1000" 
                preserveAspectRatio="none"
                style={{ transform: 'translateX(1px)' }}
              >
                <path 
                  d="M 0 0 C 60 200, 60 300, 0 500 C -60 700, -60 800, 0 1000 L 100 1000 C 40 800, 40 700, 100 500 C 160 300, 160 200, 100 0 Z" 
                  fill="white"
                />
              </svg>
            </div>
            
            <div className="mb-8 relative z-10">
              <h1 className="text-6xl font-bold mb-6 text-gray-800">Welcome to LeafLink</h1>
              <p className="text-3xl text-gray-800 mb-8">
                Connect with farmers, transporters, and buyers in a secure blockchain network for complete traceability of tea products from farm to cup.
              </p>
            </div>
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-6 w-6 text-[#44916a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-4 text-xl text-gray-800">
                  Track tea batches from harvest to delivery with real-time updates
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-6 w-6 text-[#44916a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-4 text-xl text-gray-800">
                  Verify authenticity and quality through blockchain technology
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-6 w-6 text-[#44916a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-4 text-xl text-gray-800">
                  Ensure sustainable and ethical sourcing practices
                </p>
              </div>
            </div>
          </div>
          
          {/* Right Side - Login Form (no background image) */}
          <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white relative z-30">
            <div className="max-w-md mx-auto w-full">
              <div className="text-left mb-10">
                <h2 className="text-4xl font-bold text-gray-800 mb-2">Sign In to Your Account</h2>
                <p className="text-gray-600 text-xl">Enter your credentials to access your dashboard</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#44916a] focus:border-transparent transition text-lg"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="password" className="block text-lg font-medium text-gray-700">Password</label>
                    <a href="#" className="text-lg text-[#44916a] hover:text-[#387f5e]">Forgot?</a>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full px-5 py-4 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#44916a] focus:border-transparent transition text-lg"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-5 w-5 text-[#44916a] focus:ring-[#44916a] border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-3 block text-lg text-gray-700">
                    Remember me
                  </label>
                </div>
                
                <button
                  type="button"
                  className="w-full bg-[#44916a] text-white py-4 rounded-2xl hover:bg-[#387f5e] transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-xl font-medium"
                >
                  Sign In
                </button>
              </div>
              
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-lg">
                    <span className="px-3 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>
                
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <button className="w-full inline-flex justify-center py-3 px-5 border border-gray-300 rounded-md shadow-sm bg-white text-lg font-medium text-gray-500 hover:bg-gray-50">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                    </svg>
                  </button>
                  <button className="w-full inline-flex justify-center py-3 px-5 border border-gray-300 rounded-md shadow-sm bg-white text-lg font-medium text-gray-500 hover:bg-gray-50">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <p className="text-center mt-10 text-lg text-gray-600">
                Don't have an account?{" "}
                <Link href="/register" className="font-medium text-[#44916a] hover:text-[#387f5e]">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}