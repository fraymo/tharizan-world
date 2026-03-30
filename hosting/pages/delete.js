'use client';

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {ShieldAlert, ShieldOff, Trash2} from 'lucide-react';

export default function DeleteAccountPage() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [touched, setTouched] = useState(false);

    const isValidPhoneNumber = (phoneNumber) => {
        // Regular expression for a 10-digit number.
        return /^\d{10}$/.test(phoneNumber);
    };

    const handleContinue = () => {
        if (isValidPhoneNumber(phoneNumber)) {
            alert(`Deletion request sent for ${phoneNumber}.`);
            // Trigger deletion request here
        }
    };

    return (
        <div className="min-h-screen pt-16 bg-gray-900 text-white flex flex-col items-center justify-center p-4">

            {/* Header */}
            {/* <div className="w-full flex items-center gap-3 px-4 py-4 fixed top-0 left-0 bg-gray-900 bg-opacity-90 backdrop-blur-sm z-50">
                <ArrowLeftIcon
                    className="w-5 h-5 cursor-pointer text-gray-300 hover:text-white transition-colors"
                    onClick={() => router.back()}
                />
                <span className="text-lg font-semibold text-gray-200">Delete Account</span>
            </div> */}

            {/* Main Content Card */}
            <div className="w-full max-w-sm p-6 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 space-y-6">

                {/* Icon and Title */}
                <div className="flex flex-col items-center text-center space-y-2">
                    <Trash2 size={48} className="text-red-500 mb-2"/>
                    <h1 className="text-2xl font-bold text-red-400">Permanently Delete Account</h1>
                    <p className="text-sm text-gray-400">
                        This action is irreversible. All your data will be permanently erased.
                    </p>
                </div>

                {/* Warning Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-yellow-400">
                        <ShieldAlert size={20}/>
                        <h2 className="text-sm font-semibold">What you will lose:</h2>
                    </div>
                    <ul className="list-disc list-inside space-y-2 text-gray-400 text-xs pl-4">
                        <li>Access to your account and all saved information.</li>
                        <li>Your complete order history and saved addresses.</li>
                        <li>Any remaining wallet balance will be **forfeited**.</li>
                    </ul>
                </div>

                {/* Phone Number Input */}
                <div className="space-y-2">
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300">
                        Confirm phone number
                    </label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        placeholder="Enter 10-digit number"
                        value={phoneNumber}
                        onChange={(e) => {
                            setPhoneNumber(e.target.value);
                            setTouched(true);
                        }}
                        className={`w-full px-4 py-3 bg-gray-700 text-white border rounded-lg transition-colors focus:outline-none focus:ring-2 ${
                            touched && !isValidPhoneNumber(phoneNumber) ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-sky-500'
                        }`}
                    />
                    {touched && !isValidPhoneNumber(phoneNumber) && (
                        <p className="text-xs text-red-500 mt-1">Please enter a valid 10-digit phone number.</p>
                    )}
                </div>

                <p className="text-xs text-center text-gray-500">
                    A final confirmation will be sent to this number before deletion.
                </p>

                {/* Button */}
                <button
                    onClick={handleContinue}
                    disabled={!isValidPhoneNumber(phoneNumber)}
                    className={`w-full py-3 rounded-lg font-semibold shadow-md transition-all duration-300 flex items-center justify-center gap-2 ${
                        isValidPhoneNumber(phoneNumber)
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-gray-600 cursor-not-allowed'
                    }`}
                >
                    <ShieldOff size={18}/>
                    Confirm Account Deletion
                </button>
            </div>
        </div>
    );
}
