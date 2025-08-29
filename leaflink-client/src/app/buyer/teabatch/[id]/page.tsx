"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

const teaLeafImageUrl = '/tea-leaf.png'; // Use local image

// Mock Data for a single batch with new fields
const batchDetails: { [key: string]: any } = {
  TB001: {
    id: "TB001",
    teaType: "Earl Grey",
    quantity: 100,
    harvestDate: "2024-01-15",
    location: "Highland Farm A",
    grade: "A",
    processingMethod: "Orthodox",
    description:
      "A classic Earl Grey with a robust flavor and hints of bergamot. Sourced from high-altitude farms.",
    qualityScore: 92,
    imageUrl: teaLeafImageUrl,
    bids: [
      { buyerId: "BuyerX", amount: 1250, date: "2024-01-20" },
      { buyerId: "You", amount: 1200, date: "2024-01-19" },
      { buyerId: "BuyerY", amount: 1150, date: "2024-01-18" },
    ],
  },
  // Add other batch details as needed...
};

export default function BidOnBatch() {
  const params = useParams();
  const id = params.id as string;
  const batch = batchDetails[id] || {
    bids: [],
    imageUrl: teaLeafImageUrl,
    teaType: "Unknown",
  }; // Fallback

  const [bidAmount, setBidAmount] = useState("");
  const [bids, setBids] = useState(batch.bids);

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBidAmount = parseFloat(bidAmount);
    if (!newBidAmount || newBidAmount <= (bids[0]?.amount || 0)) {
      alert("Your bid must be higher than the current highest bid.");
      return;
    }

    const newBids = [
      {
        buyerId: "You",
        amount: newBidAmount,
        date: new Date().toISOString().split("T")[0],
      },
      ...bids,
    ];
    setBids(newBids);
    setBidAmount("");
    alert(`Successfully placed a bid of $${newBidAmount}!`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Batch Details Section */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
        {batch.imageUrl && (
          <div className="relative h-64 w-full">
            <Image
              src={batch.imageUrl}
              alt={`Tea leaves for ${batch.teaType}`}
              layout="fill"
              objectFit="contain" // Changed to contain
              className="bg-gray-100 p-4"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-gray-900">
              {batch.teaType} - {batch.id}
            </h1>
            {batch.qualityScore && (
              <div className="text-right flex-shrink-0 ml-4">
                <p className="text-sm text-gray-500">Quality Score</p>
                <p className="text-3xl font-bold text-green-600">
                  {batch.qualityScore}/100
                </p>
              </div>
            )}
          </div>
          <p className="mt-2 text-gray-600">{batch.description}</p>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-6 border-t pt-6">
            <div>
              <p className="text-sm text-gray-500">Quantity</p>
              <p className="font-semibold">{batch.quantity} kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Grade</p>
              <p className="font-semibold">{batch.grade}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Harvest Date</p>
              <p className="font-semibold">{batch.harvestDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-semibold">{batch.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Processing</p>
              <p className="font-semibold">{batch.processingMethod}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bidding Section */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Place Your Bid
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Current highest bid is{" "}
            <span className="font-bold">${bids[0]?.amount || "N/A"}</span>
          </p>
          <form onSubmit={handleBidSubmit}>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">$</span>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your bid"
                min={(bids[0]?.amount || 0) + 1}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-r-lg hover:bg-blue-700"
              >
                Bid
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Bid History</h2>
          <ul className="space-y-3">
            {bids.map((bid: any, index: any) => (
              <li
                key={index}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
              >
                <div>
                  <p
                    className={`font-semibold ${
                      bid.buyerId === "You" ? "text-blue-600" : "text-gray-800"
                    }`}
                  >
                    {bid.buyerId}
                  </p>
                  <p className="text-xs text-gray-500">{bid.date}</p>
                </div>
                <p className="font-bold text-lg text-gray-900">${bid.amount}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
