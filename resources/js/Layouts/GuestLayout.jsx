import React from 'react';
import CadenceLogo from '@/Components/CadenceLogo';
import { Link, usePage } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    const { props } = usePage();
    const user = props.auth?.user;

    return (
        <div className="relative flex min-h-screen flex-col bg-[#F0F0E9] font-sans text-[#30302D] antialiased selection:bg-[#AD5266]/20 selection:text-[#762F50]">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 border-b border-[#D8DDD5] bg-[#FFFFFF]/85 px-5 py-4 backdrop-blur-md transition-all sm:px-8 md:px-12">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <Link href="/" className="group flex items-center gap-2">
                        <CadenceLogo
                            className="h-7 w-auto transition-transform group-hover:scale-105"
                            textClassName="text-xl"
                        />
                    </Link>

                    <div className="flex items-center gap-3 sm:gap-6">
                        {user ? (
                            <>
                                <Link
                                    href={
                                        typeof route === 'function'
                                            ? route('dashboard')
                                            : '/dashboard'
                                    }
                                    className="rounded-full border border-[#D8DDD5] bg-[#FFFFFF] px-4 py-2 text-xs font-semibold text-[#30302D] shadow-sm transition-all hover:bg-[#F7F7F2]"
                                >
                                    Go to Dashboard
                                </Link>
                                <Link
                                    method="post"
                                    href={
                                        typeof route === 'function'
                                            ? route('logout')
                                            : '/logout'
                                    }
                                    as="button"
                                    className="rounded-full bg-[#762F50] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#5E243F]"
                                >
                                    Log out
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={
                                        typeof route === 'function'
                                            ? route('login')
                                            : '/login'
                                    }
                                    className="text-xs font-medium text-[#30302D] transition-colors hover:text-[#762F50] sm:text-sm"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={
                                        typeof route === 'function'
                                            ? route('register')
                                            : '/register'
                                    }
                                    className="rounded-full bg-[#AD5266] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#974356] active:scale-95 sm:px-5 sm:py-2.5 sm:text-sm"
                                >
                                    Get started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="relative z-10 flex flex-grow flex-col">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-[#D8DDD5] bg-[#FFFFFF] py-8 text-center text-xs text-[#73736C]">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
                    <div className="flex items-center gap-2">
                        <CadenceLogo
                            className="h-5 w-auto"
                            textClassName="text-sm font-bold text-[#762F50]"
                        />
                        <span className="text-gray-400">·</span>
                        <span>Learning, in your own rhythm.</span>
                    </div>
                    <p className="text-[11px] text-gray-500">
                        &copy; {new Date().getFullYear()} Cadence. All rights
                        reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
