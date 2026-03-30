"use client";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play, Sparkles } from "lucide-react";
import { useRouter } from "next/router";
import useFetch from "@/utils/useFetch";

const FALLBACK_SLIDES = [];

export default function ImageSlider() {
  const router = useRouter();
  const [slides, setSlides] = useState(FALLBACK_SLIDES);
  const [isPlaying, setIsPlaying] = useState(true);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  const { data, error, isLoading } = useFetch("/get-banner");

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setSlides(
        data.map(({ _id, name, bannerImages }, index) => ({
          id: _id || index,
          imgSrc: bannerImages?.[0]?.Location || "/fallback.png",
          alt: name || `Banner ${index + 1}`,
          eyebrow: index % 2 === 0 ? "New Season" : "Trending Now",
          title: name || "Modern ecommerce banner",
          description: "Discover featured collections, fresh arrivals, and fast-moving products in a cleaner storefront hero.",
          href: "/search",
        }))
      );
    }
  }, [data]);

  const handlePlayPause = () => {
    if (!swiperRef.current) return;

    if (isPlaying) {
      swiperRef.current.autoplay.stop();
    } else {
      swiperRef.current.autoplay.start();
    }
    setIsPlaying(!isPlaying);
  };

  if (isLoading || error) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 pt-8">
        <div className="overflow-hidden rounded-[34px] border border-gray-200 bg-white p-4 shadow-sm">
          <div className="h-[320px] rounded-[28px] bg-gray-200 animate-pulse sm:h-[420px] lg:h-[520px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 pt-8">
      <div className="mb-5 flex flex-col gap-4 rounded-[30px] border border-gray-200 bg-gradient-to-b from-white to-gray-50 px-6 py-6 shadow-sm md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-500">
            Featured Banner
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            A modern ecommerce hero built for featured campaigns
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Large visuals, clear calls to action, and a cleaner layout for storefront storytelling on desktop and mobile.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {["Featured", "New Arrivals", "Best Sellers"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[34px] border border-gray-200 bg-white p-4 shadow-sm">
        <Swiper
          modules={[Navigation, Autoplay, Pagination]}
          spaceBetween={12}
          slidesPerView={1}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          pagination={{
            clickable: true,
            el: ".modern-hero-pagination",
            bulletClass:
              "swiper-pagination-bullet !mx-1 !h-2.5 !w-2.5 !bg-white/60 !opacity-100",
            bulletActiveClass:
              "swiper-pagination-bullet-active !bg-white",
          }}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          loop={true}
          className="rounded-[28px]"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative overflow-hidden rounded-[28px]">
                <Image
                  src={slide.imgSrc}
                  alt={slide.alt}
                  width={1600}
                  height={900}
                  priority
                  unoptimized
                  className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[520px]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />

                <div className="absolute inset-0 flex items-end p-6 sm:p-8 lg:p-12">
                  <div className="max-w-2xl text-white">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] backdrop-blur">
                      <Sparkles className="h-3.5 w-3.5" />
                      {slide.eyebrow}
                    </div>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                      {slide.title}
                    </h1>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-white/85 sm:text-base">
                      {slide.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push(slide.href || "/search");
                        }}
                        className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
                      >
                        Shop Now
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push(slide.href || "/search");
                        }}
                        className="rounded-2xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                      >
                        View Collection
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="pointer-events-none absolute bottom-6 right-6 z-20 flex items-center gap-2 sm:right-8">
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              ref={prevRef}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-800 shadow-lg transition hover:bg-gray-100"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handlePlayPause}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-800 shadow-lg transition hover:bg-gray-100"
              aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button
              ref={nextRef}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-800 shadow-lg transition hover:bg-gray-100"
              aria-label="Next slide"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="modern-hero-pagination pointer-events-auto hidden min-w-[72px] px-1 py-1 text-center sm:block" />
        </div>
      </div>
    </div>
  );
}
