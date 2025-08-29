"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const teaLeafImageUrl = "/tea-leaf.png"; // Use local image

const allTeaBatches = [
  {
    id: "TB001",
    teaType: "Earl Grey",
    quantity: 100,
    status: "Bidding Open",
    highestBid: 1250,
    imageUrl: teaLeafImageUrl,
  },
  {
    id: "TB002",
    teaType: "Green Tea",
    quantity: 75,
    status: "Bidding Open",
    highestBid: 950,
    imageUrl: teaLeafImageUrl,
  },
  {
    id: "TB004",
    teaType: "White Tea",
    quantity: 80,
    status: "Bidding Open",
    highestBid: 1100,
    imageUrl: teaLeafImageUrl,
  },
  {
    id: "TB006",
    teaType: "Jasmine",
    quantity: 90,
    status: "Bidding Closed",
    highestBid: 1300,
    imageUrl: teaLeafImageUrl,
  },
];

export default function TeaMarketplace() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tea Marketplace</h1>
        <p className="text-gray-600 mt-1">
          Browse and bid on available tea batches.
        </p>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allTeaBatches.map((batch) => (
          <div
            key={batch.id}
            className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col"
          >
            <div className="relative h-48 w-full">
              <Image
                src={batch.imageUrl}
                alt={`Tea leaves for ${batch.teaType}`}
                layout="fill"
                objectFit="contain" // Changed to contain to better suit the png
                className="bg-gray-100 p-2"
              />
            </div>
            <div className="p-6 flex-grow">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-800">
                  {batch.teaType}
                </h2>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    batch.status === "Bidding Open"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {batch.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Batch ID: {batch.id}</p>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Quantity</p>
                  <p className="font-semibold text-gray-900">
                    {batch.quantity} kg
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Highest Bid</p>
                  <p className="font-semibold text-gray-900">
                    ${batch.highestBid}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 mt-auto">
              <Link
                href={`/buyer/teabatch/${batch.id}`}
                className="w-full block text-center bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
              >
                View & Bid
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
