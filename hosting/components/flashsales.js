'use client';
import Image from "next/image";
import { Loader2, Sparkles, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import useFetch from "@/utils/useFetch";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart, updateCartQuantity } from "@/redux/cartSlice";
import { formatCurrency } from "@/utils/formatCurrency";
import { getCustomerEmail, handleAddToCartEvent, handleQuantityChangeEvent } from "@/utils/util";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { addToWishlist, removeFromWishlist } from "@/redux/wishlistSlice";

export default function FlashSale({ isTopPicks, newArrivals }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const cartStatus = useSelector((state) => state.cart.status);
  const wishlist = useSelector((state) => state.wishlist.items);
  const wishlistStatus = useSelector((state) => state.wishlist.status);

  const apiUrl = `/posts/new-arrivals${isTopPicks ? "?topPicks=Yes" : newArrivals ? "?limit=12" : "?flashSale=Yes"}`;
  const { data, error, isLoading } = useFetch(apiUrl);

  const sectionTitle = isTopPicks ? "Recommended For You" : newArrivals ? "New Arrivals" : "Best Sellers";
  const sectionBadge = isTopPicks ? "Recommended" : newArrivals ? "Just Dropped" : "Top Selling";
  const trendingTags = isTopPicks
    ? ["Recommended", "Popular", "Hot Right Now"]
    : newArrivals
      ? ["Fresh Stock", "Trending", "Latest Drop"]
      : ["Best Seller", "Top Rated", "Popular"];

  const _handleAddToCartEvent = (product) => {
    handleAddToCartEvent(product, dispatch, addToCart);
  };

  const _handleQuantityChange = (product, qty) => {
    handleQuantityChangeEvent(product, qty, cart, dispatch, removeFromCart, updateCartQuantity);
  };

  const gotoProduct = async (e, product) => {
    e.preventDefault();
    localStorage.setItem("selected-product", JSON.stringify(product));
    const {
      _id: productId,
      category: { name: categoryName },
      title,
      subCategory: { name: subCategoryName },
    } = product;
    await router.push(`/${categoryName}/${subCategoryName}/${title}?productId=${productId}`);
  };

  const handleWishlistToggle = (e, product, isWishlist) => {
    e.stopPropagation();
    if (getCustomerEmail()) {
      if (isWishlist) {
        handleAddToCartEvent(product, dispatch, removeFromWishlist);
      } else {
        handleAddToCartEvent(product, dispatch, addToWishlist);
      }
    } else {
      alert("please login to add to the wishlist");
    }
  };

  return (
    <section className="py-6 px-4">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-4 rounded-[28px] border border-gray-200 bg-gradient-to-b from-white to-gray-50 px-6 py-6 text-center shadow-sm">
        <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-500">
          {sectionBadge}
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{sectionTitle}</h2>
          <p className="text-sm text-gray-500">Trending products selected for fast browsing and quick shopping.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {trendingTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
        {(isLoading || error) && Array.from({ length: 4 }).map((_, index) => <ProductCardSkeleton key={index} />)}
        {!isLoading &&
          !error &&
          data.data?.map((product) => {
            const cartItem = cart.find((item) => item.productId === product._id);
            const wishListItem = wishlist.find((item) => item.productId === product._id);
            const isCartLoading = cartStatus === "loading";
            const isWishlistLoading = wishlistStatus === "loading";
            const trendLabel = isTopPicks ? "Top Pick" : newArrivals ? "Just In" : "Trending";

            return (
              <div
                key={product._id || product.title}
                className="group min-w-[280px] max-w-[320px] overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)] sm:min-w-[310px]"
              >
                <div onClick={(e) => gotoProduct(e, product)} className="cursor-pointer">
                  <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={product.images[0].Location}
                      alt={product.title}
                      width={320}
                      height={320}
                      className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    />

                    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                      <div className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-700 backdrop-blur">
                        <TrendingUp className="h-3.5 w-3.5" />
                        {trendLabel}
                      </div>
                      <div className="rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                        {product.status === "1" ? "In Stock" : "Sold Out"}
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleWishlistToggle(e, product, wishListItem)}
                      className="absolute bottom-3 right-3 z-10 rounded-full bg-white p-2 shadow"
                    >
                      {isWishlistLoading ? (
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                      ) : wishListItem ? (
                        <HeartIconSolid className="h-6 w-6 text-red-500" />
                      ) : (
                        <HeartIconOutline className="h-6 w-6 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-3 p-4">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                        Spotlight
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500">
                        <Sparkles className="h-3.5 w-3.5" />
                        Featured item
                      </span>
                    </div>

                    <div className="flex-1">
                      <h3 className="line-clamp-1 text-base font-semibold text-gray-900">{product.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-500">{product.description}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 p-4">
                  <div className="mb-3 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-400">Trending Price</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-900">{formatCurrency(product.sellingPrice)}</span>
                        {product.MRP ? <span className="text-sm text-gray-400 line-through">{formatCurrency(product.MRP)}</span> : null}
                      </div>
                    </div>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-600">Fast checkout</span>
                  </div>

                  {product.status === "1" ? (
                    cartItem ? (
                      <div className="flex w-full items-center justify-between rounded-2xl bg-black py-3 text-white font-semibold">
                        <button className="px-3" onClick={() => _handleQuantityChange(product, -1)} disabled={isCartLoading}>
                          -
                        </button>
                        <span>{cartItem.quantity}</span>
                        <button className="px-3" onClick={() => _handleQuantityChange(product, 1)} disabled={isCartLoading}>
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        className="w-full rounded-2xl bg-black py-3 font-semibold text-white transition hover:bg-gray-800"
                        onClick={() => _handleAddToCartEvent(product)}
                        disabled={isCartLoading}
                      >
                        Add to Cart
                      </button>
                    )
                  ) : (
                    <button
                      disabled
                      className="w-full rounded-2xl border border-gray-300 py-3 text-sm font-semibold text-gray-500 transition hover:bg-gray-100"
                    >
                      Notify Me
                    </button>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}
