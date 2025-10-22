"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-transparent py-4 fixed w-full z-10">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <Image
            src="/images/logo.png" // 👈 your image path in public/images folder
            alt="LeafLink Logo"
            width={120}
            height={120}
            className="rounded-full"
          />
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-10">
          <a href="#features" className="text-gray-800 hover:text-green-900 text-xl font-medium">
            Features
          </a>
          <a href="#how-it-works" className="text-gray-800 hover:text-green-900 text-xl font-medium">
            How It Works
          </a>
          <a href="#about" className="text-gray-800 hover:text-green-900 text-xl font-medium">
            About
          </a>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
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
      </div>
    </nav>

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
                Transparent <span className="text-green-900">Supply Chain<br/></span> Tracking for the Tea Industry
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

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6">
            Why Choose LeafLink?
          </h2>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16">
            Our platform revolutionizes supply chain transparency with cutting-edge blockchain technology
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Secure Blockchain</h3>
              <p className="text-gray-600">
                Immutable records ensure authenticity and prevent tampering throughout the supply chain.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Real-time Tracking</h3>
              <p className="text-gray-600">
                Monitor tea batches from harvest to delivery with instant updates and notifications.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Multi-party Collaboration</h3>
              <p className="text-gray-600">
                Seamless coordination between farmers, transporters, and buyers in a unified platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6">
            How LeafLink Works
          </h2>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16">
            Our streamlined process ensures seamless supply chain management from farm to consumer
          </p>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-start mb-8">
                <div className="bg-green-100 text-green-800 font-bold rounded-full w-12 h-12 flex items-center justify-center mr-6">1</div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">Farm Registration</h3>
                  <p className="text-gray-600 text-lg">
                    Farmers register their tea batches with detailed information about origin, variety, harvesting date, and processing methods.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start mb-8">
                <div className="bg-green-100 text-green-800 font-bold rounded-full w-12 h-12 flex items-center justify-center mr-6">2</div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">Transport Coordination</h3>
                  <p className="text-gray-600 text-lg">
                    Transporters receive batch details and provide real-time location updates during transit with environmental condition monitoring.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-100 text-green-800 font-bold rounded-full w-12 h-12 flex items-center justify-center mr-6">3</div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">Buyer Verification</h3>
                  <p className="text-gray-600 text-lg">
                    Buyers access complete batch history, quality certifications, and sustainability metrics before purchase decision.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6">
            Key Benefits
          </h2>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16">
            Discover how LeafLink transforms your supply chain operations
          </p>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4 flex justify-center items-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="md:w-3/4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Enhanced Trust</h3>
                  <p className="text-gray-600">
                    Build consumer confidence with verifiable product origins and quality certifications.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4 flex justify-center items-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="md:w-3/4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Cost Reduction</h3>
                  <p className="text-gray-600">
                    Minimize losses through improved tracking and reduce administrative overhead with automated recordkeeping.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4 flex justify-center items-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="md:w-3/4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Operational Efficiency</h3>
                  <p className="text-gray-600">
                    Streamline processes with real-time visibility and eliminate bottlenecks in your supply chain.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-teal-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Supply Chain?
          </h2>
          <p className="text-xl text-green-100 max-w-2xl mx-auto mb-10">
            Join thousands of farmers, transporters, and buyers who trust LeafLink for transparent supply chain management.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="px-8 py-4 bg-white text-green-700 font-medium rounded-lg hover:bg-green-50 transition text-lg text-center">
              Get Started Today
            </Link>
            <Link href="#contact" className="px-8 py-4 bg-transparent text-white font-medium rounded-lg border-2 border-white hover:bg-white/10 transition text-lg text-center">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-full"></div>
                <span className="text-xl font-bold">LeafLink</span>
              </div>
              <p className="mt-2 text-gray-400 max-w-xs">
                Secure blockchain-based supply chain tracking for the tea industry.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold text-lg mb-4">Product</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">Features</a></li>
                  <li><a href="#" className="hover:text-white">Solutions</a></li>
                  <li><a href="#" className="hover:text-white">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">About</a></li>
                  <li><a href="#" className="hover:text-white">Careers</a></li>
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-4">Resources</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">Documentation</a></li>
                  <li><a href="#" className="hover:text-white">Support</a></li>
                  <li><a href="#" className="hover:text-white">API Status</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} LeafLink. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}