"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/utils/formatCurrency";
import { buildProductPath, fetchApi, getTenantHeaders } from "@/utils/util";
import { ArrowUpRight, Filter, SlidersHorizontal, Sparkles, TrendingUp, X } from "lucide-react";
import {useStorefront} from "@/context/StorefrontContext";

const COLLECTION_TAGS = ["New In", "Best Sellers", "Top Rated", "Fast Moving"];

export default function Items({ category, products: initialProducts, categoryId }) {
  const router = useRouter();
  const {tenant} = useStorefront();
  const [products, setProducts] = useState(initialProducts);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 60000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 20;

  useEffect(() => {
    if (!categoryId) return;

    const fetchProducts = async () => {
      try {
        const data = await fetchApi(`/posts/new-arrivals?category=${categoryId}&page=${currentPage}&limit=${productsPerPage}`, {
          method: "GET",
          headers: getTenantHeaders({}, tenant),
        });
        setProducts(data.data || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchProducts();
  }, [categoryId, currentPage, tenant?.sellerEmail, tenant?.sellerId]);

  const filteredProducts = useMemo(() => {
    return (products || []).filter((product) => {
      const matchesPrice = product.sellingPrice >= priceRange[0] && product.sellingPrice <= priceRange[1];
      const matchesStock = inStockOnly ? product.status === "1" : true;
      return matchesPrice && matchesStock;
    });
  }, [products, priceRange, inStockOnly]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortOption === "az") return a.title.localeCompare(b.title);
      if (sortOption === "za") return b.title.localeCompare(a.title);
      if (sortOption === "low-high") return a.sellingPrice - b.sellingPrice;
      if (sortOption === "high-low") return b.sellingPrice - a.sellingPrice;
      return 0;
    });
  }, [filteredProducts, sortOption]);

  const gotoProduct = async (e, product) => {
    e.preventDefault();
    localStorage.setItem("selected-product", JSON.stringify(product));
    await router.push(buildProductPath(product, tenant));
  };

  const clearFilters = () => {
    setPriceRange([0, 60000]);
    setInStockOnly(false);
    setSortOption("featured");
    setIsFilterOpen(false);
  };

  const renderProductCard = (product, index) => (
    <button
      key={product._id}
      onClick={(e) => gotoProduct(e, product)}
      className="group overflow-hidden rounded-[28px] border border-gray-200 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)]"
    >
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <Image
          src={product.images[0].Location}
          alt={product.title}
          width={320}
          height={320}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-700 backdrop-blur">
            <TrendingUp className="h-3.5 w-3.5" />
            {COLLECTION_TAGS[index % COLLECTION_TAGS.length]}
          </span>
          <span className="rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
            {product.status === "1" ? "In Stock" : "Sold Out"}
          </span>
        </div>
        <span className="absolute bottom-4 right-4 rounded-full bg-white p-2 text-gray-800 shadow">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
            Collection
          </span>
          <span className="text-[11px] font-medium text-gray-400">Modern ecommerce</span>
        </div>

        <div>
          <h3 className="line-clamp-1 text-base font-semibold tracking-tight text-gray-900">{product.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-500">
            Browse a fast-moving product card layout designed for quick comparison and shopping.
          </p>
        </div>

        <div className="flex items-end justify-between gap-3 border-t border-gray-100 pt-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">Price</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-lg font-semibold text-gray-900">{formatCurrency(product.sellingPrice)}</span>
              {product.MRP ? <span className="text-sm text-gray-400 line-through">{formatCurrency(product.MRP)}</span> : null}
            </div>
          </div>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-600">View Item</span>
        </div>
      </div>
    </button>
  );

  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-500">Filters</h3>
          <button onClick={clearFilters} className="text-sm font-medium text-gray-500 hover:text-black">
            Reset
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <p className="text-sm font-semibold text-gray-900">Availability</p>
            <label className="mt-3 flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              In stock only
            </label>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">Price range</p>
            <div className="mt-2 text-sm text-gray-600">
              {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
            </div>
            <input
              type="range"
              min="0"
              max="60000"
              step="1000"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
              className="mt-3 w-full"
            />
            <input
              type="range"
              min="0"
              max="60000"
              step="1000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
              className="mt-2 w-full"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">Sort by</p>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="mt-3 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none"
            >
              <option value="featured">Featured</option>
              <option value="az">Alphabetically, A-Z</option>
              <option value="za">Alphabetically, Z-A</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8">
      <div className="rounded-[30px] border border-gray-200 bg-gradient-to-b from-white to-gray-50 px-6 py-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-500">
              Category Collection
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              {category} Collection
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              A complete category landing page with filtering, sorting, and a product-first grid built in a modern ecommerce style.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {COLLECTION_TAGS.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-[24px] border border-gray-200 bg-white px-4 py-4 shadow-sm lg:hidden">
        <div>
          <p className="text-sm font-semibold text-gray-900">{sortedProducts.length} products</p>
          <p className="text-xs text-gray-500">Filter and sort the collection</p>
        </div>
        <button
          onClick={() => setIsFilterOpen(true)}
          className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800"
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <FilterPanel />
        </aside>

        <div className="space-y-6">
          <div className="flex flex-col gap-4 rounded-[28px] border border-gray-200 bg-white px-5 py-5 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">{sortedProducts.length} products</p>
              <p className="text-sm text-gray-500">Browse featured items in this category.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600">
              <SlidersHorizontal className="h-4 w-4" />
              Sorted by {sortOption === "featured" ? "Featured" : sortOption}
            </div>
          </div>

          {sortedProducts.length ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {sortedProducts.map((product, index) => renderProductCard(product, index))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
              <p className="text-lg font-semibold text-gray-900">No products match the current filters.</p>
              <p className="mt-2 text-sm text-gray-500">Try widening the price range or clearing filters.</p>
              <button
                onClick={clearFilters}
                className="mt-5 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white"
              >
                Clear Filters
              </button>
            </div>
          )}

          {totalPages > 1 ? (
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                  currentPage === 1 ? "bg-gray-100 text-gray-400" : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                Previous
              </button>
              <span className="text-sm font-medium text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                  currentPage === totalPages ? "bg-gray-100 text-gray-400" : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {isFilterOpen ? (
        <div className="fixed inset-0 z-50 bg-black/30 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">Collection Filters</p>
                <h3 className="mt-1 text-lg font-semibold text-gray-900">Refine Products</h3>
              </div>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="rounded-full border border-gray-200 p-2 text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <FilterPanel />

            <button
              onClick={() => setIsFilterOpen(false)}
              className="mt-5 w-full rounded-2xl bg-black py-3 text-sm font-semibold text-white"
            >
              Apply Filters
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
