import { useState } from "react";
import { ChevronLeft, ChevronRight, Expand, Sparkles } from "lucide-react";

export default function GalleryForProductDetails({ images = [] }) {
  const safeImages = images.length ? images : ["/fallback.png"];
  const [currentImage, setCurrentImage] = useState(0);
  const hasMultipleImages = safeImages.length > 1;

  const handleNext = () => {
    setCurrentImage((prev) => (prev + 1) % safeImages.length);
  };

  const handlePrev = () => {
    setCurrentImage((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  return (
    <div className="space-y-4">
      <div className={`grid grid-cols-1 gap-4 ${hasMultipleImages ? "lg:grid-cols-[100px_minmax(0,1fr)]" : ""}`}>
        {hasMultipleImages ? (
          <div className="flex gap-3 overflow-x-auto lg:flex-col lg:overflow-visible">
            {safeImages.map((src, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`overflow-hidden rounded-[20px] border bg-white transition shrink-0 ${
                  currentImage === index ? "border-gray-900 shadow-sm" : "border-gray-200"
                }`}
              >
                <img
                  src={src}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-20 w-20 object-cover sm:h-24 sm:w-24 lg:h-[92px] lg:w-[92px]"
                />
              </button>
            ))}
          </div>
        ) : null}

        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-[28px] bg-gray-100">
            <img
              src={safeImages[currentImage]}
              alt={`Product view ${currentImage + 1}`}
              className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[560px]"
            />
            <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-700 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Product Gallery
            </div>
            <div className="absolute right-4 top-4 rounded-full bg-white px-3 py-2 text-xs font-semibold text-gray-800 shadow">
              {currentImage + 1}/{safeImages.length}
            </div>
            <button className="absolute right-4 bottom-4 rounded-full bg-white p-3 text-gray-800 shadow">
              <Expand className="h-4 w-4" />
            </button>

            {hasMultipleImages ? (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-3 text-gray-800 shadow transition hover:bg-gray-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-3 text-gray-800 shadow transition hover:bg-gray-100"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            ) : null}
          </div>

          {hasMultipleImages ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {safeImages.slice(0, 6).map((src, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`overflow-hidden rounded-[22px] border bg-white transition ${
                    currentImage === index ? "border-gray-900 shadow-sm" : "border-gray-200"
                  }`}
                >
                  <img
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="h-28 w-full object-cover sm:h-32"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
