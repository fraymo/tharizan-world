'use client';

import React, {useEffect, useState} from 'react';
import {
    ArrowRightOnRectangleIcon,
    BellIcon,
    DocumentDuplicateIcon,
    DocumentTextIcon,
    MapPinIcon,
    QuestionMarkCircleIcon,
    TrashIcon,
    UserIcon,
    HeartIcon,
} from '@heroicons/react/24/outline';
import {useRouter} from 'next/navigation';
import {fetchApi, getCustomerEmail, seller_email} from "@/utils/util";
import {formatCurrency} from "@/utils/formatCurrency";
import {resetCart} from "@/redux/cartSlice";
import {useDispatch} from "react-redux";

export default function AccountPage() {
    const router = useRouter();

    const [user, setUser] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [orderCount, setOrderCount] = useState(null);
    const [walletCount, setWalletCount] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);
    const dispatch = useDispatch();

    useEffect(() => {
        const storedUserData = localStorage.getItem('user');
        if (storedUserData) {
            try {
                const parsedUser = JSON.parse(storedUserData);
                setUser(parsedUser);
                setForm(parsedUser);
                setAddresses(parsedUser.addresses || []);
            } catch (error) {
                console.error("Failed to parse user data from localStorage:", error);
            }
        } else {
            router.push("/loginpage?redirect=/accounts");
        }
    }, [router]);

    const getCount = async () => {
        const countRes = await fetchApi("/ord/getCounts", {
            headers: {'Content-Type': 'application/json',  'x-user': seller_email},
            method: 'POST',
            body: {
                seller_email, customer_email: getCustomerEmail()
            }
        });
        setOrderCount(countRes.orderCount);
        setWalletCount(countRes.walletAmount);
        setNotificationCount(countRes.notificationCount);
    };
    useEffect(() => {
        getCount();
    }, [user]);

    const toggleEdit = () => {
        setForm(user);
        setEditMode(!editMode);
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    };

    const saveChanges = async () => {
        setIsSaving(true);
        try {
            const phoneNumber = getCustomerEmail();
            if (!phoneNumber) {
                alert('Error: Phone number is missing. Cannot update profile.');
                return;
            }

            const apiUrl = `/posts/otp-user-update`;

            await fetchApi(apiUrl, {
                headers: {'Content-Type': 'application/json',  'x-user': seller_email},
                method: 'POST',
                body: {
                    ...form,
                    phone: phoneNumber,
                },
            });

            const updatedUser = {...user, ...form};
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setEditMode(false);
            alert('Profile updated successfully!');
        } catch (error) {
            alert('An unexpected error occurred. Please check your connection and try again.');
            console.error('Failed to save changes:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleClick = (label) => {
        const routes = {
            'Halalo Wallet': '/wallet',
            'Orders': '/orders',
            'Wish List': '/wishlist',
            'Addresses': '/addresses',
            'Notifications': '/notifications',
            'Contact Us': '/contact',
            'Terms & Conditions': '/terms-of-service',
            'FAQs': '/faqs',
            'Privacy Policy': '/privacy-policy',
            'Delete Account': '/delete',
            'Cancellation & Reschedule Policy': '/cancel-policy',
            'Logout': '/logout'
        };
        if (routes[label]) router.push(routes[label]);
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("userLocation");
        localStorage.removeItem("cart"); // Clear cart on logout
        localStorage.removeItem('customer_email');
        localStorage.clear();
        dispatch(resetCart({}));
        router.push("/");
    };

    const sendFCM = async () => {
        await fetchApi("/send-fcm", {
            headers: {'Content-Type': 'application/json',  'x-user': seller_email},
            method: 'POST',
            body: {
                seller_email,
                customer_email: getCustomerEmail(),
                "title": "Sample",
                "body": "Order Confirmation msg",
                imageUrl: "https://halaloimages.s3.ap-south-1.amazonaws.com/uploads/1756555309372_Yorkshire-Mutton-Box.jpg",
                orderId:"12344",
                type:"Order"
            },
        });
    };

    const MenuItem = ({icon: Icon, label, subLabel}) => (
        <div
            onClick={() => handleClick(label)}
            className="flex justify-between items-center py-4 border-b cursor-pointer hover:bg-gray-50 transition"
        >
            <div className="flex items-start gap-4">
                <Icon className="w-6 h-6 text-gray-600"/>
                <div>
                    <p className="font-medium text-gray-800">{label}</p>
                    {subLabel && <p className="text-sm text-gray-500">{subLabel}</p>}
                </div>
            </div>
            <ArrowRightOnRectangleIcon className="w-4 h-4 text-gray-400"/>
        </div>
    );

    return (
        <div className="bg-white min-h-screen pt-4 pb-20">
            <div className="p-4 border-b text-sm pt-16 relative">
                {!editMode ? (
                    <>
                        <h2 className="text-xl font-bold">{user.name}</h2>
                        <p>{user.phone} | {user.email}</p>
                        <p
                            onClick={toggleEdit}
                            className="text-red-500 font-semibold cursor-pointer mt-1"
                        >
                            Edit
                        </p>
                    </>
                ) : (
                    <div className="space-y-2">
                        <input
                            type="text"
                            name="name"
                            value={form.name || ''}
                            onChange={handleChange}
                            className="w-full border p-2 rounded text-sm"
                            placeholder="Name"
                        />
                        <input
                            type="text"
                            name="phone"
                            value={form.phone || ''}
                            onChange={handleChange}
                            className="w-full border p-2 rounded text-sm bg-gray-100 cursor-not-allowed"
                            placeholder="Phone"
                            disabled
                        />
                        <input
                            type="email"
                            name="email"
                            value={form.email || ''}
                            onChange={handleChange}
                            className="w-full border p-2 rounded text-sm"
                            placeholder="Email"
                        />
                        <div className="flex justify-end gap-4 text-sm mt-2">
                            <button onClick={toggleEdit} className="text-gray-600 underline">
                                Cancel
                            </button>
                            <button
                                onClick={saveChanges}
                                className="bg-pink-600 text-white px-4 py-1 rounded disabled:bg-pink-400 disabled:cursor-wait"
                                disabled={isSaving}
                            >
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 space-y-2 text-sm">
                {/* <MenuItem icon={UserIcon} label="Halalo Wallet"
                          subLabel={walletCount === null ? "Loading..." : `${formatCurrency(walletCount)}`}/> */}
                <MenuItem
                    icon={DocumentTextIcon}
                    label="Orders"
                    subLabel={orderCount === null ? "Loading..." : `Orders placed: ${orderCount}`}
                />
                <MenuItem icon={HeartIcon} label="Wish List"/>
                <MenuItem icon={MapPinIcon} label="Addresses" subLabel={`${addresses.length} saved addresses`}/>
                <MenuItem icon={BellIcon} label="Notifications" subLabel={`${notificationCount} unread notifications`}/>
                <MenuItem icon={QuestionMarkCircleIcon} label="Contact Us"/>
            </div>

            <div className="p-4 text-sm">
                <MenuItem icon={DocumentDuplicateIcon} label="Terms & Conditions"/>
                {/* <MenuItem icon={QuestionMarkCircleIcon} label="FAQs"/> */}
                <MenuItem icon={UserIcon} label="Privacy Policy"/>
                <MenuItem icon={TrashIcon} label="Delete Account"/>
                {/* <MenuItem icon={BellIcon} label="Cancellation & Reschedule Policy"/> */}
            </div>
            {/*<div*/}
            {/*    onClick={() => sendFCM()}*/}
            {/*    className="p-4 text-center text-red-600 font-semibold border-t cursor-pointer hover:bg-gray-50"*/}
            {/*>*/}
            {/*    Send*/}
            {/*</div>*/}
            <div
                onClick={() => handleLogout()}
                className="p-4 text-center text-red-600 font-semibold border-t cursor-pointer hover:bg-gray-50"
            >
                Logout
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
                App Version - 8.51.2 (319) | Bundle - 1.0.33
            </p>

        </div>
    );
}
