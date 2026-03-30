"use client";
import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {Swiper, SwiperSlide} from "swiper/react";
import {useRouter} from "next/navigation";
import {Navigation} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {fetchApi} from "@/utils/util";

export default function SwiperPage() {
    const router = useRouter();
    const swiperRef = useRef(null);

    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Navigate to category page
    const handleClick = (categoryName, categoryId) => {
        router.push(`/${categoryName}?categoryId=${categoryId}`);
    };

    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiUrl = `/getAllCategory`;
                const data = await fetchApi(apiUrl, {
                    headers: {
                        'X-USER': process.env.NEXT_PUBLIC_SELLER_EMAIL,
                    }
                });
                setCategories(data);
            } catch (e) {
                console.error("Error fetching categories:", e);
                setError(e.message);
                throw new Error(`Failed to fetch categories: ${e.status}`);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="relative w-full top-5 max-w-7xl mx-auto py-8 px-4 md:px-6 bg-white mt-10">
            {/* Left Navigation Button */}
            <button
                className={`absolute left-2 z-20 flex items-center justify-center 
        w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg 
        top-1/2 -translate-y-1/2 transition-all duration-300 
        hover:bg-gray-100 ${isBeginning ? "opacity-0" : "opacity-100"}`}
                onClick={() => swiperRef.current?.slidePrev()}
                disabled={isBeginning}
                aria-label="Previous slide"
            >
                <ChevronLeft size={22}/>
            </button>

            {/* Swiper Slider */}
            <Swiper
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                onSlideChange={(swiper) => {
                    setIsBeginning(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                }}
                modules={[Navigation]}
                slidesPerView={3}
                spaceBetween={10}
                breakpoints={{
                    480: {slidesPerView: 4, spaceBetween: 12},
                    768: {slidesPerView: 5, spaceBetween: 16},
                    1024: {slidesPerView: 6, spaceBetween: 20},
                    1280: {slidesPerView: 7, spaceBetween: 24},
                }}
                className="w-full"
            >
                {loading && (
                    <div className="flex justify-center items-center py-10">
                        <p className="text-gray-500 text-sm">Loading categories...</p>
                    </div>
                )}

                {error && (
                    <div className="flex justify-center items-center py-10">
                        <p className="text-red-500 text-sm">{error}</p>
                    </div>
                )}

                {!loading &&
                    !error &&
                    categories.map((category) => (
                        <SwiperSlide
                            key={category._id}
                            className="flex flex-col items-center cursor-pointer group"
                            onClick={() => handleClick(category.name, category._id)}
                        >
                            <div
                                className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center
                overflow-hidden  border-2 border-gray-200
                shadow-md group-hover:shadow-lg transition duration-300"
                            >
                                <Image
                                    src={category.categoryImages[0].Location}
                                    alt={category.name}
                                    width={100}
                                    height={100}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                            </div>
                            <p className="mt-3 text-xs md:text-sm font-medium text-gray-700 text-center w-24 truncate group-hover:text-black">
                                {category.name}
                            </p>
                        </SwiperSlide>
                    ))}
            </Swiper>

            {/* Right Navigation Button */}
            <button
                className={`absolute right-2 z-20 flex items-center justify-center 
        w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg 
        top-1/2 -translate-y-1/2 transition-all duration-300 
        hover:bg-gray-100 ${isEnd ? "opacity-0" : "opacity-100"}`}
                onClick={() => swiperRef.current?.slideNext()}
                disabled={isEnd}
                aria-label="Next slide"
            >
                <ChevronRight size={22}/>
            </button>
        </div>
    );
}
