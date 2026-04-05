'use client';
import React from 'react';
import {useRouter} from "next/router";
import {Mail, MapPin, Phone, Plus} from "lucide-react";
import {fetchApi, getTenantHeaders, withTenant, buildTenantPath} from "@/utils/util";
import {FaBriefcase, FaEllipsisH, FaHome} from "react-icons/fa";
import {useStorefront} from "@/context/StorefrontContext";

const AddressesPage = () => {
    const router = useRouter();
    const {tenant, loading: storefrontLoading} = useStorefront();
    const [addresses, setAddresses] = React.useState([]);

    React.useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const userString = localStorage.getItem("user");
                if (!userString || !tenant?.sellerEmail) return;
                const user = JSON.parse(userString);

                const response = await fetchApi(`/posts/addresses`, {
                    method: "POST",
                    headers: getTenantHeaders({}, tenant),
                    body: withTenant({mobile: user.phone}, tenant),
                });

                setAddresses(response || []);
            } catch (error) {
                console.error("Failed to fetch addresses:", error);
            }
        };

        if (!storefrontLoading) {
            fetchAddresses();
        }
    }, [storefrontLoading, tenant?.sellerEmail, tenant?.sellerId]);

    const handleAddAddress = () => {
        router.push(buildTenantPath('/add-address', tenant));
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff8f3_0%,#ffffff_42%,#f8fafc_100%)] px-4 pb-16 pt-24 sm:px-6">
            <div className="mx-auto max-w-5xl">
                <div className="overflow-hidden rounded-[34px] border border-gray-200 bg-white shadow-sm">
                    <div className="bg-[linear-gradient(135deg,#111827_0%,#1f2937_52%,#7c2d12_100%)] px-6 py-8 text-white sm:px-8">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em]">
                            <MapPin className="h-4 w-4"/>
                            Saved addresses
                        </div>
                        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Delivery addresses for {tenant?.storeName || tenant?.sellerName || "your storefront"}</h1>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">
                            Review your saved delivery locations and keep checkout moving faster.
                        </p>
                    </div>

                    <div className="px-6 py-8 sm:px-8">
                        {addresses.length === 0 ? (
                            <div className="rounded-[30px] border border-dashed border-gray-300 bg-gray-50 px-6 py-14 text-center">
                                <h2 className="text-xl font-semibold text-gray-900">No saved addresses yet</h2>
                                <p className="mt-2 text-sm leading-6 text-gray-500">Add your first address to make storefront checkout faster.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {addresses.map((addr, index) => (
                                    <div key={index} className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
                                        <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-gray-600">
                                            {addr.tag === "Home" ? <FaHome className="text-blue-500"/> : addr.tag === "Work" ? <FaBriefcase className="text-green-500"/> : <FaEllipsisH className="text-gray-500"/>}
                                            {addr.tag}
                                        </div>
                                        <p className="mt-4 text-lg font-semibold text-gray-900">{addr.name}</p>
                                        <div className="mt-3 space-y-2 text-sm text-gray-600">
                                            <p className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0"/><span>{addr.address}</span></p>
                                            {addr.pincode ? <p>Pincode: {addr.pincode}</p> : null}
                                            <p className="flex items-center gap-3"><Phone className="h-4 w-4 shrink-0"/><span>{addr.mobile}</span></p>
                                            {addr.secondaryMobile ? <p className="flex items-center gap-3"><Phone className="h-4 w-4 shrink-0"/><span>Alt: {addr.secondaryMobile}</span></p> : null}
                                            {addr.email ? <p className="flex items-center gap-3"><Mail className="h-4 w-4 shrink-0"/><span>{addr.email}</span></p> : null}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-8">
                            <button
                                onClick={handleAddAddress}
                                className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-black"
                            >
                                <Plus className="h-4 w-4"/>
                                Add new address
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddressesPage;
