"use client";

export default function StoreUnavailableScreen() {
    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,#fff8f6_0%,#ffffff_100%)] px-4 py-10">
            <div className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
                <div className="w-full rounded-[2rem] border border-rose-200 bg-white p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-10">
                    <div className="inline-flex rounded-full bg-rose-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-rose-600">
                        Store not found
                    </div>
                    <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
                        This storefront is not available
                    </h1>
                    <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                        The store may be unavailable, blocked, or removed. Please check the link and try again.
                    </p>
                </div>
            </div>
        </div>
    );
}
