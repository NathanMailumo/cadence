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
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const faqs = [
        {
            question:
                'What is the difference between private and collaborative spaces?',
            answer: 'Private spaces are exclusively for your own personal notes, links, and study files. Collaborative spaces allow you to invite classmates via unique links to contribute resources and study together in real-time.',
        },
        {
            question: 'How do the free tier limits work?',
            answer: 'On the Free Tier, you can create unlimited private spaces, alongside up to 2 collaborative spaces, 3 AI revision pack generations, and 3 past-question file uploads. Using these allowances does not delete your existing files.',
        },
        {
            question:
                'What happens when my Plus plan or Semester Pass expires?',
            answer: 'When your subscription ends, your account smoothly transitions back to the Free plan. You keep all your existing spaces and resources permanently, and you receive a fresh set of free allowances.',
        },
        {
            question: 'How does Paystack process payments?',
            answer: 'We use Paystack to handle secure payments in Nigerian Naira (NGN). You can easily pay using bank cards, transfers, or supported mobile channels on a monthly subscription or a 4-month semester pass.',
        },
    ];

    return (
        <GuestLayout>
            <Head>
                <title>Cadence - Educational Resource Canvas</title>
                <meta
                    name="description"
                    content="Cadence is a platform for organizing, gathering, and collaborating on educational study resources."
                />
                <link
                    rel="icon"
                    type="image/svg+xml"
                    href="/images/cadence_logo.svg"
                />
            </Head>

            {/* HERO SECTION */}
            <section className="border-b border-[#D8DDD5]/60">
                <FadeInSection>
                    <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-12 sm:px-10 sm:py-20 lg:grid-cols-2 lg:gap-20 lg:px-12 lg:py-28">
                        <div className="max-w-xl">
                            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#AD5266]">
                                <span aria-hidden="true">Cadence</span>
                                Learning, in your own rhythm
                            </p>
                            <h1 className="mt-4 text-5xl font-medium leading-[0.96] tracking-[-0.06em] text-[#30302D] transition-colors duration-300 hover:text-[#762F50] sm:text-6xl lg:text-[5.5rem]">
                                Everything
                                <br />
                                useful,
                                <br />
                                <span className="text-[#AD5266]">
                                    together.
                                </span>
                            </h1>
                            <p className="mt-6 max-w-lg text-sm leading-6 text-[#73736C] sm:text-base sm:leading-7">
                                Cadence gives students one calm space to gather
                                resources, share discoveries, and keep learning
                                moving.
                            </p>
                            <div className="mt-7 flex flex-wrap items-center gap-4">
                                <Link
                                    href="/register"
                                    className="inline-flex items-center gap-2 rounded-md bg-[#762F50] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#762F50]/20 transition duration-200 hover:-translate-y-1 hover:bg-[#5E243F] hover:shadow-xl hover:shadow-[#762F50]/25 sm:px-6 sm:py-4"
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

                        <div className="mx-auto w-full max-w-[620px] rounded-2xl bg-[#C8CDC3] p-2.5 shadow-xl shadow-stone-300/50 transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-stone-400/40 sm:p-4">
                            <div className="rounded-lg bg-white p-4 sm:p-6">
                                <div className="border-b border-[#E5E7E1] pb-3 sm:pb-4">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#AD5266]">
                                        Collective space
                                    </p>
                                    <h2 className="mt-1 text-base font-medium text-[#762F50] sm:text-lg">
                                        Biology · Year 12
                                    </h2>
                                </div>
                                <div className="mt-3 grid grid-cols-2 gap-2.5 sm:gap-3">
                                    <div className="flex min-h-36 flex-col justify-end rounded-lg bg-[#762F50] p-3.5 text-white transition duration-200 hover:scale-[1.02] hover:bg-[#87365B] sm:min-h-52 sm:p-5">
                                        <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#E8C7D3] sm:text-[9px]">
                                            Featured
                                        </p>
                                        <p className="mt-2 text-sm leading-tight sm:mt-3 sm:text-lg">
                                            Cell membranes
                                            <br />
                                            explained
                                        </p>
                                        <p className="mt-2 text-[9px] text-[#E8C7D3] sm:mt-3 sm:text-[10px]">
                                            Shared by Maya
                                        </p>
                                    </div>
                                    <div className="flex min-h-36 flex-col justify-center rounded-lg bg-[#D9DED6] p-3.5 transition duration-200 hover:scale-[1.02] hover:bg-[#CDD4CA] sm:min-h-52 sm:p-5">
                                        <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#AD5266] sm:text-[9px]">
                                            Weekly resources
                                        </p>
                                        <p className="mt-2 text-sm leading-tight text-[#30302D] sm:mt-3 sm:text-lg">
                                            Trusted links,
                                            <br />
                                            one place.
                                        </p>
                                    </div>
                                    <div className="flex min-h-24 flex-col justify-center rounded-lg border border-[#E5E7E1] p-3.5 transition duration-200 hover:border-[#AD5266] hover:bg-[#FCFCF9] sm:min-h-28 sm:p-5">
                                        <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#AD5266] sm:text-[9px]">
                                            Sticky note
                                        </p>
                                        <p className="leading-3.5 mt-2 text-[10px] text-[#30302D] sm:mt-3 sm:text-[11px] sm:leading-4">
                                            Compare active & passive transport.
                                        </p>
                                    </div>
                                    <div className="flex min-h-24 flex-col justify-center rounded-lg bg-[#762F50] p-3.5 text-white transition duration-200 hover:scale-[1.02] hover:bg-[#87365B] sm:min-h-28 sm:p-5">
                                        <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#E8C7D3] sm:text-[9px]">
                                            Revision pick
                                        </p>
                                        <p className="mt-2 text-sm leading-tight sm:mt-3 sm:text-lg">
                                            Cell Biology
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
                className="mx-auto max-w-7xl px-5 py-16 sm:px-10 sm:py-24 lg:px-12 lg:py-28"
            >
                <FadeInSection>
                    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end sm:gap-8">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#AD5266]">
                            How it works
                        </p>
                        <h2 className="max-w-xl text-4xl font-medium leading-[1] tracking-[-0.06em] text-[#30302D] sm:text-5xl lg:text-6xl">
                            A space that grows
                            <br />
                            the way you learn.
                        </h2>
                    </div>
                    <div className="mt-10 grid gap-4 sm:mt-12 md:grid-cols-3">
                        <div className="flex min-h-56 flex-col justify-between rounded-lg border border-[#D8DDD5] bg-white p-5 transition duration-200 hover:-translate-y-2 hover:border-[#AD5266] hover:shadow-xl sm:p-6">
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
                                <p className="mt-2.5 max-w-xs text-xs leading-5 text-[#73736C]">
                                    Start a private space for yourself or open a
                                    collaborative one for your learning
                                    community.
                                </p>
                            </div>
                        </div>
                        <div className="flex min-h-56 flex-col justify-between rounded-lg bg-[#D9DED6] p-5 transition duration-200 hover:-translate-y-2 hover:bg-[#CDD4CA] hover:shadow-xl sm:p-6">
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
                                <p className="mt-2.5 max-w-xs text-xs leading-5 text-[#73736C]">
                                    Add notes, links, videos, files, and ideas
                                    without forcing them into folders.
                                </p>
                            </div>
                        </div>
                        <div className="flex min-h-56 flex-col justify-between rounded-lg bg-[#762F50] p-5 text-white transition duration-200 hover:-translate-y-2 hover:bg-[#87365B] hover:shadow-xl sm:p-6">
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
                                <p className="mt-2.5 max-w-xs text-xs leading-5 text-[#E8C7D3]">
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
                className="mx-auto max-w-7xl px-5 py-16 sm:px-10 lg:px-12"
            >
                <FadeInSection>
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#AD5266]">
                                USE CASES
                            </p>
                            <h2
                                className="mt-3 max-w-xl text-3xl font-normal leading-[1.05] text-[#30302D] sm:text-5xl lg:text-6xl"
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

                {/* Optimized padding and grid alignment for mobile responsiveness */}
                <div className="mt-12 space-y-8 sm:mt-16 sm:space-y-12">
                    {/* 01. PERSONAL STUDY */}
                    <FadeInSection delay={100}>
                        <div className="grid grid-cols-1 gap-8 rounded-[2rem] bg-white p-6 shadow-md sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-12 lg:rounded-[2.55rem] lg:p-16">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#AD5266]">
                                    01 · PERSONAL STUDY
                                </p>
                                <h3
                                    className="mt-4 text-2xl font-bold leading-tight text-[#30302D] sm:text-4xl lg:text-5xl"
                                    style={{
                                        fontFamily: '"Manrope", sans-serif',
                                    }}
                                >
                                    Build a visual home for every subject.
                                </h3>
                                <p className="mt-4 max-w-md text-sm leading-relaxed text-[#73736C]">
                                    Collect videos, notes, useful websites, and
                                    past questions on a freeform canvas that
                                    makes sense to you.
                                </p>
                            </div>

                            <div className="rounded-2xl border-2 border-[#C8CDC3] bg-[#EBECE7] p-5 shadow-inner sm:rounded-3xl sm:border-4 sm:p-8">
                                <div className="flex items-center justify-between border-b border-[#D8DDD5] pb-3 sm:pb-4">
                                    <span className="text-sm font-bold text-[#762F50] sm:text-base">
                                        Organic chemistry
                                    </span>
                                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#AD5266] sm:text-[10px]">
                                        PRIVATE SPACE
                                    </span>
                                </div>
                                <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4">
                                    <div className="rounded-xl bg-[#762F50] p-4 text-white shadow-sm sm:rounded-2xl sm:p-5">
                                        <p className="text-[8px] font-bold uppercase tracking-wider text-[#E8C7D3] sm:text-[9px]">
                                            VIDEO
                                        </p>
                                        <p className="mt-2 text-xs font-bold sm:mt-3 sm:text-sm">
                                            Reaction mechanisms
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-[#D9DED6] p-4 shadow-sm sm:rounded-2xl sm:p-5">
                                        <p className="text-[8px] font-bold uppercase tracking-wider text-[#AD5266] sm:text-[9px]">
                                            STICKY NOTE
                                        </p>
                                        <p className="mt-2 text-xs text-[#30302D]">
                                            Nucleophile donates an electron
                                            pair.
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-[#D8DDD5] bg-white p-4 shadow-sm sm:col-span-2 sm:rounded-2xl sm:p-5">
                                        <p className="text-[8px] font-bold uppercase tracking-wider text-[#AD5266] sm:text-[9px]">
                                            PAST QUESTIONS
                                        </p>
                                        <p className="mt-2 text-xs font-bold text-[#30302D] sm:text-sm">
                                            Paper 2 · 2023
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeInSection>

                    {/* 02. STUDY GROUPS */}
                    <FadeInSection delay={150}>
                        <div className="grid grid-cols-1 gap-8 rounded-[2rem] bg-[#D9DED6] p-6 shadow-md sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-12 lg:rounded-[2.55rem] lg:p-16">
                            <div className="order-2 rounded-2xl bg-white p-5 shadow-md sm:rounded-3xl sm:p-8 lg:order-1">
                                <div className="flex items-center justify-between border-b border-[#F0F0E9] pb-3 sm:pb-4">
                                    <span className="text-sm font-bold text-[#30302D] sm:text-base">
                                        Biology · Year 12
                                    </span>
                                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#AD5266] sm:text-[10px]">
                                        4 COLLABORATORS
                                    </span>
                                </div>
                                <div className="mt-4 flex items-center gap-2.5 sm:mt-6 sm:gap-3">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E5E7E1] text-[10px] font-bold text-[#73736C] sm:h-9 sm:w-9 sm:text-xs">
                                        AM
                                    </span>
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0E6EA] text-[10px] font-bold text-[#762F50] sm:h-9 sm:w-9 sm:text-xs">
                                        JK
                                    </span>
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E5E7E1] text-[10px] font-bold text-[#73736C] sm:h-9 sm:w-9 sm:text-xs">
                                        RS
                                    </span>
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#762F50] text-[10px] font-bold text-white sm:h-9 sm:w-9 sm:text-xs">
                                        +1
                                    </span>
                                </div>
                                <div className="mt-4 rounded-xl bg-[#D9DED6]/70 p-4 sm:mt-6 sm:rounded-2xl sm:p-5">
                                    <p className="text-[8px] font-bold uppercase tracking-wider text-[#AD5266] sm:text-[9px]">
                                        SHARED WEBSITE
                                    </p>
                                    <p className="mt-1.5 text-xs font-bold text-[#30302D] sm:mt-2 sm:text-sm">
                                        Cell membrane transport
                                    </p>
                                    <p className="mt-1 text-[10px] text-[#73736C]">
                                        Added by Maya · just now
                                    </p>
                                </div>
                                <p className="mt-3 text-xs font-semibold text-[#73736C] sm:mt-4">
                                    👥 Everyone stays in sync
                                </p>
                            </div>

                            <div className="order-1 lg:order-2">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#AD5266]">
                                    02 · STUDY GROUPS
                                </p>
                                <h3
                                    className="mt-4 text-2xl font-bold leading-tight text-[#30302D] sm:text-4xl lg:text-5xl"
                                    style={{
                                        fontFamily: '"Manrope", sans-serif',
                                    }}
                                >
                                    Turn scattered finds into shared momentum.
                                </h3>
                                <p className="mt-4 max-w-md text-sm leading-relaxed text-[#73736C]">
                                    Invite classmates into one collaborative
                                    space, add resources together, and keep
                                    everyone working from the same material.
                                </p>
                            </div>
                        </div>
                    </FadeInSection>

                    {/* 03. EXAM PREP */}
                    <FadeInSection delay={200}>
                        <div className="grid grid-cols-1 gap-8 rounded-[2rem] bg-white p-6 shadow-md sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-12 lg:rounded-[2.55rem] lg:p-16">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#AD5266]">
                                    03 · EXAM PREP
                                </p>
                                <h3
                                    className="mt-4 text-2xl font-bold leading-tight text-[#30302D] sm:text-4xl lg:text-5xl"
                                    style={{
                                        fontFamily: '"Manrope", sans-serif',
                                    }}
                                >
                                    Go from resources to revision in seconds.
                                </h3>
                                <p className="mt-4 max-w-md text-sm leading-relaxed text-[#73736C]">
                                    Use the material already in your space to
                                    generate focused revision packs with
                                    summaries, flashcards, and practice
                                    questions.
                                </p>
                            </div>

                            <div className="rounded-2xl border-2 border-[#C8CDC3] bg-[#762F50] p-5 text-white shadow-md sm:rounded-3xl sm:border-4 sm:p-8">
                                <div>
                                    <p className="text-[8px] font-bold uppercase tracking-wider text-[#E8C7D3] sm:text-[9px]">
                                        REVISION PACK
                                    </p>
                                    <p className="mt-1 text-sm font-bold sm:text-base">
                                        Cell biology essentials
                                    </p>
                                </div>
                                <div className="mt-4 space-y-2.5 sm:mt-6 sm:space-y-3">
                                    <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3 sm:rounded-2xl sm:p-4">
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/25 text-[10px] font-bold sm:h-6 sm:w-6 sm:text-xs">
                                            ✓
                                        </span>
                                        <div>
                                            <p className="text-xs font-bold sm:text-sm">
                                                Topic summary
                                            </p>
                                            <p className="text-[9px] text-[#E8C7D3] sm:text-[10px]">
                                                12 key concepts
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3 sm:rounded-2xl sm:p-4">
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/25 text-[10px] font-bold sm:h-6 sm:w-6 sm:text-xs">
                                            ✓
                                        </span>
                                        <div>
                                            <p className="text-xs font-bold sm:text-sm">
                                                Flashcards
                                            </p>
                                            <p className="text-[9px] text-[#E8C7D3] sm:text-[10px]">
                                                24 cards
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3 sm:rounded-2xl sm:p-4">
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/25 text-[10px] font-bold sm:h-6 sm:w-6 sm:text-xs">
                                            ✓
                                        </span>
                                        <div>
                                            <p className="text-xs font-bold sm:text-sm">
                                                Practice questions
                                            </p>
                                            <p className="text-[9px] text-[#E8C7D3] sm:text-[10px]">
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
                className="mx-auto max-w-7xl px-5 py-16 sm:px-10 lg:px-12"
            >
                <FadeInSection>
                    <div className="text-center">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#AD5266]">
                            PRICING PLANS
                        </p>
                        <h2
                            className="mt-3 text-3xl font-normal leading-[1.05] text-[#30302D] sm:text-5xl lg:text-6xl"
                            style={{ fontFamily: '"Manrope", sans-serif' }}
                        >
                            Choose the right rhythm for your studies.
                        </h2>
                        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#73736C]">
                            Start for free or upgrade to Cadence Plus or the
                            Semester Pass for unlimited access to everything you
                            need.
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 sm:gap-8 lg:grid-cols-3 lg:items-stretch">
                        {/* FREE PLAN CARD */}
                        <div className="flex flex-col justify-between rounded-3xl border border-[#D8DDD5] bg-white p-6 shadow-sm sm:p-10">
                            <div>
                                <div className="flex items-baseline justify-between border-b border-[#F0F0E9] pb-6">
                                    <div>
                                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#73736C]">
                                            FREE TIER
                                        </p>
                                        <h3 className="mt-1 text-2xl font-bold text-[#30302D]">
                                            Starter Plan
                                        </h3>
                                    </div>
                                    <div className="text-right">
                                        <span
                                            className="text-3xl font-extrabold text-[#30302D]"
                                            style={{
                                                fontFamily:
                                                    '"Manrope", sans-serif',
                                            }}
                                        >
                                            ₦0
                                        </span>
                                        <span className="text-xs text-[#73736C]">
                                            {' '}
                                            / forever
                                        </span>
                                    </div>
                                </div>

                                <p className="mt-6 text-xs leading-relaxed text-[#73736C]">
                                    Essential features to get started with
                                    individual study and small group
                                    collaboration.
                                </p>

                                <ul className="mt-8 space-y-4 text-xs font-semibold text-[#30302D]">
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
                                        2 collaborative spaces limit
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#762F50]">
                                            ✓
                                        </span>{' '}
                                        3 AI revision pack generations limit
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#762F50]">
                                            ✓
                                        </span>{' '}
                                        3 past-question uploads limit
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#762F50]">
                                            ✓
                                        </span>{' '}
                                        Links, videos, notes, and files
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-10">
                                <Link
                                    href="/register"
                                    className="flex w-full items-center justify-center rounded-xl border border-[#762F50] bg-white py-4 text-xs font-bold text-[#762F50] transition hover:bg-[#FDF4F6]"
                                >
                                    Get Started Free
                                </Link>
                            </div>
                        </div>

                        {/* CADENCE PLUS PLAN CARD */}
                        <div className="relative flex flex-col justify-between rounded-3xl bg-[#762F50] p-6 text-white shadow-xl sm:p-10">
                            <div>
                                <div className="flex items-baseline justify-between border-b border-white/10 pb-6">
                                    <div>
                                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#E8C7D3]">
                                            MONTHLY PRO
                                        </p>
                                        <h3 className="mt-1 text-2xl font-bold text-white">
                                            Cadence Plus
                                        </h3>
                                    </div>
                                    <div className="text-right">
                                        <span
                                            className="text-3xl font-extrabold text-white"
                                            style={{
                                                fontFamily:
                                                    '"Manrope", sans-serif',
                                            }}
                                        >
                                            ₦500
                                        </span>
                                        <span className="text-xs text-[#E8C7D3]">
                                            {' '}
                                            / month
                                        </span>
                                    </div>
                                </div>

                                <p className="mt-6 text-xs leading-relaxed text-[#E8C7D3]">
                                    Complete, unrestricted access for serious
                                    students and power learners.
                                </p>

                                <ul className="mt-8 space-y-4 text-xs font-semibold text-white">
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#E8C7D3]">
                                            ✓
                                        </span>{' '}
                                        Unlimited private spaces
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#E8C7D3]">
                                            ✓
                                        </span>{' '}
                                        Unlimited collaborative spaces
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#E8C7D3]">
                                            ✓
                                        </span>{' '}
                                        Unlimited AI-generated revision packs
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#E8C7D3]">
                                            ✓
                                        </span>{' '}
                                        Unlimited past-question uploads
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#E8C7D3]">
                                            ✓
                                        </span>{' '}
                                        Priority processing & updates
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-10">
                                <Link
                                    href="/register"
                                    className="flex w-full items-center justify-center rounded-xl bg-white py-4 text-xs font-bold text-[#762F50] shadow-md transition hover:bg-[#FDF4F6]"
                                >
                                    Upgrade to Plus
                                </Link>
                            </div>
                        </div>

                        {/* SEMESTER PASS PLAN CARD */}
                        <div className="flex flex-col justify-between rounded-3xl border border-[#D8DDD5] bg-[#F7F8F5] p-6 shadow-sm sm:p-10">
                            <div>
                                <div className="flex items-baseline justify-between border-b border-[#E2E6DF] pb-6">
                                    <div>
                                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#AD5266]">
                                            BEST VALUE
                                        </p>
                                        <h3 className="mt-1 text-2xl font-bold text-[#30302D]">
                                            Semester Pass
                                        </h3>
                                    </div>
                                    <div className="text-right">
                                        <span
                                            className="text-3xl font-extrabold text-[#30302D]"
                                            style={{
                                                fontFamily:
                                                    '"Manrope", sans-serif',
                                            }}
                                        >
                                            ₦1,500
                                        </span>
                                        <span className="text-xs text-[#73736C]">
                                            {' '}
                                            / 4 months
                                        </span>
                                    </div>
                                </div>

                                <p className="mt-6 text-xs leading-relaxed text-[#73736C]">
                                    One-off payment covering your entire
                                    academic semester with discount pricing.
                                </p>

                                <ul className="mt-8 space-y-4 text-xs font-semibold text-[#30302D]">
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#762F50]">
                                            ✓
                                        </span>{' '}
                                        4 full months of Plus access
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#762F50]">
                                            ✓
                                        </span>{' '}
                                        Unlimited collaborative spaces
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#762F50]">
                                            ✓
                                        </span>{' '}
                                        Unlimited AI revision packs
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#762F50]">
                                            ✓
                                        </span>{' '}
                                        Unlimited past-question uploads
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#762F50]">
                                            ✓
                                        </span>{' '}
                                        Save 25% over monthly plan
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-10">
                                <Link
                                    href="/register"
                                    className="flex w-full items-center justify-center rounded-xl bg-[#762F50] py-4 text-xs font-bold text-white shadow-md transition hover:bg-[#5E243F]"
                                >
                                    Get Semester Pass
                                </Link>
                            </div>
                        </div>
                    </div>
                </FadeInSection>
            </section>

            {/* FAQ SECTION */}
            <section
                id="faq"
                className="mx-auto max-w-4xl px-5 py-16 sm:px-10 sm:py-20 lg:px-12"
            >
                <FadeInSection>
                    <div className="text-center">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#AD5266]">
                            FREQUENTLY ASKED QUESTIONS
                        </p>
                        <h2
                            className="mt-3 text-3xl font-medium tracking-[-0.03em] text-[#30302D] sm:text-4xl"
                            style={{ fontFamily: '"Manrope", sans-serif' }}
                        >
                            Everything you need to know about Cadence.
                        </h2>
                    </div>

                    <div className="mt-10 space-y-4 sm:mt-12">
                        {faqs.map((faq, index) => {
                            const isOpen = openFaq === index;
                            return (
                                <div
                                    key={index}
                                    className="overflow-hidden rounded-2xl border border-[#D8DDD5] bg-white transition-all"
                                >
                                    <button
                                        type="button"
                                        onClick={() => toggleFaq(index)}
                                        className="flex w-full items-center justify-between p-5 text-left transition hover:bg-[#FDF9FA] sm:p-6"
                                    >
                                        <span className="text-xs font-bold text-[#30302D] sm:text-base">
                                            {faq.question}
                                        </span>
                                        <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F0F0E9] text-xs font-bold text-[#762F50] sm:h-7 sm:w-7">
                                            {isOpen ? '−' : '+'}
                                        </span>
                                    </button>
                                    <div
                                        className={`grid transition-all duration-300 ease-in-out ${
                                            isOpen
                                                ? 'grid-rows-[1fr] opacity-100'
                                                : 'grid-rows-[0fr] opacity-0'
                                        }`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="border-t border-[#F0F0E9] px-5 pb-5 pt-3 text-xs leading-relaxed text-[#73736C] sm:px-6 sm:pb-6 sm:pt-4 sm:text-sm">
                                                {faq.answer}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </FadeInSection>
            </section>
        </GuestLayout>
    );
}
