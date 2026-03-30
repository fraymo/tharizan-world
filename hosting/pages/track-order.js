'use client';
import React, {useEffect, useState} from 'react';
import {ArrowLeft, CheckCircle, Package, RefreshCcw, Truck, XCircle} from 'lucide-react';

const statusSteps = [
    {name: 'Placed', icon: Package},
    {name: "Preparing", icon: Package},
    {name: "Packed", icon: Truck},
    {name: "Delivered", icon: CheckCircle},
];

export default function TrackOrderPage() {
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // In a real application, you would fetch the order from an API.
        // For this flow, we read the selected order from localStorage.
        try {
            const storedOrder = localStorage.getItem('selectedTrackOrder');
            if (storedOrder) {
                setOrder(JSON.parse(storedOrder));
            } else {
                // Handle case where no order is in localStorage
                console.warn("No 'selectedTrackOrder' found in localStorage.");
                setOrder(null);
            }
        } catch (error) {
            console.error("Failed to parse order from localStorage:", error);
            setOrder(null); // Set to null on parsing error
        } finally {
            setIsLoading(false);
        }
    }, []); // Empty dependency array means this runs once on mount

    const handleBack = () => {
        window.history.back();
    };

    // Determine the current status index for the progress bar
    const currentStatusIndex = order && order.orderStatus !== "Cancelled"
        ? statusSteps.findIndex(step => step.name === order.orderStatus)
        : -1;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 sm:p-6 md:p-8 font-inter pt-16">
            {/* Header */}
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 mb-6 flex items-center justify-between"
                 style={{paddingTop: '4rem'}}>
                <button
                    onClick={handleBack}
                    className="flex items-center text-gray-700 gap-2 font-semibold text-base transition-colors duration-200 hover:text-indigo-600"
                >
                    <ArrowLeft className="w-5 h-5"/> Back
                </button>
                <h1 className="text-xl font-bold text-gray-800">Order Details</h1>
                <div></div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-indigo-500 border-opacity-25"></div>
                    <p className="mt-4 text-gray-600">Loading order details...</p>
                </div>
            ) : !order ? (
                <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg animate-fade-in text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4"/>
                    <h2 className="text-xl font-bold text-gray-800 mb-3">Order Not Found</h2>
                    <p className="text-gray-600">We could not find the order details in your session. Please go back and
                        select an order to track.</p>
                </div>
            ) : (
                <>
                    {/* Conditional Rendering based on order.orderStatus */}
                    {order.orderStatus === 'Cancelled' && (
                        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg animate-fade-in text-center">
                            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4"/>
                            <h2 className="text-xl font-bold text-gray-800 mb-3">Order Cancelled</h2>
                            <p className="text-lg font-semibold text-gray-700 mb-2">{order.restaurant}</p>
                            <p className="text-sm text-gray-500 mb-4">Order ID: <span
                                className="font-semibold">{order._id}</span></p>
                            <p className="text-sm text-gray-600">
                                Reason: <span className="font-medium">{order.cancellationReason}</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-2">Cancelled on: {order.cancelledDate}</p>
                            <button
                                onClick={() => console.log('Contact support clicked for cancelled order')}
                                className="mt-6 bg-red-600 text-white text-sm font-semibold px-5 py-2 rounded-lg shadow-sm hover:bg-red-700 transition-colors"
                            >
                                Contact Support
                            </button>
                        </div>
                    )}

                    {order.orderStatus === 'Delivered' && (
                        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg animate-fade-in text-center">
                            <RefreshCcw className="w-16 h-16 text-blue-500 mx-auto mb-4"/>
                            <h2 className="text-xl font-bold text-gray-800 mb-3">Previous Order</h2>
                            <p className="text-lg font-semibold text-gray-700 mb-2">{order.restaurant}</p>
                            <p className="text-sm text-gray-500 mb-4">Order ID: <span
                                className="font-semibold">{order._id}</span></p>
                            <div className="border-t border-gray-200 pt-4 mb-4">
                                <p className="text-base font-semibold text-gray-700 mb-2">Items:</p>
                                <ul className="list-disc list-inside text-sm text-gray-600 pl-2">
                                    {order.items.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Delivered on: {order.deliveryDate}</p>
                            <button
                                onClick={() => console.log(`Reordering ${order._id}`)}
                                className="mt-6 bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                            >
                                Reorder
                            </button>
                        </div>
                    )}

                    {/* Default to Track Order if status is Preparing or Packed */}
                    {(order.orderStatus === 'Preparing' || order.orderStatus === 'Packed' || order.orderStatus === 'Placed') && (
                        <>
                            {/* Status line for Track Order */}
                            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 mb-8">
                                <div className="flex items-center justify-between relative">
                                    <div
                                        className="absolute left-0 right-0 h-1 bg-gray-200 rounded-full mx-6"
                                        style={{
                                            top: 'calc(50% - 2px)'
                                        }}
                                    >
                                        <div
                                            className="h-full bg-green-500 rounded-full transition-all duration-500 ease-in-out"
                                            style={{
                                                width: `${currentStatusIndex !== -1 ? (currentStatusIndex / (statusSteps.length - 1)) * 100 : 0}%`
                                            }}
                                        ></div>
                                    </div>

                                    {statusSteps.map((step, index) => {
                                        const isActive = index <= currentStatusIndex;
                                        const IconComponent = step.icon;
                                        return (
                                            <div key={step.name} className="flex-1 flex flex-col items-center z-10">
                                                <div
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out
                                      ${isActive ? "bg-green-500 text-white shadow-md" : "bg-gray-300 text-gray-600"}`}
                                                >
                                                    <IconComponent className="w-5 h-5"/>
                                                </div>
                                                <span
                                                    className={`text-sm mt-2 font-medium text-center transition-colors duration-300 ease-in-out
                                      ${isActive ? "text-green-700" : "text-gray-500"}`}
                                                >
                          {step.name}
                        </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Order Details for Track Order */}
                            <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg animate-fade-in">
                                <h2 className="text-xl font-bold text-gray-800 mb-3">{order.restaurant}</h2>
                                <p className="text-sm text-gray-500 mb-4">Order ID: <span
                                    className="font-semibold">{order._id}</span></p>

                                <div className="border-t border-gray-200 pt-4">
                                    <p className="text-base font-semibold text-gray-700 mb-2">Items:</p>
                                    <ul className="space-y-2 text-gray-600">
                                        {order.products.map((item, idx) => (
                                            <li key={idx} className="flex items-center text-sm">
                                                <span
                                                    className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2 flex-shrink-0"></span>
                                                {item.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <p className="mt-6 text-right text-base text-gray-600">
                                    Estimated Delivery: <span
                                    className="font-bold text-indigo-600">{order.deliverySlot}</span>
                                </p>
                            </div>
                        </>
                    )}
                </>
            )}

            {/* Tailwind CSS custom animation for fade-in */}
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
        </div>
    );
}
