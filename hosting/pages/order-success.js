import Link from "next/link";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {CheckCircle2, PackageCheck, Sparkles, Truck} from "lucide-react";
import {updateCartFromLocalStorage} from "@/redux/cartSlice";
import {buildTenantPath, getStoredTenant} from "@/utils/util";

export default function OrderSuccessPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const {orderId} = router.query;
    const tenant = getStoredTenant();
    const storeName = tenant?.storeName || tenant?.sellerName || "your storefront";
    const continueHref = buildTenantPath("/", tenant);
    const ordersHref = buildTenantPath("/orders", tenant);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify([]));
        dispatch(updateCartFromLocalStorage([]));
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,#ecfdf5_0%,#ffffff_42%,#f8fafc_100%)] px-4 pb-12 pt-24 sm:px-6">
            <div className="mx-auto max-w-4xl">
                <div className="overflow-hidden rounded-[36px] border border-emerald-100 bg-white shadow-[0_30px_90px_rgba(16,185,129,0.12)]">
                    <div className="bg-[linear-gradient(135deg,#022c22_0%,#065f46_48%,#10b981_100%)] px-6 py-10 text-white sm:px-10">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em]">
                            <Sparkles className="h-4 w-4"/>
                            Payment complete
                        </div>
                        <div className="mt-6 flex items-start gap-4">
                            <div className="rounded-[28px] bg-white/10 p-4">
                                <CheckCircle2 className="h-12 w-12"/>
                            </div>
                            <div>
                                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Order confirmed for {storeName}</h1>
                                <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-50">
                                    Your payment was successful and the order is now in the storefront workflow for processing and delivery.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 px-6 py-8 sm:px-10 lg:grid-cols-[1.05fr_0.95fr]">
                        <div className="space-y-5">
                            <div className="rounded-[28px] border border-emerald-100 bg-emerald-50 p-5">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-700">Order reference</p>
                                <p className="mt-3 text-2xl font-semibold text-gray-900">{orderId || "Processing..."}</p>
                                <p className="mt-2 text-sm text-gray-600">Keep this ID handy for order tracking and support.</p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-[28px] border border-gray-200 bg-white p-5">
                                    <PackageCheck className="h-6 w-6 text-emerald-600"/>
                                    <p className="mt-4 text-base font-semibold text-gray-900">Packed into the order queue</p>
                                    <p className="mt-2 text-sm leading-6 text-gray-500">The storefront can now start fulfillment and review the placed items.</p>
                                </div>
                                <div className="rounded-[28px] border border-gray-200 bg-white p-5">
                                    <Truck className="h-6 w-6 text-emerald-600"/>
                                    <p className="mt-4 text-base font-semibold text-gray-900">Delivery updates next</p>
                                    <p className="mt-2 text-sm leading-6 text-gray-500">You can check upcoming order status changes from your account order history.</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[32px] border border-gray-200 bg-gray-50 p-6">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-400">What to do next</p>
                            <div className="mt-5 space-y-3 text-sm text-gray-600">
                                <div className="flex items-start gap-3 rounded-2xl bg-white p-4">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600"/>
                                    <span>Open your storefront orders page to monitor progress.</span>
                                </div>
                                <div className="flex items-start gap-3 rounded-2xl bg-white p-4">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600"/>
                                    <span>Continue shopping without leaving the same seller storefront.</span>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                <Link href={ordersHref} className="flex w-full items-center justify-center rounded-2xl bg-gray-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-black">
                                    View Orders
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
