import React, {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/router";
import {
    ArrowLeft,
    CheckCircle2,
    Clock3,
    Package,
    PackageCheck,
    ShoppingBag,
    Truck,
    XCircle
} from "lucide-react";
import {buildTenantPath, fetchApi, getTenantHeaders} from "@/utils/util";
import {useStorefront} from "@/context/StorefrontContext";

const statusMeta = {
    Placed: {
        icon: Clock3,
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        card: "border-amber-100 bg-amber-50/50"
    },
    Packed: {
        icon: Package,
        badge: "bg-sky-50 text-sky-700 border-sky-200",
        card: "border-sky-100 bg-sky-50/50"
    },
    "Out for Delivery": {
        icon: Truck,
        badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
        card: "border-indigo-100 bg-indigo-50/50"
    },
    Delivered: {
        icon: PackageCheck,
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        card: "border-emerald-100 bg-emerald-50/50"
    },
    Cancelled: {
        icon: XCircle,
        badge: "bg-rose-50 text-rose-700 border-rose-200",
        card: "border-rose-100 bg-rose-50/50"
    }
};

const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("en-IN", {style: "currency", currency: "INR", maximumFractionDigits: 2}).format(Number(value || 0));

const formatDate = (value) => {
    if (!value) {
        return "Recently";
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return "Recently";
    }

    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    }).format(parsed);
};

const getProductName = (product = {}) => product?.name || product?.title || "Product";

function EmptyState({title, description}) {
    return (
        <div className="rounded-[32px] border border-dashed border-gray-300 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-gray-100">
                <ShoppingBag className="h-7 w-7 text-gray-500"/>
            </div>
            <h3 className="mt-5 text-xl font-semibold text-gray-900">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
        </div>
    );
}

function OrderCard({order, onSelect}) {
    const meta = statusMeta[order.orderStatus] || statusMeta.Placed;
    const StatusIcon = meta.icon;
    const productNames = (order.products || []).map(getProductName);

    return (
        <button
            onClick={() => onSelect(order)}
            className="w-full rounded-[30px] border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${meta.badge}`}>
                        <StatusIcon className="h-4 w-4"/>
                        {order.orderStatus || "Placed"}
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-gray-900">Order #{order._id}</h3>
                    <p className="mt-2 text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                </div>

                <div className="rounded-[24px] bg-gray-50 px-4 py-3 text-right">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-400">Total</p>
                    <p className="mt-1 text-xl font-bold text-gray-900">{formatCurrency(order?.billDetails?.grandTotal)}</p>
                </div>
            </div>

            <div className={`mt-5 rounded-[24px] border p-4 ${meta.card}`}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-500">Items</p>
                <p className="mt-2 text-sm leading-7 text-gray-700">{productNames.join(" • ")}</p>
            </div>
        </button>
    );
}

