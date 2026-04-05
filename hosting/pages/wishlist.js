import React, {useEffect, useState} from 'react';
import {Heart, ShoppingBag, Trash2} from "lucide-react";
import {fetchApi, getCustomerEmail, getTenantHeaders, updateCart, withTenant, buildTenantPath} from "@/utils/util";
import {store} from "@/redux/store";
import {useStorefront} from "@/context/StorefrontContext";
import {formatCurrency} from "@/utils/formatCurrency";

const Wishlist = () => {
    const {tenant, loading: storefrontLoading} = useStorefront();
    const [wishlist, setWishlist] = useState([]);

    const getList = async () => {
        if (!tenant?.sellerEmail) {
            return;
        }

        try {
            const list = await fetchApi("/cart/getWishlist", {
                headers: getTenantHeaders({}, tenant),
                method: 'POST',
                body: withTenant({customer_email: getCustomerEmail()}, tenant)
            });
            updateCart(store, tenant);
            setWishlist(Array.isArray(list) ? list : []);
        } catch (_error) {
            setWishlist([]);
        }
    };

    useEffect(() => {
        if (storefrontLoading || !tenant?.sellerEmail) {
            return;
        }
        getList();
    }, [storefrontLoading, tenant?.sellerEmail, tenant?.sellerId]);

    const handleMoveToCart = async (item) => {
        try {
            const res = await fetchApi("/cart/wishlist-to-cart", {
                headers: getTenantHeaders({}, tenant),
                method: 'POST',
                body: withTenant({
                    customer_email: getCustomerEmail(),
                    ...item
                }, tenant)
            });
            if (res.success) {
                getList();
            }
        } catch (_error) {
            alert('Not able to move to the cart');
        }
    };

    const handleRemoveFromWishlist = async (_id) => {
        try {
            const res = await fetchApi("/cart/removeWishlist", {
                headers: getTenantHeaders({}, tenant),
                method: 'DELETE',
                body: withTenant({
                    customer_email: getCustomerEmail(),
                    _id
                }, tenant)
            });
            if (res.success) {
                getList();
            }
        } catch (_error) {
            alert('Not able to remove the wishlist');
        }
    };

    if (wishlist.length === 0) {
        return (
            <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff8f3_0%,#ffffff_40%,#f8fafc_100%)] px-4 pb-16 pt-24 sm:px-6">
                <div className="mx-auto max-w-5xl">
                    <div className="overflow-hidden rounded-[34px] border border-gray-200 bg-white shadow-sm">
                        <div className="bg-[linear-gradient(135deg,#111827_0%,#1f2937_52%,#7c2d12_100%)] px-6 py-8 text-white sm:px-8">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em]">
                                <Heart className="h-4 w-4"/>
                                Wishlist
                            </div>
                            <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Your wishlist is empty</h1>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">
                                Save products you love and revisit them quickly from {tenant?.storeName || tenant?.sellerName || "this storefront"}.
                            </p>
                        </div>

                        <div className="px-6 py-12 text-center sm:px-8">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-rose-50">
                                <Heart className="h-9 w-9 text-rose-500"/>
                            </div>
                            <h2 className="mt-6 text-2xl font-semibold text-gray-900">Nothing saved yet</h2>
                            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-500">
                                Browse the storefront, tap the wishlist icon on products you love, and build your own saved collection for later.
                            </p>
                            <a
                                href={buildTenantPath("/", tenant)}
                                className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-black"
                            >
                                <ShoppingBag className="h-4 w-4"/>
                                Continue Shopping
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff8f3_0%,#ffffff_40%,#f8fafc_100%)] px-4 pb-16 pt-24 sm:px-6">
            <div className="mx-auto max-w-6xl">
                <div className="overflow-hidden rounded-[34px] border border-gray-200 bg-white shadow-sm">
                    <div className="bg-[linear-gradient(135deg,#111827_0%,#1f2937_52%,#7c2d12_100%)] px-6 py-8 text-white sm:px-8">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em]">
                            <Heart className="h-4 w-4"/>
                            Wishlist
                        </div>
                        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Saved picks for {tenant?.storeName || tenant?.sellerName || "your storefront"}</h1>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">
                            Keep your favorite products handy and move them into checkout whenever you're ready.
                        </p>
                    </div>

                    <div className="grid gap-5 px-6 py-8 sm:px-8 lg:grid-cols-2 xl:grid-cols-3">
                        {wishlist.map((item) => (
                            <div key={item._id} className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
                                <img src={item.image} alt={item.name} className="h-64 w-full object-cover"/>
                                <div className="p-5">
                                    <p className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                                        Wishlist item
                                    </p>
                                    <h2 className="mt-4 text-xl font-semibold text-gray-900">{item.name}</h2>
                                    <p className="mt-2 text-lg font-bold text-gray-900">{formatCurrency(item.price)}</p>
                                    <div className="mt-5 flex gap-3">
                                        <button
                                            onClick={() => handleMoveToCart(item)}
                                            className="flex-1 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black"
                                        >
                                            <span className="inline-flex items-center gap-2">
                                                <ShoppingBag className="h-4 w-4"/>
                                                Move to Cart
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => handleRemoveFromWishlist(item._id)}
                                            className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                                        >
                                            <Trash2 className="h-4 w-4"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
