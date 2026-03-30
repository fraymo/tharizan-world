"use client";
import {useEffect, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {formatCurrency} from "@/utils/formatCurrency";

const FREE_DELIVERY_THRESHOLD = 499;
const DELIVERY_CHARGE = 50;

export default function CartDrawer({isOpen, onClose}) {
    const [cart, setCart] = useState([]);
    const [savedAddress, setSavedAddress] = useState(null);
    const [isSlotModalOpen, setSlotModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedDay, setSelectedDay] = useState("Today");
    const router = useRouter();

    const slots = [
        "6:00 AM - 8:00 AM",
        "8:00 AM - 10:00 AM",
        "10:00 AM - 12:00 PM",
        "12:00 PM - 2:00 PM",
        "2:00 PM - 4:00 PM",
        "4:00 PM - 6:00 PM",
        "6:00 PM - 8:00 PM",
        "8:00 PM - 10:00 PM",
    ];

    useEffect(() => {
        if (isOpen) {
            setCart(JSON.parse(localStorage.getItem("cart")) || []);
            setSavedAddress(JSON.parse(localStorage.getItem("savedAddress")));
        }
    }, [isOpen]);

    const isSlotInPast = (slot, day) => {
        if (day !== "Today") return false;
        const now = new Date();
        const currentHour = now.getHours();
        const endTimeString = slot.split(" - ")[1];
        const [hourString, period] = endTimeString.split(" ");
        let endHour = parseInt(hourString, 10);
        if (period === "PM" && endHour !== 12) endHour += 12;
        if (period === "AM" && endHour === 12) endHour = 0;
        return currentHour >= endHour;
    };

    const removeItem = (index) => {
        const updatedCart = cart.filter((_, i) => i !== index);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const updateQuantity = (index, change) => {
        const updatedCart = cart.map((item, i) =>
            i === index ? {...item, quantity: Math.max(1, item.quantity + change)} : item
        );
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const subtotal = cart.reduce((acc, item) => acc + (item.sellingPrice || 0) * item.quantity, 0);
    const totalOriginalPrice = cart.reduce((acc, item) => acc + (item.MRP || 0) * item.quantity, 0);
    const savedAmount = totalOriginalPrice - subtotal;
    const tax = subtotal * 0.02;
    const deliveryCharge = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
    const total = subtotal + tax + deliveryCharge;

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${
                    isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
                onClick={onClose}
            ></div>

            {/* Cart Drawer */}
            <div
                className={`fixed top-0 right-0 w-full sm:w-96 h-full bg-white shadow-2xl transform ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                } transition-transform duration-300 z-50 flex flex-col`}
            >
                {/* Header Info */}
                <div className="p-4 bg-green-600 text-white text-center font-semibold">
                    Free delivery on all orders above ₹{FREE_DELIVERY_THRESHOLD}
                </div>
                <div className="p-2 bg-green-100 text-green-800 text-center font-medium border border-green-400">
                    {savedAmount > 0
                        ? `Congratulations! You have saved ₹${savedAmount.toFixed(2)}`
                        : `Add more items to save more!`}
                </div>

                {/* Cart Items */}
                <div className="p-4 flex-1 overflow-y-auto">
                    {cart.length === 0 ? (
                        <p className="text-gray-500 text-center mt-10">Your cart is empty.</p>
                    ) : (
                        cart.map((item, index) => (
                            <div key={index} className="flex items-center gap-4 border-b pb-3 mb-3">
                                <Image
                                    src={item.images[0]?.Location}
                                    alt={item.title}
                                    width={60}
                                    height={60}
                                    className="rounded-md"
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold">{item.title}</p>
                                    <p className="text-green-600 text-sm">{formatCurrency(item.sellingPrice)}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <button
                                            onClick={() => updateQuantity(index, -1)}
                                            className="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
                                        >
                                            -
                                        </button>
                                        <span className="text-sm">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(index, 1)}
                                            className="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <button onClick={() => removeItem(index)}
                                        className="text-red-500 hover:text-red-700 text-lg">
                                    🗑
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Bill Details */}
                {cart.length > 0 && (
                    <div className="p-4 border-t">
                        <div className="font-semibold text-lg mb-2">Bill Details</div>
                        <div className="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Tax (2%)</span>
                            <span>₹{tax.toFixed(2)}</span>
                        </div>
                        {deliveryCharge > 0 ? (
                            <div className="flex justify-between text-sm">
                                <span>Delivery Charge</span>
                                <span>₹{deliveryCharge.toFixed(2)}</span>
                            </div>
                        ) : (
                            <div className="text-green-600 text-sm">Free delivery on all orders above
                                ₹{FREE_DELIVERY_THRESHOLD}</div>
                        )}
                        <div className="flex justify-between font-bold text-lg mt-2">
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                    </div>
                )}

                {/* Address Section */}
                <div className="p-4 border-t">
                    <h2 className="text-lg font-semibold mb-2">Delivery Address</h2>
                    {savedAddress ? (
                        <div className="p-3 bg-gray-100 rounded-md">
                            <p className="text-gray-800 font-semibold">{savedAddress.tag}</p>
                            <p className="text-gray-700">
                                {savedAddress.address}, {savedAddress.building}
                            </p>
                            {savedAddress.landmark && <p className="text-gray-600">{savedAddress.landmark}</p>}
                            <p className="text-gray-600">{savedAddress.city}</p>
                            <p className="text-gray-600">📞 {savedAddress.mobile}</p>
                        </div>
                    ) : (
                        <button
                            onClick={() => router.push("/add-address")}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm"
                        >
                            + Add Address
                        </button>
                    )}
                </div>

                {/* Checkout & Slot Section */}
                <div className="p-4 border-t flex flex-col gap-2">
                    <button
                        onClick={() => setSlotModalOpen(true)}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-md text-sm"
                    >
                        {selectedSlot ? `Slot: ${selectedDay}, ${selectedSlot}` : "Select Delivery Slot"}
                    </button>
                    <button
                        onClick={() => router.push("/halalo/cart")}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md text-sm"
                    >
                        Proceed to Pay ₹{total.toFixed(2)}
                    </button>
                </div>

                {/* Slot Modal */}
                {isSlotModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-5 rounded-lg shadow-lg w-96">
                            <h2 className="text-lg font-semibold mb-3">Select a Time Slot</h2>
                            <div className="grid grid-cols-2 gap-2">
                                {slots.map((slot) => {
                                    const disabled = isSlotInPast(slot, "Today");
                                    return (
                                        <button
                                            key={slot}
                                            disabled={disabled}
                                            className={`p-2 text-sm font-medium rounded-md transition-colors ${
                                                selectedSlot === slot
                                                    ? "bg-green-500 text-white"
                                                    : "bg-gray-200 hover:bg-gray-300"
                                            } disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed`}
                                            onClick={() => {
                                                setSelectedSlot(slot);
                                                setSlotModalOpen(false);
                                            }}
                                        >
                                            {slot}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
