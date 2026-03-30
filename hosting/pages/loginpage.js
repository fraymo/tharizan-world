"use client";

import React, {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router"; // Import useRouter for redirection
import {auth, RecaptchaVerifier, signInWithPhoneNumber, googleProvider, signInWithPopup} from "@/utils/firebase";
import {fetchApi, seller_email} from "@/utils/util";
import {updateCartFromLocalStorage} from "@/redux/cartSlice";
import {useDispatch} from "react-redux";
import {updateWishlistFromLocalStorage} from "@/redux/wishlistSlice";

// Renamed to PascalCase for React component convention
const LoginPage = () => {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [confirmation, setConfirmation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [googleUser, setGoogleUser] = useState(null); // State to hold Google user details
    const dispatch = useDispatch();
    const router = useRouter(); // Initialize the router
    const recaptchaVerifierRef = useRef(null);

    // Initialize reCAPTCHA verifier once on component mount
    useEffect(() => {
        if (!recaptchaVerifierRef.current) {
            recaptchaVerifierRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
                size: "invisible",
            });
        }
    }, []);

    const sendOtp = async () => {
        setLoading(true);
        setError("");

        if (!recaptchaVerifierRef.current) {
            setError("reCAPTCHA not initialized. Please refresh the page.");
            setLoading(false);
            return;
        }

        try {
            const fullPhoneNumber = `+91${phone}`;
            const confirmationResult = await signInWithPhoneNumber(auth, fullPhoneNumber, recaptchaVerifierRef.current);
            setConfirmation(confirmationResult);
        } catch (err) {
            console.error("Failed to send OTP:", err);
            setError("Failed to send OTP. Please check the phone number and try again.");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        if (!confirmation) {
            setError("Please send an OTP first.");
            return;
        }
        setLoading(true);
        setError("");

        try {
            // Step 1: Confirm the OTP with Firebase
            await confirmation.confirm(otp);
            // Step 2: OTP is valid, now call your backend API to sign in the user
            const fullPhoneNumber = `+91${phone}`;
            // Use the environment variable for the API endpoint
            const apiUrl = `/posts/otp-login`;

            const localCart = JSON.parse(localStorage.getItem('cart') || '{}');

            try {
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        event: "USER_LOGGED_IN",
                        user: {
                            phone: fullPhoneNumber,
                            seller_email
                        },
                        headers: {
                            'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY,
                            'x-user': seller_email
                        },
                        uri: process.env.NEXT_PUBLIC_API_BASE_URL + '/fcm'
                    }));
                }
            } catch (e) {
                console.error(e)
            }

            const {token, cart, wishlist, ...rData} = await fetchApi(apiUrl, {
                method: 'POST', headers: {
                    'Content-Type': 'application/json',
                    'x-user': seller_email,
                }, body: {phone: fullPhoneNumber, otp, cart: localCart, seller_email}
            });

            // Step 3: Store the token/session data from your API in local storage
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify({...rData,phone: fullPhoneNumber,seller_email, userId: rData._id || rData.upsertedId || rData.userId, _id: rData._id || rData.upsertedId || rData.userId })); // Optional: store user info
            localStorage.setItem('cart', JSON.stringify(cart));
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            localStorage.setItem('customer_email', fullPhoneNumber);
            dispatch(updateCartFromLocalStorage(cart));
            dispatch(updateWishlistFromLocalStorage(wishlist));
            // Step 4: Redirect the user
            const redirectUrl = Array.isArray(router.query.redirect)
                ? router.query.redirect[0]
                : (router.query.redirect || '/');
            await router.push(redirectUrl);

        } catch (err) {
            console.error("Failed to verify OTP or sign in:", err);
            // Provide a more specific error based on the error type
            if (err.code === 'auth/invalid-verification-code') {
                setError("Invalid OTP. Please try again.");
            } else {
                setError("Sign-in failed. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            setGoogleUser(user); // Store Google user and show phone input
            setPhone(""); // Clear phone input for fresh entry
        } catch (err) {
            console.error("Google Sign-In Error:", err);
            if (err.code === 'auth/unauthorized-domain') {
                setError("Domain not authorized. Please add this domain to Firebase Console.");
            } else if (err.code === 'auth/popup-closed-by-user') {
                setError("Sign-in popup was closed.");
            } else {
                setError("Google Sign-In failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const completeGoogleLogin = async () => {
        if (phone.length < 10) {
            setError("Please enter a valid phone number.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const user = googleUser;
            const email = user.email;
            const displayName = user.displayName;
            const photoURL = user.photoURL;
            const fullPhoneNumber = `+91${phone}`;

            const apiUrl = `/posts/google-login`;
            const localCart = JSON.parse(localStorage.getItem('cart') || '{}');

            try {
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        event: "USER_LOGGED_IN",
                        user: {
                            email: email,
                            seller_email
                        },
                        headers: {
                            'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY,
                            'x-user': seller_email
                        },
                        uri: process.env.NEXT_PUBLIC_API_BASE_URL + '/fcm'
                    }));
                }
            } catch (e) {
                console.error(e)
            }

            const {token, cart, wishlist, ...rData} = await fetchApi(apiUrl, {
                method: 'POST', headers: {
                    'Content-Type': 'application/json',
                    'x-user': seller_email,
                }, body: {email, displayName, photoURL, phone: fullPhoneNumber, cart: localCart, seller_email}
            });

            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify({...rData, email, phone: fullPhoneNumber, seller_email, userId: rData._id || rData.upsertedId || rData.userId, _id: rData._id || rData.upsertedId || rData.userId }));
            localStorage.setItem('cart', JSON.stringify(cart));
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            localStorage.setItem('customer_email', fullPhoneNumber);
            dispatch(updateCartFromLocalStorage(cart));
            dispatch(updateWishlistFromLocalStorage(wishlist));

            const redirectUrl = Array.isArray(router.query.redirect)
                ? router.query.redirect[0]
                : (router.query.redirect || '/');
            await router.push(redirectUrl);

        } catch (err) {
            console.error("Google Login Completion Error:", err);
            setError("Failed to complete login. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (<div className="flex min-h-screen items-center justify-center bg-white">
            <div className="w-full max-w-sm p-6 bg-white rounded-lg text-center">
                <h1 className="text-3xl font-bold">
                    Get <span className="text-red-500">Started</span>
                </h1>

                {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}

                {!googleUser ? (
                    <>
                        <div className="flex justify-center my-2">
                            <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded-full uppercase">Step 1</span>
                        </div>
                        {/*<p className="text-gray-700 mt-2">Login with your Phone Number</p>*/}
                        {/*<div className="mt-6">*/}
                        {/*    {!confirmation ? (<>*/}
                        {/*            <input*/}
                        {/*                type="tel"*/}
                        {/*                aria-label="Phone number input"*/}
                        {/*                placeholder="Enter phone number"*/}
                        {/*                className="w-full border p-2 rounded-lg mb-2"*/}
                        {/*                value={phone}*/}
                        {/*                onChange={(e) => setPhone(e.target.value)}*/}
                        {/*            />*/}
                        {/*            <button*/}
                        {/*                onClick={sendOtp}*/}
                        {/*                disabled={loading || phone.length < 10}*/}
                        {/*                className="mt-4 w-full bg-red-500 text-white py-3 rounded-lg text-lg font-semibold disabled:bg-red-300 disabled:cursor-not-allowed"*/}
                        {/*            >*/}
                        {/*                {loading ? "Sending..." : "Send OTP"}*/}
                        {/*            </button>*/}
                        {/*        </>) : (<>*/}
                        {/*            <input*/}
                        {/*                type="text"*/}
                        {/*                aria-label="OTP input"*/}
                        {/*                placeholder="Enter OTP"*/}
                        {/*                className="w-full border p-2 rounded-lg mb-2"*/}
                        {/*                value={otp}*/}
                        {/*                onChange={(e) => setOtp(e.target.value)}*/}
                        {/*            />*/}
                        {/*            <button*/}
                        {/*                onClick={verifyOtp}*/}
                        {/*                disabled={loading || otp.length < 6}*/}
                        {/*                className="mt-4 w-full bg-green-500 text-white py-3 rounded-lg text-lg font-semibold disabled:bg-green-300 disabled:cursor-not-allowed"*/}
                        {/*            >*/}
                        {/*                {loading ? "Verifying & Signing In..." : "Verify & Sign In"}*/}
                        {/*            </button>*/}
                        {/*        </>)}*/}
                        {/*</div>*/}

                        <div className="mt-4">
                            <button
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg text-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-50"
                            >
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6"/>
                                Sign in with Google
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex justify-center my-2">
                            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full uppercase">Step 2</span>
                        </div>
                        <p className="text-gray-700 mt-2">Please enter your mobile number to continue</p>
                        <div className="mt-6">
                            <input
                                type="tel"
                                aria-label="Phone number input"
                                placeholder="Enter phone number"
                                className="w-full border p-2 rounded-lg mb-2"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            <button
                                onClick={completeGoogleLogin}
                                disabled={loading || phone.length < 10}
                                className="mt-4 w-full bg-red-500 text-white py-3 rounded-lg text-lg font-semibold disabled:bg-red-300 disabled:cursor-not-allowed"
                            >
                                {loading ? "Processing..." : "Continue"}
                            </button>
                            <button
                                onClick={() => {
                                    setGoogleUser(null);
                                    setPhone("");
                                    setError("");
                                }}
                                disabled={loading}
                                className="mt-2 w-full bg-gray-200 text-gray-700 py-2 rounded-lg text-md font-semibold hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                )}

                {/* This div is used by reCAPTCHA and should be present in the DOM */}
                <div id="recaptcha-container"></div>
            </div>
        </div>);
};

export default LoginPage;
