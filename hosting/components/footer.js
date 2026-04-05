"use client";
import React from "react";
import {Facebook, Instagram, Youtube} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {motion} from "framer-motion";
import {useStorefront} from "@/context/StorefrontContext";
import {buildTenantPath} from "@/utils/util";

export default function Footer() {
  const {tenant} = useStorefront();
  const defaultSlug = process.env.NEXT_PUBLIC_DEFAULT_STORE_SLUG || "modern-hub";
  const isSellerStorefront = Boolean(tenant?.slug && tenant.slug !== defaultSlug);
  const brandName = isSellerStorefront ? (tenant?.storeName || tenant?.sellerName || "Seller Store") : "Modern Hub";
  const brandLogo = tenant?.logo || "/logo.jpg";
  const homeHref = isSellerStorefront ? `/${tenant.slug}` : "/";
  const socialLinks = tenant?.socialLinks || {};
  const brandDescription = isSellerStorefront
    ? `${brandName} is a seller storefront powered by Modern Hub for fast browsing, wishlist sync, and direct checkout.`
    : "Modern Hub is your promotional shopping destination for trending collections, featured campaigns, and curated product ads.";
  const quickLinks = [
    {label: "My Account", href: buildTenantPath("/accounts", tenant)},
    {label: "Wishlist", href: buildTenantPath("/wishlist", tenant)},
    {label: "Saved Addresses", href: buildTenantPath("/addresses", tenant)},
    {label: "Notifications", href: buildTenantPath("/notifications", tenant)},
    {label: "Contact Us", href: buildTenantPath("/contact", tenant)},
  ];
  const policyLinks = [
    {label: "Terms of Service", href: buildTenantPath("/terms-of-service", tenant)},
    {label: "Privacy Policy", href: buildTenantPath("/privacy-policy", tenant)},
    {label: "Return and Refund Policy", href: "/return-refund-policy"},
    {label: "Shipping Policy", href: "/shipping-policy"},
    {label: "International Orders", href: "/international-orders"},
  ];

  return (
    <motion.footer
      className="border-t border-gray-200 bg-white pt-10 text-gray-600"
      initial={{opacity: 0, y: 50}}
      whileInView={{opacity: 1, y: 0}}
      transition={{duration: 0.8, ease: "easeOut"}}
      viewport={{once: true}}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 md:grid-cols-3 lg:grid-cols-4 lg:px-12">
        <div className="flex flex-col items-start">
          <Link href={homeHref} className="mb-4 flex items-center gap-2">
            <Image src={brandLogo} alt={brandName} width={40} height={40} unoptimized />
            <span className="text-2xl font-bold text-gray-900">{brandName}</span>
          </Link>
          <p className="mb-4 text-sm text-gray-500">
            {brandDescription}
          </p>
          <div className="mt-4 flex gap-4">
            {socialLinks.facebook ? <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-gray-300 bg-white p-2 transition-colors hover:bg-gray-100"
            >
              <Facebook className="h-5 w-5 text-gray-600 hover:text-black" />
            </a> : null}
            {socialLinks.instagram ? <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-gray-300 bg-white p-2 transition-colors hover:bg-gray-100"
            >
              <Instagram className="h-5 w-5 text-gray-600 hover:text-black" />
            </a> : null}
            {socialLinks.youtube ? <a
              href={socialLinks.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-gray-300 bg-white p-2 transition-colors hover:bg-gray-100"
            >
              <Youtube className="h-5 w-5 text-gray-600 hover:text-black" />
            </a> : null}
          </div>
        </div>

        <div />

        <div>
          <h3 className="mb-4 font-bold text-gray-900">Quick Links</h3>
          <div className="grid grid-cols-1 gap-y-2">
            {quickLinks.map((item) => (
              <Link key={item.label} href={item.href} className="text-gray-500 transition-colors hover:text-black">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-gray-900">Policies</h3>
          <div className="grid grid-cols-1 gap-y-2">
            {policyLinks.map((item) => (
              <Link key={item.label} href={item.href} className="text-gray-500 transition-colors hover:text-black">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 pb-6 pt-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} {brandName}. Developed by{" "}
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
