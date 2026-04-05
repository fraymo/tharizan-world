'use client';

import React from 'react';
import {Mail, PhoneCall} from "lucide-react";
import {useStorefront} from "@/context/StorefrontContext";

export default function ContactPage() {
    const {tenant} = useStorefront();
    const storeName = tenant?.storeName || tenant?.sellerName || "our storefront";

    const handleCall = () => {
        window.location.href = 'tel:9043643573';
    };

    const handleMail = () => {
        window.location.href = 'mailto:natherfaahim26@gmail.com';
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff8f3_0%,#ffffff_42%,#f8fafc_100%)] px-4 pb-16 pt-24 sm:px-6">
            <div className="mx-auto max-w-4xl">
                <div className="overflow-hidden rounded-[34px] border border-gray-200 bg-white shadow-sm">
                    <div className="bg-[linear-gradient(135deg,#111827_0%,#1f2937_52%,#7c2d12_100%)] px-6 py-8 text-white sm:px-8">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em]">
                            <PhoneCall className="h-4 w-4"/>
                            Contact us
                        </div>
                        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Need help from {storeName}?</h1>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">
                            Reach out for order help, product questions, or support with your storefront shopping experience.
                        </p>
                    </div>

                    <div className="grid gap-5 px-6 py-8 sm:px-8 md:grid-cols-2">
                        <button
                            onClick={handleCall}
                            className="rounded-[30px] border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div className="rounded-2xl bg-gray-100 p-3 w-fit">
                                <PhoneCall className="h-6 w-6 text-gray-700"/>
                            </div>
                            <h2 className="mt-5 text-xl font-semibold text-gray-900">Call support</h2>
                            <p className="mt-2 text-sm leading-6 text-gray-500">Speak directly with the support team for urgent help.</p>
                            <p className="mt-4 text-sm font-semibold text-gray-900">9043643573</p>
                        </button>

                        <button
                            onClick={handleMail}
                            className="rounded-[30px] border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div className="rounded-2xl bg-gray-100 p-3 w-fit">
                                <Mail className="h-6 w-6 text-gray-700"/>
                            </div>
                            <h2 className="mt-5 text-xl font-semibold text-gray-900">Email support</h2>
                            <p className="mt-2 text-sm leading-6 text-gray-500">Share screenshots, order IDs, or detailed queries anytime.</p>
                            <p className="mt-4 text-sm font-semibold text-gray-900">natherfaahim26@gmail.com</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
