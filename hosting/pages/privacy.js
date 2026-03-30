'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import {ArrowLeftIcon} from '@heroicons/react/24/outline';

export default function PrivacyPolicyPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-white pt-16 flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-4 bg-gray-900 text-white text-lg font-semibold shadow">
                <ArrowLeftIcon
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => router.back()}
                />
                Privacy Policy
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto p-5 space-y-4 text-sm text-gray-700 leading-relaxed">
                <h2 className="text-base font-semibold text-gray-800">1. Introduction</h2>
                <p>
                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you
                    use our app or services.
                </p>

                <h2 className="text-base font-semibold text-gray-800">2. Information We Collect</h2>
                <ul className="list-disc pl-5">
                    <li>Personal Data: Name, email, phone number, etc.</li>
                    <li>Usage Data: How you interact with our services.</li>
                    <li>Device Data: Device type, OS, IP address, etc.</li>
                </ul>

                <h2 className="text-base font-semibold text-gray-800">3. How We Use Your Information</h2>
                <ul className="list-disc pl-5">
                    <li>To provide and maintain the app functionality.</li>
                    <li>To personalize user experience.</li>
                    <li>To send updates, offers, and promotional content.</li>
                </ul>

                <h2 className="text-base font-semibold text-gray-800">4. Sharing of Information</h2>
                <p>
                    We do not sell your data. We may share information with trusted third parties who assist us in
                    operating the service, as long as those parties agree to keep the data confidential.
                </p>

                <h2 className="text-base font-semibold text-gray-800">5. Data Security</h2>
                <p>
                    We implement appropriate security measures to protect your personal data. However, no method of
                    transmission over the internet is 100% secure.
                </p>

                <h2 className="text-base font-semibold text-gray-800">6. Your Rights</h2>
                <ul className="list-disc pl-5">
                    <li>You have the right to access, update, or delete your information.</li>
                    <li>You may opt out of receiving marketing emails from us at any time.</li>
                </ul>

                <h2 className="text-base font-semibold text-gray-800">7. Children Privacy</h2>
                <p>
                    Our services are not intended for children under 13. We do not knowingly collect data from children.
                </p>

                <h2 className="text-base font-semibold text-gray-800">8. Changes to This Policy</h2>
                <p>
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting
                    the new policy on this page.
                </p>

                <h2 className="text-base font-semibold text-gray-800">9. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, contact us at{' '}
                    <a href="mailto:support@example.com" className="text-pink-600 underline">
                        support@example.com
                    </a>.
                </p>
            </div>
        </div>
    );
}
