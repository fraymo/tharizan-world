'use client';
import React, {useEffect, useState} from 'react';
import {Bell, CheckCircle2, Megaphone, ShieldAlert} from "lucide-react";
import {fetchApi, getCustomerEmail, getTenantHeaders, withTenant} from "@/utils/util";
import {useStorefront} from "@/context/StorefrontContext";

export default function NotificationsPage() {
    const {tenant, loading: storefrontLoading} = useStorefront();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getNotification = async () => {
        try {
            const notification = await fetchApi('/notification/get', {
                headers: getTenantHeaders({}, tenant),
                method: 'POST',
                body: withTenant({customer_email: getCustomerEmail()}, tenant)
            });
            setNotifications(notification.notification || []);
        } catch (_error) {
            setError("Unable to get notifications right now.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (storefrontLoading || !tenant?.sellerEmail) {
            return;
        }
        setLoading(true);
        getNotification();
    }, [storefrontLoading, tenant?.sellerEmail, tenant?.sellerId]);

    const updateNotificationStatus = async (notification) => {
        if (!notification.read) {
            await fetchApi("/notification/update", {
                headers: getTenantHeaders({}, tenant),
                method: 'PUT',
                body: withTenant({
                    _id: notification._id,
                    customer_email: getCustomerEmail()
                }, tenant)
            });
            setNotifications((prevNotifications) => {
                const newNotificationIndex = prevNotifications.findIndex((value) => value._id === notification._id);
                const newNotifications = [...prevNotifications];
                if (newNotificationIndex > -1) {
                    newNotifications[newNotificationIndex].read = true;
                }
                return newNotifications;
            });
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff8f3_0%,#ffffff_42%,#f8fafc_100%)] px-4 pb-16 pt-24 sm:px-6">
            <div className="mx-auto max-w-5xl">
                <div className="overflow-hidden rounded-[34px] border border-gray-200 bg-white shadow-sm">
                    <div className="bg-[linear-gradient(135deg,#111827_0%,#1f2937_52%,#7c2d12_100%)] px-6 py-8 text-white sm:px-8">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em]">
                            <Bell className="h-4 w-4"/>
                            Notifications
                        </div>
                        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Updates from {tenant?.storeName || tenant?.sellerName || "your storefront"}</h1>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">
                            Review the latest storefront alerts, order updates, and announcements in one place.
                        </p>
                    </div>

                    <div className="px-6 py-8 sm:px-8">
                        {loading ? (
                            <div className="rounded-[30px] border border-gray-200 bg-gray-50 px-6 py-14 text-center">
                                <p className="text-lg font-semibold text-gray-900">Loading notifications...</p>
                            </div>
                        ) : error ? (
                            <div className="rounded-[30px] border border-rose-100 bg-rose-50 px-6 py-14 text-center">
                                <ShieldAlert className="mx-auto h-12 w-12 text-rose-500"/>
                                <p className="mt-4 text-lg font-semibold text-rose-700">{error}</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="rounded-[30px] border border-dashed border-gray-300 bg-gray-50 px-6 py-14 text-center">
                                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500"/>
                                <h2 className="mt-4 text-xl font-semibold text-gray-900">All caught up</h2>
                                <p className="mt-2 text-sm leading-6 text-gray-500">You have no new notifications right now.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {notifications.map((notification) => (
                                    <button
                                        onClick={() => updateNotificationStatus(notification)}
                                        key={notification._id}
                                        className={`flex w-full items-start gap-4 rounded-[28px] border p-5 text-left shadow-sm transition ${
                                            notification.read
                                                ? 'border-gray-200 bg-gray-50'
                                                : 'border-amber-100 bg-white hover:shadow-md'
                                        }`}
                                    >
                                        <div className={`rounded-2xl p-3 ${notification.read ? "bg-gray-200" : "bg-amber-50"}`}>
                                            <Megaphone className={`h-5 w-5 ${notification.read ? "text-gray-500" : "text-amber-500"}`}/>
                                        </div>
                                        <div className="flex-1">
                                            {!notification.read ? (
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-600">New update</p>
                                            ) : null}
                                            <p className={`mt-2 text-sm leading-7 ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                                                {notification.message}
                                            </p>
                                            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-gray-400">{notification.addedAt}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
