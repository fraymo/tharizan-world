export default function ProductCardSkeleton() {
    return (
        <div
            className="min-w-[220px] sm:min-w-[250px] max-w-[250px] bg-white rounded-xl shadow-md p-3 flex flex-col justify-between animate-pulse">
            {/* Image Skeleton */}
            <div className="w-full h-36 rounded-lg bg-gray-200"></div>

            {/* Text Skeleton */}
            <div className="mt-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>

            {/* Pricing & Button Skeleton */}
            <div className="flex items-center justify-between mt-2">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-9 bg-gray-200 rounded-md w-1/4"></div>
            </div>
        </div>
    );
}
