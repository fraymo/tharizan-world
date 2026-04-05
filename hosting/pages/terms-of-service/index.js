"use client";
import React from "react";
import {useStorefront} from "@/context/StorefrontContext";

const sections = [
    {
        title: "Use of the Website",
        points: [
            "You must be legally eligible to use the storefront and place orders.",
            "You are responsible for maintaining accurate account, contact, and delivery details.",
            "You may not misuse the site, attempt fraud, or interfere with other shoppers."
        ]
    },
    {
        title: "Products and Orders",
        points: [
            "Product details and images are presented as accurately as possible, but display differences may occur across devices.",
            "Prices, availability, and offers may change without prior notice.",
            "The storefront may refuse or cancel orders due to stock issues, pricing errors, or suspected fraud."
        ]
    },
    {
        title: "Payments and Fulfillment",
        points: [
            "Payments are processed through approved payment partners.",
            "Order confirmation does not guarantee dispatch until payment and verification are completed.",
            "Delivery timelines can vary based on logistics, location, and operational factors."
        ]
    },
    {
        title: "Account Responsibility",
        points: [
            "You are responsible for activity performed under your account session.",
            "Keep your contact information and saved addresses accurate for order updates and delivery."
        ]
    },
    {
        title: "Changes and Contact",
        points: [
            "These terms may be updated when the storefront, policies, or legal obligations change.",
            "Questions about the terms can be directed to the support contacts listed on the Contact Us page."
        ]
    }
];

export default function TermsOfService() {
    const {tenant} = useStorefront();
    const storeName = tenant?.storeName || tenant?.sellerName || "This storefront";

    return (
        <section className="min-h-screen bg-[radial-gradient(circle_at_top,#fff8f3_0%,#ffffff_42%,#f8fafc_100%)] px-4 pb-16 pt-24 sm:px-6">
            <div className="mx-auto max-w-5xl overflow-hidden rounded-[34px] border border-gray-200 bg-white shadow-sm">
                <div className="bg-[linear-gradient(135deg,#111827_0%,#1f2937_52%,#7c2d12_100%)] px-6 py-8 text-white sm:px-8">
                    <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em]">
                        Terms of service
                    </div>
                    <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">{storeName} Terms of Service</h1>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">
                        The core rules and expectations that apply when you browse, buy, and use this storefront.
                    </p>
                </div>

                <div className="space-y-6 px-6 py-8 sm:px-8">
                    <div className="rounded-[28px] border border-gray-200 bg-gray-50 p-5 text-sm leading-7 text-gray-600">
                        By accessing or using this storefront, you agree to these terms and the related privacy and policy pages.
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
