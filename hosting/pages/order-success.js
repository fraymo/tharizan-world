import {useRouter} from 'next/router';
import Link from 'next/link';
import {useEffect, useReducer} from "react";
import {useDispatch} from "react-redux";
import {updateCartFromLocalStorage} from "@/redux/cartSlice";

export default function OrderSuccessPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const {orderId} = router.query; // Get orderId from the URL query string: /order-success?orderId=...
    useEffect(() => {
        const updateCart = (updatedCart) => {
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            dispatch(updateCartFromLocalStorage([]));
        };
        updateCart([]);
    }, []);
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
            <div className="bg-white p-8 sm:p-12 rounded-xl shadow-lg max-w-md w-full">
                {/* Success Icon */}
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                    <svg
                        className="h-12 w-12 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                        ></path>
                    </svg>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Order Placed Successfully!
                </h1>

                <p className="text-gray-600 mt-4">
                    Thank you for your purchase. Your order is being processed and will be delivered soon.
                </p>

                {/* Display the Order ID if it exists in the URL */}
                {orderId && (
                    <p className="text-sm text-gray-500 mt-2">
                        Your Order ID is: <span className="font-semibold text-gray-700">{orderId}</span>
                    </p>
                )}

                <div className="mt-8">
                    <Link href="/"
                          className="w-full inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
