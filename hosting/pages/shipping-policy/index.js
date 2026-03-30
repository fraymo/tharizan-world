"use client";
import React from "react";
import { Clock, Truck, Home, MapPinOff, MapPin } from "lucide-react";

export default function ShippingPolicy() {
  return (
    <section className="bg-white py-12 px-6 lg:px-20 text-gray-800">
      <div className="max-w-5xl mx-auto space-y-8 text-lg leading-relaxed">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center mb-6">Shipping Policy</h2>

        {/* Introduction */}
        <p className="text-center">
          At <span className="font-semibold">Tharizan World</span>, we ensure that
          your order reaches you safely and as quickly as possible. Please read
          our shipping policy carefully before placing your order.
        </p>

        {/* Order Processing Time */}
        <div>
          <h3 className="flex items-center text-xl font-semibold mb-3">
            <Clock className="w-6 h-6 mr-3 text-gray-700" />
            Order Processing Time
          </h3>
          <ul className="list-disc pl-8 space-y-2">
            <li>
              All orders are processed within 2-3 business days (excluding
              Sundays and public holidays).
            </li>
          </ul>
        </div>

        {/* Shipping Timeline */}
        <div>
          <h3 className="flex items-center text-xl font-semibold mb-3">
            <Truck className="w-6 h-6 mr-3 text-blue-600" />
            Shipping Timeline
          </h3>
          <ul className="list-disc pl-8 space-y-2">
            <li>
              We ship across India through trusted courier partners (DTDC &
              India Post).
            </li>
            <li>
              Delivery typically takes 3–7 business days, depending on your
              location.
            </li>
            <li>
              During high-demand seasons or unforeseen delays (like weather or
              courier issues), delivery may take slightly longer.
            </li>
          </ul>
        </div>

        {/* Address Accuracy */}
        <div>
          <h3 className="flex items-center text-xl font-semibold mb-3">
            <Home className="w-6 h-6 mr-3 text-purple-600" />
            Address Accuracy – Please Note
          </h3>
          <p className="mb-2">
            Before placing your order, please double-check your shipping
            address, phone number, and pin code.
          </p>
          <ul className="list-disc pl-8 space-y-2">
            <li>
              If a package is misrouted or returned due to an incorrect or
              incomplete address, the courier and our company will not bear any
              responsibility.
            </li>
            <li>
              In such cases, customers will have to bear any reshipping charges
              or product loss incurred.
            </li>
          </ul>
        </div>

        {/* Non-Serviceable Areas */}
        <div>
          <h3 className="flex items-center text-xl font-semibold mb-3">
            <MapPinOff className="w-6 h-6 mr-3 text-yellow-600" />
            Non-Serviceable Areas
          </h3>
          <p>
            If your pin code is not serviceable by our delivery partners, we
            will reach out to you for an alternative address.
          </p>
        </div>

        {/* Tracking Information */}
        <div>
          <h3 className="flex items-center text-xl font-semibold mb-3">
            <MapPin className="w-6 h-6 mr-3 text-red-600" />
            Tracking Information
          </h3>
          <ul className="list-disc pl-8 space-y-2">
            <li>
              Once your order is shipped, a tracking link will be sent via
              email.
            </li>
            <li>
              You can use this to track the real-time status of your delivery.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
