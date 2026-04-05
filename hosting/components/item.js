"use client";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import { addToCart, removeFromCart, updateCartQuantity } from "@/redux/cartSlice";
import {
  getCustomerEmail,
  handleAddToCartEvent,
  handleQuantityChangeEvent,
} from "@/utils/util";
import { useDispatch, useSelector } from "react-redux";
import GalleryForProductDetails from "@/components/GalleryForProductDetails";
import SubProducts from "@/components/SubProducts";
import { ChevronDown, Heart, ShieldCheck, Sparkles, Truck, TrendingUp } from "lucide-react";
import { addToWishlist, removeFromWishlist } from "@/redux/wishlistSlice";

export default function Item({ product }) {
  const [quantity, setQuantity] = useState(0);
  const [openAccordion, setOpenAccordion] = useState(0);
  const cart = useSelector((state) => state.cart.items);
  const wishlist = useSelector((state) => state.wishlist.items);
  const cartStatus = useSelector((state) => state.cart.status);
  const wishlistStatus = useSelector((state) => state.wishlist.status);
  const dispatch = useDispatch();
  const isWishlistAdded = wishlist.some((item) => item.productId === product._id);
  const isWishlistChecking = wishlistStatus === "loading";

  const accordionItems = [
    { title: "Description", content: product.description },
    {
      title: "Our Promise To You",
      content:
        "All our products use premium quality materials. Photos are captured without filters. Every piece is prepared for you with care and attention.",
    },
    {
      title: "International Orders",
      content:
        "We ship worldwide. Before placing an order, contact us through WhatsApp or by call and we will guide you on international orders.",
    },
  ];

  useEffect(() => {
    const existing = cart.find((item) => item.productId === product._id);
    if (existing) {
      setQuantity(existing.quantity);
    } else {
      setQuantity(0);
    }
  }, [product._id, cart]);

  const handleAddtoWishlist = () => {
    if (!getCustomerEmail()) {
      alert("please login to add to the wishlist");
      return;
    }

    if (isWishlistAdded) {
      handleAddToCartEvent(product, dispatch, removeFromWishlist);
      return;
    }

    handleAddToCartEvent(product, dispatch, addToWishlist);
  };

  const AccordionItem = ({ title, content, isOpen, onClick }) => (
    <div className="rounded-2xl border border-gray-200 bg-white">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between px-5 py-4 text-left text-gray-800"
      >
        <span className="font-semibold">{title}</span>
        <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96" : "max-h-0"}`}>
        <div className="px-5 pb-5 text-sm leading-7 text-gray-600">{content}</div>
      </div>
    </div>
  );

  const _handleAddToCart = () => {
    handleAddToCartEvent(product, dispatch, addToCart);
  };

  const _handleQuantityChange = (qty) => {
    handleQuantityChangeEvent(product, qty, cart, dispatch, removeFromCart, updateCartQuantity);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
      <div className="mb-6 rounded-[30px] border border-gray-200 bg-gradient-to-b from-white to-gray-50 px-6 py-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-500">
              Trending Product View
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">{product.title}</h1>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              A modern ecommerce product layout with clear details, strong pricing, and mobile-friendly actions.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Trending", "Top Rated", "Fast Moving"].map((tag) => (
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[30px] border border-gray-200 bg-white p-4 shadow-sm">
          <GalleryForProductDetails images={product.images.map((v) => v.Location)} />
        </div>

        <div className="space-y-6">
          <div className="rounded-[30px] border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-700">
                <TrendingUp className="h-3.5 w-3.5" />
                Trending Pick
              </span>
              <span className="rounded-full border border-gray-200 px-3 py-1 text-[11px] font-medium text-gray-500">
                {product.status === "1" ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <div className="mt-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-400">Trending Price</p>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">{formatCurrency(product.sellingPrice)}</span>
                {product.MRP ? <span className="text-base text-gray-400 line-through">{formatCurrency(product.MRP)}</span> : null}
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <ShieldCheck className="h-4 w-4" />
                  Product
                </div>
                <p className="mt-2 text-xs leading-6 text-gray-500">Clear product details and reliable item presentation.</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <Truck className="h-4 w-4" />
                  Shipping
                </div>
                <p className="mt-2 text-xs leading-6 text-gray-500">Shipping-ready with a checkout flow built for quick purchase.</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <Sparkles className="h-4 w-4" />
                  Experience
                </div>
                <p className="mt-2 text-xs leading-6 text-gray-500">Built to feel clean, modern, and easy to browse on any device.</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {!isWishlistChecking ? (
                <button
                  onClick={handleAddtoWishlist}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                >
                  <Heart className="h-4 w-4" />
                  {isWishlistAdded ? "Remove from Wishlist" : "Add to Wishlist"}
                </button>
              ) : null}

              {product.status === "1" ? (
                quantity > 0 ? (
                  <div className="flex items-center justify-between rounded-2xl bg-black px-4 py-3 text-white sm:min-w-[220px]">
                    <button onClick={() => _handleQuantityChange(-1)} className="px-2 py-1 text-lg" disabled={cartStatus === "loading"}>
                      -
                    </button>
                    <span className="font-semibold">{quantity}</span>
                    <button onClick={() => _handleQuantityChange(1)} className="px-2 py-1 text-lg" disabled={cartStatus === "loading"}>
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={_handleAddToCart}
                    className="rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    Add to Cart
                  </button>
                )
              ) : (
                <button
                  disabled
                  className="rounded-2xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-500"
                >
                  Notify Me
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {accordionItems.map((item, index) => (
              <AccordionItem
                key={index}
                title={item.title}
                content={item.content}
                isOpen={openAccordion === index}
                onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
              />
            ))}
          </div>

          {product.subProducts && product.subProducts.length > 0 ? <SubProducts ids={product.subProducts} /> : null}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-between border-t border-gray-200 bg-white/95 px-4 py-4 shadow-lg backdrop-blur md:hidden">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-400">Trending Price</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-bold text-gray-900">{formatCurrency(product.sellingPrice)}</span>
            {product.MRP ? <span className="text-xs text-gray-400 line-through">{formatCurrency(product.MRP)}</span> : null}
          </div>
        </div>

        {product.status === "1" ? (
          quantity > 0 ? (
            <div className="flex items-center justify-between rounded-2xl bg-black px-3 py-2 text-white min-w-[120px]">
              <button onClick={() => _handleQuantityChange(-1)} className="px-2 py-1 font-semibold">
                -
              </button>
              <span className="font-semibold">{quantity}</span>
              <button onClick={() => _handleQuantityChange(1)} className="px-2 py-1 font-semibold">
                +
              </button>
            </div>
          ) : (
            <button
              onClick={_handleAddToCart}
              className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white"
            >
              Add to Cart
            </button>
          )
        ) : (
          <button disabled className="rounded-2xl border border-gray-300 px-4 py-3 text-xs font-semibold text-gray-500">
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
}
