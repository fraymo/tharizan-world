"use client";
import React from "react";
import {
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Send,
  Undo2,
  RefreshCw,
} from "lucide-react";

export default function ReturnPolicy() {
  return (
    <section className="bg-white py-12 px-6 lg:px-20 text-gray-800">
      <div className="max-w-5xl mx-auto space-y-10 text-lg leading-relaxed">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center mb-8">
          Return and Refund Policy
        </h2>

        {/* Need Help Before Ordering? */}
        <div>
          <h3 className="flex items-center text-xl font-semibold mb-3">
            <HelpCircle className="w-6 h-6 mr-3 text-blue-600" />
            Need Help Before Ordering?
          </h3>
          <p className="mb-2">
            For clarity on quality or size, please read the below points
            carefully before placing your order.
          </p>
          <p>
            For exact color details & sizes, kindly contact our team on WhatsApp
            at{" "}
            <a
              href="https://wa.me/918056428351"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-green-600 hover:underline"
            >
              80564 28351
            </a>
            .
          </p>
        </div>

        {/* Order Process & Quality Assurance */}
        <div>
          <h3 className="flex items-center text-xl font-semibold mb-3">
            <ShieldCheck className="w-6 h-6 mr-3 text-green-600" />
            Order Process & Quality Assurance
          </h3>
          <ul className="list-disc pl-8 space-y-2">
            <li>
              <strong>Order Confirmation:</strong> Once your order is placed, an
              Order ID and invoice will be emailed. Kindly check your inbox or
              spam folder.
            </li>
            <li>
              <strong>Double Quality Check & Dispatch:</strong> Every piece is
              inspected before packing.
            </li>
          </ul>
        </div>

        {/* What Is Not Considered as Damage */}
        <div>
          <h3 className="flex items-center text-xl font-semibold mb-3">
            <AlertTriangle className="w-6 h-6 mr-3 text-yellow-600" />
            What Is Not Considered as Damage
          </h3>
          <ul className="list-disc pl-8 space-y-2">
            <li>Bent earring stems.</li>
            <li>
              Color variation of 5–10% due to screen or device differences.
            </li>
          </ul>
        </div>

        {/* Reasons for No Returns */}
        <div>
          <h3 className="flex items-center text-xl font-semibold mb-3">
            <XCircle className="w-6 h-6 mr-3 text-red-600" />
            We Do NOT Accept Returns for the Following Reasons
          </h3>
          <ul className="list-disc pl-8 space-y-2">
            <li>Delays in delivery / product not received before an occasion.</li>
            <li>Bangle size doesn’t fit.</li>
            <li>The product doesn’t suit you.</li>
            <li>Damage while wearing or trying on after delivery.</li>
          </ul>
        </div>

        {/* Accepted Returns */}
        <div>
          <h3 className="flex items-center text-xl font-semibold mb-3">
            <CheckCircle2 className="w-6 h-6 mr-3 text-teal-600" />
            We ACCEPT Returns Only For:
          </h3>
          <ul className="list-disc pl-8">
            <li>Logistic/Transit Damages</li>
          </ul>
        </div>

        {/* Return Request Process */}
        <div>
          <h3 className="flex items-center text-xl font-semibold mb-3">
            <Send className="w-6 h-6 mr-3 text-gray-700" />
            Return Request Process
          </h3>
          <p className="mb-2">
            In case of damage due to logistics, please follow the steps below
            within <strong>24 hours of delivery</strong>:
          </p>
          <ol className="list-decimal pl-8 space-y-2">
            <li>
              Report the issue on WhatsApp with:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Name</li>
                <li>Order ID</li>
                <li>
                  <strong className="text-red-700">
                    360° Unboxing Video (Compulsory – no cuts/editing. Repacked
                    items will not be accepted).
                  </strong>
                </li>
              </ul>
            </li>
          </ol>
          <p className="mt-4 text-sm italic">
            Issues reported after 24 hours or without an unboxing video will
            not be accepted.
          </p>
        </div>

        {/* Approved Return Instructions */}
        <div>
          <h3 className="flex items-center text-xl font-semibold mb-3">
            <Undo2 className="w-6 h-6 mr-3 text-indigo-600" />
            Approved Return Instructions
          </h3>
          <ul className="list-disc pl-8 space-y-2">
            <li>Return the item within 48 hours of our approval.</li>
            <li>Use a reliable courier service like India Post or DTDC.</li>
            <li>
              A shipping cost of ₹70 will be reimbursed.
            </li>
            <li>
              You must provide the tracking number to us once the item is
              dispatched.
            </li>
          </ul>
        </div>

        {/* Refunds / Replacements */}
        <div>
          <h3 className="flex items-center text-xl font-semibold mb-3">
            <RefreshCw className="w-6 h-6 mr-3 text-purple-600" />
            Refunds / Replacements
          </h3>
          <ul className="list-disc pl-8 space-y-2">
            <li>
              Once the returned product is received and inspected, its status
              will be shared with you on WhatsApp.
            </li>
            <li>
              A replacement will be shipped at no additional cost.
            </li>
            <li>
              A refund (if applicable) will be processed for the product price
              only.
            </li>
          </ul>
          <p className="mt-4 text-sm font-semibold">
            All refund/replacement decisions are made at the sole discretion of
            the company based on the case.
          </p>
        </div>
      </div>
    </section>
  );
}
