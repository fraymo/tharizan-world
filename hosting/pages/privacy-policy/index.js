"use client";
import React from "react";

export default function PrivacyPolicy() {
  return (
    <section className="bg-white py-12 px-6 lg:px-20 text-gray-800">
      <div className="max-w-5xl mx-auto space-y-6 text-lg leading-relaxed">
        {/* Page Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">🔒 Privacy Policy</h1>
          <p className="text-sm text-gray-600 mt-2">
            Last Updated: October 1, 2025
          </p>
        </div>

        {/* Introduction */}
        <p>
          This Privacy Policy describes how{" "}
          <span className="font-semibold">Tharizan World</span> ("we," "us," or
          "our") collects, uses, and discloses your personal information when
          you visit our website (the "Site") or make a purchase. Your privacy
          is important to us, and we are committed to protecting your data.
        </p>

        {/* Section 1: Information We Collect */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold pt-4 border-t border-gray-300">
            1. Information We Collect
          </h2>
          <p>
            We collect information in a few different ways to provide and
            improve our services:
          </p>
          <ul className="list-disc pl-8 space-y-2">
            <li>
              <strong>Information You Provide to Us:</strong> This includes your
              name, billing address, shipping address, email address, phone
              number, and payment information when you make a purchase or create
              an account.
            </li>
            <li>
              <strong>Information We Collect Automatically:</strong> When you
              browse our Site, we automatically collect certain information
              about your device, including your IP address, browser type, and
              how you interact with our Site, using cookies and similar
              technologies.
            </li>
          </ul>
        </div>

        {/* Section 2: How We Use Your Information */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold pt-4 border-t border-gray-300">
            2. How We Use Your Information
          </h2>
          <p>
            We use the information we collect for various purposes, including:
          </p>
          <ul className="list-disc pl-8 space-y-2">
            <li>To process and fulfill your orders, including managing payments and shipping.</li>
            <li>To communicate with you about your orders and provide customer support.</li>
            <li>To send you marketing communications, if you opt-in to receive them.</li>
            <li>To improve and personalize your experience on our Site.</li>
            <li>To prevent fraudulent transactions and enhance the security of our Site.</li>
          </ul>
        </div>

        {/* Section 3: How We Share Your Information */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold pt-4 border-t border-gray-300">
            3. How We Share Your Information
          </h2>
          <p>
            We do not sell your personal information. We may share it with
            trusted third-party service providers who help us operate our
            business, such as:
          </p>
          <ul className="list-disc pl-8 space-y-2">
            <li>Payment processors to securely handle your payments.</li>
            <li>Shipping carriers to deliver your orders.</li>
            <li>Marketing platforms to manage our email communications.</li>
          </ul>
          <p>We may also share information to comply with legal obligations.</p>
        </div>
        
        {/* Section 4: Data Security */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold pt-4 border-t border-gray-300">
            4. Data Security
          </h2>
          <p>
            We implement a variety of security measures to maintain the safety
            of your personal information. However, no method of transmission
            over the Internet or electronic storage is 100% secure, and we
            cannot guarantee its absolute security.
          </p>
        </div>

        {/* Section 5: Your Rights */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold pt-4 border-t border-gray-300">
            5. Your Rights
          </h2>
          <p>
            You have the right to access, correct, or delete your personal
            information that we hold. You can also opt-out of receiving
            marketing emails from us at any time by clicking the "unsubscribe"
            link in the email.
          </p>
        </div>

        {/* Section 6: Changes to This Policy */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold pt-4 border-t border-gray-300">
            6. Changes to This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new policy on this page and
            updating the "01/10/2025" date.
          </p>
        </div>

        {/* Section 7: Contact Us */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold pt-4 border-t border-gray-300">
            7. Contact Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at:
          </p>
          <p className="font-semibold">support@diyajewelz.com</p>
        </div>
      </div>
    </section>
  );
}
