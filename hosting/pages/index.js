import Link from "next/link";
import {ArrowRight, BadgePercent, Megaphone, Sparkles, Store} from "lucide-react";

const promoPills = [
    "Seller-powered storefronts",
    "Modern Hub campaigns",
    "Trending drops",
];

const campaignCards = [
    {
        title: "Launch your next bestseller",
        copy: "Featured promo rails, campaign banners, and curated collections designed to move attention fast.",
        tone: "from-amber-100 via-white to-rose-50",
        icon: Megaphone,
    },
    {
        title: "Drive discovery across categories",
        copy: "Push shoppers into trending categories, fresh arrivals, and promotional stories from one storefront landing.",
        tone: "from-sky-100 via-white to-cyan-50",
        icon: Sparkles,
    },
    {
        title: "Bring sellers into one hub",
        copy: "Modern Hub handles the promo layer while each seller storefront stays available on its own slug.",
        tone: "from-emerald-100 via-white to-lime-50",
        icon: Store,
    },
];

export default function Home() {
    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_42%,#eff6ff_100%)] pb-12">
            <section className="px-4 pt-10">
                <div className="mx-auto max-w-[1400px] overflow-hidden rounded-[36px] border border-gray-200 bg-[radial-gradient(circle_at_top_left,_rgba(254,215,170,0.45),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(191,219,254,0.45),_transparent_24%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] shadow-sm">
                    <div className="grid gap-8 px-6 py-10 md:grid-cols-[1.15fr_0.85fr] md:px-10 md:py-12">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.32em] text-gray-500">
                                <BadgePercent className="h-3.5 w-3.5" />
                                Modern Hub Promotions
                            </div>
                            <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                                A consumer landing page built to feel like an active promo and product ad hub.
                            </h1>
                            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
                                This root page is your Modern Hub campaign surface. It should sell the platform, highlight products, and guide shoppers into featured collections before they enter any seller-specific storefront.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-2">
                                {promoPills.map((pill) => (
                                    <span
                                        key={pill}
                                        className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-gray-600 shadow-sm"
                                    >
                                        {pill}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    href="/search"
                                    className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
                                >
                                    Explore promoted products
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    href="/about-us"
                                    className="inline-flex items-center gap-2 rounded-2xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 transition hover:border-gray-900 hover:text-black"
                                >
                                    Learn about Modern Hub
                                </Link>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
                            <div className="rounded-[28px] border border-white/80 bg-white/80 p-6 shadow-sm backdrop-blur">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">Promo focus</p>
                                <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">Root traffic lands here first</p>
                                <p className="mt-3 text-sm leading-7 text-gray-500">
                                    Use this page for campaign storytelling, strong product ads, and platform-led merchandising.
                                </p>
                            </div>
                            <div className="rounded-[28px] border border-gray-900 bg-gray-900 p-6 text-white shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Slug routing</p>
                                <p className="mt-3 text-3xl font-bold tracking-tight">Seller storefronts stay isolated</p>
                                <p className="mt-3 text-sm leading-7 text-white/75">
                                    When the URL contains a seller slug, the app shifts into that seller&apos;s storefront and keeps the consumer shopping experience intact.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-4 pt-6">
                <div className="mx-auto grid max-w-[1400px] gap-5 lg:grid-cols-3">
                    {campaignCards.map(({title, copy, tone, icon: Icon}) => (
                        <div
                            key={title}
                            className={`rounded-[30px] border border-gray-200 bg-gradient-to-br ${tone} p-6 shadow-sm`}
                        >
                            <div className="inline-flex rounded-2xl border border-gray-200 bg-white p-3 text-gray-900 shadow-sm">
                                <Icon className="h-5 w-5" />
                            </div>
                            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-gray-900">{title}</h2>
                            <p className="mt-3 text-sm leading-7 text-gray-600">{copy}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
