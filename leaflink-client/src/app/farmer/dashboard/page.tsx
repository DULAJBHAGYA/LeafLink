"use client";

import React from "react";
import Link from "next/link";

// Updated mock data for recent batches to include all fields
const recentBatches = [
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

export default function FarmerDashboard() {
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

  const getDaysLeft = (deadline: string) => {
    const diff = new Date(deadline).getTime() - new Date().getTime();
    if (diff < 0) return "Closed";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days}d left`;
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Farmer Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's your tea production overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">🍃</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Batches</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">📦</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Pending Batches
              </p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-bold">💰</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$12,450</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/farmer/teabatch/add"
            className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition text-center"
          >
            <div className="text-2xl mb-2">➕</div>
            <div className="font-medium">Add New Batch</div>
          </Link>

          <Link
            href="/farmer/teabatch"
            className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition text-center"
          >
            <div className="text-2xl mb-2">📋</div>
            <div className="font-medium">View All Batches</div>
          </Link>

          <Link
            href="/farmer/reports"
            className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition text-center"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium">View Reports</div>
          </Link>

          <Link
            href="/farmer/profile"
            className="bg-gray-600 text-white p-4 rounded-lg hover:bg-gray-700 transition text-center"
          >
            <div className="text-2xl mb-2">👤</div>
            <div className="font-medium">Edit Profile</div>
          </Link>
        </div>
      </div>

      {/* Recent Batches Table Updated */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Tea Batches
        </h2>
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
              {recentBatches.map((batch) => (
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
