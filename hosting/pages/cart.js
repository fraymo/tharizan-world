"use client";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Image from "next/image";
import {
    buildTenantPath,
    fetchApi,
    getCustomerEmail,
    getStoredTenant,
    getTenantHeaders,
    handleQuantityChangeEvent,
    handleRemoveFromCartEvent,
    withTenant
} from "@/utils/util";
import {formatCurrency} from "@/utils/formatCurrency";
import {useDispatch, useSelector} from "react-redux";
import {removeFromCart, updateCartQuantity} from "@/redux/cartSlice";
import {
    ArrowRight,
    CheckCircle2,
    CreditCard,
    MapPin,
    ShieldCheck,
    ShoppingBag,
    Store,
    Trash2,
    Truck,
    Wallet
} from "lucide-react";
import {FaBriefcase, FaEllipsisH, FaHome} from "react-icons/fa";

const DELIVERY_CHARGE = 70;

export default function CartPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [savedAddress, setSavedAddress] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [wallet, setWallet] = useState(0);
    const [isWalletApplied, setIsWalletApplied] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.items);
    const tenant = getStoredTenant();

    useEffect(() => {
        const loadRazorpayScript = async () => {
            if (razorpayLoaded) return;
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            script.onload = () => setRazorpayLoaded(true);
            document.body.appendChild(script);
        };
        loadRazorpayScript();
    }, [razorpayLoaded]);

    const getWalletAmount = async () => {
        const res = await fetchApi("/wallet/amount", {
            method: "POST",
            headers: getTenantHeaders({}, tenant),
            body: withTenant({customer_email: getCustomerEmail()}, tenant)
        });
        setWallet(res.amount);
    };

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            setIsLoggedIn(true);
            setSavedAddress(JSON.parse(localStorage.getItem("savedAddress")));
            getWalletAmount();
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const removeItem = (item) => {
        const {productId: _id, quantity, price: sellingPrice, image: Location, category, subCategory, name: title} = item;
        handleRemoveFromCartEvent({
            customer_email: getCustomerEmail(),
            _id,
            quantity,
            sellingPrice,
            images: [{Location}],
            category: {name: category},
            subCategory: {name: subCategory},
            title
        }, dispatch, removeFromCart);
    };

    const updateQuantity = (item, change) => {
        const {productId: _id, quantity, price: sellingPrice, image: Location, category, subCategory, name: title} = item;
        handleQuantityChangeEvent({
            customer_email: getCustomerEmail(),
            _id,
            quantity,
            sellingPrice,
            images: [{Location}],
            category: {name: category},
            subCategory: {name: subCategory},
            title
        }, change, cart, dispatch, removeFromCart, updateCartQuantity);
    };

    const handleLoginRedirect = () => {
        const cartPath = buildTenantPath("/cart", tenant);
        router.push(`${buildTenantPath("/loginpage", tenant)}?redirect=${encodeURIComponent(cartPath)}`);
    };

    const subtotal = cart.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);
    const tax = 0;
    const deliveryCharge = subtotal === 0 ? 0 : DELIVERY_CHARGE;
    const amountToPay = subtotal + deliveryCharge;
    const walletDiscount = isWalletApplied && wallet > 0 ? Math.min(wallet, amountToPay) : 0;
    const grandTotal = amountToPay - walletDiscount;
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const handleProceedToCheckout = async () => {
        if (!savedAddress) {
            alert("Please select a delivery address to proceed.");
            return;
        }

        setIsProcessing(true);
        let user = JSON.parse(localStorage.getItem("user"));

        if (!user.phone) {
            user._id = user.upsertedId;
            user.name = savedAddress.mobile;
            user.phone = savedAddress.mobile;
        }

        const orderDetails = {
            user,
            userId: user._id,
            phone: user.phone,
            products: cart,
            deliveryAddress: savedAddress,
            billDetails: {
                subtotal,
                tax,
                deliveryCharge,
                walletDiscount,
                grandTotal,
            },
            receiptNo: "T" + Date.now(),
            customer_email: getCustomerEmail()
        };

        if (grandTotal > 0) {
            try {
                const response = await fetchApi("/posts/create-order", {
                    method: "POST",
                    headers: getTenantHeaders({}, tenant),
                    body: withTenant(orderDetails, tenant),
                });

                const {id, verifyPaymentUrl, key_id, orderId} = response;
                const appUrl = window.location.origin;
                const param = `/?transactionId=${encodeURIComponent(orderId)}&seller_id=${encodeURIComponent(tenant?.sellerId || "")}&seller_email=${encodeURIComponent(tenant?.sellerEmail || "")}&customer_email=${encodeURIComponent(getCustomerEmail())}&storeSlug=${encodeURIComponent(tenant?.slug || "")}`;
                const callback_url = `${appUrl}/api/razorPaycheck${param}`;

                const options = {
                    key: key_id,
                    amount: parseInt(grandTotal * 100),
                    currency: "INR",
                    name: user.phone,
                    description: "Transaction",
                    order_id: id,
                    callback_url,
                    prefill: {name: user.name, email: user.email, contact: user.phone},
                    theme: {color: "#111111"},
                    handler: async (response) => {
                        try {
                            const data = await fetchApi(verifyPaymentUrl, {
                                method: "POST",
                                headers: getTenantHeaders({}, tenant),
                                body: withTenant({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                    razorpay_response: response,
                                    transactionId: orderId,
                                    customer_email: getCustomerEmail()
                                }, tenant)
                            });
                            await router.push(data.redirectUrl);
                        } catch (error) {
                            console.error("Error:", error);
                            alert("Error verifying payment");
                        }
                    }
                };

                if (razorpayLoaded && typeof window.Razorpay !== "undefined") {
                    const rzp = new window.Razorpay(options);
                    rzp.open();
                } else {
                    alert("Razorpay is not ready yet.");
                }
            } catch (error) {
                console.error("Failed to create order:", error);
                alert(`Error: ${error.message || "Could not place your order. Please try again."}`);
            } finally {
                setIsProcessing(false);
            }
        } else {
            try {
                const response = await fetchApi("/ord/create-wallet-order", {
                    headers: getTenantHeaders({}, tenant),
                    method: "POST",
                    body: withTenant(orderDetails, tenant)
                });
                router.push(response.redirectUrl);
            } catch (e) {
                console.error("Failed to create order:", e);
                alert(`Error: ${e.message || "Could not place your order. Please try again."}`);
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const renderAddressIcon = () => {
        if (!savedAddress) return <MapPin className="h-4 w-4 text-gray-500"/>;
        if (savedAddress.tag === "Home") return <FaHome className="text-blue-500"/>;
        if (savedAddress.tag === "Work") return <FaBriefcase className="text-green-500"/>;
        return <FaEllipsisH className="text-gray-500"/>;
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff8f3_0%,#ffffff_40%,#f8fafc_100%)] pt-24 pb-16 sm:pt-28">
                <div className="mx-auto max-w-6xl px-4 md:px-6">
                    <div className="rounded-[32px] border border-gray-200 bg-gradient-to-b from-white to-gray-50 px-6 py-7 shadow-sm">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-3xl">
                                <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-500">
                                    <ShoppingBag className="h-3.5 w-3.5"/>
                                    Modern Cart
                                </div>
                                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                                    Your cart is waiting for its first pick
                                </h1>
                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    Save products from this storefront, review them here, and move into checkout when you are ready.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm">
                                    Storefront synced
                                </span>
                                <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm">
                                    Fast checkout later
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                        <div className="rounded-[30px] border border-dashed border-gray-300 bg-white/90 px-6 py-10 text-center shadow-sm sm:px-10 sm:py-14">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-700">
                                <ShoppingBag className="h-10 w-10"/>
                            </div>
                            <h2 className="mt-6 text-2xl font-semibold tracking-tight text-gray-900">
                                Nothing in cart yet
                            </h2>
                            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-500">
                                Browse the latest arrivals, trending categories, and featured collections from {tenant?.storeName || tenant?.sellerName || "this storefront"} to start building your order.
                            </p>
                            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                                <button
                                    onClick={() => router.push(buildTenantPath("/", tenant))}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                                >
                                    Continue Shopping
                                    <ArrowRight className="h-4 w-4"/>
                                </button>
                                <button
                                    onClick={() => router.push(buildTenantPath("/wishlist", tenant))}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-800 transition hover:border-gray-900 hover:text-black"
                                >
                                    View Wishlist
                                </button>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-gray-100 p-3 text-gray-700">
                                        <ShieldCheck className="h-5 w-5"/>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Checkout stays ready</p>
                                        <p className="mt-1 text-sm leading-6 text-gray-500">Add products any time and return here for address selection, wallet usage, and payment.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-gray-100 p-3 text-gray-700">
                                        <Store className="h-5 w-5"/>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Current storefront</p>
                                        <p className="mt-1 text-sm leading-6 text-gray-500">{tenant?.storeName || tenant?.sellerName || "Modern Hub Store"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-400">Helpful next steps</p>
                                <div className="mt-4 space-y-3 text-sm text-gray-600">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500"/>
                                        <span>Explore categories to discover products faster.</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500"/>
                                        <span>Save favorites to wishlist if you are still comparing items.</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500"/>
                                        <span>Come back to cart when you are ready to pay securely.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff8f3_0%,#ffffff_38%,#f8fafc_100%)] pt-24 pb-28 sm:pt-28">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
                <div className="rounded-[32px] border border-gray-200 bg-gradient-to-b from-white to-gray-50 px-6 py-7 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-500">
                                <ShoppingBag className="h-3.5 w-3.5"/>
                                Modern Cart
                            </div>
                            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                                Review your picks before checkout
                            </h1>
                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                A cleaner cart built for quick edits, clear totals, and a smoother handoff to payment.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm">
                                {itemCount} items
                            </span>
                            <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm">
                                Secure checkout
                            </span>
                            <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm">
                                Fast fulfillment
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="space-y-5">
                        {cart.map((item) => (
                            <div
                                key={item.productId}
                                className="overflow-hidden rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
                            >
                                <div className="flex flex-col gap-5 sm:flex-row">
                                    <div className="relative h-40 w-full overflow-hidden rounded-[24px] bg-gray-100 sm:h-36 sm:w-36 sm:flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 100vw, 144px"
                                        />
                                    </div>

                                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
                                        <div>
                                            <div className="flex flex-wrap items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <div className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                                                        Cart Selection
                                                    </div>
                                                    <h2 className="mt-3 text-lg font-semibold text-gray-900 sm:text-xl">{item.name}</h2>
                                                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                                                        <span className="rounded-full bg-gray-100 px-3 py-1">{item.category}</span>
                                                        <span className="rounded-full bg-gray-100 px-3 py-1">{item.subCategory}</span>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item)}
                                                    className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 className="h-4 w-4"/>
                                                    Remove
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-end sm:justify-between">
                                            <div>
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-400">Item total</p>
                                                <div className="mt-1 flex items-center gap-3">
                                                    <span className="text-2xl font-bold text-gray-900">
                                                        {formatCurrency((item.price || 0) * item.quantity)}
                                                    </span>
                                                    <span className="text-sm text-gray-400">
                                                        {formatCurrency(item.price || 0)} each
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between rounded-2xl bg-black px-3 py-3 text-white sm:min-w-[170px]">
                                                <button
                                                    onClick={() => updateQuantity(item, -1)}
                                                    className="px-3 py-1 text-lg font-semibold"
                                                >
                                                    -
                                                </button>
                                                <span className="font-semibold">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item, 1)}
                                                    className="px-3 py-1 text-lg font-semibold"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-5">
                        <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-28">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-400">Order Summary</p>
                                    <h3 className="mt-2 text-2xl font-bold text-gray-900">Checkout Details</h3>
                                </div>
                                <div className="rounded-full bg-gray-100 p-3 text-gray-700">
                                    <CreditCard className="h-5 w-5"/>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                        <ShieldCheck className="h-4 w-4"/>
                                        Trusted
                                    </div>
                                    <p className="mt-2 text-xs leading-6 text-gray-500">Checkout is prepared for secure payment verification.</p>
                                </div>
                                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                        <Truck className="h-4 w-4"/>
                                        Delivery
                                    </div>
                                    <p className="mt-2 text-xs leading-6 text-gray-500">Shipping is calculated clearly before payment.</p>
                                </div>
                                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                        <Store className="h-4 w-4"/>
                                        Storefront
                                    </div>
                                    <p className="mt-2 text-xs leading-6 text-gray-500">{tenant?.storeName || "Modern Hub Store"}</p>
                                </div>
                            </div>

                            <div className="mt-6 rounded-[24px] border border-gray-200 bg-white p-4">
                                <div className="space-y-3 text-sm text-gray-700">
                                    <div className="flex items-center justify-between">
                                        <span>Subtotal</span>
                                        <span className="font-medium">{formatCurrency(subtotal)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Delivery Charge</span>
                                        <span className="font-medium">{deliveryCharge === 0 ? "Free" : formatCurrency(deliveryCharge)}</span>
                                    </div>

                                    {isLoggedIn && wallet > 0 ? (
                                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
                                            <div className="flex items-center justify-between gap-3">
                                                <label htmlFor="applyWallet" className="flex items-center gap-3 text-sm font-medium text-gray-900">
                                                    <input
                                                        type="checkbox"
                                                        id="applyWallet"
                                                        checked={isWalletApplied}
                                                        onChange={(e) => setIsWalletApplied(e.target.checked)}
                                                        className="h-4 w-4 rounded border-gray-300"
                                                    />
                                                    <span className="inline-flex items-center gap-2">
                                                        <Wallet className="h-4 w-4"/>
                                                        Apply Wallet
                                                    </span>
                                                </label>
                                                <span className="font-semibold text-gray-900">{formatCurrency(wallet)}</span>
                                            </div>
                                        </div>
                                    ) : null}

                                    {isWalletApplied ? (
                                        <div className="flex items-center justify-between text-emerald-600">
                                            <span>Wallet Discount</span>
                                            <span className="font-medium">- {formatCurrency(walletDiscount)}</span>
                                        </div>
                                    ) : null}

                                    <div className="border-t border-gray-100 pt-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-base font-semibold text-gray-900">Grand Total</span>
                                            <span className="text-2xl font-bold text-gray-900">{formatCurrency(grandTotal)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 rounded-[24px] border border-gray-200 bg-gray-50 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-400">Delivery Address</p>
                                        <h4 className="mt-2 text-base font-semibold text-gray-900">
                                            {savedAddress ? "Ready for delivery" : "Address needed"}
                                        </h4>
                                    </div>
                                    <div className="rounded-full bg-white p-3 text-gray-700 shadow-sm">
                                        {renderAddressIcon()}
                                    </div>
                                </div>

                                {savedAddress ? (
                                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                                        <p className="font-semibold text-gray-900">{savedAddress.tag}</p>
                                        <p>{savedAddress.address}</p>
                                        {savedAddress.pincode ? <p>Pincode: {savedAddress.pincode}</p> : null}
                                        <p>Phone: {savedAddress.mobile}</p>
                                        {savedAddress.secondaryMobile ? <p>Alt: {savedAddress.secondaryMobile}</p> : null}
                                        {savedAddress.email ? <p>Email: {savedAddress.email}</p> : null}
                                        <button
                                            onClick={() => router.push(buildTenantPath("/add-address", tenant))}
                                            className="inline-flex items-center gap-2 pt-2 text-sm font-semibold text-gray-900 transition hover:text-black"
                                        >
                                            Change or add address
                                            <ArrowRight className="h-4 w-4"/>
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => router.push(buildTenantPath("/add-address", tenant))}
                                        className="mt-4 w-full rounded-2xl border border-gray-900 bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black"
                                    >
                                        Add Delivery Address
                                    </button>
                                )}
                            </div>

                            {isLoggedIn ? (
                                <button
                                    onClick={handleProceedToCheckout}
                                    className="mt-6 hidden w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 lg:inline-flex"
                                    disabled={!savedAddress || isProcessing}
                                >
                                    {isProcessing ? "Processing..." : `Proceed to Pay ${formatCurrency(grandTotal)}`}
                                    {!isProcessing ? <ArrowRight className="h-4 w-4"/> : null}
                                </button>
                            ) : (
                                <button
                                    onClick={handleLoginRedirect}
                                    className="mt-6 hidden w-full rounded-2xl bg-black px-5 py-4 text-sm font-semibold text-white transition hover:bg-gray-800 lg:inline-flex lg:items-center lg:justify-center"
                                >
                                    Login to Proceed
                                </button>
                            )}

                            <div className="mt-5 flex items-center gap-2 text-xs text-gray-500">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500"/>
                                Your cart stays synced with this storefront.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-4 shadow-lg backdrop-blur lg:hidden">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-400">Grand Total</p>
                        <p className="mt-1 truncate text-lg font-bold text-gray-900">{formatCurrency(grandTotal)}</p>
                    </div>

                    {isLoggedIn ? (
                        <button
                            onClick={handleProceedToCheckout}
                            className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                            disabled={!savedAddress || isProcessing}
                        >
                            {isProcessing ? "Processing..." : "Checkout"}
                        </button>
                    ) : (
                        <button
                            onClick={handleLoginRedirect}
                            className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
