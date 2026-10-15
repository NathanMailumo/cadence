import React, { useEffect, useRef, useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';

// Scroll-in Animation Wrapper Component
function FadeInSection({ children, className = '', delay = 0 }) {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.15 },
        );

        const currentElement = domRef.current;
        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) observer.unobserve(currentElement);
        };
    }, []);

    return (
        <div
            ref={domRef}
            style={{ transitionDelay: `${delay}ms` }}
            className={`transition-all duration-700 ease-out ${
                isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-12 opacity-0'
            } ${className}`}
        >
            {children}
        </div>
    );
}

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
            <Head>
                <title>Cadence — Your Study Workspace</title>
                <link
                    rel="icon"
                    type="image/svg+xml"
                    href="/images/cadence_logo.svg"
                />
                {/* Or use href="/logo.png" if your file is a PNG */}
            </Head>

            {/* HERO SECTION */}
            <section className="border-b border-[#D8DDD5]/60">
                <FadeInSection>
                    <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 sm:px-10 sm:py-24 lg:grid-cols-2 lg:gap-20 lg:px-12 lg:py-28">
                        <div className="max-w-xl">
                            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#AD5266]">
                                <span aria-hidden="true">Cadence</span>
                                Learning, in your own rhythm
                            </p>
                            <h1 className="mt-6 text-6xl font-medium leading-[0.94] tracking-[-0.06em] text-[#30302D] transition-colors duration-300 hover:text-[#762F50] sm:text-7xl lg:text-[5.5rem]">
                                Everything
                                <br />
                                useful,
                                <br />
                                <span className="text-[#AD5266]">
                                    together.
                                </span>
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
                                            Remember to compare active and
                                            passive transport.
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
                </FadeInSection>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section
                id="how-it-works"
                className="mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24 lg:px-12 lg:py-28"
            >
                <FadeInSection>
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
                                <Icon>Resources</Icon>
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
                                    collaborative one for your learning
                                    community.
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
                                <span className="text-[#F1DCE4]">Cadence</span>
                                <span className="text-[10px] font-bold text-[#E8C7D3]">
                                    03
                                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium">
                                    Learn together
                                </h3>
                                <p className="mt-3 max-w-xs text-xs leading-5 text-[#E8C7D3]">
                                    Run focused sessions, share discoveries, and
                                    let the collection evolve naturally.
                                </p>
                            </div>
                        </div>
                    </div>
                </FadeInSection>
            </section>

            {/* USE CASES SECTION */}
            <section
                id="use-cases"
                className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12"
            >
                <FadeInSection>
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#AD5266]">
                                USE CASES
                            </p>
                            <h2
                                className="mt-3 max-w-xl text-4xl font-normal leading-[1.05] text-[#30302D] sm:text-5xl lg:text-6xl"
                                style={{ fontFamily: '"Manrope", sans-serif' }}
                            >
                                Built for the way learning actually happens.
                            </h2>
                        </div>
                        <p className="max-w-sm text-sm leading-relaxed text-[#73736C] md:mt-12">
                            From one useful link to a complete revision pack,
                            Cadence keeps every part of learning visible,
                            connected, and ready when you need it.
                        </p>
                    </div>
                </FadeInSection>

                <div className="mt-16 space-y-12">
                    {/* 01. PERSONAL STUDY */}
                    <FadeInSection delay={100}>
                        <div className="grid grid-cols-1 gap-12 rounded-[2.55rem] bg-white p-10 shadow-md sm:p-14 lg:grid-cols-2 lg:items-center lg:p-16">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#AD5266]">
                                    01 · PERSONAL STUDY
                                </p>
                                <h3
                                    className="mt-5 text-3xl font-bold leading-tight text-[#30302D] sm:text-4xl lg:text-5xl"
                                    style={{
                                        fontFamily: '"Manrope", sans-serif',
                                    }}
                                >
                                    Build a visual home for every subject.
                                </h3>
                                <p className="mt-6 max-w-md text-sm leading-relaxed text-[#73736C]">
                                    Collect videos, notes, useful websites, and
                                    past questions on a freeform canvas that
                                    makes sense to you.
                                </p>
                            </div>

                            <div className="rounded-3xl border-4 border-[#C8CDC3] bg-[#EBECE7] p-8 shadow-inner">
                                <div className="flex items-center justify-between border-b border-[#D8DDD5] pb-4">
                                    <span className="text-base font-bold text-[#762F50]">
                                        Organic chemistry
                                    </span>
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#AD5266]">
                                        PRIVATE SPACE
                                    </span>
                                </div>
                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <div className="col-span-1 rounded-2xl bg-[#762F50] p-5 text-white shadow-sm">
                                        <p className="text-[9px] font-bold uppercase tracking-wider text-[#E8C7D3]">
                                            VIDEO
                                        </p>
                                        <p className="mt-3 text-sm font-bold">
                                            Reaction mechanisms
                                        </p>
                                    </div>
                                    <div className="col-span-1 rounded-2xl bg-[#D9DED6] p-5 shadow-sm">
                                        <p className="text-[9px] font-bold uppercase tracking-wider text-[#AD5266]">
                                            STICKY NOTE
                                        </p>
                                        <p className="mt-2 text-xs text-[#30302D]">
                                            Nucleophile donates an electron
                                            pair.
                                        </p>
                                    </div>
                                    <div className="col-span-2 rounded-2xl border border-[#D8DDD5] bg-white p-5 shadow-sm">
                                        <p className="text-[9px] font-bold uppercase tracking-wider text-[#AD5266]">
                                            PAST QUESTIONS
                                        </p>
                                        <p className="mt-2 text-sm font-bold text-[#30302D]">
                                            Paper 2 · 2023
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeInSection>

                    {/* 02. STUDY GROUPS */}
                    <FadeInSection delay={150}>
                        <div className="grid grid-cols-1 gap-12 rounded-[2.55rem] bg-[#D9DED6] p-10 shadow-md sm:p-14 lg:grid-cols-2 lg:items-center lg:p-16">
                            <div className="order-2 rounded-3xl bg-white p-8 shadow-md lg:order-1">
                                <div className="flex items-center justify-between border-b border-[#F0F0E9] pb-4">
                                    <span className="text-base font-bold text-[#30302D]">
                                        Biology · Year 12
                                    </span>
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#AD5266]">
                                        4 COLLABORATORS
                                    </span>
                                </div>
                                <div className="mt-6 flex items-center gap-3">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E5E7E1] text-xs font-bold text-[#73736C]">
                                        AM
                                    </span>
                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0E6EA] text-xs font-bold text-[#762F50]">
                                        JK
                                    </span>
                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E5E7E1] text-xs font-bold text-[#73736C]">
                                        RS
                                    </span>
                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#762F50] text-xs font-bold text-white">
                                        +1
                                    </span>
                                </div>
                                <div className="mt-6 rounded-2xl bg-[#D9DED6]/70 p-5">
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#AD5266]">
                                        SHARED WEBSITE
                                    </p>
                                    <p className="mt-2 text-sm font-bold text-[#30302D]">
                                        Cell membrane transport
                                    </p>
                                    <p className="mt-1 text-xs text-[#73736C]">
                                        Added by Maya · just now
                                    </p>
                                </div>
                                <p className="mt-4 text-xs font-semibold text-[#73736C]">
                                    👥 Everyone stays in sync
                                </p>
                            </div>

                            <div className="order-1 lg:order-2">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#AD5266]">
                                    02 · STUDY GROUPS
                                </p>
                                <h3
                                    className="mt-5 text-3xl font-bold leading-tight text-[#30302D] sm:text-4xl lg:text-5xl"
                                    style={{
                                        fontFamily: '"Manrope", sans-serif',
                                    }}
                                >
                                    Turn scattered finds into shared momentum.
                                </h3>
                                <p className="mt-6 max-w-md text-sm leading-relaxed text-[#73736C]">
                                    Invite classmates into one collaborative
                                    space, add resources together, and keep
                                    everyone working from the same material.
                                </p>
                            </div>
                        </div>
                    </FadeInSection>

                    {/* 03. EXAM PREP */}
                    <FadeInSection delay={200}>
                        <div className="grid grid-cols-1 gap-12 rounded-[2.55rem] bg-white p-10 shadow-md sm:p-14 lg:grid-cols-2 lg:items-center lg:p-16">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#AD5266]">
                                    03 · EXAM PREP
                                </p>
                                <h3
                                    className="mt-5 text-3xl font-bold leading-tight text-[#30302D] sm:text-4xl lg:text-5xl"
                                    style={{
                                        fontFamily: '"Manrope", sans-serif',
                                    }}
                                >
                                    Go from resources to revision in seconds.
                                </h3>
                                <p className="mt-6 max-w-md text-sm leading-relaxed text-[#73736C]">
                                    Use the material already in your space to
                                    generate focused revision packs with
                                    summaries, flashcards, and practice
                                    questions.
                                </p>
                            </div>

                            <div className="rounded-3xl border-4 border-[#C8CDC3] bg-[#762F50] p-8 text-white shadow-md">
                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#E8C7D3]">
                                        REVISION PACK
                                    </p>
                                    <p className="mt-1 text-base font-bold">
                                        Cell biology essentials
                                    </p>
                                </div>
                                <div className="mt-6 space-y-3">
                                    <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/25 text-xs font-bold">
                                            ✓
                                        </span>
                                        <div>
                                            <p className="text-sm font-bold">
                                                Topic summary
                                            </p>
                                            <p className="text-[10px] text-[#E8C7D3]">
                                                12 key concepts
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/25 text-xs font-bold">
                                            ✓
                                        </span>
                                        <div>
                                            <p className="text-sm font-bold">
                                                Flashcards
                                            </p>
                                            <p className="text-[10px] text-[#E8C7D3]">
                                                24 cards
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/25 text-xs font-bold">
                                            ✓
                                        </span>
                                        <div>
                                            <p className="text-sm font-bold">
                                                Practice questions
                                            </p>
                                            <p className="text-[10px] text-[#E8C7D3]">
                                                8 questions
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeInSection>
                </div>
            </section>

            {/* PRICING SECTION */}
            <section
                id="pricing"
                className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12"
            >
                <FadeInSection>
                    <div className="overflow-hidden rounded-3xl bg-[#762F50] p-8 text-white shadow-xl sm:p-12 md:p-16">
                        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
                            <div>
                                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#E8C7D3]">
                                    SIMPLE PRICING
                                </p>
                                <h2
                                    className="mt-4 text-4xl font-normal leading-[1.05] text-white sm:text-5xl lg:text-6xl"
                                    style={{
                                        fontFamily: '"Manrope", sans-serif',
                                    }}
                                >
                                    Start learning together, completely
                                    flexible.
                                </h2>
                                <p className="mt-6 max-w-md text-xs leading-relaxed text-[#E8C7D3] sm:text-sm">
                                    Everything you need to collect, organise,
                                    and turn your resources into useful
                                    revision.
                                </p>
                            </div>

                            <div className="relative rounded-3xl bg-white p-8 text-[#30302D] shadow-2xl sm:p-10">
                                {/* Coming Soon Badge */}
                                <span className="absolute -top-3 right-8 rounded-full bg-[#AD5266] px-3.5 py-1 text-[10px] font-extrabold tracking-wider text-white shadow-md">
                                    COMING SOON
                                </span>

                                <div className="flex items-baseline justify-between border-b border-[#F0F0E9] pb-6">
                                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#AD5266]">
                                        CADENCE PRO
                                    </p>
                                    <div className="text-right">
                                        <span
                                            className="text-3xl font-extrabold text-[#762F50]"
                                            style={{
                                                fontFamily:
                                                    '"Manrope", sans-serif',
                                            }}
                                        >
                                            ₦2,000
                                        </span>
                                        <span className="text-xs text-[#73736C]">
                                            {' '}
                                            / month
                                        </span>
                                    </div>
                                </div>

                                <ul className="my-8 space-y-4 text-xs font-semibold text-[#30302D]">
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#762F50]">
                                            ✓
                                        </span>{' '}
                                        Unlimited private spaces
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#762F50]">
                                            ✓
                                        </span>{' '}
                                        Collaborative learning spaces
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#762F50]">
                                            ✓
                                        </span>{' '}
                                        AI-generated revision packs
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#762F50]">
                                            ✓
                                        </span>{' '}
                                        Links, videos, notes, and files
                                    </li>
                                </ul>

                                <button
                                    type="button"
                                    disabled
                                    className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-gray-200 py-4 text-xs font-bold text-gray-500 shadow-none"
                                >
                                    Coming Soon
                                </button>
                            </div>
                        </div>
                    </div>
                </FadeInSection>
            </section>
        </GuestLayout>
    );
}
