"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const sampleProducts = [
  { id: 1, name: "Attigai", image: "/images/attigai.jpg", price: 12000, inStock: true, link: "/attigai" },
  { id: 2, name: "Chains", image: "/images/chains.jpg", price: 8000, inStock: false, link: "/chains" },
  { id: 3, name: "Chokers", image: "/images/chokers.jpg", price: 15000, inStock: true, link: "/chokers" },
  { id: 4, name: "Bridal Neckpiece", image: "/images/bridal.jpg", price: 25000, inStock: true, link: "/bridal-neckpiece" },
  { id: 5, name: "Interchangeables", image: "/images/interchangeables.jpg", price: 10000, inStock: false, link: "/interchangeables" },
  { id: 6, name: "Diamond Necklace", image: "/images/diamond-necklace.jpg", price: 55000, inStock: true, link: "/diamond-necklace" },
  { id: 7, name: "Pearl Necklace", image: "/images/pearl-necklace.jpg", price: 18000, inStock: true, link: "/pearl-necklace" },
  { id: 8, name: "Antique Haram", image: "/images/antique-haram.jpg", price: 30000, inStock: false, link: "/antique-haram" },
  { id: 9, name: "Temple Jewelry", image: "/images/temple.jpg", price: 40000, inStock: true, link: "/temple-jewelry" },
  { id: 10, name: "Kemp Necklace", image: "/images/kemp.jpg", price: 16000, inStock: true, link: "/kemp-necklace" },
  { id: 11, name: "Gold Bangles", image: "/images/bangles.jpg", price: 20000, inStock: true, link: "/gold-bangles" },
  { id: 12, name: "Diamond Earrings", image: "/images/diamond-earrings.jpg", price: 22000, inStock: true, link: "/diamond-earrings" },
  { id: 13, name: "Stud Earrings", image: "/images/stud-earrings.jpg", price: 7000, inStock: false, link: "/stud-earrings" },
  { id: 14, name: "Pearl Earrings", image: "/images/pearl-earrings.jpg", price: 9500, inStock: true, link: "/pearl-earrings" },
  { id: 15, name: "Gold Chain", image: "/images/gold-chain.jpg", price: 12000, inStock: true, link: "/gold-chain" },
  { id: 16, name: "Diamond Ring", image: "/images/diamond-ring.jpg", price: 18000, inStock: false, link: "/diamond-ring" },
  { id: 17, name: "Platinum Ring", image: "/images/platinum-ring.jpg", price: 25000, inStock: true, link: "/platinum-ring" },
  { id: 18, name: "Mangalsutra", image: "/images/mangalsutra.jpg", price: 35000, inStock: true, link: "/mangalsutra" },
  { id: 19, name: "Gold Pendant", image: "/images/pendant.jpg", price: 14000, inStock: false, link: "/gold-pendant" },
  { id: 20, name: "Navaratna Necklace", image: "/images/navaratna.jpg", price: 50000, inStock: true, link: "/navaratna-necklace" },
];

export default function ProductGrid() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 60000]);
  const [sortOption, setSortOption] = useState("az");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const filteredProducts = sampleProducts.filter(
    (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "az") return a.name.localeCompare(b.name);
    if (sortOption === "za") return b.name.localeCompare(a.name);
    if (sortOption === "low-high") return a.price - b.price;
    if (sortOption === "high-low") return b.price - a.price;
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-center mb-6">Attigai Collection</h1>

        {/* Mobile Filter Button */}
        <div className="flex items-center justify-between sm:hidden mb-4">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 border px-4 py-2 rounded-md shadow-sm bg-white"
          >
            <span>⚙️ Filter and sort</span>
          </button>
          <span className="text-gray-600">{filteredProducts.length} products</span>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filter (Desktop Only) */}
          <aside className="hidden sm:block w-64 bg-white p-4 border rounded-md">
            <h3 className="font-semibold mb-3">Availability</h3>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked /> In stock
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" /> Out of stock
            </label>

            <h3 className="font-semibold mt-6 mb-3">Price</h3>
            <div className="mb-2 text-sm text-gray-700">
              ₹{priceRange[0]} – ₹{priceRange[1]}
            </div>
            <input
              type="range"
              min="0"
              max="60000"
              step="1000"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
              className="w-full mb-2"
            />
            <input
              type="range"
              min="0"
              max="60000"
              step="1000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
              className="w-full"
            />

            <h3 className="font-semibold mt-6 mb-3">Sort by</h3>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full border px-2 py-1 rounded"
            >
              <option value="az">Alphabetically, A-Z</option>
              <option value="za">Alphabetically, Z-A</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
                <Link
                  key={product.id}
                  href={product.link} // ✅ fixed page link, not dynamic
                  className="border bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="object-cover w-full h-48"
                  />
                  <div className="p-3">
                    <h3 className="font-medium text-gray-800">{product.name}</h3>
                    <p className="text-gray-600">₹{product.price}</p>
                    <p
                      className={`text-sm ${
                        product.inStock ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <Transition appear show={isFilterOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setIsFilterOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl">
              <div className="p-4 flex justify-between items-center border-b">
                <h2 className="text-lg font-bold">Filter and sort</h2>
                <button onClick={() => setIsFilterOpen(false)}>✖</button>
              </div>

              <div className="p-4">
                <h3 className="font-semibold mb-3">Availability</h3>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked /> In stock
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> Out of stock
                </label>

                <h3 className="font-semibold mt-6 mb-3">Price</h3>
                <div className="mb-2 text-sm text-gray-700">
                  ₹{priceRange[0]} – ₹{priceRange[1]}
                </div>
                <input
                  type="range"
                  min="0"
                  max="60000"
                  step="1000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                  className="w-full mb-2"
                />
                <input
                  type="range"
                  min="0"
                  max="60000"
                  step="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                  className="w-full"
                />

                <h3 className="font-semibold mt-6 mb-3">Sort by</h3>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                >
                  <option value="az">Alphabetically, A-Z</option>
                  <option value="za">Alphabetically, Z-A</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                </select>
              </div>

              <div className="p-4 flex justify-between border-t">
                <button
                  className="text-red-500"
                  onClick={() => {
                    setPriceRange([0, 60000]);
                    setSortOption("az");
                  }}
                >
                  Remove all
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="bg-black text-white px-4 py-2 rounded-md"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
