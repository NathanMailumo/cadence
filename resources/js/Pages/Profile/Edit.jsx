import React, { useEffect, useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Camera,
    Check,
    CreditCard,
    Mail,
    CheckCircle2,
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function EditProfile({ currentPlan = 'free' }) {
    const { props } = usePage();
    const user = props.auth?.user;
    const flash = props.flash;

    const [previewUrl, setPreviewUrl] = useState(user?.profile_image_url || '');
    const [successBanner, setSuccessBanner] = useState(flash?.success || null);

    const { data, setData, patch, processing, errors, recentlySuccessful } =
        useForm({
            name: user?.name || '',
            email: user?.email || '',
            profile_image: null,
        });

    // Handle auto-dismissing success banner after 4 seconds
    useEffect(() => {
        if (flash?.success) {
            setSuccessBanner(flash.success);
            const timer = setTimeout(() => {
                setSuccessBanner(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    useEffect(() => {
        return () => {
            if (previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        if (previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }

        setData('profile_image', file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        patch('/profile', { forceFormData: true });
    };

    const handleCancelSubscription = () => {
        if (
            window.confirm(
                'Are you sure you want to cancel your subscription? You will be moved to the Free plan.',
            )
        ) {
            router.post(route('subscription.cancel'));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head>
                <title>Cadence - Profile</title>
                <link
                    rel="icon"
                    type="image/svg+xml"
                    href="/images/cadence_logo.svg"
                />
            </Head>

            <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-10 sm:py-10 lg:px-12">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#73736C] transition hover:text-[#762F50]"
                >
                    <ArrowLeft size={15} />
                    Back to home
                </Link>

                {/* AUTO-DISMISSING SUCCESS BANNER */}
                {successBanner && (
                    <div className="animate-in fade-in slide-in-from-top-2 mt-4 flex items-center gap-2.5 rounded-2xl border border-[#762F50]/20 bg-[#F1E5EA] p-4 text-xs font-bold text-[#762F50] transition-all duration-300">
                        <CheckCircle2
                            size={16}
                            className="shrink-0 text-[#AD5266]"
                        />
                        <span>{successBanner}</span>
                    </div>
                )}

                <header className="mt-8 border-b border-[#D8DDD5] pb-8">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#AD5266]">
                        Account
                    </p>
                    <h1 className="mt-3 text-4xl font-medium tracking-[-0.06em] text-[#30302D]">
                        Your profile
                    </h1>
                    <p className="mt-3 max-w-lg text-sm leading-6 text-[#73736C]">
                        View your account details and manage your Cadence plan.
                    </p>
                </header>

                <div className="mt-8 grid gap-5 lg:grid-cols-2">
                    <section className="rounded-2xl border border-[#D8DDD5] bg-white p-6 sm:p-8">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[#F1E5EA] text-lg font-bold text-[#762F50]">
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt={`${user?.name || 'Account'} profile`}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        (user?.name || user?.email || 'A')
                                            .charAt(0)
                                            .toUpperCase()
                                    )}
                                </div>
                                <label
                                    htmlFor="profile-image"
                                    className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[#762F50] text-white transition hover:bg-[#5E243F]"
                                    title="Update profile image"
                                >
                                    <Camera size={13} />
                                    <span className="sr-only">
                                        Update profile image
                                    </span>
                                </label>
                                <input
                                    id="profile-image"
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg,image/webp,image/gif"
                                    onChange={handleImageChange}
                                    className="sr-only"
                                />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#AD5266]">
                                    Account information
                                </p>
                                <h2 className="mt-1 text-xl font-medium text-[#30302D]">
                                    Personal details
                                </h2>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="mt-8">
                            <dl className="space-y-5">
                                <div>
                                    <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A5A59D]">
                                        Name
                                    </dt>
                                    <dd className="mt-1 text-sm font-semibold text-[#30302D]">
                                        {data.name || 'Not provided'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A5A59D]">
                                        <Mail size={12} />
                                        Email
                                    </dt>
                                    <dd className="mt-1 text-sm font-semibold text-[#30302D]">
                                        {data.email || 'Not provided'}
                                    </dd>
                                </div>
                            </dl>
                            {errors.profile_image && (
                                <p className="mt-4 text-xs text-rose-600">
                                    {errors.profile_image}
                                </p>
                            )}
                            <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#F0F0E9] pt-5">
                                <p className="text-xs text-[#73736C]">
                                    JPG, PNG, WebP, or GIF up to 5 MB.
                                </p>
                                <button
                                    type="submit"
                                    disabled={processing || !data.profile_image}
                                    className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#762F50] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#5E243F] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {recentlySuccessful ? (
                                        <Check size={14} />
                                    ) : null}
                                    {processing
                                        ? 'Saving...'
                                        : recentlySuccessful
                                          ? 'Saved'
                                          : 'Update image'}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* BILLING & PLAN MANAGEMENT CARD LINK */}
                    <Link
                        href={route('billing.info')}
                        className="group relative flex flex-col justify-between rounded-2xl border border-[#D8DDD5] bg-white p-6 transition hover:border-[#AD5266] hover:shadow-md sm:p-8"
                    >
                        <div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F7F2] text-[#762F50] transition group-hover:bg-[#F1E5EA]">
                                        <CreditCard size={18} />
                                    </span>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#AD5266]">
                                            Billing
                                        </p>
                                        <h2 className="mt-1 text-xl font-medium text-[#30302D]">
                                            Plan and billing
                                        </h2>
                                    </div>
                                </div>
                                <span className="text-xs font-semibold text-[#762F50] underline opacity-0 transition group-hover:opacity-100">
                                    Manage &rarr;
                                </span>
                            </div>

                            <div className="mt-6 flex items-center justify-between rounded-xl bg-[#F7F7F2] p-4">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#73736C]">
                                        Current Plan
                                    </p>
                                    <p className="mt-0.5 text-sm font-bold uppercase text-[#30302D]">
                                        {currentPlan === 'free'
                                            ? 'Free Plan'
                                            : currentPlan === 'semester'
                                              ? 'Semester Pass'
                                              : 'Plus Plan'}
                                    </p>
                                </div>
                                <span
                                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                                        currentPlan === 'free'
                                            ? 'bg-[#D8DDD5]/40 text-[#73736C]'
                                            : 'bg-[#F1E5EA] text-[#762F50]'
                                    }`}
                                >
                                    {currentPlan === 'free'
                                        ? 'Inactive'
                                        : 'Active'}
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-[#F0F0E9] pt-4 text-xs font-semibold text-[#762F50]">
                            Click to view billing info & manage subscription
                            &rarr;
                        </div>
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
