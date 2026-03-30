"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useParams } from "next/navigation";
import {fetchApi, seller_email} from "@/utils/util";
import NoProductsFound from "@/components/NoProductFound";
import { useRouter } from "next/router";

export default function ProductGrid() {
    const router = useRouter();
    const { category:catename, subCategory:subname, categoryId, subCategoryId } = router.query;

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 60000]);
    const [sortOption, setSortOption] = useState("az");

    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 20;
    // const categoryId =
    //     searchParams.get("category");
    // const subCategoryId =
    //     searchParams.get("subCategory");
    // ✅ Fetch products when page changes
    useEffect(() => {
       if(categoryId && subCategoryId){
           const fetchProducts = async () => {
               try {
                   const data = await fetchApi(
                       `/posts/new-arrivals?category=${categoryId}&subCategory=${subCategoryId}&page=${currentPage}&limit=${limit}`, {
                           method: 'GET',
                           headers: {
                               'x-user':seller_email
                           }
                       }
                   );
                   // Assuming API returns { products: [...], totalPages: X }
                   setProducts(data.data || []);
                   setTotalPages(data.totalPages || 1);
               } catch (error) {
                   console.error("Failed to fetch products", error);
               }
           };
           fetchProducts();
       }
    }, [catename, subname, currentPage]);

    // ✅ Apply filters locally
    const filteredProducts = products.filter(
        (p) => p.sellingPrice >= priceRange[0] && p.sellingPrice <= priceRange[1]
    );

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortOption === "az") return a.title.localeCompare(b.title);
        if (sortOption === "za") return b.title.localeCompare(a.title);
        if (sortOption === "low-high") return a.sellingPrice - b.sellingPrice;
        if (sortOption === "high-low") return b.sellingPrice - a.sellingPrice;
        return 0;
    });


    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <h1 className="text-2xl font-bold text-center mb-6">{subname}</h1>

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
                        {sortedProducts.length> 0 ?
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                            {sortedProducts.map((product) => {
                                const {_id: productId, category: {_id: categoryId, name:categoryName }, title, subCategory: {_id: subCategoryId, name:subCategoryName} } = product;
                                return (
                                    <Link
                                        key={product._id}
                                        onClick={(e)=> {
                                            localStorage.setItem('selected-product', JSON.stringify(product));
                                        }}
                                        href={`/${categoryName}/${subCategoryName}/${title}?productId=${productId}`}
                                        className="border bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
                                    >
                                        <Image
                                            src={product.images[0].Location}
                                            alt={product.title}
                                            width={300}
                                            height={300}
                                            className="object-cover w-full h-48"
                                        />
                                        <div className="p-3">
                                            <h3 className="font-medium text-gray-800">{product.title}</h3>
                                            <p className="text-gray-600">₹{product.sellingPrice}</p>
                                            <p
                                                className={`text-sm ${
                                                    product.status == 1 ? "text-green-600" : "text-red-500"
                                                }`}
                                            >
                                                {product.status == 1 ? "In Stock" : "Out of Stock"}
                                            </p>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>:<NoProductsFound
                                title={`No ${subname} match your search`}
                                description="Try different keywords or clear filters."
                                ctaHref={'/'}
                                suggestions={[{title: 'Bracelets', href: '/category/bracelets'}]}
                                onClear={() => { /* custom clear logic */ }}
                            />}

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
                                    onClick={() =>
                                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                                    }
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
