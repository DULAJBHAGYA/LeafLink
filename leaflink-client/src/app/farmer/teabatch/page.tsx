"use client";

import React from "react";
import Link from "next/link";

// Updated mock data with farmerId removed
const teaBatches = [
  {
    batchId: "TB001",
    variety: "Earl Grey",
    quantity: 100,
    startPrice: 1100,
    qualityScore: 92,
    fertilizer: "Organic",
    weather: "Sunny",
    biddingDeadline: "2024-10-25T23:59:59Z",
    status: "Bidding Open",
  },
  {
    batchId: "TB002",
    variety: "Green Tea",
    quantity: 75,
    startPrice: 800,
    qualityScore: 88,
    fertilizer: "Standard",
    weather: "Cloudy",
    biddingDeadline: "2024-10-26T23:59:59Z",
    status: "Processing",
  },
  {
    batchId: "TB003",
    variety: "Black Tea",
    quantity: 120,
    startPrice: 950,
    qualityScore: 95,
    fertilizer: "Organic",
    weather: "Rainy",
    biddingDeadline: "2024-10-27T23:59:59Z",
    status: "Sold",
  },
];

export default function TeaBatchList() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Bidding Open":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Sold":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Tea Batches</h1>
          <p className="text-gray-600 mt-1">
            Manage your tea production batches.
          </p>
        </div>
        <Link
          href="/farmer/teabatch/add"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
        >
          ➕ Add New Batch
        </Link>
      </div>

      {/* Batches Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variety
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity (kg)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quality Score
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fertilizer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weather
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bidding Deadline
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teaBatches.map((batch) => (
                <tr key={batch.batchId} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {batch.batchId}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {batch.variety}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {batch.quantity}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    ${batch.startPrice}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                    {batch.qualityScore}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {batch.fertilizer}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {batch.weather}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(batch.biddingDeadline).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        batch.status
                      )}`}
                    >
                      {batch.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      href={`/farmer/teabatch/${batch.batchId}/edit`}
                      className="text-green-600 hover:text-green-800"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
