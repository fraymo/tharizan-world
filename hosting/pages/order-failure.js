import {useRouter} from 'next/router';
import Link from 'next/link';

export default function OrderFailurePage() {
    const router = useRouter();
    // Get orderId and a custom error message from the URL query string
    // e.g., /order-failure?orderId=...&error=Payment%20declined
    const {orderId, error} = router.query;

    // Provide a default message if no specific error is passed in the URL
    const errorMessage = error || "We encountered an issue while processing your order.";

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
            <div className="bg-white p-8 sm:p-12 rounded-xl shadow-lg max-w-md w-full">
                {/* Failure Icon */}
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
                    <svg
                        className="h-12 w-12 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        ></path>
                    </svg>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Order Could Not Be Placed
                </h1>

                <p className="text-gray-600 mt-4">
                    {errorMessage}
                </p>

                {/* Display the Order ID if it exists for reference */}
                {orderId && (
                    <p className="text-sm text-gray-500 mt-2">
                        Reference ID: <span className="font-semibold text-gray-700">{orderId}</span>
                    </p>
                )}

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <Link href="/cart"
                          className="w-full inline-block px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-300">
                        Back to Cart
                    </Link>
                    <Link href="/"
                          className="w-full inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
