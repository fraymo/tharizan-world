"use client";

import React, {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router"; // Import useRouter for redirection
import {auth, RecaptchaVerifier, signInWithPhoneNumber, googleProvider, signInWithPopup} from "@/utils/firebase";
import {fetchApi, seller_email} from "@/utils/util";
import {updateCartFromLocalStorage} from "@/redux/cartSlice";
import {useDispatch} from "react-redux";
import {updateWishlistFromLocalStorage} from "@/redux/wishlistSlice";
import {ArrowRight, CheckCircle2, LockKeyhole, Phone, ShieldCheck, Sparkles, Star} from "lucide-react";

const trustPoints = [
    "Fast Google sign-in with one secure step",
    "Phone-linked access for order updates and support",
    "Encrypted authentication handled with Firebase"
];

const highlights = [
    {label: "Active drops", value: "120+"},
    {label: "Happy shoppers", value: "18k"},
    {label: "Rated experience", value: "4.9/5"}
];

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

    return (
        <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top,#fff1f2_0%,#fff8f3_30%,#f8fafc_65%,#eef2ff_100%)] px-4 py-10 sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-[-8%] top-16 h-56 w-56 rounded-full bg-rose-300/30 blur-3xl"/>
                <div className="absolute right-[-6%] top-24 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl"/>
                <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-200/30 blur-3xl"/>
            </div>

            <div className="relative mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 shadow-[0_30px_120px_rgba(15,23,42,0.18)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
                <div className="relative flex flex-col justify-between overflow-hidden bg-slate-950 px-6 py-8 text-white sm:px-8 sm:py-10 lg:px-10">
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(244,63,94,0.28),rgba(15,23,42,0.96)_38%,rgba(59,130,246,0.22))]"/>
                    <div className="absolute right-6 top-6 h-24 w-24 rounded-full border border-white/10 bg-white/5 blur-2xl"/>
                    <div className="absolute bottom-10 left-10 h-28 w-28 rounded-full border border-white/10 bg-amber-300/10 blur-2xl"/>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
                            <Sparkles className="h-4 w-4 text-amber-300"/>
                            Tharizan World
                        </div>
                        <div className="mt-8 max-w-xl">
                            <p className="text-sm font-medium uppercase tracking-[0.35em] text-rose-200/80">
                                Trending login experience
                            </p>
                            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
                                Sign in to a sharper, premium shopping experience.
                            </h1>
                            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-200 sm:text-base">
                                A modern entry point built for fast access, cleaner trust signals, and a smoother handoff from discovery to checkout.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 mt-10 grid gap-4 sm:grid-cols-3">
                        {highlights.map((item) => (
                            <div key={item.label} className="rounded-3xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                                <p className="text-2xl font-semibold text-white">{item.value}</p>
                                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-300">{item.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="relative z-10 mt-10 space-y-4">
                        {trustPoints.map((point) => (
                            <div key={point} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300"/>
                                <p className="text-sm leading-6 text-slate-200">{point}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
                    <div className="mx-auto flex h-full max-w-md flex-col justify-center">
                        <div className="w-fit rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 shadow-sm">
                            {!googleUser ? "Step 1 of 2" : "Step 2 of 2"}
                        </div>

                        <div className="mt-6">
                            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                                {!googleUser ? "Continue with Google" : "Add your mobile number"}
                            </h2>
                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                {!googleUser
                                    ? "Use your Google account to unlock saved wishlist, cart sync, and faster checkout."
                                    : "We use your mobile number for order updates, account recovery, and a more seamless shopping flow."}
                            </p>
                        </div>

                        {error && (
                            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                {error}
                            </div>
                        )}

                        <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                            {!googleUser ? (
                                <div className="space-y-5">
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
                                                <img
                                                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                                    alt="Google"
                                                    className="h-6 w-6"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">Google sign-in</p>
                                                <p className="text-xs text-slate-500">One tap identity verification</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleGoogleSignIn}
                                        disabled={loading}
                                        className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                                    >
                                        <span>{loading ? "Connecting..." : "Sign in with Google"}</span>
                                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1"/>
                                    </button>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-2xl border border-slate-200 p-4">
                                            <ShieldCheck className="h-5 w-5 text-emerald-600"/>
                                            <p className="mt-3 text-sm font-semibold text-slate-900">Protected sign-in</p>
                                            <p className="mt-1 text-xs leading-6 text-slate-500">Authentication is validated with Firebase security.</p>
                                        </div>
                                        <div className="rounded-2xl border border-slate-200 p-4">
                                            <Star className="h-5 w-5 text-amber-500"/>
                                            <p className="mt-3 text-sm font-semibold text-slate-900">Faster return visits</p>
                                            <p className="mt-1 text-xs leading-6 text-slate-500">Your cart and wishlist are restored immediately after sign-in.</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                                        Signed in as <span className="font-semibold">{googleUser.email}</span>
                                    </div>

                                    <label className="block">
                                        <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                                            <Phone className="h-4 w-4"/>
                                            Mobile number
                                        </span>
                                        <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 focus-within:border-rose-400 focus-within:bg-white">
                                            <span className="pr-3 text-sm font-semibold text-slate-500">+91</span>
                                            <input
                                                type="tel"
                                                aria-label="Phone number input"
                                                placeholder="Enter phone number"
                                                className="w-full bg-transparent py-4 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                            />
                                        </div>
                                    </label>

                                    <button
                                        onClick={completeGoogleLogin}
                                        disabled={loading || phone.length < 10}
                                        className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-rose-500 px-5 py-4 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-rose-300"
                                    >
                                        <LockKeyhole className="h-4 w-4"/>
                                        <span>{loading ? "Processing..." : "Continue to account"}</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setGoogleUser(null);
                                            setPhone("");
                                            setError("");
                                        }}
                                        disabled={loading}
                                        className="w-full rounded-2xl border border-slate-200 px-5 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        Use a different Google account
                                    </button>
                                </div>
                            )}
                        </div>

                        <p className="mt-6 text-xs leading-6 text-slate-500">
                            By continuing, you agree to a secure account session for Tharizan World access, wishlist sync, and support communication.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3 text-xs font-medium text-slate-500">
                            <span className="rounded-full border border-slate-200 px-3 py-2">Wishlist sync</span>
                            <span className="rounded-full border border-slate-200 px-3 py-2">Cart recovery</span>
                            <span className="rounded-full border border-slate-200 px-3 py-2">Secure checkout</span>
                        </div>
                    </div>

                    <div id="recaptcha-container"></div>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;
