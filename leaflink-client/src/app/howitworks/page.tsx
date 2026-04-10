import React from "react";
import Navbar from "../common/Navbar";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* How It Works Section - Full Screen */}
      <section className="min-h-screen flex items-center pb-20 pt-20 relative bg-gradient-to-br from-green-50 to-teal-50">
        <div className="absolute inset-0 bg-[url('/images/heroBg.jpeg')] bg-cover bg-center "></div>
                <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-200 mb-3">
              How LeafLink Works
            </h1>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              Our streamlined process ensures seamless supply chain management from farm to consumer
            </p>
          </div>
          
          <div className="max-w-8xl mx-auto">
            <div className="bg-transparent p-6 rounded-2xl shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Step 1 */}
                <div className="flex flex-col bg-green-50/50 p-5 rounded-xl border border-green-200">
                  <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center mb-3 self-center shadow-lg">1</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">Farm Registration</h3>
                  <p className="text-gray-700 text-lg text-center mb-3 leading-relaxed">
                    Farmers register their tea batches with detailed information about origin, variety, harvesting date, and processing methods. 
                    Each batch is assigned a unique identifier and recorded on the blockchain for complete traceability.
                  </p>
                  <div className="bg-white p-3 rounded-lg mt-auto">
                    <ul className="text-gray-600 text-xs space-y-1">
                      <li className="flex items-start">
                        <span className="text-green-600 font-bold mr-1">✓</span>
                        <span><span className="font-medium">Batch ID Creation:</span> Unique blockchain identifier</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 font-bold mr-1">✓</span>
                        <span><span className="font-medium">Quality Data:</span> Certification documentation</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 font-bold mr-1">✓</span>
                        <span><span className="font-medium">Farm Details:</span> Location and conditions</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="flex flex-col bg-green-50/50 p-5 rounded-xl border border-green-200">
                  <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center mb-3 self-center shadow-lg">2</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">Transport Coordination</h3>
                  <p className="text-gray-700 text-sm text-center mb-3 leading-relaxed">
                    Transporters receive batch details and provide real-time location updates during transit with environmental condition monitoring.
                    All transportation data is securely recorded on the blockchain for transparency.
                  </p>
                  <div className="bg-white p-3 rounded-lg mt-auto">
                    <ul className="text-gray-600 text-xs space-y-1">
                      <li className="flex items-start">
                        <span className="text-green-600 font-bold mr-1">✓</span>
                        <span><span className="font-medium">GPS Tracking:</span> Real-time location updates</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 font-bold mr-1">✓</span>
                        <span><span className="font-medium">Condition Monitoring:</span> Temperature & humidity</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 font-bold mr-1">✓</span>
                        <span><span className="font-medium">Delivery Verification:</span> Secure confirmation</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="flex flex-col bg-green-50/50 p-5 rounded-xl border border-green-200">
                  <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center mb-3 self-center shadow-lg">3</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">Buyer Verification</h3>
                  <p className="text-gray-700 text-sm text-center mb-3 leading-relaxed">
                    Buyers access complete batch history, quality certifications, and sustainability metrics before purchase decision.
                    Blockchain verification ensures authenticity and quality of the tea products.
                  </p>
                  <div className="bg-white p-3 rounded-lg mt-auto">
                    <ul className="text-gray-600 text-xs space-y-1">
                      <li className="flex items-start">
                        <span className="text-green-600 font-bold mr-1">✓</span>
                        <span><span className="font-medium">Full Traceability:</span> Farm to cup journey</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 font-bold mr-1">✓</span>
                        <span><span className="font-medium">Quality Assurance:</span> Certification validation</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 font-bold mr-1">✓</span>
                        <span><span className="font-medium">Ethical Sourcing:</span> Sustainability metrics</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <div className="inline-flex items-center bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-2 rounded-full shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="font-medium">Blockchain-verified supply chain</span>
                </div>
                <p className="text-gray-700 text-sm mt-4 max-w-3xl mx-auto leading-relaxed">
                  LeafLink's blockchain technology ensures that every step of the tea supply chain is transparent, 
                  traceable, and trustworthy, connecting farmers, transporters, and buyers in a secure ecosystem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}