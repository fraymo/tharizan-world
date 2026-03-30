"use client";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import CategorySection from "@/components/categories";
import SearchDetails from "@/components/SearchDetails";

const Search = () => {
    const router = useRouter();
    const [query, setQuery] = useState("");

    // Update query whenever URL changes
    useEffect(() => {
        if (router.isReady) {
            const q = typeof router.query.query === "string" ? router.query.query : "";
            setQuery(q);
        }
    }, [router.isReady, router.query.query]);

    return (
        // Apply pt-12 only for mobile (below md), and no padding for md and above
        <div className="pt-20 md:pt-12">
            {query.trim() === "" ? <CategorySection/> : <SearchDetails query={query}/>}
        </div>
    );
};

export default Search;
