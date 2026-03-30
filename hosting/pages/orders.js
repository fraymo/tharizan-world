import React, {useEffect, useMemo, useState} from "react";
import {ArrowLeft, ChefHat, MapPin, ShoppingCart, Star} from "lucide-react";
import {useRouter} from "next/router";
import {fetchApi, seller_email} from "@/utils/util";
import {router} from "next/client"; // or "next/navigation" for App Router


// Helper to map order status to corresponding icon and colors
const statusConfig = {
    Placed: {
        icon: <ChefHat className="w-4 h-4 text-orange-500"/>,
        color: "text-orange-500",
    },
    Packed: {
        icon: <ChefHat className="w-4 h-4 text-orange-500"/>,
        color: "text-orange-500",
    },
    "Out for Delivery": {
        icon: <MapPin className="w-4 h-4 text-blue-500"/>,
        color: "text-blue-500",
    },
    Delivered: {
        icon: null, // No icon for past orders in the card
        color: "text-green-600",
    },
    Cancelled: {
        icon: null,
        color: "text-red-500",
    },
};

// Component for the full details of a selected order
const OrderDetailPage = ({order, onBack}) => (
    <div className="bg-white rounded-lg shadow p-6 animate-fade-in">
        <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 mb-6 font-semibold transition-colors"
        >
            <ArrowLeft size={18}/>
            Back to All Orders
        </button>
        <div className="border-b pb-4 mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{order.restaurant}</h2>
            <p className="text-sm text-gray-500">Order ID: {order._id}</p>
            <p
                className={`mt-2 text-lg font-bold ${
                    statusConfig[order.orderStatus]?.color || "text-gray-500"
                }`}
            >
                Status: {order.orderStatus}
            </p>
        </div>
        <div>
            <h3 className="font-semibold text-gray-700 mb-2">Items Ordered</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
                {order.products.map((product) => (
                    <li key={product.productId}>{product.name}</li>
                ))}
            </ul>
        </div>
        <div className="text-right mt-6 pt-4 border-t">
            <p className="text-xl font-bold">Total: ₹{order.billDetails.grandTotal.toFixed(2)}</p>
        </div>
        <div className="mt-6 pt-4 border-t">
            <p className="text-gray-500">Estimated Delivery Time</p>
            <p className="text-xl font-bold">{order.deliverySlot}</p>
        </div>
    </div>
);

// Component for a single live order card
const LiveOrderCard = ({order, onSelect}) => {
    const router = useRouter();
    return (
        <div
            className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => onSelect(order)}
        >
            <div className="flex justify-between items-center border-b pb-2 mb-3">
                <div>
                    <p className="text-sm font-semibold text-gray-800">{order.restaurant}</p>
                    <p className="text-xs text-gray-500">Order ID: {order._id}</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                    {statusConfig[order.orderStatus]?.icon}
                    <span className="text-xs font-bold text-gray-700">{order.orderStatus}</span>
                </div>
            </div>
            <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Items:</p>
                <ul className="list-disc list-inside text-sm text-gray-600 pl-2">
                    {order.products.map((product) => (
                        <li key={product.productId}>{product.name}</li>
                    ))}
                </ul>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <div>
                    <p className="text-xs text-gray-500">Estimated Delivery</p>
                    <p className="text-sm font-bold text-indigo-600">{order.deliverySlot}</p>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        localStorage.setItem('selectedTrackOrder', JSON.stringify(order));
                        router.push(`/track-order?id=${order._id}`);
                    }}
                    className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
                >
                    Track Order
                </button>
            </div>
        </div>
    )
};

// Component for a single past order card
const PastOrderCard = ({order, onSelect}) => (
    <div
        className={`bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200 cursor-pointer ${
            order.orderStatus === "Cancelled" ? "opacity-70 bg-gray-50" : ""
        }`}
        onClick={() => onSelect(order)}
    >
        <div className="flex justify-between items-center border-b pb-2 mb-3">
            <div>
                <p className="text-sm font-semibold text-gray-800">{order.restaurant}</p>
                <p className={`text-xs font-bold ${statusConfig[order.orderStatus]?.color}`}>
                    {order.orderStatus} on {order.deliveryDate}
                </p>
            </div>
            <p className="text-sm font-bold text-gray-800">₹{order.billDetails.grandTotal.toFixed(2)}</p>
        </div>
        <div className="mb-3">
            <p className="text-sm text-gray-600 font-medium">{order.products.map(p => p.name).join(" • ")}</p>
        </div>
        {/*<div className="flex justify-end items-center gap-3 pt-2 border-t mt-3">*/}
        {/*    {order.orderStatus !== "Cancelled" && (*/}
        {/*        <button*/}
        {/*            onClick={(e) => {*/}
        {/*                e.stopPropagation();*/}
        {/*                alert(`Rating order ${order._id}`);*/}
        {/*            }}*/}
        {/*            className="text-gray-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1"*/}
        {/*        >*/}
        {/*            <Star className="w-4 h-4"/> Rate Order*/}
        {/*        </button>*/}
        {/*    )}*/}
        {/*    <button*/}
        {/*        onClick={(e) => {*/}
        {/*            e.stopPropagation();*/}
        {/*            alert(`Reordering from ${order.restaurant}`);*/}
        {/*        }}*/}
        {/*        className="bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-red-600 transition-colors"*/}
        {/*    >*/}
        {/*        {order.orderStatus === "Cancelled" ? "Order Again" : "Reorder"}*/}
        {/*    </button>*/}
        {/*</div>*/}
    </div>
);

