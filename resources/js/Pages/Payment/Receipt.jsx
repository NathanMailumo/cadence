import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Download, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Receipt({ subscription }) {
    const formattedDate = subscription?.starts_at
        ? new Date(subscription.starts_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          });

    const expiryDate = subscription?.ends_at
        ? new Date(subscription.ends_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : 'N/A';

    const planName =
        subscription?.plan_type === 'semester' ? 'Semester Pass' : 'Plus Plan';
    const amountPaid =
        subscription?.plan_type === 'semester' ? '₦1,500' : '₦500';
    const referenceId =
        subscription?.paystack_reference ||
        'TRX-' + Math.floor(Math.random() * 1000000000);

    const handleDownloadPdf = () => {
        window.print();
    };

    return (
        <AuthenticatedLayout>
            <Head>
                <title>Cadence - Payment Receipt</title>
                <link
                    rel="icon"
                    type="image/svg+xml"
                    href="/images/cadence_logo.svg"
                />
            </Head>

            {/* Perfectly centers the card horizontally and vertically inside the main layout area */}
            <div className="flex h-full w-full items-center justify-center p-4 sm:p-6">
                {/* PAPER RECEIPT CARD */}
                <div className="w-full max-w-lg rounded-3xl border border-[#D8DDD5] bg-white p-6 shadow-sm sm:p-10">
                    {/* Top Status Icon */}
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F1E5EA] text-[#762F50]">
                            <CheckCircle2 size={24} strokeWidth={2.5} />
                        </div>
                        <span className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#AD5266]">
                            Official Transaction Receipt
                        </span>
                        <h1
                            className="mt-1 text-2xl font-bold tracking-tight text-[#30302D]"
                            style={{ fontFamily: '"Manrope", sans-serif' }}
                        >
                            Cadence Workspace
                        </h1>
                        <p className="mt-1 text-xs text-[#73736C]">
                            Payment processed securely via Paystack
                        </p>
                    </div>

                    {/* Receipt Tear Line Effect */}
                    <div className="my-6 border-t border-dashed border-[#D8DDD5]" />

                    {/* Receipt Metadata */}
                    <div className="space-y-3 text-xs">
                        <div className="flex justify-between">
                            <span className="text-[#73736C]">Date Issued</span>
                            <span className="font-semibold text-[#30302D]">
                                {formattedDate}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#73736C]">Reference ID</span>
                            <span className="font-mono font-medium text-[#30302D]">
                                {referenceId}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#73736C]">
                                Payment Status
                            </span>
                            <span className="rounded-full bg-[#EBF5EE] px-2.5 py-0.5 font-bold text-[#1F7A3F]">
                                Successful
                            </span>
                        </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="mt-6 rounded-2xl bg-[#F7F7F2] p-4 sm:p-5">
                        <div className="flex items-center justify-between border-b border-[#E5E7E1] pb-3 text-[10px] font-bold uppercase tracking-wider text-[#A5A59D]">
                            <span>Description</span>
                            <span>Total</span>
                        </div>

                        <div className="py-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-bold text-[#30302D]">
                                        {planName}
                                    </p>
                                    <p className="mt-0.5 text-[11px] text-[#73736C]">
                                        Valid until {expiryDate}
                                    </p>
                                </div>
                                <span className="text-xs font-extrabold text-[#30302D]">
                                    {amountPaid}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-[#E5E7E1] pt-3 text-xs font-bold text-[#30302D]">
                            <span>Total Paid</span>
                            <span className="text-sm font-extrabold text-[#762F50]">
                                {amountPaid}
                            </span>
                        </div>
                    </div>

                    {/* Bottom Perforation */}
                    <div className="my-6 border-t border-dashed border-[#D8DDD5]" />

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={handleDownloadPdf}
                            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#D8DDD5] bg-white px-4 py-3 text-xs font-semibold text-[#30302D] shadow-sm transition hover:bg-[#F7F7F2]"
                        >
                            <Download size={14} className="text-[#73736C]" />
                            Download PDF Receipt
                        </button>

                        <Link
                            href="/dashboard"
                            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#762F50] px-4 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#5E243F]"
                        >
                            <span>Return to Dashboard</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* Security Footer */}
                    <div className="mt-6 flex items-center justify-center gap-1.5 text-center text-[10px] text-[#A5A59D]">
                        <ShieldCheck size={13} className="text-[#AD5266]" />
                        <span>Encrypted & Verified Transaction</span>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
