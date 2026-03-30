"use client";
import React from "react";

export default function TermsOfService() {
  return (
    <section className="bg-white py-12 px-6 lg:px-20 text-gray-800">
      <div className="max-w-5xl mx-auto space-y-6 text-lg leading-relaxed">
        {/* Page Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="text-sm text-gray-600 mt-2">
            Last Updated: October 1, 2025
          </p>
        </div>

        {/* Introduction */}
        <p>
          Welcome to <span className="font-semibold">Tharizan World</span>. By
          accessing or using our website (the "Site"), you agree to be bound by
          these Terms of Service ("Terms") and our Privacy Policy. If you do not
          agree with any part of these terms, you must not use our Site.
        </p>

        {/* Section 1: Use of the Website */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold pt-4 border-t border-gray-300">
            1. Use of the Website
          </h2>
          <ul className="list-disc pl-8 space-y-2">
            <li>
              <strong>Eligibility:</strong> You must be at least 18 years of age
              to use this Site or make a purchase.
            </li>
            <li>
              <strong>Account Responsibility:</strong> You are responsible for
              maintaining the confidentiality of your account information and
              for all activities that occur under your account.
            </li>
            <li>
              <strong>Prohibited Conduct:</strong> You agree not to use the Site
              for any unlawful purpose, to infringe upon the rights of others,
              or to transmit any harmful code or spam.
            </li>
          </ul>
        </div>

        {/* Section 2: Products and Orders */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold pt-4 border-t border-gray-300">
            2. Products and Orders
          </h2>
          <ul className="list-disc pl-8 space-y-2">
            <li>
              <strong>Product Information:</strong> We strive to display product
              information and colors as accurately as possible, but we cannot
              guarantee that your device's display will be completely accurate.
            </li>
            <li>
              <strong>Pricing:</strong> All prices are subject to change without
              notice. We reserve the right to modify or discontinue a product at
              any time.
            </li>
            <li>
              <strong>Order Acceptance:</strong> We reserve the right to refuse
              or cancel any order for any reason, including limitations on
              quantities available, inaccuracies in product or pricing
              information, or issues identified by our credit and fraud
              avoidance department.
            </li>
          </ul>
        </div>

        {/* Section 3: Intellectual Property */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold pt-4 border-t border-gray-300">
            3. Intellectual Property
          </h2>
          <p>
            All content on this Site, including text, graphics, logos, images,
            and software, is the property of{" "}
            <span className="font-semibold">Tharizan World</span> and is
            protected by copyright and other intellectual property laws.
            Unauthorized use of any content is strictly prohibited.
          </p>
        </div>

        {/* Section 4: Limitation of Liability */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold pt-4 border-t border-gray-300">
            4. Limitation of Liability
          </h2>
          <p>
            To the fullest extent permitted by law,{" "}
            <span className="font-semibold">Tharizan World</span> shall not be
            liable for any indirect, incidental, special, or consequential
            damages that result from the use of, or the inability to use, this
            Site or the performance of the products purchased through the Site.
          </p>
        </div>

        {/* Section 5: Governing Law */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold pt-4 border-t border-gray-300">
            5. Governing Law
          </h2>
          <p>
            These Terms of Service shall be governed by and construed in
            accordance with the laws of India, and you agree to submit to the
            exclusive jurisdiction of the courts located in Tiruppur, Tamil Nadu.
          </p>
        </div>

        {/* Section 6: Changes to Terms */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold pt-4 border-t border-gray-300">
            6. Changes to Terms
          </h2>
          <p>
            We reserve the right to update or modify these Terms at any time
            without prior notice. Your continued use of the Site following any
            changes constitutes your acceptance of the new Terms.
          </p>
        </div>

        {/* Section 7: Contact Information */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold pt-4 border-t border-gray-300">
            7. Contact Information
          </h2>
          <p>
            If you have any questions about these Terms, please contact us at{" "}
            <span className="font-semibold">support@diyajewelz.com</span>.
          </p>
        </div>
      </div>
    </section>
  );
}
