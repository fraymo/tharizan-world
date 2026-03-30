"use client";

import React from "react";
import Link from "next/link";

const defaultSuggestions = [
    { title: "Necklaces", href: "/category/necklaces" },
    { title: "Earrings", href: "/category/earrings" },
    { title: "Rings", href: "/category/rings" },
];

export default function NoProductsFound({
                                            title = "No products found",
                                            description = "We couldn't find any products that match your search. Try adjusting your filters or check out these popular categories.",
                                            ctaText = "Back to shop",
                                            ctaHref = "/",
                                            suggestions,
                                            onClear,
                                            showSuggestion,
                                            isNeedCleanFilter
                                        }) {
    const items = Array.isArray(suggestions) && suggestions.length > 0 ? suggestions : defaultSuggestions;

    const handleClear = () => {
        if (typeof onClear === "function") {
            onClear();
            return;
        }

        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            try {
                const url = new URL(window.location.href);
                if (url.search) {
                    url.search = "";
                    window.history.replaceState({}, document.title, url.toString());
                }
            } catch (e) {
                // ignore malformed URLs
            }
        }
    };

    return (
        <section aria-labelledby="no-products-title" className="min-h-[60vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-3xl w-full text-center">
        <div className="rounded-2xl bg-white backdrop-blur-md shadow-lg p-8 sm:p-12 border border-gray-200">
                    {/* Illustration */}
                    <div className="mx-auto w-40 h-40 flex items-center justify-center rounded-full bg-gradient-to-tr from-pink-50 to-amber-50 dark:from-slate-700 dark:to-slate-600 mb-6">
                        <svg className="w-20 h-20 text-amber-500 dark:text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M3 6h18M5 6v13a1 1 0 001 1h12a1 1 0 001-1V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9 10l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    <h2 id="no-products-title" className="text-2xl sm:text-3xl font-semibold text-slate-900  mb-3">{title}</h2>

                    <p className="text-slate-600  mb-6">{description}</p>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 mb-6">
                        <Link href={ctaHref} className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400">
                            {ctaText}
                        </Link>
                        {isNeedCleanFilter &&
                        <button type="button" onClick={handleClear} className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm shadow-sm">
                            Clear filters
                        </button>}
                    </div>

                    {showSuggestion &&
                    <div className="text-left mt-4">
                        <p className="text-sm font-medium mb-3 text-black">Try these popular categories</p>

                        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {items.map((s) => (
                                <li key={s.href || s.title}>
                                    <Link href={s.href} className="block w-full text-left p-3 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60" aria-label={`Go to ${s.title}`}>
                                        <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{s.title}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>}
                    {isNeedCleanFilter &&
                    <div className="mt-6 text-xs text-slate-500 dark:text-slate-400">Tip: broaden your search, remove filters or check back later — new items arrive frequently.</div>}
                </div>

                <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">Still need help? <Link href="/support" className="underline">Contact support</Link></div>
            </div>
        </section>
    );
}
