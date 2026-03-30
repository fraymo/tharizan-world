'use client';
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation'; // Import for Next.js navigation
import {
    ArrowLeftIcon,
    ChevronRightIcon,
    ExclamationTriangleIcon,
    MegaphoneIcon,
    TagIcon,
} from '@heroicons/react/24/outline';
import {fetchApi, getCustomerEmail, seller_email} from "@/utils/util";

// A helper function to determine which icon to show based on the notification type
const getNotificationIcon = (type) => {
    switch (type) {
        case 'offer':
            return <TagIcon className="w-6 h-6 text-pink-500"/>;
        case 'alert':
            return <ExclamationTriangleIcon className="w-6 h-6 text-amber-500"/>;
        default:
            return <MegaphoneIcon className="w-6 h-6 text-gray-500"/>;
    }
};

// --- START: Sample Data ---
const sampleNotifications = [
    {
        id: '1',
        title: 'Your referral was successful!',
        description: 'You\'ve earned a ₹200 bonus for your recent referral.',
        type: 'offer',
        date: '2 hours ago',
    },
    {
        id: '2',
        title: 'New Policy Update',
        description: 'We have updated our terms of service. Please review the changes.',
        type: 'alert',
        date: '1 day ago',
    },
    {
        id: '3',
        title: 'Welcome to the club!',
        description: 'Thank you for signing up. Explore our latest offers and deals.',
        type: 'announcement',
        date: '3 days ago',
    },
];
// --- END: Sample Data ---


export default function NotificationsPage() {
    const router = useRouter(); // Initialize router for navigation
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getNotification = async () => {
        try {
            const notification = await fetchApi('/notification/get', {
                headers: {'Content-Type': 'application/json',  'x-user': seller_email},
                method: 'POST',
                body: {
                    seller_email,
                    customer_email: getCustomerEmail()
                }
            });
            setNotifications(notification.notification)
        } catch (e) {
            setError("unable to get the notification");
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        setLoading(true);
        getNotification();
    }, []); // Empty dependency array ensures this runs only once on mount

    const handleBack = () => {
        router.back(); // Use router.back() for more reliable back navigation
    };

    const handleReferClick = () => {
        router.push('/refer'); // Use router.push for client-side navigation
    };

    const updateNotificationStatus = async (notification) => {
        if(!notification.read) {
            await fetchApi("/notification/update", {
                headers: {'Content-Type': 'application/json',  'x-user': seller_email},
                method: 'PUT',
                body: {
                    _id: notification._id,
                    seller_email,
                    customer_email: getCustomerEmail()
                }
            });
            setNotifications((prevNotifications) => {
                const newNotificationIndex = prevNotifications.findIndex(v => v._id === notification._id);
                const newNotifications = [...prevNotifications];
                newNotifications[newNotificationIndex].read = true;
                return newNotifications;
            });
        }
    }

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex-grow flex items-center justify-center">
                    <p className="text-gray-500">Loading notifications...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
                    <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mb-4"/>
                    <h2 className="text-lg font-semibold text-gray-800">
                        Something went wrong
                    </h2>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
            );
        }

        if (notifications.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center flex-grow p-6 text-center">
                    <img
                        src="/notification-placeholder.png"
                        alt="No Notifications"
                        className="w-36 h-36 mb-6"
                        onError={(e) => (e.target.style.display = 'none')}
                    />
                    <h2 className="text-lg font-semibold text-gray-800">
                        All caught up!
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        You have no new notifications right now.
                    </p>
                </div>
            );
        }

        return (
            <div className="space-y-4 p-4">
                {notifications.map((notification) => (
                    <div
                        onClick={() => updateNotificationStatus(notification)}
                        key={notification._id}
                        className={`flex items-start gap-4 border rounded-lg p-4 shadow-sm ${notification.read ? 'bg-gray-500' : 'bg-white'}`}
                    >
                        <div className="flex-shrink-0 mt-1">
                            <ExclamationTriangleIcon className="w-6 h-6 text-amber-500"/>
                        </div>
                        <div className="flex-grow">
                            {!notification.read && (<p>New</p>)}
                            <p className={`text-sm mt-1 ${notification.read ? 'text-white' : 'text-gray-600'}`}>
                                {notification.message}
                            </p>
                            <p className={`text-xs  mt-2 ${notification.read ? 'text-white' : 'text-gray-600'}`}>{notification.addedAt}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white min-h-screen pt-20 flex flex-col">
            {/* Header */}
            <div
                className="flex items-center gap-3 px-4 py-4 bg-gray-900 text-white text-lg font-semibold sticky top-0 z-10">
                <ArrowLeftIcon
                    className="w-5 h-5 cursor-pointer"
                    onClick={handleBack}
                />
                Notifications
            </div>

            {/* Content Area */}
            <div className="flex flex-col flex-grow">{renderContent()}</div>

            {/* Refer a Friend Section */}
            <div className="p-4 mt-auto border-t">
                <div
                    onClick={handleReferClick}
                    className="flex items-center justify-between border rounded-lg px-4 py-3 shadow-sm cursor-pointer hover:bg-gray-50 transition"
                >
                    <div className="flex items-center gap-3">
                        <MegaphoneIcon className="w-5 h-5 text-gray-500"/>
                        <div>
                            <p className="text-sm font-semibold text-gray-800">
                                Get ₹200 per referral
                            </p>
                            <p className="text-sm text-gray-600">Refer a friend</p>
                        </div>
                    </div>
                    <ChevronRightIcon className="w-4 h-4 text-gray-400"/>
                </div>
            </div>
        </div>
    );
}
