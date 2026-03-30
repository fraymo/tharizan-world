"use client";
import React from "react";
import { Facebook, Instagram, Youtube, Phone, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      className="bg-white text-gray-600 pt-10 border-t border-gray-200"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {/* Brand and Social Section */}
        <div className="flex flex-col items-start">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <Image
              src="/logo.jpg"
              alt="Tharizan World"
              width={40}
              height={40}
            />
            <span className="text-2xl font-bold text-gray-900">
              Tharizan World
            </span>
          </Link>
          <p className="mb-4 text-sm text-gray-500">
            Tharizan World is your premier online destination for fashion
            jewelry, serving customers since {new Date().getFullYear()}.
          </p>
          <div className="flex gap-4 mt-4">
            <a
              href="https://www.instagram.com/diya_jewelz?igsh=aW1maGJpdXBtYmxw"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              <Facebook className="w-5 h-5 text-gray-600 hover:text-black" />
            </a>
            <a
              href="https://www.instagram.com/diya_jewelz?igsh=aW1maGJpdXBtYmxw"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              <Instagram className="w-5 h-5 text-gray-600 hover:text-black" />
            </a>
            <a
              href="https://www.youtube.com/@DiyaJewelz"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              <Youtube className="w-5 h-5 text-gray-600 hover:text-black" />
            </a>
          </div>
        </div>

        {/* Contact & Timings Section */}
        <div>
          {/* <h3 className="font-bold text-white mb-4">Contact Info</h3>
          <h3 className="font-bold text-white mb-4">Contact Info</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-pink-500" />
              <p className="text-gray-400">WhatsApp: +91 96770 26020</p>
              <Phone className="w-4 h-4 text-pink-400" />
              <a
                href="https://wa.me/919677026020"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                WhatsApp: +91 96770 26020
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="w-4 h-4 mt-1 text-purple-500" />
              <Clock className="w-4 h-4 mt-1 text-pink-400" />
              <div>
                <p className="text-gray-400 font-medium">Online Department Timings:</p>
                <p className="text-sm text-gray-500">
                  Mon - Sat: 9:30 AM - 5:30 PM IST
                  <br />
                  Closed on Sundays & Public Holidays
                </p>
              </div>
            </li>
          </ul> */}
        </div>

        {/* Links Section (re-organized) */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
          <div className="grid grid-cols-1 gap-y-2">
            <Link href="/about-us" className="text-gray-500 hover:text-black transition-colors">
              About Us
            </Link>
            <Link href="/wishlist" className="text-gray-500 hover:text-black transition-colors">
              Wishlist
            </Link>
            <Link href="/faqs" className="text-gray-500 hover:text-black transition-colors">
              FAQs
            </Link>
            <Link href="/jewellery-care" className="text-gray-500 hover:text-black transition-colors">
              Jewellery Care
            </Link>
            <Link href="/size-measurement-guide" className="text-gray-500 hover:text-black transition-colors">
              Size and Measurement Guide
            </Link>
          </div>
        </div>

        {/* Policies Section */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4">Policies</h3>
          <div className="grid grid-cols-1 gap-y-2">
            <Link href="/return-refund-policy" className="text-gray-500 hover:text-black transition-colors">
              Return and Refund Policy
            </Link>
            <Link href="/shipping-policy" className="text-gray-500 hover:text-black transition-colors">
              Shipping Policy
            </Link>
            <Link href="/international-orders" className="text-gray-500 hover:text-black transition-colors">
              International Orders
            </Link>
            <Link href="/terms-of-service" className="text-gray-500 hover:text-black transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy-policy" className="text-gray-500 hover:text-black transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 mt-8 pt-4 pb-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Tharizan World. Developed by{" "}
        <a
          href="https://fraymotech.com/"
          className="text-gray-900 hover:text-black"
          target="_blank"
          rel="noopener noreferrer"
        >
          Fraymo Technologies
        </a>
      </div>
    </motion.footer>
  );
}
