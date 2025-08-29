"use client";

import React, { useState } from "react";
import Link from "next/link";

// Mock Data
const ownedBatches = [
  {
    id: "TB003",
    teaType: "Black Tea",
    quantity: 120,
    winningBid: 1500,
    status: "Awaiting Transport",
  },
  {
    id: "TB005",
    teaType: "Oolong",
    quantity: 50,
    winningBid: 800,
    status: "Delivered",
  },
];

const activeBids = [
  {
    id: "TB001",
    teaType: "Earl Grey",
    yourBid: 1200,
    currentHighest: 1250,
    status: "Outbid",
  },
  {
    id: "TB002",
    teaType: "Green Tea",
    yourBid: 950,
    currentHighest: 950,
    status: "Winning",
  },
];

const transporters = [
  { id: "T01", name: "Speedy Logistics" },
  { id: "T02", name: "Reliable Freight" },
  { id: "T03", name: "Tea Movers Inc." },
];

// Transporter Modal Component
function AssignTransporterModal({ batch, onClose, onAssign }: any) {
  const [selectedTransporter, setSelectedTransporter] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Assign Transporter
        </h2>
        <p className="mb-4 text-gray-600">
          Select a transporter for batch{" "}
          <span className="font-semibold">{batch.id}</span>.
        </p>
        <select
          value={selectedTransporter}
          onChange={(e) => setSelectedTransporter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        >
          <option value="">Select a transporter</option>
          {transporters.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onAssign(batch.id, selectedTransporter)}
            disabled={!selectedTransporter}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BuyerDashboard() {
  const [modalInfo, setModalInfo] = useState<{
    isOpen: boolean;
    batch: any | null;
  }>({
    isOpen: false,
    batch: null,
  });

  const handleAssignTransporter = (batchId: string, transporterId: string) => {
    console.log(`Assigning transporter ${transporterId} to batch ${batchId}`);
    alert(`Transporter assigned to batch ${batchId}!`);
    setModalInfo({ isOpen: false, batch: null });
  };

  return (
    <div className="space-y-8">
      {modalInfo.isOpen && modalInfo.batch && (
        <AssignTransporterModal
          batch={modalInfo.batch}
          onClose={() => setModalInfo({ isOpen: false, batch: null })}
          onAssign={handleAssignTransporter}
        />
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Manage your bids and purchased tea batches.
        </p>
      </div>

      {/* Owned Batches */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Your Owned Tea Batches
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Batch ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tea Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Winning Bid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ownedBatches.map((batch) => (
                <tr key={batch.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {batch.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {batch.teaType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    ${batch.winningBid}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {batch.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {batch.status === "Awaiting Transport" && (
                      <button
                        onClick={() => setModalInfo({ isOpen: true, batch })}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-xs"
                      >
                        Assign Transporter
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Bids */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Your Active Bids
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Batch ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Your Bid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Highest Bid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeBids.map((bid) => (
                <tr key={bid.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {bid.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    ${bid.yourBid}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    ${bid.currentHighest}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`font-semibold ${
                        bid.status === "Winning"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {bid.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/buyer/teabatch/${bid.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View Batch
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
