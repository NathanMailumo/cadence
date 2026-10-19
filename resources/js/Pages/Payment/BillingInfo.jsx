import React, { useEffect, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    ArrowLeft,
    CreditCard,
    ShieldCheck,
    CheckCircle2,
    Zap,
} from 'lucide-react';

export default function BillingInfo({ subscription, currentPlan = 'free' }) {
    const { flash } = usePage().props;
    const [successBanner, setSuccessBanner] = useState(flash?.success || null);

    useEffect(() => {
        if (flash?.success) {
            setSuccessBanner(flash.success);
            const timer = setTimeout(() => setSuccessBanner(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleCancel = () => {
        if (
            window.confirm(
                'Are you sure you want to cancel your subscription? You will be moved to the Free plan.',
            )
        ) {
            router.post(route('subscription.cancel'));
        }
    };

    const expiryFormatted = subscription?.ends_at
        ? new Date(subscription.ends_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : 'N/A';

    return (
        <AuthenticatedLayout>
            <Head>
                <title>Cadence - Billing & Subscription Info</title>
                <link
                    rel="icon"
                    type="image/svg+xml"
                    href="/images/cadence_logo.svg"
                />
            </Head>

            <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
                <Link
                    href="/profile"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#73736C] transition hover:text-[#762F50]"
                >
                    <ArrowLeft size={15} />
                    Back to Profile
                </Link>

                {successBanner && (
                    <div className="mt-4 flex items-center gap-2.5 rounded-2xl border border-[#762F50]/20 bg-[#F1E5EA] p-4 text-xs font-bold text-[#762F50]">
                        <CheckCircle2
                            size={16}
                            className="shrink-0 text-[#AD5266]"
                        />
                        <span>{successBanner}</span>
                    </div>
                )}

                <div className="mt-8 rounded-3xl border border-[#D8DDD5] bg-white p-6 shadow-sm sm:p-10">
                    <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7F7F2] text-[#762F50]">
                            <CreditCard size={22} />
                        </span>
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#AD5266]">
                                Subscription Management
                            </span>
                            <h1 className="text-2xl font-bold text-[#30302D]">
                                Plan & Billing Details
                            </h1>
                        </div>
                    </div>

                    <div className="my-6 border-t border-dashed border-[#D8DDD5]" />

                    {/* Subscription Details Card */}
                    <div className="space-y-4 rounded-2xl bg-[#F7F7F2] p-6 text-xs">
                        <div className="flex justify-between border-b border-[#E5E7E1] pb-3">
                            <span className="text-[#73736C]">Current Plan</span>
                            <span className="font-extrabold uppercase text-[#30302D]">
                                {currentPlan === 'free'
                                    ? 'Free Plan'
                                    : currentPlan === 'semester'
                                      ? 'Semester Pass'
                                      : 'Plus Plan'}
                            </span>
                        </div>
                        <div className="flex justify-between border-b border-[#E5E7E1] pb-3">
                            <span className="text-[#73736C]">Status</span>
                            <span
                                className={`rounded-full px-2.5 py-0.5 font-bold ${currentPlan === 'free' ? 'bg-[#D8DDD5]/40 text-[#73736C]' : 'bg-[#EBF5EE] text-[#1F7A3F]'}`}
                            >
                                {currentPlan === 'free' ? 'Inactive' : 'Active'}
                            </span>
                        </div>
                        {currentPlan !== 'free' && (
                            <>
                                <div className="flex justify-between border-b border-[#E5E7E1] pb-3">
                                    <span className="text-[#73736C]">
                                        Expires On
                                    </span>
                                    <span className="font-semibold text-[#30302D]">
                                        {expiryFormatted}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#73736C]">
                                        Paystack Reference
                                    </span>
                                    <span className="font-mono font-medium text-[#30302D]">
                                        {subscription?.paystack_reference ||
                                            'N/A'}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        {currentPlan === 'free' ? (
                            <Link
                                href={route('billing')}
                                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#762F50] py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#5E243F]"
                            >
                                <Zap size={14} />
                                Upgrade Plan
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#AD5266] bg-white py-3 text-xs font-semibold text-[#AD5266] shadow-sm transition hover:bg-[#FCE8ED]"
                            >
                                Cancel Plan
                            </button>
                        )}
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-1.5 text-center text-[10px] text-[#A5A59D]">
                        <ShieldCheck size={13} className="text-[#AD5266]" />
                        <span>Secured by Paystack • Cadence Workspace</span>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
