'use client';

import React, {useEffect, useMemo, useState} from 'react';
import {
    BellIcon,
    DocumentDuplicateIcon,
    DocumentTextIcon,
    HeartIcon,
    MapPinIcon,
    PencilSquareIcon,
    QuestionMarkCircleIcon,
    ShieldCheckIcon,
    TrashIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline';
import {useRouter} from 'next/router';
import {buildTenantPath, fetchApi, getCustomerEmail, getTenantHeaders, withTenant} from "@/utils/util";
import {formatCurrency} from "@/utils/formatCurrency";
import {resetCart} from "@/redux/cartSlice";
import {useDispatch} from "react-redux";
import {useStorefront} from "@/context/StorefrontContext";

const quickActions = [
    {label: "Orders", description: "Track placed orders and delivery progress", icon: DocumentTextIcon, route: "/orders"},
    {label: "Wish List", description: "Saved products for this storefront", icon: HeartIcon, route: "/wishlist"},
    {label: "Addresses", description: "Manage delivery addresses", icon: MapPinIcon, route: "/addresses"},
    {label: "Notifications", description: "Unread storefront updates", icon: BellIcon, route: "/notifications"},
];

const supportActions = [
    {label: "Contact Us", description: "Reach the seller support team", icon: QuestionMarkCircleIcon, route: "/contact"},
    {label: "Terms & Conditions", description: "Storefront terms and policies", icon: DocumentDuplicateIcon, route: "/terms-of-service"},
    {label: "Privacy Policy", description: "How your data is handled", icon: ShieldCheckIcon, route: "/privacy-policy"},
    {label: "Delete Account", description: "Permanently remove your profile", icon: TrashIcon, route: "/delete"},
];

export default function AccountPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const {tenant} = useStorefront();

    const [user, setUser] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [orderCount, setOrderCount] = useState(null);
    const [walletCount, setWalletCount] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);

    const storeName = tenant?.storeName || tenant?.sellerName || "your storefront";

    useEffect(() => {
        const storedUserData = localStorage.getItem('user');
        if (storedUserData) {
            try {
                const parsedUser = JSON.parse(storedUserData);
                setUser(parsedUser);
                setForm(parsedUser);
                setAddresses(parsedUser.addresses || []);
            } catch (error) {
                console.error("Failed to parse user data from localStorage:", error);
            }
        } else {
            router.push(`${buildTenantPath("/loginpage", tenant)}?redirect=${encodeURIComponent(buildTenantPath("/accounts", tenant))}`);
        }
    }, [router, tenant?.slug, tenant?.sellerEmail]);

    useEffect(() => {
        const getCount = async () => {
            if (!tenant?.sellerEmail || !getCustomerEmail()) {
                return;
            }

            const countRes = await fetchApi("/ord/getCounts", {
                headers: getTenantHeaders({}, tenant),
                method: 'POST',
                body: withTenant({customer_email: getCustomerEmail()}, tenant)
            });
            setOrderCount(countRes.orderCount);
            setWalletCount(countRes.walletAmount);
            setNotificationCount(countRes.notificationCount);
        };

        getCount();
    }, [tenant?.sellerEmail, tenant?.sellerId, user]);

    const handleChange = (event) => {
        const {name, value} = event.target;
        setForm((prev) => ({...prev, [name]: value}));
    };

    const saveChanges = async () => {
        setIsSaving(true);
        try {
            const phoneNumber = getCustomerEmail();
            if (!phoneNumber) {
                alert('Error: Phone number is missing. Cannot update profile.');
                return;
            }

            await fetchApi(`/posts/otp-user-update`, {
                headers: getTenantHeaders({}, tenant),
                method: 'POST',
                body: withTenant({
                    ...form,
                    phone: phoneNumber,
                }, tenant),
            });

            const updatedUser = {...user, ...form};
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setEditMode(false);
            alert('Profile updated successfully!');
        } catch (error) {
            alert('An unexpected error occurred. Please check your connection and try again.');
            console.error('Failed to save changes:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleRoute = (route) => {
        router.push(buildTenantPath(route, tenant));
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("userLocation");
        localStorage.removeItem("cart");
        localStorage.removeItem('customer_email');
        localStorage.removeItem("savedAddress");
        dispatch(resetCart({}));
        router.push(buildTenantPath("/", tenant));
    };

    const statCards = useMemo(() => ([
        {label: "Orders", value: orderCount === null ? "..." : orderCount, helper: "Placed from this storefront"},
        {label: "Wallet", value: walletCount === null ? "..." : formatCurrency(walletCount), helper: "Available balance"},
        {label: "Addresses", value: addresses.length, helper: "Saved delivery spots"},
        {label: "Alerts", value: notificationCount, helper: "Unread notifications"},
    ]), [orderCount, walletCount, addresses.length, notificationCount]);

    const ActionCard = ({item, trailing}) => {
        const Icon = item.icon;
        return (
            <button
                onClick={() => handleRoute(item.route)}
                className="flex w-full items-center justify-between rounded-[28px] border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
                <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-gray-100 p-3">
                        <Icon className="h-6 w-6 text-gray-700"/>
                    </div>
                    <div>
                        <p className="text-base font-semibold text-gray-900">{item.label}</p>
                        <p className="mt-1 text-sm leading-6 text-gray-500">{item.description}</p>
                    </div>
                </div>
                <div className="text-right">
                    {trailing ? <p className="text-sm font-semibold text-gray-900">{trailing}</p> : null}
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">Open</p>
                </div>
            </button>
        );
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff8f3_0%,#ffffff_40%,#f8fafc_100%)] px-4 pb-16 pt-24 sm:px-6">
            <div className="mx-auto max-w-6xl space-y-8">
                <section className="overflow-hidden rounded-[34px] border border-gray-200 bg-white shadow-sm">
                    <div className="bg-[linear-gradient(135deg,#111827_0%,#1f2937_52%,#7c2d12_100%)] px-6 py-8 text-white sm:px-8">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em]">
                            <UserCircleIcon className="h-4 w-4"/>
                            Account hub
                        </div>
                        <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{user?.name || "Shopper account"}</h1>
                                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">
                                    Manage profile details, saved delivery info, orders, and support for {storeName}.
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setForm(user);
                                    setEditMode((prev) => !prev);
                                }}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                            >
                                <PencilSquareIcon className="h-5 w-5"/>
                                {editMode ? "Close editor" : "Edit profile"}
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-6 px-6 py-8 sm:px-8 lg:grid-cols-[1fr_360px]">
                        <div className="space-y-6">
                            {editMode ? (
                                <div className="rounded-[30px] border border-gray-200 bg-gray-50 p-5">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-400">Profile editor</p>
                                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name || ''}
                                            onChange={handleChange}
                                            className="rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition focus:border-gray-900"
                                            placeholder="Name"
                                        />
                                        <input
                                            type="text"
                                            name="phone"
                                            value={form.phone || ''}
                                            onChange={handleChange}
                                            className="cursor-not-allowed rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3.5 text-sm text-gray-500"
                                            placeholder="Phone"
                                            disabled
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email || ''}
                                            onChange={handleChange}
                                            className="sm:col-span-2 rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition focus:border-gray-900"
                                            placeholder="Email"
                                        />
                                    </div>
                                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                                        <button
                                            onClick={() => {
                                                setForm(user);
                                                setEditMode(false);
                                            }}
                                            className="rounded-2xl border border-gray-200 px-5 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-white"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={saveChanges}
                                            className="rounded-2xl bg-gray-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-wait disabled:bg-gray-400"
                                            disabled={isSaving}
                                        >
                                            {isSaving ? 'Saving...' : 'Save changes'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-[30px] border border-gray-200 bg-gray-50 p-5">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-400">Profile overview</p>
                                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                                        <p className="text-lg font-semibold text-gray-900">{user?.name || "Guest user"}</p>
                                        <p>{user?.phone || "No phone number"}</p>
                                        <p>{user?.email || user?.customer_main_email || "No email added"}</p>
                                    </div>
                                </div>
                            )}

                            <div className="grid gap-4 sm:grid-cols-2">
                                {quickActions.map((item) => {
                                    let trailing = null;
                                    if (item.label === "Orders") trailing = orderCount === null ? "Loading" : `${orderCount}`;
                                    if (item.label === "Addresses") trailing = `${addresses.length}`;
                                    if (item.label === "Notifications") trailing = `${notificationCount}`;
                                    return <ActionCard key={item.label} item={item} trailing={trailing}/>;
                                })}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {supportActions.map((item) => (
                                    <ActionCard key={item.label} item={item}/>
                                ))}
                            </div>
                        </div>

                        <aside className="space-y-5">
                            <div className="rounded-[30px] border border-gray-200 bg-white p-5 shadow-sm">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-400">Account snapshot</p>
                                <div className="mt-4 grid gap-3">
                                    {statCards.map((item) => (
                                        <div key={item.label} className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                                                <p className="text-lg font-bold text-gray-900">{item.value}</p>
                                            </div>
                                            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-400">{item.helper}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-[30px] border border-red-100 bg-red-50 p-5">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-red-500">Session</p>
                                <p className="mt-3 text-base font-semibold text-gray-900">Leaving this storefront account</p>
                                <p className="mt-2 text-sm leading-6 text-gray-600">
                                    Logging out clears shopper data, cart state, and saved session details for this device.
                                </p>
                                <button
                                    onClick={handleLogout}
                                    className="mt-5 w-full rounded-2xl bg-red-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-red-700"
                                >
                                    Logout
                                </button>
                            </div>
                        </aside>
                    </div>
                </section>

                <p className="text-center text-xs text-gray-400">
                    App Version - 8.51.2 (319) | Bundle - 1.0.33
                </p>
            </div>
        </div>
    );
}
