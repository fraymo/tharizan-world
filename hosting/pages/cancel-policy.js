'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import {ArrowLeftIcon} from '@heroicons/react/24/outline';

export default function CancellationPolicyPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-white pt-16 flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-4 bg-gray-900 text-white text-lg font-semibold shadow">
                <ArrowLeftIcon
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => router.back()}
                />
                Cancellation & Reschedule Policy
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto p-5 space-y-4 text-sm text-gray-700 leading-relaxed">
                <h2 className="text-base font-semibold text-gray-800">1. Cancellation Policy</h2>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Cancellations must be made at least 24 hours prior to the scheduled service time.</li>
                    <li>If canceled within the 24-hour window, a cancellation fee may apply.</li>
                    <li>Same-day cancellations are non-refundable unless due to emergencies (subject to review).</li>
                    <li>Refunds (if applicable) will be processed within 5–7 business days.</li>
                </ul>

                <h2 className="text-base font-semibold text-gray-800">2. How to Cancel</h2>
                <p>
                    You can cancel your appointment or booking by:
                </p>
                <ul className="list-disc pl-5">
                    <li>Using the “Cancel” option in your order or booking history.</li>
                    <li>Contacting our customer support team directly.</li>
                </ul>

                <h2 className="text-base font-semibold text-gray-800">3. Rescheduling Policy</h2>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Rescheduling requests must be made at least 12 hours before the appointment.</li>
                    <li>Each booking can be rescheduled only once, unless otherwise allowed.</li>
                    <li>Rescheduled appointments are subject to availability.</li>
                </ul>

                <h2 className="text-base font-semibold text-gray-800">4. No Show Policy</h2>
                <ul className="list-disc pl-5">
                    <li>If you fail to attend your scheduled service without prior notice, the booking may be marked as
                        “No Show”.
                    </li>
                    <li>No-shows are not eligible for a refund or rescheduling.</li>
                </ul>

                <h2 className="text-base font-semibold text-gray-800">5. Force Majeure</h2>
                <p>
                    We are not liable for cancellations or delays caused by events beyond our control (natural
                    disasters, emergencies, government restrictions, etc.).
                </p>

                <h2 className="text-base font-semibold text-gray-800">6. Contact Support</h2>
                <p>
                    For any issues regarding cancellations or reschedules, please contact us at{' '}
                    <a href="mailto:support@example.com" className="text-pink-600 underline">
                        support@example.com
                    </a>{' '}
                    or call us at{' '}
                    <a href="tel:+919876543210" className="text-pink-600 underline">
                        +91 98765 43210
                    </a>.
                </p>
            </div>
        </div>
    );
}
