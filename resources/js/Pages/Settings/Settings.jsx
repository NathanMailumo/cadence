import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { CreditCard, Download, ShieldAlert } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Settings() {
    const [defaultFormat, setDefaultFormat] = useState('pdf');

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-[#F0F0E9] font-sans text-[#30302D]">
                <Head title="Cadence - Settings" />

                <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-[#D8DDD5] pb-6">
                        <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#AD5266]">
                                Preferences
                            </span>
                            <h1
                                className="mt-1 text-3xl font-bold tracking-tight text-[#30302D]"
                                style={{ fontFamily: '"Manrope", sans-serif' }}
                            >
                                Settings
                            </h1>
                            <p className="mt-1 text-xs text-[#73736C]">
                                Manage workspace parameters and study options.
                            </p>
                        </div>

                        <Link
                            href={typeof route === 'function' ? route('dashboard') : '/dashboard'}
                            className="rounded-full border border-[#D8DDD5] bg-[#FFFFFF] px-4 py-2 text-xs font-semibold text-[#30302D] shadow-sm hover:bg-[#F7F7F2] transition-colors"
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>

                    {/* SECTION 1: SUBSCRIPTION & PAYMENT PLAN */}
                    <div className="rounded-3xl border border-[#D8DDD5] bg-[#FFFFFF] p-6 shadow-sm sm:p-8">
                        <div className="mb-6 flex items-center gap-3 border-b border-[#F0F0E9] pb-4">
                            <CreditCard className="h-5 w-5 text-[#AD5266]" />
                            <h2
                                className="text-xl font-bold text-[#30302D]"
                                style={{ fontFamily: '"Manrope", sans-serif' }}
                            >
                                Subscription & Plan
                            </h2>
                        </div>

                        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-[#D8DDD5] bg-[#FDF8FA] p-6 text-[#30302D] md:flex-row md:items-center">
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-3">
                                    <span className="text-lg font-bold text-[#762F50]" style={{ fontFamily: '"Manrope", sans-serif' }}>
                                        Scholar Plan
                                    </span>
                                    <span className="rounded-full bg-[#AD5266] px-2.5 py-0.5 text-[10px] font-bold text-white">
                                        Active
                                    </span>
                                </div>
                                <p className="max-w-xl text-xs text-[#73736C]">
                                    Unlimited visual study spaces, AI revision pack compilation, and collaborative workspaces.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: EXPORT PREFERENCES */}
                    <div className="rounded-3xl border border-[#D8DDD5] bg-[#FFFFFF] p-6 shadow-sm sm:p-8">
                        <div className="mb-6 flex items-center gap-3 border-b border-[#F0F0E9] pb-4">
                            <Download className="h-5 w-5 text-[#AD5266]" />
                            <h2
                                className="text-xl font-bold text-[#30302D]"
                                style={{ fontFamily: '"Manrope", sans-serif' }}
                            >
                                Export Defaults
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-[#30302D]">
                                    Default Format for Study Guides
                                </label>
                                <select
                                    value={defaultFormat}
                                    onChange={(e) => setDefaultFormat(e.target.value)}
                                    className="mt-1.5 w-full max-w-xs rounded-xl border border-[#D8DDD5] bg-[#F7F7F2] p-2.5 text-xs font-medium text-[#30302D] outline-none focus:border-[#AD5266] focus:bg-[#FFFFFF]"
                                >
                                    <option value="pdf">PDF Document (.pdf)</option>
                                    <option value="markdown">Markdown Source (.md)</option>
                                    <option value="txt">Plain Text (.txt)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
