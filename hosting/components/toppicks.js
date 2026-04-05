"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchApi, getTenantHeaders } from "@/utils/util";
import { formatCurrency } from "@/utils/formatCurrency";

const ProductSkeleton = () => (
  <div className="min-w-[220px] sm:min-w-[250px] overflow-hidden rounded-[28px] border border-gray-200 bg-white p-3 shadow-sm animate-pulse">
    <div className="h-44 w-full rounded-2xl bg-gray-200"></div>
    <div className="mt-4 h-3 w-24 rounded bg-gray-200"></div>
    <div className="mt-3 h-5 w-3/4 rounded bg-gray-200"></div>
    <div className="mt-2 h-4 w-full rounded bg-gray-200"></div>
    <div className="mt-5 h-11 w-full rounded-2xl bg-gray-200"></div>
  </div>
);

export default function TopPicks() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await fetchApi(`/posts/top-picks`, {
          headers: getTenantHeaders(),
        });
        setProducts(data);
      } catch (err) {
        setError(err.message);
        throw new Error("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const increment = (id) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decrement = (id) => {
    setCart((prev) => {
      if (!prev[id] || prev[id] <= 1) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
      return { ...prev, [id]: prev[id] - 1 };
    });
  };

  return (
    <section className="py-6 px-4 pb-20">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-4 rounded-[28px] border border-gray-200 bg-gradient-to-b from-white to-gray-50 px-6 py-6 text-center shadow-sm">
        <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-500">
          Recommended
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Recommended For You</h2>
          <p className="text-sm text-gray-500">A modern ecommerce row with popular products picked for quick shopping.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {["Recommended", "Popular", "Hot Right Now"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 flex space-x-4 overflow-x-auto scrollbar-hide">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => <ProductSkeleton key={index} />)
        ) : error ? (
          <div className="w-full text-center text-red-500">{error}</div>
        ) : (
          products.map((product) => {
            const qty = cart[product._id] || 0;

            return (
              <div
                key={product._id || product.title}
                className="group min-w-[220px] max-w-[250px] overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)] sm:min-w-[250px]"
              >
                <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                  <Image
                    src={product.images[0].Location}
                    alt={product.title}
                    width={250}
                    height={176}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-700 backdrop-blur">
                    Hot Pick
                  </div>
                </div>

                <div className="flex-1 space-y-3 p-4">
                  <div className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                    Recommended
                  </div>
                  <h3 className="line-clamp-1 text-base font-semibold text-gray-900">{product.title}</h3>
                  <p className="line-clamp-2 text-sm text-gray-500">{product.description}</p>
                  {product.stockDetails?.[0] ? (
                    <p className="text-xs text-gray-500">Stock: {product.stockDetails[0].qty}</p>
                  ) : null}
                </div>

                <div className="border-t border-gray-100 p-4">
                  <div className="mb-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-400">Trending Price</p>
                    <p className="mt-1 text-sm">
                      <span className="text-gray-400 line-through">{formatCurrency(product.MRP)}</span>
                      {product.stockDetails?.[0] ? (
                        <span className="ml-2 text-lg font-semibold text-gray-900">
                          {formatCurrency(product.stockDetails[0].price)}
                        </span>
                      ) : null}
                    </p>
                  </div>

                  {qty === 0 ? (
                    <button
                      onClick={() => increment(product._id)}
                      className="w-full rounded-2xl bg-black px-3 py-3 text-sm font-semibold text-white hover:bg-gray-800"
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <div className="flex items-center justify-between rounded-2xl bg-black px-3 py-3 text-white">
                      <button onClick={() => decrement(product._id)} className="px-2 py-1">
                        -
                      </button>
                      <span className="text-sm font-medium">{qty}</span>
                      <button onClick={() => increment(product._id)} className="px-2 py-1">
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
