"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddTeaBatch() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    variety: "",
    quantity: "",
    startPrice: "",
    qualityScore: "",
    fertilizer: "",
    weather: "",
    biddingDeadline: "",
  });
  const [teaLeafImage, setTeaLeafImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle the image upload and then submit the form data
    console.log("Tea batch data:", formData);
    console.log("Tea leaf image:", teaLeafImage);
    alert("Tea batch added successfully!");
    router.push("/farmer/teabatch");
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTeaLeafImage(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Add New Tea Batch
          </h1>
          <p className="text-gray-600 mt-2">
            Enter the details for your new tea batch.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Variety */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Variety *
              </label>
              <input
                type="text"
                name="variety"
                value={formData.variety}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Earl Grey"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity (kg) *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter quantity"
              />
            </div>

            {/* Start Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Price ($) *
              </label>
              <input
                type="number"
                name="startPrice"
                value={formData.startPrice}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter starting bid price"
              />
            </div>

            {/* Quality Score */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quality Score (1-100)
              </label>
              <input
                type="number"
                name="qualityScore"
                value={formData.qualityScore}
                onChange={handleChange}
                min="1"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter score"
              />
            </div>

            {/* Fertilizer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fertilizer Type
              </label>
              <select
                name="fertilizer"
                value={formData.fertilizer}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select fertilizer</option>
                <option value="Organic">Organic</option>
                <option value="Standard">Standard</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            {/* Weather */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weather Conditions
              </label>
              <select
                name="weather"
                value={formData.weather}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select weather</option>
                <option value="Sunny">Sunny</option>
                <option value="Cloudy">Cloudy</option>
                <option value="Rainy">Rainy</option>
              </select>
            </div>

            {/* Bidding Deadline */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bidding Deadline *
              </label>
              <input
                type="date"
                name="biddingDeadline"
                value={formData.biddingDeadline}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Tea Leaf Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tea Leaf Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                {teaLeafImage && (
                  <p className="text-xs text-gray-500">{teaLeafImage.name}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition font-medium"
            >
              Add Tea Batch
            </button>
            <button
              type="button"
              onClick={() => router.push("/farmer/teabatch")}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
