"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";

// Mock Data for delivery details
const deliveryDetails: { [key: string]: any } = {
  DEL001: {
    id: "DEL001",
    batchId: "TB003",
    teaType: "Black Tea",
    quantity: 120,
    status: "In Transit",
    buyer: {
      name: "Alice Corp",
      address: "123 Market St, Cityville, CV 45678",
      contact: "alice@example.com",
    },
    pickupLocation: "Mountain Farm C, Hilltop County",
  },
  DEL002: {
    id: "DEL002",
    batchId: "TB007",
    teaType: "Rooibos",
    quantity: 60,
    status: "Pending Pickup",
    buyer: {
      name: "Bob Industries",
      address: "456 Commerce Ave, Townburg, TB 90123",
      contact: "bob@example.com",
    },
    pickupLocation: "Valley View Farm, Greenfield",
  },
};

export default function DeliveryDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [delivery, setDelivery] = useState(deliveryDetails[id]);

  if (!delivery) {
    return <div className="text-center text-gray-600">Delivery not found.</div>;
  }

  const handleUpdateStatus = () => {
    // In a real app, this would be an API call
    setDelivery({ ...delivery, status: "Delivered" });
    alert("Status updated to Delivered!");
    router.push("/transporter/dashboard");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Transit":
        return "bg-yellow-100 text-yellow-800";
      case "Pending Pickup":
        return "bg-blue-100 text-blue-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Delivery Details Section */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Delivery #{delivery.id}
            </h1>
            <p className="text-gray-600">Batch ID: {delivery.batchId}</p>
          </div>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
              delivery.status
            )}`}
          >
            {delivery.status}
          </span>
        </div>

        <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Batch Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Batch Information
            </h2>
            <p>
              <span className="font-semibold">Type:</span> {delivery.teaType}
            </p>
            <p>
              <span className="font-semibold">Quantity:</span>{" "}
              {delivery.quantity} kg
            </p>
            <p>
              <span className="font-semibold">Pickup From:</span>{" "}
              {delivery.pickupLocation}
            </p>
          </div>

          {/* Buyer Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Buyer Information
            </h2>
            <p>
              <span className="font-semibold">Name:</span> {delivery.buyer.name}
            </p>
            <p>
              <span className="font-semibold">Address:</span>{" "}
              {delivery.buyer.address}
            </p>
            <p>
              <span className="font-semibold">Contact:</span>{" "}
              {delivery.buyer.contact}
            </p>
          </div>
        </div>
      </div>

      {/* Action Card */}
      <div className="bg-white rounded-lg shadow p-6 h-fit">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Update Status</h2>
        <p className="text-gray-600 mb-4">
          Once the tea batch has been successfully delivered, mark it as
          delivered.
        </p>
        <button
          onClick={handleUpdateStatus}
          disabled={delivery.status === "Delivered"}
          className="w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition disabled:bg-purple-300"
        >
          {delivery.status === "Delivered"
            ? "Already Delivered"
            : "Mark as Delivered"}
        </button>
      </div>
    </div>
  );
}
