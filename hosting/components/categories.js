"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Sparkles, TrendingUp } from "lucide-react";
import useFetch from "@/utils/useFetch";

const TRENDING_TAGS = ["Trending Edit", "Top Rated", "Fresh Picks", "Staff Pick"];

export default function CategorySection() {
  const router = useRouter();
  const { data: categories, error, isLoading } = useFetch("/getAllCategory");

  const handleClick = (name, id) => {
    router.push(`/${name}?categoryId=${id}`);
  };

  const renderLoading = () => (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="hidden overflow-hidden rounded-[28px] border border-gray-200 bg-white p-3 shadow-sm xl:block"
          >
            <div className="h-64 rounded-[22px] bg-gray-200 animate-pulse"></div>
            <div className="mt-4 h-3 w-24 rounded bg-gray-200 animate-pulse"></div>
            <div className="mt-3 h-6 w-3/4 rounded bg-gray-200 animate-pulse"></div>
            <div className="mt-2 h-4 w-full rounded bg-gray-200 animate-pulse"></div>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto hide-scrollbar xl:hidden">
        <div className="flex min-w-max gap-4 pb-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="w-[250px] overflow-hidden rounded-[28px] border border-gray-200 bg-white p-3 shadow-sm"
            >
              <div className="h-64 rounded-[22px] bg-gray-200 animate-pulse"></div>
              <div className="mt-4 h-3 w-24 rounded bg-gray-200 animate-pulse"></div>
              <div className="mt-3 h-6 w-3/4 rounded bg-gray-200 animate-pulse"></div>
              <div className="mt-2 h-4 w-full rounded bg-gray-200 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderEmpty = () => (
    <div className="rounded-[28px] border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
      <p className="text-gray-500">No categories found.</p>
    </div>
  );

  const renderCategoryCard = (cat, index, desktop = false) => (
    <button
      key={cat._id}
      onClick={() => handleClick(cat.name, cat._id)}
      className={`group overflow-hidden rounded-[30px] border border-gray-200 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)] ${
        desktop ? "w-full" : "w-[250px]"
      }`}
    >
      <div className="relative h-72 overflow-hidden rounded-b-none">
        <Image
          src={cat.categoryImages?.[0]?.Location || "/fallback.png"}
          alt={cat.name}
          width={320}
          height={420}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-700 backdrop-blur">
            <TrendingUp className="h-3.5 w-3.5" />
            {TRENDING_TAGS[index % TRENDING_TAGS.length]}
          </span>
          <span className="rounded-full bg-black/60 p-2 text-white backdrop-blur">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Shop Category
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
            Home Trend
          </span>
          <span className="text-[11px] font-medium text-gray-400">Featured category</span>
        </div>

        <div>
          <h3 className="text-lg font-semibold tracking-tight text-gray-900">{cat.name}</h3>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Browse featured products, popular picks, and everyday essentials in this category.
          </p>
        </div>
      </div>
    </button>
  );

  const renderCategories = () => (
    <>
      <div className="hidden gap-5 xl:grid xl:grid-cols-5">
        {categories.slice(0, 5).map((cat, index) => renderCategoryCard(cat, index, true))}
      </div>

      <div className="overflow-x-auto hide-scrollbar xl:hidden">
        <div className="flex min-w-max gap-5 pb-2">
          {categories.map((cat, index) => renderCategoryCard(cat, index, false))}
        </div>
      </div>
    </>
  );

  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-6 rounded-[30px] border border-gray-200 bg-gradient-to-b from-white to-gray-50 px-6 py-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-500">
                Trending Categories
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Shop the categories customers browse most
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                A modern ecommerce category section built for fast browsing across desktop and mobile.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {TRENDING_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {isLoading || error ? renderLoading() : !categories?.length ? renderEmpty() : renderCategories()}
      </div>
    </section>
  );
}
