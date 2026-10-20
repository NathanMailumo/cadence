import React from 'react';
import CadenceLogo from '@/Components/CadenceLogo';
import { Link, usePage } from '@inertiajs/react';
import { Mail } from 'lucide-react';

export default function GuestLayout({ children }) {
    const { props } = usePage();
    const user = props.auth?.user;

    return (
        <div className="relative flex min-h-screen flex-col bg-[#F0F0E9] font-sans text-[#30302D] antialiased selection:bg-[#AD5266]/20 selection:text-[#762F50]">
            {/* Top Navigation Bar - Permanently Fixed */}
            <header className="fixed inset-x-0 top-0 z-50 border-b border-[#D8DDD5]/60 bg-[#F0F0E9]/90 px-6 py-4 backdrop-blur-md transition-all sm:px-10 md:px-16">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <Link href="/" className="group flex items-center gap-2">
                        <CadenceLogo
                            className="h-7 w-auto transition-transform group-hover:scale-105"
                            textClassName="text-xl"
                        />
                    </Link>

                    {/* Nav Links */}
                    <nav className="hidden items-center gap-8 text-xs font-semibold text-[#30302D] sm:flex">
                        <a
                            href="#how-it-works"
                            className="transition hover:text-[#762F50]"
                        >
                            How it works
                        </a>
                        <a
                            href="#use-cases"
                            className="transition hover:text-[#762F50]"
                        >
                            Use cases
                        </a>
                        <a
                            href="#pricing"
                            className="transition hover:text-[#762F50]"
                        >
                            Pricing
                        </a>
                        <a
                            href="#faq"
                            className="transition hover:text-[#762F50]"
                        >
                            FAQ
                        </a>
                    </nav>

                    {/* Auth Actions */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <Link
                                href={
                                    typeof route === 'function'
                                        ? route('dashboard')
                                        : '/dashboard'
                                }
                                className="rounded-xl bg-[#762F50] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#5E243F]"
                            >
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={
                                        typeof route === 'function'
                                            ? route('login')
                                            : '/login'
                                    }
                                    className="rounded-xl border border-[#D8DDD5] bg-[#F7F7F2]/60 px-5 py-2.5 text-xs font-bold text-[#30302D] shadow-sm transition hover:bg-white hover:text-[#762F50]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={
                                        typeof route === 'function'
                                            ? route('register')
                                            : '/register'
                                    }
                                    className="rounded-xl bg-[#762F50] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#5E243F] active:scale-95"
                                >
                                    Get started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content Area with top padding offset for the fixed header */}
            <main className="relative z-10 flex flex-grow flex-col pt-20">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-[#D8DDD5]/60 bg-[#F0F0E9] py-16">
                <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 px-6 sm:px-10 md:flex-row lg:px-16">
                    {/* Left Column: Brand, Socials & Slogan */}
                    <div className="flex flex-col gap-6">
                        <Link href="/">
                            <CadenceLogo
                                className="h-7 w-auto"
                                textClassName="text-xl"
                            />
                        </Link>

                        {/* Social Handles: Instagram, Gmail, X */}
                        <div className="flex items-center gap-3">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D8DDD5] bg-[#F0F0E9] text-xs font-bold text-[#762F50] transition hover:border-[#762F50] hover:bg-white"
                                title="Instagram"
                            >
                                IG
                            </a>
                            <a
                                href="mailto:support@cadence.study"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D8DDD5] bg-[#F0F0E9] text-xs font-bold text-[#762F50] transition hover:border-[#762F50] hover:bg-white"
                                title="Gmail"
                            >
                                <Mail size={16} strokeWidth={1.8} />
                            </a>
                            <a
                                href="https://x.com"
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D8DDD5] bg-[#F0F0E9] text-xs font-bold text-[#762F50] transition hover:border-[#762F50] hover:bg-white"
                                title="X"
                            >
                                X
                            </a>
                        </div>

                        <p className="mt-2 text-xs font-medium text-[#73736C]">
                            Learn clearly. Grow confidently.
                        </p>
                    </div>

                    {/* Right Column: Footer Links */}
                    <div className="flex flex-col items-start gap-3.5 text-xs font-bold text-[#30302D] md:items-end">
                        <a
                            href="#how-it-works"
                            className="transition hover:text-[#762F50]"
                        >
                            How it works
                        </a>
                        <a
                            href="#use-cases"
                            className="transition hover:text-[#762F50]"
                        >
                            Use cases
                        </a>
                        <a
                            href="#pricing"
                            className="transition hover:text-[#762F50]"
                        >
                            Pricing
                        </a>
                        <a
                            href="#faq"
                            className="transition hover:text-[#762F50]"
                        >
                            FAQ
                        </a>
                        <Link
                            href={
                                typeof route === 'function'
                                    ? route('login')
                                    : '/login'
                            }
                            className="transition hover:text-[#762F50]"
                        >
                            Log in
                        </Link>
                        <Link
                            href={
                                typeof route === 'function'
                                    ? route('register')
                                    : '/register'
                            }
                            className="transition hover:text-[#762F50]"
                        >
                            Get started
                        </Link>
                        <Link
                            href={route('terms')}
                            className="mt-2 transition hover:text-[#762F50]"
                        >
                            Terms and conditions
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
