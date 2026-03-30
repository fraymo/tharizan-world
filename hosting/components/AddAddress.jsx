"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { FaBriefcase, FaEllipsisH, FaHome, FaTrash } from "react-icons/fa";
import { fetchApi, seller_email } from "@/utils/util";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AddressSelection() {
    const router = useRouter();
    const [isModalOpen, setModalOpen] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const [address, setAddress] = useState("");
    const [name, setName] = useState("");
    const [pincode, setPincode] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [secondaryMobile, setSecondaryMobile] = useState("");
    const [selectedTag, setSelectedTag] = useState("Home");

    useEffect(() => {
        const fetchAddresses = async () => {
            setIsFetching(true);
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

                setSavedAddresses(response || []);
            } catch (error) {
                console.error("Failed to fetch addresses:", error);
            } finally {
                setIsFetching(false);
            }
        };
        fetchAddresses();
    }, []);

    useEffect(() => {
        if (isModalOpen) {
            const userString = localStorage.getItem("user");
            if (userString) {
                try {
                    const user = JSON.parse(userString);
                    if (user && user.phone) setMobile(user.phone);
                } catch (error) {
                    console.error("Failed to parse user from localStorage", error);
                }
            }
        }
    }, [isModalOpen]);

    const saveAddress = async () => {
        if (!name || !pincode || !address || !mobile || !email) return;
        setIsLoading(true);

        try {
            const userString = localStorage.getItem("user");
            if (!userString) {
                alert("Please log in to save an address.");
                router.push("/loginpage");
                return;
            }

            const user = JSON.parse(userString);
            const newAddress = {
                name,
                address,
                pincode,
                email,
                mobile,
                secondaryMobile,
                tag: selectedTag,
            };
            const addressesSet = [...savedAddresses, newAddress];

            await fetchApi(`/posts/otp-user-address-update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user": seller_email,
                },
                body: {
                    addresses: addressesSet,
                    phone: user.phone,
                },
            });

            setSavedAddresses(addressesSet);
            setModalOpen(false);

            setAddress("");
            setMobile("");
            setEmail("");
            setName("");
            setPincode("");
            setSecondaryMobile("");
            setSelectedTag("Home");
        } catch (error) {
            console.error("Error saving address:", error);
            alert("There was an error saving your address. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const deleteAddress = async (addressIndexToDelete) => {
        const originalAddresses = [...savedAddresses];
        const updatedAddresses = savedAddresses.filter(
            (_, index) => index !== addressIndexToDelete
        );
        setSavedAddresses(updatedAddresses);

        try {
            const userString = localStorage.getItem("user");
            if (!userString) {
                alert("Please log in to delete an address.");
                router.push("/loginpage");
                setSavedAddresses(originalAddresses);
                return;
            }
            const user = JSON.parse(userString);

            await fetchApi(`/posts/otp-user-address-update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user": seller_email,
                },
                body: {
                    addresses: updatedAddresses,
                    phone: user.phone,
                },
            });
        } catch (error) {
            console.error("Error deleting address:", error);
            alert("Failed to delete address. Please try again.");
            setSavedAddresses(originalAddresses);
        }
    };

    const toggleSelectAddress = (addressIndex) => {
        setSelectedAddressId(addressIndex);
        localStorage.setItem(
            "savedAddress",
            JSON.stringify(savedAddresses[addressIndex])
        );
    };

    if (isFetching) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <p className="text-lg text-gray-600">Loading your addresses...</p>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 pt-20">
            <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
                <div className="mt-6">
                    {savedAddresses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32">
                            <p className="text-gray-700 text-lg">No address saved</p>
                        </div>
                    ) : (
                        savedAddresses.map((addr, index) => (
                            <div
                                key={index}
                                className={`p-4 border rounded-lg shadow-sm mt-2 relative flex items-center transition ${
                                    selectedAddressId === index
                                        ? "border-red-500 bg-red-50"
                                        : "bg-gray-100"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="selectedAddress"
                                    checked={selectedAddressId === index}
                                    onChange={() => toggleSelectAddress(index)}
                                    className="mr-4 h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300"
                                />

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

                                <button
                                    className="text-red-500 hover:text-red-700 ml-3"
                                    onClick={() => deleteAddress(index)}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        onClick={() => setModalOpen(true)}
                        className="w-1/2 border border-red-500 text-red-500 py-2 rounded-md font-semibold mx-2 hover:bg-red-100 transition-colors"
                    >
                        Add new address
                    </button>
                    <button
                        onClick={() => router.push("/cart")}
                        disabled={selectedAddressId === null}
                        className={`w-1/2 py-2 rounded-md font-semibold mx-2 transition-colors ${
                            selectedAddressId !== null
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
                    >
                        Select & Proceed
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <div
                    className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 backdrop-blur-sm mt-20 z-50"
                    onClick={() => setModalOpen(false)}
                >
                    <div
                        className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg relative animate-fade-in max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 z-10"
                            onClick={() => setModalOpen(false)}
                        >
                            ✖
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Add New Address</h2>

                        <div className="mt-4">
                            <p className="text-gray-700 text-sm mt-4">Save As</p>
                            <div className="flex gap-3 mt-2">
                                {["Home", "Work", "Other"].map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => setSelectedTag(tag)}
                                        className={`flex items-center gap-2 px-4 py-2 border rounded-md ${
                                            selectedTag === tag
                                                ? "bg-gray-800 text-white"
                                                : "bg-gray-100"
                                        }`}
                                    >
                                        {tag === "Home" ? (
                                            <FaHome />
                                        ) : tag === "Work" ? (
                                            <FaBriefcase />
                                        ) : (
                                            <FaEllipsisH />
                                        )}
                                        {tag}
                                    </button>
                                ))}
                            </div>

                            <label className="block text-sm font-medium text-gray-700 mt-2">
                                Name*
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. John"
                                className="w-full p-2 border rounded-md mt-1"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <label className="block text-sm font-medium text-gray-700 mt-2">
                                Full Address*
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Main Street, Sector 5"
                                className="w-full p-2 border rounded-md mt-1"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />

                            <label className="block text-sm font-medium text-gray-700 mt-2">
                                Pincode*
                            </label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded-md mt-1"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                            />

                            <label className="block text-sm font-medium text-gray-700 mt-2">
                                Email*
                            </label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-md mt-1"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <label className="block text-sm font-medium text-gray-700 mt-2">
                                Mobile Number*
                            </label>
                            <input
                                type="tel"
                                placeholder="10-digit mobile number"
                                className="w-full p-2 border rounded-md mt-1"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                            />

                            <label className="block text-sm font-medium text-gray-700 mt-2">
                                Secondary Mobile Number
                            </label>
                            <input
                                type="tel"
                                className="w-full p-2 border rounded-md mt-1"
                                value={secondaryMobile}
                                onChange={(e) => setSecondaryMobile(e.target.value)}
                            />

                            <button
                                className={`w-full mt-4 p-2 rounded-md text-white font-semibold ${
                                    address && mobile
                                        ? "bg-red-500 hover:bg-red-600"
                                        : "bg-gray-300 cursor-not-allowed"
                                }`}
                                onClick={saveAddress}
                                disabled={!address || !mobile || isLoading}
                            >
                                {isLoading ? "Saving..." : "Save & Proceed"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
