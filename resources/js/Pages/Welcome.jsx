import React from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';

const Arrow = () => (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
            d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const Icon = ({ children }) => (
    <span className="text-[#762F50]" aria-hidden="true">
        {children}
    </span>
);

export default function Welcome() {
    return (
        <GuestLayout>
            <Head title="Cadence - Learning, in your own rhythm" />

            <section className="border-b border-[#D8DDD5]">
                <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 sm:px-10 sm:py-24 lg:grid-cols-2 lg:gap-20 lg:px-12 lg:py-28">
                    <div className="max-w-xl">
                        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#AD5266]">
                            <span aria-hidden="true">✣</span>
                            Learning, in your own rhythm
                        </p>
                        <h1 className="mt-6 text-6xl font-medium leading-[0.94] tracking-[-0.06em] text-[#30302D] transition-colors duration-300 hover:text-[#762F50] sm:text-7xl lg:text-[5.5rem]">
                            Everything
                            <br />
                            useful,
                            <br />
                            <span className="text-[#AD5266]">together.</span>
                        </h1>
                        <p className="mt-7 max-w-lg text-base leading-7 text-[#73736C] sm:text-lg">
                            Cadence gives students one calm space to gather
                            resources, share discoveries, and keep learning
                            moving.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-5">
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 rounded-md bg-[#762F50] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#762F50]/20 transition duration-200 hover:-translate-y-1 hover:bg-[#5E243F] hover:shadow-xl hover:shadow-[#762F50]/25"
                            >
                                Create your space <Arrow />
                            </Link>
                            <a
                                href="#how-it-works"
                                className="text-sm font-bold text-[#762F50] transition hover:translate-x-1 hover:underline"
                            >
                                See how it works
                            </a>
                        </div>
                    </div>

                    <div className="mx-auto w-full max-w-[620px] rounded-2xl bg-[#C8CDC3] p-3 shadow-xl shadow-stone-300/50 transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-stone-400/40 sm:p-4">
                        <div className="rounded-lg bg-white p-5 sm:p-6">
                            <div className="border-b border-[#E5E7E1] pb-4">
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#AD5266]">
                                    Collective space
                                </p>
                                <h2 className="mt-1 text-lg font-medium text-[#762F50]">
                                    Biology · Year 12
                                </h2>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-3">
                                <div className="flex min-h-44 flex-col justify-end rounded-lg bg-[#762F50] p-5 text-white transition duration-200 hover:scale-[1.02] hover:bg-[#87365B] sm:min-h-52">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#E8C7D3]">
                                        Featured
                                    </p>
                                    <p className="mt-3 text-lg leading-tight">
                                        Cell membranes
                                        <br />
                                        explained
                                    </p>
                                    <p className="mt-3 text-[10px] text-[#E8C7D3]">
                                        Shared by Maya · Crash Course
                                    </p>
                                </div>
                                <div className="flex min-h-44 flex-col justify-center rounded-lg bg-[#D9DED6] p-5 transition duration-200 hover:scale-[1.02] hover:bg-[#CDD4CA] sm:min-h-52">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#AD5266]">
                                        Weekly resources
                                    </p>
                                    <p className="mt-3 text-lg leading-tight text-[#30302D]">
                                        Trusted links,
                                        <br />
                                        one place.
                                    </p>
                                    <p className="mt-3 text-[10px] leading-4 text-[#73736C]">
                                        Khan Academy
                                        <br />
                                        Nature Archive
                                        <br />
                                        BBC Bitesize
                                    </p>
                                </div>
                                <div className="flex min-h-28 flex-col justify-center rounded-lg border border-[#E5E7E1] p-5 transition duration-200 hover:border-[#AD5266] hover:bg-[#FCFCF9]">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#AD5266]">
                                        Sticky note
                                    </p>
                                    <p className="mt-3 text-[11px] leading-4 text-[#30302D]">
                                        Remember to compare active and passive
                                        transport.
                                    </p>
                                </div>
                                <div className="flex min-h-28 flex-col justify-center rounded-lg bg-[#762F50] p-5 text-white transition duration-200 hover:scale-[1.02] hover:bg-[#87365B]">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#E8C7D3]">
                                        Revision pick
                                    </p>
                                    <p className="mt-3 text-lg leading-tight">
                                        Cell Biology
                                        <br />
                                        Essentials
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="how-it-works"
                className="mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24 lg:px-12 lg:py-28"
            >
                <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#AD5266]">
                        How it works
                    </p>
                    <h2 className="max-w-xl text-5xl font-medium leading-[0.98] tracking-[-0.06em] text-[#30302D] sm:text-6xl">
                        A space that grows
                        <br />
                        the way you learn.
                    </h2>
                </div>
                <div className="mt-12 grid gap-4 md:grid-cols-3">
                    <div className="flex min-h-60 flex-col justify-between rounded-lg border border-[#D8DDD5] bg-white p-6 transition duration-200 hover:-translate-y-2 hover:border-[#AD5266] hover:shadow-xl hover:shadow-stone-200/60">
                        <div className="flex justify-between">
                            <Icon>▱</Icon>
                            <span className="text-[10px] font-bold text-[#73736C]">
                                01
                            </span>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium">
                                Make your space
                            </h3>
                            <p className="mt-3 max-w-xs text-xs leading-5 text-[#73736C]">
                                Start a private space for yourself or open a
                                collaborative one for your learning community.
                            </p>
                        </div>
                    </div>
                    <div className="flex min-h-60 flex-col justify-between rounded-lg bg-[#D9DED6] p-6 transition duration-200 hover:-translate-y-2 hover:bg-[#CDD4CA] hover:shadow-xl hover:shadow-stone-200/60">
                        <div className="flex justify-between">
                            <Icon>▣</Icon>
                            <span className="text-[10px] font-bold text-[#73736C]">
                                02
                            </span>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium">
                                Drop anything in
                            </h3>
                            <p className="mt-3 max-w-xs text-xs leading-5 text-[#73736C]">
                                Add notes, links, videos, files, and ideas
                                without forcing them into folders.
                            </p>
                        </div>
                    </div>
                    <div className="flex min-h-60 flex-col justify-between rounded-lg bg-[#762F50] p-6 text-white transition duration-200 hover:-translate-y-2 hover:bg-[#87365B] hover:shadow-xl hover:shadow-[#762F50]/25">
                        <div className="flex justify-between">
                            <span className="text-[#F1DCE4]">✣</span>
                            <span className="text-[10px] font-bold text-[#E8C7D3]">
                                03
                            </span>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium">
                                Learn together
                            </h3>
                            <p className="mt-3 max-w-xs text-xs leading-5 text-[#E8C7D3]">
                                Run focused sessions, share discoveries, and let
                                the collection evolve naturally.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