function OrderDetail({order, onBack}) {
    const meta = statusMeta[order.orderStatus] || statusMeta.Placed;
    const StatusIcon = meta.icon;

    return (
        <div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <button
                onClick={onBack}
                className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
                <ArrowLeft className="h-4 w-4"/>
                Back to orders
            </button>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${meta.badge}`}>
                        <StatusIcon className="h-4 w-4"/>
                        {order.orderStatus || "Placed"}
                    </div>
                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900">Order #{order._id}</h2>
                    <p className="mt-2 text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
                </div>

                <div className="rounded-[24px] bg-gray-900 px-5 py-4 text-white">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-300">Grand total</p>
                    <p className="mt-1 text-2xl font-bold">{formatCurrency(order?.billDetails?.grandTotal)}</p>
                </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="space-y-5">
                    <div className="rounded-[28px] border border-gray-200 bg-gray-50 p-5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-400">Ordered items</p>
                        <div className="mt-4 space-y-3">
                            {(order.products || []).map((product) => (
                                <div key={product.productId || product._id || getProductName(product)} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                                    <div>
                                        <p className="font-semibold text-gray-900">{getProductName(product)}</p>
                                        <p className="mt-1 text-sm text-gray-500">Qty: {product.quantity || 1}</p>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-700">{formatCurrency((product.price || 0) * (product.quantity || 1))}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-gray-200 bg-white p-5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-400">Delivery address</p>
                        <div className="mt-4 text-sm leading-7 text-gray-600">
                            <p className="font-semibold text-gray-900">{order?.deliveryAddress?.name || order?.deliveryAddress?.tag || "Saved address"}</p>
                            <p>{order?.deliveryAddress?.address || "Address unavailable"}</p>
                            {order?.deliveryAddress?.pincode ? <p>Pincode: {order.deliveryAddress.pincode}</p> : null}
                            {order?.deliveryAddress?.mobile ? <p>Phone: {order.deliveryAddress.mobile}</p> : null}
                            {order?.deliveryAddress?.email ? <p>Email: {order.deliveryAddress.email}</p> : null}
                        </div>
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="rounded-[28px] border border-gray-200 bg-white p-5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-400">Bill summary</p>
                        <div className="mt-4 space-y-3 text-sm text-gray-600">
                            <div className="flex items-center justify-between">
                                <span>Subtotal</span>
                                <span className="font-medium">{formatCurrency(order?.billDetails?.subtotal)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Delivery charge</span>
                                <span className="font-medium">{formatCurrency(order?.billDetails?.deliveryCharge)}</span>
                            </div>
                            {order?.billDetails?.walletDiscount ? (
                                <div className="flex items-center justify-between text-emerald-600">
                                    <span>Wallet discount</span>
                                    <span className="font-medium">- {formatCurrency(order.billDetails.walletDiscount)}</span>
                                </div>
                            ) : null}
                            <div className="border-t border-gray-100 pt-3">
                                <div className="flex items-center justify-between text-base font-semibold text-gray-900">
                                    <span>Total paid</span>
                                    <span>{formatCurrency(order?.billDetails?.grandTotal)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-[28px] border p-5 ${meta.card}`}>
                        <div className="flex items-start gap-3">
                            <StatusIcon className="mt-0.5 h-5 w-5 text-gray-700"/>
                            <div>
                                <p className="font-semibold text-gray-900">Current status</p>
                                <p className="mt-1 text-sm leading-6 text-gray-600">
                                    This order is currently marked as <span className="font-semibold">{order.orderStatus || "Placed"}</span>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OrdersPage() {
    const router = useRouter();
    const {tenant, loading: storefrontLoading} = useStorefront();
    const [activeTab, setActiveTab] = useState("live");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const storeName = tenant?.storeName || tenant?.sellerName || "your storefront";

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (storefrontLoading) {
                    return;
                }

                if (!tenant?.sellerEmail) {
                    setError("We couldn't identify the storefront for these orders.");
                    setAllOrders([]);
                    setLoading(false);
                    return;
                }

                const user = JSON.parse(localStorage.getItem("user") || "null");
                if (!user?.phone) {
                    await router.push(`${buildTenantPath("/loginpage", tenant)}?redirect=${encodeURIComponent(buildTenantPath("/orders", tenant))}`);
                    return;
                }

                const data = await fetchApi("/posts/orders-by-phone", {
                    method: "POST",
                    headers: getTenantHeaders({}, tenant),
                    body: {phone: user.phone},
                });

                setAllOrders(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Fetch orders failed:", err);
                setError("We couldn't load your orders right now.");
                setAllOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [router, storefrontLoading, tenant?.sellerEmail, tenant?.sellerId]);

    const {liveOrders, pastOrders} = useMemo(() => {
        const live = allOrders.filter((order) => order.orderStatus !== "Delivered" && order.orderStatus !== "Cancelled");
        const past = allOrders.filter((order) => order.orderStatus === "Delivered" || order.orderStatus === "Cancelled");
        return {liveOrders: live, pastOrders: past};
    }, [allOrders]);

    const currentOrders = activeTab === "live" ? liveOrders : pastOrders;

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff8f3_0%,#ffffff_42%,#f8fafc_100%)] px-4 pb-16 pt-24 sm:px-6">
            <div className="mx-auto max-w-6xl">
                {selectedOrder ? (
                    <OrderDetail order={selectedOrder} onBack={() => setSelectedOrder(null)}/>
                ) : (
                    <>
                        <div className="overflow-hidden rounded-[34px] border border-gray-200 bg-white shadow-sm">
                            <div className="bg-[linear-gradient(135deg,#111827_0%,#1f2937_52%,#7c2d12_100%)] px-6 py-8 text-white sm:px-8">
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em]">
                                    <CheckCircle2 className="h-4 w-4"/>
                                    Order history
                                </div>
                                <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Track every order from {storeName}</h1>
                                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">
                                    Review live progress, revisit completed purchases, and keep the full storefront order journey in one place.
                                </p>
                            </div>

                            <div className="px-6 py-6 sm:px-8">
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() => setActiveTab("live")}
                                        className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                                            activeTab === "live" ? "bg-gray-900 text-white" : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                        }`}
                                    >
                                        Live Orders ({liveOrders.length})
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("past")}
                                        className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                                            activeTab === "past" ? "bg-gray-900 text-white" : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                        }`}
                                    >
                                        Past Orders ({pastOrders.length})
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            {loading ? (
                                <div className="rounded-[32px] border border-gray-200 bg-white px-6 py-14 text-center shadow-sm">
                                    <p className="text-lg font-semibold text-gray-900">Loading your orders...</p>
                                    <p className="mt-2 text-sm text-gray-500">Preparing the latest storefront order timeline.</p>
                                </div>
                            ) : error ? (
                                <div className="rounded-[32px] border border-rose-100 bg-rose-50 px-6 py-14 text-center shadow-sm">
                                    <p className="text-lg font-semibold text-rose-700">{error}</p>
                                </div>
                            ) : currentOrders.length === 0 ? (
                                <EmptyState
                                    title={activeTab === "live" ? "No live orders right now" : "No past orders yet"}
                                    description={activeTab === "live"
                                        ? "Once you place a new storefront order, it will appear here with its current status."
                                        : "Completed and cancelled orders will appear here after your first completed checkout."}
                                />
                            ) : (
                                <div className="grid gap-5">
                                    {currentOrders.map((order) => (
                                        <OrderCard key={order._id} order={order} onSelect={setSelectedOrder}/>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
