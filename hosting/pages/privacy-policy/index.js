"use client";
import React from "react";
import {useStorefront} from "@/context/StorefrontContext";

const sections = [
    {
        title: "Information We Collect",
        points: [
            "Details you provide during checkout or account use, such as name, phone number, email, and delivery addresses.",
            "Order, payment, and support-related information needed to fulfill purchases and manage storefront activity.",
            "Technical information such as device, browser, and interaction data for security and performance."
        ]
    },
    {
        title: "How We Use Information",
        points: [
            "To process orders, update deliveries, and provide customer support.",
            "To improve storefront performance, reliability, and the overall shopping experience.",
            "To send notifications related to purchases, offers, or important account activity when applicable."
        ]
    },
    {
        title: "How Information May Be Shared",
        points: [
            "With payment and logistics providers only as needed to complete orders and delivery.",
            "With service providers that help operate the storefront securely and efficiently.",
            "When required by law or to protect against fraud, abuse, or misuse."
        ]
    },
    {
        title: "Security and Retention",
        points: [
            "Reasonable safeguards are used to protect personal information, though no system is fully risk-free.",
            "Information may be retained as long as needed for orders, compliance, dispute handling, or support."
        ]
    },
    {
        title: "Your Choices",
        points: [
            "You can update saved profile information and addresses from your account pages.",
            "You may contact the storefront if you need help reviewing or deleting eligible account information."
        ]
    }
];

export default function PrivacyPolicy() {
    const {tenant} = useStorefront();
    const storeName = tenant?.storeName || tenant?.sellerName || "This storefront";

    return (
        <section className="min-h-screen bg-[radial-gradient(circle_at_top,#fff8f3_0%,#ffffff_42%,#f8fafc_100%)] px-4 pb-16 pt-24 sm:px-6">
            <div className="mx-auto max-w-5xl overflow-hidden rounded-[34px] border border-gray-200 bg-white shadow-sm">
                <div className="bg-[linear-gradient(135deg,#111827_0%,#1f2937_52%,#7c2d12_100%)] px-6 py-8 text-white sm:px-8">
                    <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em]">
                        Privacy policy
                    </div>
                    <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">{storeName} Privacy Policy</h1>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">
                        A high-level overview of how storefront account, order, and device information is handled.
                    </p>
                </div>

                <div className="space-y-6 px-6 py-8 sm:px-8">
                    <div className="rounded-[28px] border border-gray-200 bg-gray-50 p-5 text-sm leading-7 text-gray-600">
                        This policy explains how information is collected, used, and protected when you interact with this storefront.
                    </div>

                    {sections.map((section) => (
                        <div key={section.title} className="rounded-[28px] border border-gray-200 bg-white p-6">
                            <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
                            <div className="mt-4 space-y-3 text-sm leading-7 text-gray-600">
                                {section.points.map((point) => (
                                    <p key={point}>{point}</p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
