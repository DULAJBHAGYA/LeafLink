"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../common/Navbar";
import FeaturesSection from "../features/page";
import HowItWorksSection from "../howitworks/page";
import AboutSection from "../about/page";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section - Full Screen Height with Background Image and Overlay */}
      <section className="min-h-screen flex items-center pb-20 pt-20 relative">
        {/* Background image with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: "url('/images/HeroBg.jpeg')",
          }}
        ></div>
        {/* Overlay to add opacity to background image */}
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-full max-w-8xl">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-300 mb-10 leading-tight">
                Transparent <span className="text-[#1d2e28]">Supply Chain<br/></span> Tracking for the Tea Industry
              </h1>
              <p className="sm:text-xl md:text-2xl text-gray-300 font-regular max-w-4xl mx-auto mb-6">
                LeafLink connects farmers, transporters, and buyers in a secure blockchain network for complete traceability of tea products from farm to cup. Ensure quality, authenticity, and sustainability.
              </p>
              
              <div className="flex flex-col sm:flex-row md:mt-10 justify-center gap-4">
                <Link
                  href="/register"
                  className="px-8 py-4 backdrop-blur-[5px] text-gray-300 font-medium rounded-xl border border-white-1 transition-all duration-300 transform hover:-translate-y-1 text-lg text-center"
                >
                  Join Our Network
                </Link>


                <Link href="#features" className="px-8 py-4 backdrop-blur-[5px] text-gray-300 font-medium rounded-xl border border-white-1 transition-all duration-300 transform hover:-translate-y-1 text-lg text-center">
                  Explore Features
                </Link>
              </div>
              
              <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div className=" p-6 rounded-xl shadow-lg">
                  <div className="text-3xl font-bold text-gray-300 mb-2">1000+</div>
                  <div className="text-gray-300 text-xl font-medium">Farmers Connected</div>
                  <p className="text-gray-300 text-xl mt-2">Across multiple regions</p>
                </div>
                <div className=" p-6 rounded-xl shadow-lg">
                  <div className="text-3xl font-bold text-gray-300 mb-2">500+</div>
                  <div className="text-gray-300 text-xl font-medium">Tons Tracked</div>
                  <p className="text-gray-300 text-xl mt-2 font-medium">Of premium tea products</p>
                </div>
                <div className="p-6 rounded-xl shadow-lg">
                  <div className="text-3xl font-bold text-gray-300 mb-2">99.9%</div>
                  <div className="text-gray-300 text-xl font-medium">Data Accuracy</div>
                  <p className="text-gray-300 text-xl mt-2 font-medium">Verified blockchain records</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}