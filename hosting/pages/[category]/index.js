"use client";
import React from "react";
import Items from "@/components/items";
import { useRouter } from "next/router";
import useFetch from "@/utils/useFetch";

const ShimmerEffect = () => {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8">
      <div className="rounded-[30px] border border-gray-200 bg-white px-6 py-8 shadow-sm">
        <div className="h-3 w-32 rounded bg-gray-200 animate-pulse"></div>
        <div className="mt-4 h-10 w-72 rounded bg-gray-200 animate-pulse"></div>
        <div className="mt-3 h-5 w-[32rem] max-w-full rounded bg-gray-200 animate-pulse"></div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-[28px] border border-gray-200 bg-white p-3 shadow-sm">
            <div className="h-64 rounded-[22px] bg-gray-200 animate-pulse"></div>
            <div className="mt-4 h-3 w-24 rounded bg-gray-200 animate-pulse"></div>
            <div className="mt-3 h-6 w-3/4 rounded bg-gray-200 animate-pulse"></div>
            <div className="mt-2 h-4 w-full rounded bg-gray-200 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MainCategory = () => {
  const router = useRouter();
  const { category, categoryId } = router.query;

  const { data: products, error, isLoading } = useFetch(
    category ? `/posts/new-arrivals?category=${categoryId}&page=1&limit=20` : null
  );

  if (isLoading) {
    return <ShimmerEffect />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-16 text-center">
        <div className="rounded-[30px] border border-dashed border-gray-300 bg-gray-50 px-6 py-16">
          <p className="text-xl font-semibold text-gray-900">Unable to load this category right now.</p>
          <p className="mt-2 text-sm text-gray-500">Please try again in a moment.</p>
        </div>
      </div>
    );
  }

  return <Items category={category} categoryId={categoryId} products={products?.data || []} />;
};

export default MainCategory;
