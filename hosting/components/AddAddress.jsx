"use client";

import {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/router";
import {ArrowRight, CheckCircle2, Mail, MapPin, Phone, Plus, ShieldCheck, Trash2, User} from "lucide-react";
import {FaBriefcase, FaEllipsisH, FaHome} from "react-icons/fa";
import {buildTenantPath, fetchApi, getStoredTenant, getTenantHeaders, withTenant} from "@/utils/util";

const addressTags = ["Home", "Work", "Other"];

const tagIconMap = {
    Home: <FaHome className="text-sky-500"/>,
    Work: <FaBriefcase className="text-emerald-500"/>,
    Other: <FaEllipsisH className="text-amber-500"/>
};

const emptyForm = {
    name: "",
    address: "",
    pincode: "",
    email: "",
    mobile: "",
    secondaryMobile: "",
    tag: "Home"
};

const readUser = () => {
    if (typeof window === "undefined") {
        return null;
    }

    try {
        const value = localStorage.getItem("user");
        return value ? JSON.parse(value) : null;
    } catch (_error) {
        return null;
    }
};

export default function AddressSelection() {
    const router = useRouter();
    const [tenant] = useState(() => getStoredTenant());
    const [isModalOpen, setModalOpen] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [form, setForm] = useState(emptyForm);

    const selectedAddress = selectedAddressId !== null ? savedAddresses[selectedAddressId] : null;
    const storeName = tenant?.storeName || tenant?.sellerName || "your storefront";

    const progressMessage = useMemo(() => {
        if (savedAddresses.length === 0) {
            return "Add the first delivery address for this storefront.";
        }

        if (selectedAddress) {
            return "Address selected. You can head back to checkout any time.";
        }

        return "Choose a saved address or add a fresh one for this order.";
    }, [savedAddresses.length, selectedAddress]);

    useEffect(() => {
        const selectedAddressValue = localStorage.getItem("savedAddress");
        if (!selectedAddressValue) {
            return;
        }

        try {
            const parsedAddress = JSON.parse(selectedAddressValue);
            setSelectedAddressId((current) => {
                if (current !== null) {
                    return current;
                }
                const matchIndex = savedAddresses.findIndex((item) => JSON.stringify(item) === JSON.stringify(parsedAddress));
                return matchIndex >= 0 ? matchIndex : null;
            });
        } catch (_error) {
            setSelectedAddressId(null);
        }
    }, [savedAddresses]);

    useEffect(() => {
        const fetchAddresses = async () => {
            setIsFetching(true);
            try {
                const user = readUser();
                if (!user?.phone) {
                    setIsFetching(false);
                    return;
                }

                const response = await fetchApi("/posts/addresses", {
                    method: "POST",
                    headers: getTenantHeaders({}, tenant),
                    body: withTenant({mobile: user.phone}, tenant),
                });

                setSavedAddresses(Array.isArray(response) ? response : []);
            } catch (error) {
                console.error("Failed to fetch addresses:", error);
            } finally {
                setIsFetching(false);
            }
        };

        fetchAddresses();
    }, [tenant?.sellerId, tenant?.sellerEmail]);

    useEffect(() => {
        if (!isModalOpen) {
            return;
        }

        const user = readUser();
        setForm((current) => ({
            ...current,
            mobile: current.mobile || user?.phone || "",
            email: current.email || user?.email || user?.customer_main_email || ""
        }));
    }, [isModalOpen]);

    const updateForm = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value
        }));
    };

    const resetForm = () => {
        setForm(emptyForm);
    };

    const saveAddress = async () => {
        if (!form.name || !form.pincode || !form.address || !form.mobile || !form.email) {
            return;
        }

        setIsSaving(true);

        try {
            const user = readUser();
            if (!user?.phone) {
                alert("Please log in to save an address.");
                await router.push(buildTenantPath("/loginpage", tenant));
                return;
            }

            const newAddress = {
                name: form.name,
                address: form.address,
                pincode: form.pincode,
                email: form.email,
                mobile: form.mobile,
                secondaryMobile: form.secondaryMobile,
                tag: form.tag,
            };
            const addressesSet = [...savedAddresses, newAddress];

            await fetchApi("/posts/otp-user-address-update", {
                method: "POST",
                headers: getTenantHeaders({}, tenant),
                body: withTenant({
                    addresses: addressesSet,
                    phone: user.phone,
                }, tenant),
            });

            setSavedAddresses(addressesSet);
            const newIndex = addressesSet.length - 1;
            setSelectedAddressId(newIndex);
            localStorage.setItem("savedAddress", JSON.stringify(newAddress));
            setModalOpen(false);
            resetForm();
        } catch (error) {
            console.error("Error saving address:", error);
            alert("There was an error saving your address. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const deleteAddress = async (addressIndexToDelete) => {
        const originalAddresses = [...savedAddresses];
        const updatedAddresses = savedAddresses.filter((_, index) => index !== addressIndexToDelete);
        setSavedAddresses(updatedAddresses);

        try {
            const user = readUser();
            if (!user?.phone) {
                alert("Please log in to delete an address.");
                await router.push(buildTenantPath("/loginpage", tenant));
                setSavedAddresses(originalAddresses);
                return;
            }

            await fetchApi("/posts/otp-user-address-update", {
                method: "POST",
                headers: getTenantHeaders({}, tenant),
                body: withTenant({
                    addresses: updatedAddresses,
                    phone: user.phone,
                }, tenant),
            });

            if (selectedAddressId === addressIndexToDelete) {
                setSelectedAddressId(null);
                localStorage.removeItem("savedAddress");
            } else if (selectedAddressId !== null && selectedAddressId > addressIndexToDelete) {
                setSelectedAddressId(selectedAddressId - 1);
            }
        } catch (error) {
            console.error("Error deleting address:", error);
            alert("Failed to delete address. Please try again.");
            setSavedAddresses(originalAddresses);
        }
    };

    const toggleSelectAddress = (addressIndex) => {
        setSelectedAddressId(addressIndex);
        localStorage.setItem("savedAddress", JSON.stringify(savedAddresses[addressIndex]));
    };

    const handleProceed = async () => {
        if (selectedAddressId === null) {
            return;
        }
        await router.push(buildTenantPath("/cart", tenant));
    };

    if (isFetching) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#fff7ed_0%,#ffffff_55%,#f8fafc_100%)] px-4 pt-24">
                <div className="rounded-[28px] border border-gray-200 bg-white px-8 py-6 text-center shadow-sm">
                    <p className="text-lg font-semibold text-gray-900">Loading your addresses...</p>
                    <p className="mt-2 text-sm text-gray-500">Preparing delivery details for {storeName}.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff7ed_0%,#ffffff_48%,#f8fafc_100%)] px-4 pb-16 pt-24 sm:px-6">
            <div className="mx-auto max-w-6xl">
                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <section className="overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-100 bg-[linear-gradient(135deg,#111827_0%,#1f2937_52%,#7c2d12_100%)] px-6 py-7 text-white sm:px-8">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-100">
                                <MapPin className="h-4 w-4"/>
                                Delivery details
                            </div>
                            <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
                                Choose where {storeName} should deliver.
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">
                                Save trusted addresses, keep checkout moving, and make every storefront order feel personal and fast.
                            </p>
                        </div>

                        <div className="px-6 py-6 sm:px-8">
                            <div className="flex flex-col gap-4 rounded-[28px] border border-amber-100 bg-amber-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-700">Address status</p>
                                    <p className="mt-2 text-base font-semibold text-gray-900">{progressMessage}</p>
                                </div>
                                <button
                                    onClick={() => setModalOpen(true)}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
                                >
                                    <Plus className="h-4 w-4"/>
                                    Add New Address
                                </button>
                            </div>

                            <div className="mt-6 space-y-4">
                                {savedAddresses.length === 0 ? (
                                    <div className="rounded-[28px] border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
                                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                                            <MapPin className="h-6 w-6 text-gray-700"/>
                                        </div>
                                        <h2 className="mt-4 text-xl font-semibold text-gray-900">No saved addresses yet</h2>
                                        <p className="mt-2 text-sm leading-6 text-gray-500">
                                            Add a delivery address to continue checkout inside this storefront.
                                        </p>
                                    </div>
                                ) : (
                                    savedAddresses.map((addr, index) => {
                                        const isActive = selectedAddressId === index;

                                        return (
                                            <label
                                                key={`${addr.mobile}-${index}`}
                                                className={`block cursor-pointer overflow-hidden rounded-[28px] border p-5 shadow-sm transition ${
                                                    isActive
                                                        ? "border-gray-900 bg-gray-900 text-white shadow-[0_22px_50px_rgba(17,24,39,0.18)]"
                                                        : "border-gray-200 bg-white hover:border-gray-300"
                                                }`}
                                            >
                                                <div className="flex gap-4">
                                                    <input
                                                        type="radio"
                                                        name="selectedAddress"
                                                        checked={isActive}
                                                        onChange={() => toggleSelectAddress(index)}
                                                        className="mt-1 h-5 w-5 border-gray-300"
                                                    />

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                                            <div>
                                                                <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${
                                                                    isActive ? "bg-white/10 text-white" : "bg-gray-100 text-gray-600"
                                                                }`}>
                                                                    {tagIconMap[addr.tag] || tagIconMap.Other}
                                                                    {addr.tag || "Other"}
                                                                </div>
                                                                <p className={`mt-4 text-lg font-semibold ${isActive ? "text-white" : "text-gray-900"}`}>{addr.name}</p>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() => deleteAddress(index)}
                                                                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition ${
                                                                    isActive
                                                                        ? "border border-white/15 bg-white/10 text-white hover:bg-white/15"
                                                                        : "border border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
                                                                }`}
                                                            >
                                                                <Trash2 className="h-4 w-4"/>
                                                                Remove
                                                            </button>
                                                        </div>

                                                        <div className={`mt-4 grid gap-3 text-sm ${isActive ? "text-slate-200" : "text-gray-600"}`}>
                                                            <p className="flex items-start gap-3">
                                                                <MapPin className="mt-0.5 h-4 w-4 shrink-0"/>
                                                                <span>{addr.address}</span>
                                                            </p>
                                                            {addr.pincode ? (
                                                                <p className="flex items-center gap-3">
                                                                    <ShieldCheck className="h-4 w-4 shrink-0"/>
                                                                    <span>Pincode: {addr.pincode}</span>
                                                                </p>
                                                            ) : null}
                                                            <p className="flex items-center gap-3">
                                                                <Phone className="h-4 w-4 shrink-0"/>
                                                                <span>{addr.mobile}</span>
                                                            </p>
                                                            {addr.secondaryMobile ? (
                                                                <p className="flex items-center gap-3">
                                                                    <Phone className="h-4 w-4 shrink-0"/>
                                                                    <span>Alt: {addr.secondaryMobile}</span>
                                                                </p>
                                                            ) : null}
                                                            {addr.email ? (
                                                                <p className="flex items-center gap-3">
                                                                    <Mail className="h-4 w-4 shrink-0"/>
                                                                    <span>{addr.email}</span>
                                                                </p>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </section>
                    <aside className="space-y-5 lg:pt-8">
                        <div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-400">Checkout handoff</p>
                            <h2 className="mt-3 text-2xl font-semibold text-gray-900">Ready to return to cart</h2>
                            <p className="mt-3 text-sm leading-7 text-gray-500">
                                Once you select a delivery address, checkout in {storeName} can continue without sending the shopper out of the storefront flow.
                            </p>

                            <div className="mt-6 space-y-3 rounded-[24px] border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600"/>
                                    <span>Address is saved to the logged-in customer profile.</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-600"/>
                                    <span>The selected address stays attached to this storefront checkout session.</span>
                                </div>
                            </div>

                            {selectedAddress ? (
                                <div className="mt-6 rounded-[24px] bg-gray-900 p-5 text-white">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-300">Selected address</p>
                                    <p className="mt-3 text-lg font-semibold">{selectedAddress.name}</p>
                                    <p className="mt-2 text-sm leading-6 text-slate-200">{selectedAddress.address}</p>
                                    <p className="mt-3 text-sm text-slate-300">{selectedAddress.mobile}</p>
                                </div>
                            ) : null}

                            <div className="mt-6 space-y-3">
                                <button
                                    onClick={handleProceed}
                                    disabled={selectedAddressId === null}
                                    className={`flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-semibold transition ${
                                        selectedAddressId !== null
                                            ? "bg-gray-900 text-white hover:bg-black"
                                            : "cursor-not-allowed bg-gray-200 text-gray-500"
                                    }`}
                                >
                                    Select & Proceed
                                    {selectedAddressId !== null ? <ArrowRight className="h-4 w-4"/> : null}
                                </button>

                                <button
                                    onClick={() => setModalOpen(true)}
                                    className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                >
                                    Add another address
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {isModalOpen ? (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm"
                    onClick={() => setModalOpen(false)}
                >
                    <div
                        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[32px] border border-white/50 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.25)]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="border-b border-gray-100 px-6 py-6 sm:px-8">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-400">New address</p>
                            <h3 className="mt-3 text-2xl font-semibold text-gray-900">Add delivery details</h3>
                            <p className="mt-2 text-sm leading-7 text-gray-500">
                                Save this address for faster repeat purchases from {storeName}.
                            </p>
                        </div>

                        <div className="px-6 py-6 sm:px-8">
                            <div className="flex flex-wrap gap-3">
                                {addressTags.map((tag) => {
                                    const isActive = form.tag === tag;
                                    return (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => updateForm("tag", tag)}
                                            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                                                isActive
                                                    ? "bg-gray-900 text-white"
                                                    : "border border-gray-200 bg-gray-50 text-gray-700 hover:bg-white"
                                            }`}
                                        >
                                            {tagIconMap[tag]}
                                            {tag}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                <label className="block">
                                    <span className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <User className="h-4 w-4"/>
                                        Name
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Customer name"
                                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:bg-white"
                                        value={form.name}
                                        onChange={(event) => updateForm("name", event.target.value)}
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <Mail className="h-4 w-4"/>
                                        Email
                                    </span>
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:bg-white"
                                        value={form.email}
                                        onChange={(event) => updateForm("email", event.target.value)}
                                    />
                                </label>

                                <label className="block sm:col-span-2">
                                    <span className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <MapPin className="h-4 w-4"/>
                                        Full address
                                    </span>
                                    <textarea
                                        rows={4}
                                        placeholder="House number, street, area, landmark"
                                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:bg-white"
                                        value={form.address}
                                        onChange={(event) => updateForm("address", event.target.value)}
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <ShieldCheck className="h-4 w-4"/>
                                        Pincode
                                    </span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="6-digit pincode"
                                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:bg-white"
                                        value={form.pincode}
                                        onChange={(event) => updateForm("pincode", event.target.value.replace(/\D/g, "").slice(0, 6))}
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <Phone className="h-4 w-4"/>
                                        Mobile number
                                    </span>
                                    <input
                                        type="tel"
                                        placeholder="Primary mobile"
                                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:bg-white"
                                        value={form.mobile}
                                        onChange={(event) => updateForm("mobile", event.target.value.replace(/\D/g, "").slice(0, 10))}
                                    />
                                </label>

                                <label className="block sm:col-span-2">
                                    <span className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <Phone className="h-4 w-4"/>
                                        Secondary mobile
                                    </span>
                                    <input
                                        type="tel"
                                        placeholder="Optional alternate number"
                                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:bg-white"
                                        value={form.secondaryMobile}
                                        onChange={(event) => updateForm("secondaryMobile", event.target.value.replace(/\D/g, "").slice(0, 10))}
                                    />
                                </label>
                            </div>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setModalOpen(false);
                                        resetForm();
                                    }}
                                    className="rounded-2xl border border-gray-200 px-5 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={saveAddress}
                                    disabled={!form.name || !form.address || !form.pincode || !form.email || !form.mobile || isSaving}
                                    className={`rounded-2xl px-5 py-3.5 text-sm font-semibold transition ${
                                        !form.name || !form.address || !form.pincode || !form.email || !form.mobile || isSaving
                                            ? "cursor-not-allowed bg-gray-200 text-gray-500"
                                            : "bg-gray-900 text-white hover:bg-black"
                                    }`}
                                >
                                    {isSaving ? "Saving..." : "Save Address"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
