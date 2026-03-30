"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Grid } from "swiper/modules";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/autoplay";
import useFetch from "@/utils/useFetch";

// Data for the customer and bride image galleries

const GallerySlider = ({ title, images }) => {
  return (
    <section className="w-full px-4 py-10">
      <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>
      <Swiper
        modules={[Autoplay, Grid]}
        grid={{
          rows: 1,
          fill: "row",
        }}
        spaceBetween={10}
        slidesPerView={5}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        loop={true}
        breakpoints={{
          320: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
        }}
      >
        {images.map((src, i) => (
          <SwiperSlide key={i}>
            <div className="w-full h-80 overflow-hidden rounded-lg">
              <img
                src={src}
                alt={`Slide ${i}`}
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default function Home() {
  const {data, error, isLoading} = useFetch('/get-customer-review/all')


  return null;
}
