"use client";
import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

const SocialBar = () => {
  return (
    <div className="hidden md:flex bg-white border-b border-gray-200 py-2 pl-20 justify-start items-center gap-6">
      {/* Facebook */}
      <a
        href="https://facebook.com"
        target="_blank"
        rel="noopener noreferrer"
          className="text-gray-600 hover:text-black text-lg"
      >
        <FaFacebookF />
      </a>

      {/* Instagram */}
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
          className="text-gray-600 hover:text-black text-lg"
      >
        <FaInstagram />
      </a>

      {/* YouTube */}
      <a
        href="https://youtube.com"
        target="_blank"
        rel="noopener noreferrer"
          className="text-gray-600 hover:text-black text-lg"
      >
        <FaYoutube />
      </a>
    </div>
  );
};

export default SocialBar;
