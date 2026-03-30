"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Attigai",
    image: "/images/attigai.jpg",
    link: "/attigai",
  },
  {
    name: "Chains",
    image: "/images/chains.jpg",
    link: "/chains",
  },
  {
    name: "Chokers",
    image: "/images/chokers.jpg",
    link: "/chokers",
  },
  {
    name: "Bridal Neckpiece",
    image: "/images/bridal-neckpiece.jpg",
    link: "/bridal-neckpiece",
  },
  {
    name: "Interchangeables",
    image: "/images/interchangeables.jpg",
    link: "/interchangeables",
  },
];

export default function CategoryGrid() {
  return (
    <div className="bg-white py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Top Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {categories.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="relative border border-white group"
            >
              <Image
                src={item.image}
                alt={item.name}
                width={300}
                height={300}
                className="object-cover w-full h-56"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-lg text-center px-2">
                  {item.name.toUpperCase()}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Text Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mt-4 text-center">
          {categories.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="text-gray-800 hover:text-black text-base flex justify-center items-center gap-1"
            >
              {item.name} <span>→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
