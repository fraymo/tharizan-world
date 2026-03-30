'use client';
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {ArrowLeftIcon, ChevronRightIcon} from '@heroicons/react/24/outline';
import {fetchApi, getCustomerEmail, seller_email} from "@/utils/util";
import {formatCurrency} from "@/utils/formatCurrency";

export default function WalletPage() {
    const router = useRouter();
    const [balance, setBalance] = useState(0.0);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const customer_email = getCustomerEmail();
    const [isProcessing, setIsProcessing] = useState(false); // State for API call loading

    const fetchWalletData = async () => {
        try {
            const res = await fetchApi('/wallet/getTotalAmount', {
                headers: {'Content-Type': 'application/json',  'x-user': seller_email},
                method: 'POST',
                body: {
                    seller_email,
                    customer_email,
                }
            });
            setBalance(res.amount || 0);
            setTransactions(res.transaction || []);
        } catch (e) {
            setBalance(0);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setLoading(true);
        fetchWalletData();
    }, []);

    const initializeRazorpay = () => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
            // Script loaded
        };
        document.body.appendChild(script);
    };

    useEffect(() => {
        initializeRazorpay();
    }, []);

    const handleAddMoney = async () => {
        if (!amount || amount <= 0) {
            alert("Please enter a valid amount");
            return;
        }
        setIsProcessing(true);

        const user = JSON.parse(localStorage.getItem("user"));
        const orderDetails = {
            user: user,
            userId: user._id,
            phone: user.phone,
            receiptNo: "T" + Date.now(),
            seller_email,
            customer_email: getCustomerEmail(),
            amount
        };

        try {
            // Construct the API URL from the environment variable
            const createOrderUrl = `/wallet/create`;

            let response;
            try {
                response = await fetchApi(createOrderUrl, {
                    headers: {'Content-Type': 'application/json',  'x-user': seller_email},
                    method: 'POST', body: orderDetails,
                });
            } catch (e) {
                throw new Error(response.message || 'Failed to create the order.');
            }

            const {id, verifyPaymentUrl, key_id} = response;

            // Construct the callback URL from an environment variable for flexibility
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://halalo-foods.web.app';
            const param = "/?transactionId=" + orderDetails.receiptNo;
            const callbackUrl = `${appUrl}/success${param}`;

            const options = {
                key: key_id, // Replace with your Razorpay key_id
                amount: parseInt(amount),
                currency: 'INR',
                name: user.phone,
                description: 'Halalo Wallet',
                order_id: id, // This is the order_id created in the backend
                callback_url: callbackUrl, // Using the dynamic callback URL
                prefill: {
                    name: user.name, email: user.email, contact: user.phone
                },
                theme: {
                    color: '#F45F5E'
                },
                handler: function (response) {
                    fetchApi('/wallet/add', {
                        headers: {'Content-Type': 'application/json',  'x-user': seller_email},
                        method: "POST", body: {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            razorpay_response: response,
                            transactionId: orderDetails.receiptNo,
                            seller_email,
                            customer_email: getCustomerEmail(),
                            amount: parseInt(amount),
                        }
                    }).then(data => {
                        fetchWalletData();
                    }).catch(error => {
                        console.error('Error:', error);
                        alert('Error verifying payment');
                    });
                }
            };

            if (typeof window.Razorpay !== "undefined") {
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
    };

    return (
        <div className="bg-white min-h-screen flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 pt-20 px-4 py-4 border-b text-lg font-semibold text-gray-800">
                <ArrowLeftIcon className="w-5 h-5 cursor-pointer" onClick={() => router.back()}/>
                Halalo Wallet
            </div>

            {/* Wallet Card */}
            <div className="p-4">
                <div className="bg-gradient-to-br from-red-100 via-white to-red-100 rounded-xl p-4 shadow-sm border">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-500">Total balance</p>
                            {loading ? (
                                <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                            ) : (
                                <p className="text-3xl font-bold text-red-600">₹{balance.toFixed(2)}</p>
                            )}
                        </div>
                    </div>
                    <div className="mt-4">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount to add"
                            className="w-full px-3 py-2 border rounded-md"
                        />
                        <button
                            onClick={handleAddMoney}
                            className="w-full mt-2 bg-pink-600 text-white px-4 py-2 rounded-md font-medium hover:bg-pink-700 transition"
                        >
                            Add Money
                        </button>
                    </div>
                </div>
            </div>

            {/* Last 5 Transactions */}
            <div className="px-4 mt-6">
                <p className="font-medium text-gray-800 mb-3">Last 5 Transactions</p>
                {transactions && transactions.length > 0 ? (
                    <div className="space-y-3">
                        {transactions.slice(0, 5).map((txn) => (
                            <div key={txn._id} className="bg-white border rounded-lg p-3 shadow-sm">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-gray-500 truncate">ID: {txn._id}</p>
                                        <p className="text-sm font-medium text-gray-800">{txn.addedAt}</p>
                                    </div>
                                    {txn.type === 'add' ?
                                        <p className="text-lg font-semibold text-green-600">
                                            + {formatCurrency(txn.amount)}
                                        </p> : <p className="text-lg font-semibold text-red-600">
                                            - {formatCurrency(txn.amount)}
                                        </p>}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-100 text-gray-500 text-sm p-6 rounded-md text-center">
                        No Transactions Yet
                    </div>
                )}
            </div>

            {/* FAQs */}
            <div className="p-4 mt-6">
                <div
                    className="flex justify-between items-center bg-white border rounded-lg p-4 shadow-sm cursor-pointer"
                    onClick={() => router.push('/faqs')}
                >
                    <p className="text-sm font-medium text-gray-800">FAQs</p>
                    <ChevronRightIcon className="w-4 h-4 text-gray-500"/>
                </div>
            </div>

            <div className="flex-grow"></div>
        </div>
    );
}
