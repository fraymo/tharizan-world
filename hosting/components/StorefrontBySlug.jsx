"use client";
import {useEffect, useState} from "react";
import ImageSlider from "@/components/slider";
import CategorySection from "@/components/categories";
import FlashSale from "@/components/flashsales";
import {clearConsumerSession, fetchStoreConfigBySlugSafe} from "@/utils/util";
import {useStorefront} from "@/context/StorefrontContext";
import StoreUnavailableScreen from "@/components/StoreUnavailableScreen";

function ModernHubPromo({title = "Modern Hub"}) {
    return (
        <div style={{marginBottom: "3rem"}}>
            <div className="mx-auto max-w-[1400px] px-4 pt-8">
                <div className="rounded-[34px] border border-gray-200 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_48%,#eff6ff_100%)] px-6 py-8 shadow-sm">
                    <div className="inline-flex rounded-full border border-gray-200 bg-white px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-500">
                        {title}
                    </div>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Modern Hub promotional storefront
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-500">
                        Explore our featured product ads, trending collections, and seasonal campaigns or open a seller storefront by visiting its slug.
                    </p>
                </div>
            </div>
            <ImageSlider />
            <CategorySection />
            <FlashSale newArrivals={true} />
            <FlashSale />
            <FlashSale isTopPicks={true} />
        </div>
    );
}

export default function StorefrontBySlug({slug}) {
    const {setTenant, markStoreUnavailable} = useStorefront();
    const [state, setState] = useState({loading: true, notFound: false, store: null});

    useEffect(() => {
        let isMounted = true;

        const loadStorefront = async () => {
            setState({loading: true, notFound: false, store: null});

            try {
                const result = await fetchStoreConfigBySlugSafe(slug);

                if (!result.ok || !result.data) {
                    if (isMounted) {
                        clearConsumerSession();
                        markStoreUnavailable();
                        setState({loading: false, notFound: true, store: null});
                    }
                    return;
                }

                const store = result.data;

                if (isMounted) {
                    setTenant(store);
                    setState({loading: false, notFound: false, store});
                }
            } catch (error) {
                if (isMounted) {
                    clearConsumerSession();
                    markStoreUnavailable();
                    console.warn("storefront-by-slug", error?.message || error);
                    setState({loading: false, notFound: true, store: null});
                }
            }
        };

        if (slug) {
            loadStorefront();
        }

        return () => {
            isMounted = false;
        };
    }, [slug, setTenant, markStoreUnavailable]);

    if (state.loading) {
        return (
            <div className="mx-auto max-w-[1400px] px-4 py-8">
                <div className="rounded-[30px] border border-gray-200 bg-white px-6 py-8 shadow-sm">
                    <div className="h-3 w-32 animate-pulse rounded bg-gray-200"></div>
                    <div className="mt-4 h-10 w-72 animate-pulse rounded bg-gray-200"></div>
                    <div className="mt-3 h-5 w-[32rem] max-w-full animate-pulse rounded bg-gray-200"></div>
                </div>
            </div>
        );
    }

    if (state.notFound) {
        return <StoreUnavailableScreen/>;
    }
    return (
        <div style={{marginBottom: "3rem"}}>
            <ImageSlider />
            <CategorySection />
            <FlashSale newArrivals={true} />
            <FlashSale />
            <FlashSale isTopPicks={true} />
        </div>
    );
}
