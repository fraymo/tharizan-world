'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import {ArrowLeftIcon} from '@heroicons/react/24/outline';

export default function ContactPage() {
    const router = useRouter();

    const handleCall = () => {
        window.location.href = 'tel:9043643573';
    };

    const handleMail = () => {
        window.location.href = 'mailto:natherfaahim26@gmail.com';
    };

    return (
        <div className="min-h-screen pt-16 bg-white">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-4 bg-gray-900 text-white text-lg font-semibold">
                <ArrowLeftIcon
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => router.back()}
                />
                Contact Us
            </div>

            {/* Content */}
            <div className="pt-24 flex flex-col items-center px-6 text-center">
                {/* Image */}
                {/* <img
          src="/contact-illustration.png"
          alt="Contact"
          className="w-36 h-36 mb-6"
          onError={(e) => (e.target.style.display = 'none')}
        /> */}

                {/* Text */}
                <h2 className="text-base font-semibold text-gray-800">
                    Tingling fingertips?
                </h2>
                <p className="text-sm text-gray-500 mt-1 mb-6">
                    That is a magnetic urge to get in touch with us!
                </p>

                {/* Buttons */}
                <button
                    onClick={handleCall}
                    className="w-full max-w-xs mb-3 bg-white border border-pink-600 text-pink-600 font-semibold py-2 rounded-md hover:bg-pink-50 transition"
                >
                    Call Us Maybe
                </button>

                <button
                    onClick={handleMail}
                    className="w-full max-w-xs bg-white border border-pink-600 text-pink-600 font-semibold py-2 rounded-md hover:bg-pink-50 transition"
                >
                    Drop Us a Line
                </button>
            </div>
        </div>
    );
}
