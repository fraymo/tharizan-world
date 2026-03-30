"use client";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Image from "next/image";
import {
    fetchApi,
    getCustomerEmail,
    handleQuantityChangeEvent,
    handleRemoveFromCartEvent,
    seller_email
} from "@/utils/util";
import {formatCurrency} from "@/utils/formatCurrency";
import {useDispatch, useSelector} from "react-redux";
import {removeFromCart, updateCartQuantity} from "@/redux/cartSlice";
import NoProductsFound from "@/components/NoProductFound";
import {FaBriefcase, FaEllipsisH, FaHome} from "react-icons/fa";

// --- Constants ---
// const TAX_RATE = 0.02; // 2%
// const FREE_DELIVERY_THRESHOLD = 499;
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
    const cart = useSelector(state => state.cart.items);

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
        const res = await fetchApi('/wallet/amount', {
            method: 'POST',
            headers: { 'x-user': seller_email },
            body: { seller_email, customer_email: getCustomerEmail() }
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
        const { productId: _id, quantity, price: sellingPrice, image: Location, category, subCategory, name: title } = item;
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
        const { productId: _id, quantity, price: sellingPrice, image: Location, category, subCategory, name: title } = item;
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
        router.push(`/loginpage?redirect=${encodeURIComponent("/cart")}`);
    };

    // --- Price Calculations ---
    const subtotal = cart.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);
    const tax = 0;
    const deliveryCharge = subtotal === 0 ? 0 : DELIVERY_CHARGE;
    const amountToPay = subtotal + deliveryCharge;
    const walletDiscount = isWalletApplied && wallet > 0 ? Math.min(wallet, amountToPay) : 0;
    const grandTotal = amountToPay - walletDiscount;

    const handleProceedToCheckout = async () => {
        if (!savedAddress) {
            alert("Please select a delivery address to proceed.");
            return;
        }

        if(process.env.NEXT_PUBLIC_PAYMENT_ENABLED === 'true'){
            setIsProcessing(true);
            let user = JSON.parse(localStorage.getItem("user"));

            if(!user.phone){
                user._id =  user.upsertedId;
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
                seller_email,
                customer_email: getCustomerEmail()
            };

            if (grandTotal > 0) {
                try {
                    const response = await fetchApi(`/posts/create-order`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'x-user': seller_email },
                        body: orderDetails,
                    });

                    const { id, verifyPaymentUrl, key_id, orderId } = response;
                    const appUrl = process.env.NEXT_PUBLIC_HALALO_CLIENT_PORT;
                    const param = `/?transactionId=${encodeURIComponent(orderId)}&seller_email=${encodeURIComponent(seller_email)}&customer_email=${encodeURIComponent(getCustomerEmail())}`;
                    const callback_url = `${appUrl}/api/razorPaycheck${param}`;

                    const options = {
                        key: key_id,
                        amount: parseInt(grandTotal * 100),
                        currency: 'INR',
                        name: user.phone,
                        description: 'Transaction',
                        order_id: id,
                        callback_url,
                        prefill: { name: user.name, email: user.email, contact: user.phone },
                        theme: { color: '#F45F5E' },
                        handler: async (response) => {
                            try {
                                const data = await fetchApi(verifyPaymentUrl, {
                                    method: "POST",
                                    headers: { 'Content-Type': 'application/json', 'x-user': seller_email },
                                    body: {
                                        razorpay_order_id: response.razorpay_order_id,
                                        razorpay_payment_id: response.razorpay_payment_id,
                                        razorpay_signature: response.razorpay_signature,
                                        razorpay_response: response,
                                        transactionId: orderId,
                                        seller_email,
                                        customer_email: getCustomerEmail()
                                    }
                                });
                                await router.push(data.redirectUrl);
                            } catch (error) {
                                console.error('Error:', error);
                                alert('Error verifying payment');
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
                    alert(`Error: ${error.message || 'Could not place your order. Please try again.'}`);
                } finally {
                    setIsProcessing(false);
                }
            } else {
                try {
                    const response = await fetchApi('/ord/create-wallet-order', {
                        headers: { 'x-user': seller_email },
                        method: 'POST',
                        body: orderDetails
                    });
                    router.push(response.redirectUrl);
                } catch (e) {
                    console.error("Failed to create order:", e);
                    alert(`Error: ${e.message || 'Could not place your order. Please try again.'}`);
                } finally {
                    setIsProcessing(false);
                }
            }
        }
        else{
            alert("Payment gateway integration is in progress...");
        }
    };

    return (
        <div className="min-h-screen flex flex-col pt-24 sm:pt-28">
                {cart.length === 0 ? (
                        <NoProductsFound
                            title={`Your cart is empty`}
                            description="Continue Shopping"
                            ctaHref={'/'}
                            showSuggestion={false}
                            suggestions={[{title: 'Bracelets', href: '/category/bracelets'}]}
                            isNeedCleanFilter={false}
                            onClear={() => { /* custom clear logic */ }}
                        />
                ) : (
                    <div className="max-w-6xl mx-auto flex-1 w-full p-4">
                        <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {cart.map((item) => (
                                    <div key={item.productId} className="flex items-center p-4 border rounded-lg shadow-sm bg-white relative">
                                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                                            <Image src={item.image} alt={item.name} layout="fill" objectFit="contain" className="rounded-md"/>
                                        </div>
                                        <div className="flex-1 ml-4 overflow-hidden">
                                            <h2 className="font-medium text-gray-800 truncate">{item.name}</h2>
                                            <div className="text-gray-600 font-normal">{item.category}</div>
                                            <div className="text-gray-600 font-normal">{item.subCategory}</div>
                                            <p className="text-red-600 font-bold mt-1">
                                                {formatCurrency((item.price || 0) * item.quantity)}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="flex items-center border rounded-md">
                                                    <button onClick={() => updateQuantity(item, -1)} className="px-3 py-1 text-lg hover:bg-gray-100 rounded-l-md">-</button>
                                                    <span className="px-4 font-medium">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item, 1)} className="px-3 py-1 text-lg hover:bg-gray-100 rounded-r-md">+</button>
                                                </div>
                                                <button onClick={() => removeItem(item)} className="text-red-500 hover:text-red-700 text-xl ml-2" aria-label="Remove item">🗑</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary */}
                            <div className="lg:col-span-1">
                                <div className="border rounded-lg p-4 shadow-sm bg-white lg:sticky lg:top-24">
                                    <h3 className="text-xl font-semibold mb-4 border-b pb-2">Bill Details</h3>
                                    <div className="space-y-2 text-gray-700">
                                        <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                                        {/* <div className="flex justify-between"><span>Tax (2%)</span><span>₹{tax.toFixed(2)}</span></div> */}
                                        <div className="flex justify-between"><span>Delivery Charge</span><span>{deliveryCharge === 0 ? "Free" : `₹${deliveryCharge.toFixed(2)}`}</span></div>

                                        {isLoggedIn && wallet > 0 && (
                                            <div className="flex justify-between items-center pt-2">
                                                <div>
                                                    <input
                                                        type="checkbox"
                                                        id="applyWallet"
                                                        checked={isWalletApplied}
                                                        onChange={(e) => setIsWalletApplied(e.target.checked)}
                                                        className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                                    />
                                                    <label htmlFor="applyWallet" className="ml-2">Apply Wallet</label>
                                                </div>
                                                <span>₹{wallet.toFixed(2)}</span>
                                            </div>
                                        )}

                                        {isWalletApplied && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Wallet Discount</span>
                                                <span>- ₹{walletDiscount.toFixed(2)}</span>
                                            </div>
                                        )}

                                        <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                                            <span>Grand Total</span><span>₹{grandTotal.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Checkout Section */}
                                    {isLoggedIn ? (
                                        <div className="mt-6">
                                            <div className="mb-4">
                                                <h4 className="font-semibold mb-2 text-gray-800">Delivery Address</h4>
                                                {savedAddress ? (
                                                    <div className="p-3 bg-gray-50 rounded-md border text-sm">
                                                        <p className="text-gray-900 font-semibold flex items-center gap-2">
                                                            {savedAddress.tag === "Home" ? (
                                                                <FaHome className="text-blue-500" />
                                                            ) : savedAddress.tag === "Work" ? (
                                                                <FaBriefcase className="text-green-500" />
                                                            ) : (
                                                                <FaEllipsisH className="text-gray-500" />
                                                            )}
                                                            {savedAddress.tag}
                                                        </p>
                                                        <p className="text-gray-700">{savedAddress.address}</p>
                                                        {savedAddress.pincode && (
                                                            <p className="text-gray-600">Pincode: {savedAddress.pincode}</p>
                                                        )}
                                                        <p className="text-gray-600">📞 {savedAddress.mobile}</p>
                                                        {savedAddress.secondaryMobile && (
                                                            <p className="text-gray-600">
                                                                📞 Alt: {savedAddress.secondaryMobile}
                                                            </p>
                                                        )}
                                                        {savedAddress.email && (
                                                            <p className="text-gray-600">✉️ {savedAddress.email}</p>
                                                        )}
                                                        <button onClick={() => router.push('/add-address')} className="text-blue-600 hover:underline text-xs mt-1 font-medium">Change or Add New</button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => router.push("/add-address")} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-semibold">+ Add Delivery Address</button>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-6">
                                            <button onClick={handleLoginRedirect} className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold">Login to Proceed</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            {/* Fixed Proceed Button */}
            {cart.length > 0 && isLoggedIn && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg border-t z-40">
                    <button
                        onClick={handleProceedToCheckout}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg text-lg font-semibold disabled:bg-red-300 disabled:cursor-not-allowed"
                        disabled={!savedAddress || isProcessing}
                    >
                        {isProcessing ? 'Processing...' : `Proceed to Pay ₹${grandTotal.toFixed(2)}`}
                    </button>
                </div>
            )}
        </div>
    );
}
