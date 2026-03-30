'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import {ArrowLeftIcon} from '@heroicons/react/24/outline';

export default function TermsAndConditionsPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-white pt-16 flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-4 bg-gray-900 text-white text-lg font-semibold shadow">
                <ArrowLeftIcon
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => router.back()}
                />
                Terms & Conditions
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto p-5 space-y-4 text-sm text-gray-700 leading-relaxed">
                <h2 className="text-base font-semibold text-gray-800">1. Introduction</h2>
                <p>
                    These Terms & Conditions govern your use of our services. By accessing or using the application, you
                    agree to be bound by these terms.
                </p>

                <h2 className="text-base font-semibold text-gray-800">2. Eligibility</h2>
                <p>
                    You must be at least 18 years old to use this service. By agreeing to these terms, you confirm that
                    you meet this requirement.
                </p>

                <h2 className="text-base font-semibold text-gray-800">3. Account Responsibility</h2>
                <ul className="list-disc pl-5">
                    <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                    <li>Any activity under your account will be assumed to be authorized by you.</li>
                </ul>

                <h2 className="text-base font-semibold text-gray-800">4. Usage Restrictions</h2>
                <ul className="list-disc pl-5">
                    <li>Do not misuse the service or engage in illegal activity.</li>
                    <li>You may not modify, reverse engineer, or exploit any part of the service.</li>
                </ul>

                <h2 className="text-base font-semibold text-gray-800">5. Rewards & Offers</h2>
                <ul className="list-disc pl-5">
                    <li>Rewards are promotional and subject to change or cancellation at any time.</li>
                    <li>They are non-transferable and cannot be exchanged for cash unless otherwise specified.</li>
                </ul>

                <h2 className="text-base font-semibold text-gray-800">6. Termination</h2>
                <p>
                    We reserve the right to suspend or terminate your access to the service at our discretion, without
                    notice or liability.
                </p>

                <h2 className="text-base font-semibold text-gray-800">7. Changes to Terms</h2>
                <p>
                    We may update these Terms from time to time. Continued use of the app after changes are made implies
                    acceptance of the new terms.
                </p>

                <h2 className="text-base font-semibold text-gray-800">8. Contact</h2>
                <p>
                    For any questions regarding these Terms & Conditions, please contact us at <a
                    href="mailto:support@example.com" className="text-pink-600 underline">support@example.com</a>.
                </p>
            </div>
        </div>
    );
}
