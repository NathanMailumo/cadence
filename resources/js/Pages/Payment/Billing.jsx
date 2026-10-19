import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Check, Sparkles, Zap, ShieldCheck, Crown } from 'lucide-react';

export default function Billing({ currentPlan = 'free' }) {
    const [loadingPlan, setLoadingPlan] = useState(null);
    const [loadingCancel, setLoadingCancel] = useState(false);
    const { flash } = usePage().props;

    const handleSubscribe = (planType) => {
        setLoadingPlan(planType);
        router.post(
            route('subscription.initialize'),
            { plan: planType },
            {
                onFinish: () => setLoadingPlan(null),
            },
        );
    };

    const handleCancel = () => {
        if (
            !window.confirm(
                'Are you sure you want to cancel your subscription? You will be moved to the Free plan.',
            )
        ) {
            return;
        }
        setLoadingCancel(true);
        router.post(
            route('subscription.cancel'),
            {},
            {
                onFinish: () => setLoadingCancel(false),
            },
        );
    };

    return (
        <AuthenticatedLayout>
            <Head>
                <title>Cadence - Billing & Plans</title>
                <link
                    rel="icon"
                    type="image/svg+xml"
                    href="/images/cadence_logo.svg"
                />
            </Head>

            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
                {/* SUCCESS FLASH BANNER */}
                {flash?.success && (
                    <div className="mb-6 rounded-2xl border border-[#762F50]/20 bg-[#F1E5EA] p-4 text-center text-xs font-bold text-[#762F50]">
                        🎉 {flash.success}
                    </div>
                )}
                {/* Header */}
                <div className="text-center">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#AD5266]">
                        Plans & Pricing
                    </span>
                    <h1
                        className="mt-1 text-2xl font-bold text-[#30302D] sm:text-3xl"
                        style={{ fontFamily: '"Manrope", sans-serif' }}
                    >
                        Elevate your study workflow
                    </h1>
                    <p className="mt-2 text-xs text-[#73736C] sm:text-sm">
                        Choose the plan that fits your semester goals. Your
                        study spaces and notes are always safe.
                    </p>
                </div>

                {/* PLANS GRID */}
                <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-3">
                    {/* 1. FREE PLAN */}
                    <div
                        className={`flex flex-col justify-between rounded-3xl border bg-white p-6 shadow-sm transition-all ${
                            currentPlan === 'free'
                                ? 'border-[#AD5266] ring-2 ring-[#AD5266]/20'
                                : 'border-[#D8DDD5]'
                        }`}
                    >
                        <div className="flex-grow">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-[#30302D]">
                                    Free
                                </h3>
                                {currentPlan === 'free' && (
                                    <span className="rounded-full bg-[#F1E5EA] px-2.5 py-1 text-[10px] font-bold text-[#762F50]">
                                        Current Plan
                                    </span>
                                )}
                            </div>
                            <p className="mt-4 text-3xl font-extrabold text-[#30302D]">
                                ₦0{' '}
                                <span className="text-xs font-normal text-[#73736C]">
                                    / forever
                                </span>
                            </p>

                            <ul className="mt-6 space-y-3 text-xs text-[#73736C]">
                                <li className="flex items-start gap-2">
                                    <Check
                                        size={14}
                                        className="mt-0.5 shrink-0 text-[#762F50]"
                                    />
                                    <span>Unlimited resource spaces.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check
                                        size={14}
                                        className="mt-0.5 shrink-0 text-[#762F50]"
                                    />
                                    <span>
                                        Add videos, links, and past exam papers.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check
                                        size={14}
                                        className="mt-0.5 shrink-0 text-[#762F50]"
                                    />
                                    <span>
                                        Limited monthly AI revision packs.
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="mt-8 border-t border-[#F0F0E9] pt-4">
                            <button
                                type="button"
                                disabled
                                className="w-full cursor-default rounded-full border border-[#D8DDD5] bg-[#F7F7F2] py-2.5 text-xs font-semibold text-[#73736C]"
                            >
                                {currentPlan === 'free'
                                    ? 'Active Plan'
                                    : 'Included'}
                            </button>
                        </div>
                    </div>

                    {/* 2. PLUS PLAN */}
                    <div
                        className={`relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-[#FAF8F2] p-6 shadow-sm transition-all ${
                            currentPlan === 'plus'
                                ? 'border-[#AD5266] ring-2 ring-[#AD5266]/20'
                                : 'border-[#AD5266]/40'
                        }`}
                    >
                        <div className="absolute right-0 top-0 flex items-center gap-1 rounded-bl-2xl bg-[#AD5266] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                            <Sparkles size={11} /> Popular
                        </div>
                        <div className="flex-grow">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#AD5266]">
                                Plus
                            </h3>
                            <p className="mt-4 text-3xl font-extrabold text-[#30302D]">
                                ₦500{' '}
                                <span className="text-xs font-normal text-[#73736C]">
                                    / month
                                </span>
                            </p>

                            <ul className="mt-6 space-y-3 text-xs text-[#30302D]">
                                <li className="flex items-start gap-2">
                                    <Check
                                        size={14}
                                        className="mt-0.5 shrink-0 text-[#AD5266]"
                                    />
                                    <span>Everything in Free.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check
                                        size={14}
                                        className="mt-0.5 shrink-0 text-[#AD5266]"
                                    />
                                    <span>
                                        Higher monthly AI revision-pack
                                        generation limit.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check
                                        size={14}
                                        className="mt-0.5 shrink-0 text-[#AD5266]"
                                    />
                                    <span>
                                        Increased collaboration capacity for
                                        study groups.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check
                                        size={14}
                                        className="mt-0.5 shrink-0 text-[#AD5266]"
                                    />
                                    <span>
                                        Priority support & early access to
                                        future premium features.
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="mt-8 border-t border-[#E8E7E0] pt-4">
                            <button
                                type="button"
                                onClick={() =>
                                    currentPlan === 'plus'
                                        ? handleCancel()
                                        : handleSubscribe('plus')
                                }
                                disabled={
                                    loadingPlan === 'plus' || loadingCancel
                                }
                                className={`flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-xs font-semibold shadow-sm transition disabled:opacity-50 ${
                                    currentPlan === 'plus'
                                        ? 'border border-[#AD5266] bg-white text-[#AD5266] hover:bg-[#FCE8ED]'
                                        : 'bg-[#AD5266] text-white hover:bg-[#974356]'
                                }`}
                            >
                                {currentPlan === 'plus' ? (
                                    <span>
                                        {loadingCancel
                                            ? 'Cancelling...'
                                            : 'Cancel Plan'}
                                    </span>
                                ) : (
                                    <>
                                        <Zap size={14} />
                                        {loadingPlan === 'plus'
                                            ? 'Processing...'
                                            : 'Get Pro'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* 3. SEMESTER PASS */}
                    <div
                        className={`relative flex flex-col justify-between rounded-3xl border bg-white p-6 shadow-sm transition-all ${
                            currentPlan === 'semester'
                                ? 'border-[#AD5266] ring-2 ring-[#AD5266]/20'
                                : 'border-[#D8DDD5]'
                        }`}
                    >
                        <div className="absolute right-0 top-0 flex items-center gap-1 rounded-bl-2xl bg-[#762F50] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                            <Crown size={11} /> Best Value
                        </div>
                        <div className="flex-grow">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-[#30302D]">
                                    Semester Pass
                                </h3>
                            </div>
                            <p className="mt-4 text-3xl font-extrabold text-[#30302D]">
                                ₦1,500{' '}
                                <span className="text-xs font-normal text-[#73736C]">
                                    / 4 months
                                </span>
                            </p>

                            <ul className="mt-6 space-y-3 text-xs text-[#73736C]">
                                <li className="flex items-start gap-2">
                                    <Check
                                        size={14}
                                        className="mt-0.5 shrink-0 text-[#762F50]"
                                    />
                                    <span>
                                        Everything in Plus, unlocked for a full
                                        semester.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check
                                        size={14}
                                        className="mt-0.5 shrink-0 text-[#762F50]"
                                    />
                                    <span>
                                        One-time payment covering four
                                        continuous months.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check
                                        size={14}
                                        className="mt-0.5 shrink-0 text-[#762F50]"
                                    />
                                    <span>
                                        Maximum AI generation tier with zero
                                        mid-month interruptions.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check
                                        size={14}
                                        className="mt-0.5 shrink-0 text-[#762F50]"
                                    />
                                    <span>
                                        Zero automatic renewals or surprise bank
                                        debits.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check
                                        size={14}
                                        className="mt-0.5 shrink-0 text-[#762F50]"
                                    />
                                    <span>
                                        Locked-in introductory semester pricing.
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="mt-8 border-t border-[#F0F0E9] pt-4">
                            <button
                                type="button"
                                onClick={() =>
                                    currentPlan === 'semester'
                                        ? handleCancel()
                                        : handleSubscribe('semester')
                                }
                                disabled={
                                    loadingPlan === 'semester' || loadingCancel
                                }
                                className={`flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-xs font-semibold shadow-sm transition disabled:opacity-50 ${
                                    currentPlan === 'semester'
                                        ? 'border border-[#762F50] bg-white text-[#762F50] hover:bg-[#F1E5EA]'
                                        : 'bg-[#762F50] text-white hover:bg-[#5E243F]'
                                }`}
                            >
                                {currentPlan === 'semester' ? (
                                    <span>
                                        {loadingCancel
                                            ? 'Cancelling...'
                                            : 'Cancel Plan'}
                                    </span>
                                ) : (
                                    <>
                                        <Crown size={14} />
                                        {loadingPlan === 'semester'
                                            ? 'Processing...'
                                            : 'Get Semester Pass'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer security note */}
                <div className="mt-12 flex items-center justify-center gap-2 text-center text-xs text-[#73736C]">
                    <ShieldCheck size={15} className="text-[#AD5266]" />
                    <span>
                        Secure payments processed via Paystack. Your study
                        spaces and records are always preserved.
                    </span>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
