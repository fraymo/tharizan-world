'use client';
import React, {useEffect} from 'react';
import {useRouter} from "next/router";
import {ArrowLeftIcon, BuildingOfficeIcon, HomeIcon, HomeModernIcon} from '@heroicons/react/24/outline';
import {fetchApi, seller_email} from "@/utils/util";
import {FaBriefcase, FaEllipsisH, FaHome, FaTrash} from "react-icons/fa";

const AddressesPage = () => {
    const router = useRouter();
    const [addresses, setAddresses] = React.useState([]);

    // React.useEffect(() => {
    //     const user = JSON.parse(localStorage.getItem('user') || '{}');
    //     setAddresses(user.addresses || []);
    // }, []);

    React.useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const userString = localStorage.getItem("user");
                if (!userString) return;
                const user = JSON.parse(userString);

                const response = await fetchApi(`/posts/addresses`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-user": seller_email,
                    },
                    body: { mobile: user.phone },
                });

                setAddresses(response || []);
            } catch (error) {
                console.error("Failed to fetch addresses:", error);
            } finally {
            }
        };
        fetchAddresses();
    }, []);

    const handleAddAddress = () => {
        // alert("Navigate to add new address page");
        router.push('/add-address');
    };

    return (<div className="flex flex-col min-h-screen pt-16 bg-white">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b text-lg font-medium text-gray-800">
            <ArrowLeftIcon
                className="w-5 h-5 cursor-pointer"
                onClick={() => router.back()}
            />
            Saved addresses
        </div>

        {/* Address Card */}

        {addresses.map((addr, index) => (
            <div
                key={index}
                className={`p-4 border rounded-lg shadow-sm mt-2 relative flex items-center transition bg-gray-100`}
            >
                <div className="flex-1">
                    <p className="text-gray-900 font-semibold flex items-center gap-2">
                        {addr.tag === "Home" ? (
                            <FaHome className="text-blue-500" />
                        ) : addr.tag === "Work" ? (
                            <FaBriefcase className="text-green-500" />
                        ) : (
                            <FaEllipsisH className="text-gray-500" />
                        )}
                        {addr.tag}
                    </p>

                    <p className="text-gray-800 font-medium">{addr.name}</p>
                    <p className="text-gray-700">{addr.address}</p>
                    {addr.pincode && (
                        <p className="text-gray-600">Pincode: {addr.pincode}</p>
                    )}
                    <p className="text-gray-600">📞 {addr.mobile}</p>
                    {addr.secondaryMobile && (
                        <p className="text-gray-600">
                            📞 Alt: {addr.secondaryMobile}
                        </p>
                    )}
                    {addr.email && (
                        <p className="text-gray-600">✉️ {addr.email}</p>
                    )}
                </div>
            </div>
        ))}

        {/* Spacer to push the button to the bottom */}
        <div className="flex-grow"/>

        {/* Add Button */}
        <div className="p-4 pb-20">
            <button
                onClick={handleAddAddress}
                className="w-full bg-pink-600 text-white py-3 rounded-full font-medium hover:bg-pink-700 transition"
            >
                Add new address
            </button>
        </div>
    </div>);
};

export default AddressesPage;
