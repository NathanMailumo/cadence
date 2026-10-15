import React from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';

export default function TermsAndConditions() {
    return (
        <GuestLayout>
            <Head>
                <title>Cadence - Terms $ Condititons</title>
                <link
                    rel="icon"
                    type="image/svg+xml"
                    href="/images/cadence_logo.svg"
                />
                {/* Or use href="/logo.png" if your file is a PNG */}
            </Head>

            <div className="mx-auto max-w-4xl px-6 py-16 sm:px-10 lg:px-12">
                <div className="rounded-[2.55rem] border border-[#D8DDD5] bg-white p-8 shadow-sm sm:p-12 lg:p-16">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#AD5266]">
                        LEGAL AGREEMENT
                    </p>
                    <h1
                        className="mt-3 text-3xl font-extrabold text-[#30302D] sm:text-4xl lg:text-5xl"
                        style={{ fontFamily: '"Manrope", sans-serif' }}
                    >
                        Terms and Conditions
                    </h1>
                    <p className="mt-2 text-xs text-[#73736C]">
                        Last updated: October 15, 2026
                    </p>

                    <div className="mt-10 space-y-8 text-xs leading-relaxed text-[#73736C] sm:text-sm">
                        {/* 1. Age Requirements */}
                        <div>
                            <h2 className="text-sm font-bold text-[#30302D] sm:text-base">
                                1. Age Requirements
                            </h2>
                            <p className="mt-2">
                                You must be at least 13 years of age (or the
                                minimum age of digital consent required in your
                                jurisdiction) to create an account and use
                                Cadence. If you are under 18, you confirm that
                                you have reviewed these terms with your parent
                                or legal guardian.
                            </p>
                        </div>

                        {/* 2. Intellectual Property Notice */}
                        <div>
                            <h2 className="text-sm font-bold text-[#30302D] sm:text-base">
                                2. Intellectual Property Notice
                            </h2>
                            <p className="mt-2">
                                All platform design elements, source code,
                                logos, UI graphics, and brand features
                                associated with Cadence are the exclusive
                                intellectual property of Cadence. Users retain
                                ownership of the study materials, notes, and
                                resource items they upload, granting Cadence a
                                limited license solely to host and display them
                                within your personal and collaborative
                                workspaces.
                            </p>
                        </div>

                        {/* 3. Limitation of Liability */}
                        <div>
                            <h2 className="text-sm font-bold text-[#30302D] sm:text-base">
                                3. Limitation of Liability
                            </h2>
                            <p className="mt-2">
                                Cadence is provided on an "as-is" and
                                "as-available" basis. We strive to maintain
                                continuous uptime and secure AI revision
                                features, but we shall not be held liable for
                                any academic grade outcomes, data loss from
                                third-party sync failures, or service
                                interruptions beyond our reasonable control.
                            </p>
                        </div>

                        {/* 4. Affiliate Disclaimer */}
                        <div>
                            <h2 className="text-sm font-bold text-[#30302D] sm:text-base">
                                4. Affiliate Disclaimer
                            </h2>
                            <p className="mt-2">
                                From time to time, Cadence may recommend
                                educational tools, textbooks, or software
                                platforms via affiliate links. If you choose to
                                purchase or sign up through these
                                recommendations, we may earn a small commission
                                at no additional cost to you, which helps
                                support platform development.
                            </p>
                        </div>

                        {/* 5. Governing Law Clause */}
                        <div>
                            <h2 className="text-sm font-bold text-[#30302D] sm:text-base">
                                5. Governing Law Clause
                            </h2>
                            <p className="mt-2">
                                These Terms and Conditions shall be governed by
                                and construed in accordance with applicable
                                local laws, without regard to conflict of law
                                principles. Any legal disputes arising out of or
                                related to the use of Cadence shall be resolved
                                under said jurisdiction.
                            </p>
                        </div>

                        {/* Contact info */}
                        <div className="border-t border-[#F0F0E9] pt-6">
                            <h2 className="text-sm font-bold text-[#30302D] sm:text-base">
                                6. Contact Information
                            </h2>
                            <p className="mt-2">
                                If you have any questions concerning these
                                terms, you can reach out to us at{' '}
                                <a
                                    href="mailto:support@cadence.study"
                                    className="font-bold text-[#762F50] underline"
                                >
                                    support@cadence.study
                                </a>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
