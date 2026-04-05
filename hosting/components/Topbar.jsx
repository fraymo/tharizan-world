"use client";
import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import {useStorefront} from "@/context/StorefrontContext";

const SocialBar = () => {
  const {tenant} = useStorefront();
  const socialLinks = tenant?.socialLinks || {};
  const hasSocialLinks = Boolean(socialLinks.facebook || socialLinks.instagram || socialLinks.youtube);

  if (!hasSocialLinks) {
    return null;
  }

  return (
    <div className="hidden md:flex bg-white border-b border-gray-200 py-2 pl-20 justify-start items-center gap-6">
      {socialLinks.facebook ? <a
        href={socialLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
          className="text-gray-600 hover:text-black text-lg"
      >
        <FaFacebookF />
      </a> : null}

      {socialLinks.instagram ? <a
        href={socialLinks.instagram}
        target="_blank"
        rel="noopener noreferrer"
          className="text-gray-600 hover:text-black text-lg"
      >
        <FaInstagram />
      </a> : null}

      {socialLinks.youtube ? <a
        href={socialLinks.youtube}
        target="_blank"
        rel="noopener noreferrer"
          className="text-gray-600 hover:text-black text-lg"
      >
        <FaYoutube />
      </a> : null}
    </div>
  );
};

export default SocialBar;
