import Link from "next/link";
import {useRouter} from "next/router";
import {AlertTriangle, ArrowRight, LifeBuoy, RefreshCcw, ShieldAlert} from "lucide-react";
import {buildTenantPath, getStoredTenant} from "@/utils/util";

export default function OrderFailurePage() {
    const router = useRouter();
    const {orderId, error} = router.query;
    const tenant = getStoredTenant();
    const storeName = tenant?.storeName || tenant?.sellerName || "your storefront";
    const errorMessage = error || "We couldn't complete the payment for this order.";
    const cartHref = buildTenantPath("/cart", tenant);
    const continueHref = buildTenantPath("/", tenant);

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff1f2_0%,#ffffff_42%,#f8fafc_100%)] px-4 pb-12 pt-24 sm:px-6">
            <div className="mx-auto max-w-4xl">
                <div className="overflow-hidden rounded-[36px] border border-rose-100 bg-white shadow-[0_30px_90px_rgba(244,63,94,0.12)]">
                    <div className="bg-[linear-gradient(135deg,#3f0d17_0%,#881337_50%,#e11d48_100%)] px-6 py-10 text-white sm:px-10">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em]">
                            <ShieldAlert className="h-4 w-4"/>
                            Payment interrupted
                        </div>
                        <div className="mt-6 flex items-start gap-4">
                            <div className="rounded-[28px] bg-white/10 p-4">
                                <AlertTriangle className="h-12 w-12"/>
                            </div>
                            <div>
                                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Order not completed for {storeName}</h1>
                                <p className="mt-3 max-w-2xl text-sm leading-7 text-rose-50">
                                    The storefront is still intact, but this payment attempt did not finish successfully. You can retry from cart or continue browsing.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 px-6 py-8 sm:px-10 lg:grid-cols-[1.05fr_0.95fr]">
                        <div className="space-y-5">
                            <div className="rounded-[28px] border border-rose-100 bg-rose-50 p-5">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-rose-700">Reference</p>
                                <p className="mt-3 text-2xl font-semibold text-gray-900">{orderId || "Unavailable"}</p>
                                <p className="mt-2 text-sm leading-6 text-gray-600">{errorMessage}</p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-[28px] border border-gray-200 bg-white p-5">
                                    <RefreshCcw className="h-6 w-6 text-rose-600"/>
                                    <p className="mt-4 text-base font-semibold text-gray-900">Retry from cart</p>
                                    <p className="mt-2 text-sm leading-6 text-gray-500">Your selected storefront cart is the right place to retry payment safely.</p>
                                </div>
                                <div className="rounded-[28px] border border-gray-200 bg-white p-5">
                                    <LifeBuoy className="h-6 w-6 text-rose-600"/>
                                    <p className="mt-4 text-base font-semibold text-gray-900">Keep the reference</p>
                                    <p className="mt-2 text-sm leading-6 text-gray-500">If you need support, share the order reference so the seller can check the attempt.</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[32px] border border-gray-200 bg-gray-50 p-6">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-400">Next step</p>
                            <div className="mt-5 space-y-3 text-sm text-gray-600">
                                <div className="flex items-start gap-3 rounded-2xl bg-white p-4">
                                    <AlertTriangle className="mt-0.5 h-4 w-4 text-rose-600"/>
                                    <span>Return to cart to retry payment with the same storefront order.</span>
                                </div>
                                <div className="flex items-start gap-3 rounded-2xl bg-white p-4">
                                    <ArrowRight className="mt-0.5 h-4 w-4 text-rose-600"/>
                                    <span>Or continue shopping and come back when you're ready.</span>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                <Link href={cartHref} className="flex w-full items-center justify-center rounded-2xl bg-gray-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-black">
                                    Back to Cart
                                </Link>
                                <Link href={continueHref} className="flex w-full items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-100">
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
