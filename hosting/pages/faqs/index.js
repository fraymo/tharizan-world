"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "1) Order Confirmation",
    answer:
      "Placing an order is simple! Just browse our collections, select the items you love, add them to your cart, and then proceed to checkout. Follow the on-screen instructions to enter your shipping details and payment information to complete your purchase.",
  },
  {
    question: "2) Delivery Timeline",
    answer:
      "We accept a wide range of secure payment options, including major credit cards, debit cards, UPI, net banking, and popular digital wallets.",
  },
  {
    question: "3) 1-Day Delivery (Chennai Only)",
    answer:
      "We offer same-day delivery in Chennai using Porter, Dunzo, or Uber. This service must be requested at least 4 hours in advance. During peak seasons or high order volumes, we may not be able to accept 1-day delivery requests.",
  },
  {
    question: "4) International Shipping",
    answer:
      "We ship worldwide. We use DHL & FedEx for international shipments, with an estimated delivery time of 6-9 working days. Before placing an order, please contact us via WhatsApp or call so we can guide you through the process. Note: Import duties, taxes, or any applicable fees are to be borne by the customer.",
  },
  {
    question: "5) Tracking Details",
    answer:
      "Once your order has been dispatched, we will send you an email with the tracking number and a link to the courier's website, allowing you to monitor your delivery's progress.",
  },
  {
    question: "6) Unboxing Policy",
    answer:
      "For any claims related to transit damage or incorrect items, a 360° unboxing video without any cuts or edits is mandatory. Please report any issues within 24 hours of delivery. For more details, refer to our Return & Refund Policy.",
  },
  {
    question: "7) Customer Support",
    answer: `Our team is here to help! You can reach us via:
• WhatsApp: 80564 28351
• Email: teamdiyajewelz@gmail.com
• Timing: Monday - Saturday, 10:00 AM - 7:00 PM
(We are closed on Sundays)`,
  },
  {
    question: "8) Returns & Refunds",
    answer:
      "Returns and refunds are accepted within 7 working days of the delivery date for unworn and undamaged jewelry. Items must be returned in their original packaging. Once received, the item will undergo a quality check, and the refund will be processed to the original payment method within 10 working days.",
  },
  {
    question: "9) Jewelry Care",
    answer: `• Remove Before Activities: Take off jewelry before swimming, working out, showering, and cleaning.
• After Wearing: Wipe jewelry with a clean, soft, lint-free cloth to remove oils and perspiration.
• Separate Storage: Keep each piece in a separate compartment or a soft pouch to prevent scratches and tangles.
• To Avoid: Keep away from water, sweat, and harsh chemicals like perfumes and cleaning products.`,
  },
  {
    question: "10) How Can I Trust You?",
    answer: `• Secure Shopping: Our website is securely hosted on Fraymo Technologies.
• Trusted Payments: We use Razorpay, a trusted and secure payment gateway, for all transactions. We never share customer data.`,
  },
  {
    question: "11) Why are some products sold out? When will they be restocked?",
    answer:
      'Products can sell out quickly due to high demand. You can click the "Notify Me" button on the product page to receive an email update as soon as the item is back in stock.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-12 px-6 lg:px-20 text-gray-800">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center mb-10">
          Frequently Asked Questions (FAQs)
        </h2>

        {/* FAQs */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 transition-all"
            >
              <button
                className="flex justify-between items-center w-full text-left text-lg font-semibold"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="mt-3 text-gray-700 whitespace-pre-line">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