// Main component with tabs
export default function OrdersTab() {
    const [activeTab, setActiveTab] = useState("live");
    const [view, setView] = useState("list"); // 'list' or 'detail'
    const [selectedOrder, setSelectedOrder] = useState(null);
    const router = useRouter(); // Initialize the router

    // State for API data, loading, and errors
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch orders from the API when the component mounts
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user || !user.phone) {
                    // throw new Error("User phone number not found.");
                    await router.push("/loginpage?redirect=/orders");
                    return;
                }

                const data = await fetchApi(`/posts/orders-by-phone`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json',  'x-user': seller_email},
                    body: {phone: user.phone},
                });
                setAllOrders(data);
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Failed to fetch orders. Please try again later.");
                setAllOrders(getMockOrders());
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []); // Empty dependency array ensures this runs only once on mount

    // Filter orders into 'live' and 'past' categories
    const {liveOrders, pastOrders} = useMemo(() => {
        const live = allOrders.filter(o =>o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled');
        const past = allOrders.filter(o => o.orderStatus === 'Delivered' || o.orderStatus === 'Cancelled');
        return {liveOrders: live, pastOrders: past};
    }, [allOrders]);

    const handleOrderSelect = (order) => {
        setSelectedOrder(order);
        setView("detail");
    };

    const handleBackToList = () => {
        setSelectedOrder(null);
        setView("list");
    };

    const renderContent = () => {
        if (loading) {
            return <div className="text-center p-10">Loading your orders...</div>;
        }

        if (error) {
            return <div className="text-center p-10 text-red-500">{error}</div>;
        }

        if (activeTab === "live") {
            return (
                <div className="mt-6">
                    {liveOrders.length > 0 ? (
                        liveOrders.map((order) => <LiveOrderCard key={order._id} order={order}
                                                                 onSelect={handleOrderSelect}/>)
                    ) : (
                        <div className="mt-6 bg-white rounded-lg shadow p-8 flex flex-col items-center text-center">
                            <ShoppingCart className="w-16 h-16 text-gray-300 mb-4"/>
                            <p className="text-gray-500 font-medium">No live orders right now.</p>
                        </div>
                    )}
                </div>
            );
        }

        if (activeTab === "past") {
            return (
                <div className="mt-6">
                    {pastOrders.length > 0 ? (
                        pastOrders.map((order) => <PastOrderCard key={order._id} order={order}
                                                                 onSelect={handleOrderSelect}/>)
                    ) : (
                        <div className="mt-6 bg-white rounded-lg shadow p-8 flex flex-col items-center text-center">
                            <ShoppingCart className="w-16 h-16 text-gray-300 mb-4"/>
                            <p className="text-gray-500 font-medium">
                                No past orders to display. <br/>
                                All your previous orders will appear here.
                            </p>
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="max-w-xl mx-auto p-4 pt-24 bg-gray-50 min-h-screen font-sans">
            {view === "list" ? (
                <>
                    <div className="flex justify-center space-x-8 text-lg font-semibold border-b border-gray-200">
                        <button
                            className={`pb-2 border-b-4 transition-colors duration-300 ${
                                activeTab === "live"
                                    ? "border-red-600 text-red-600"
                                    : "border-transparent text-gray-500 hover:text-gray-800"
                            }`}
                            onClick={() => setActiveTab("live")}
                        >
                            Live Orders
                        </button>
                        <button
                            className={`pb-2 border-b-4 transition-colors duration-300 ${
                                activeTab === "past"
                                    ? "border-red-600 text-red-600"
                                    : "border-transparent text-gray-500 hover:text-gray-800"
                            }`}
                            onClick={() => setActiveTab("past")}
                        >
                            Past Orders
                        </button>
                    </div>
                    {renderContent()}
                </>
            ) : (
                <OrderDetailPage order={selectedOrder} onBack={handleBackToList}/>
            )}
        </div>
    );
}

// Mock function updated to align with the component's data structure expectations.
function getMockOrders() {
    return [
        {
            _id: "mock-GGF-1245-2B",
            restaurant: "Punjabi Angithi",
            products: [
                {productId: "p1", title: "Paneer Butter Masala"},
                {productId: "p2", title: "2 Butter Naan"},
                {productId: "p3", title: "Coke"},
            ],
            orderStatus: "Placed",
            deliverySlot: {day: "Today", time: "15-20 mins"},
            billDetails: {grandTotal: 650.00},
        },
        {
            _id: "mock-GGF-1245-2C",
            restaurant: "Paradise Biryani",
            products: [
                {productId: "p4", title: "Chicken Biryani (Full)"},
                {productId: "p5", title: "Raita"},
                {productId: "p6", title: "Pepsi (500ml)"},
            ],
            orderStatus: "Out for Delivery",
            deliverySlot: {day: "Today", time: "5-10 mins"},
            billDetails: {grandTotal: 780.00},
        },
        {
            _id: "mock-GGF-1245-2A",
            restaurant: "Domino's Pizza",
            products: [
                {productId: "p7", title: "Margherita Pizza (Medium)"},
                {productId: "p8", title: "Garlic Bread"},
                {productId: "p9", title: "Coke"},
            ],
            orderStatus: "Delivered",
            deliveryDate: "June 26, 2025",
            billDetails: {grandTotal: 550.00},
            deliverySlot: {day: "Yesterday", time: "8:30 PM"},
        },
        {
            _id: "mock-GGF-1245-1F",
            restaurant: "Wow! Momo",
            products: [
                {productId: "p10", title: "Steamed Chicken Momo (8pcs)"},
                {productId: "p11", title: "Pan-fried Veg Momo"},
            ],
            orderStatus: "Cancelled",
            deliveryDate: "June 24, 2025",
            billDetails: {grandTotal: 320.00},
            deliverySlot: {day: "2 days ago", time: "1:00 PM"},
        },
    ];
}
