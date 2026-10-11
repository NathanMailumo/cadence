import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useAuth, useClerk } from '@clerk/clerk-react';
import CadenceLogo from './CadenceLogo';

export default function Navbar() {
    const { isSignedIn, isLoaded } = useAuth();
    const { signOut } = useClerk();
    const { auth } = usePage().props;

    const isAuthenticated = isLoaded && (isSignedIn || !!auth?.user);

    return (
        <nav className="border-b border-[#D8DDD5] bg-[#FFFFFF]/90 backdrop-blur-md px-4 py-3.5 sm:px-6 lg:px-8 sticky top-0 z-40 transition-all">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <CadenceLogo className="h-7 w-auto transition-transform group-hover:scale-105" textClassName="text-xl" />
                </Link>

                <div className="flex items-center gap-3 sm:gap-4">
                    {isAuthenticated ? (
                        <>
                            <Link
                                href={typeof route === 'function' ? route('dashboard') : '/dashboard'}
                                className="rounded-full border border-[#D8DDD5] bg-[#F0F0E9] px-4 py-2 text-xs font-semibold text-[#30302D] transition-all hover:bg-[#E5E5DE] active:scale-95"
                            >
                                Dashboard
                            </Link>

                            <button
                                type="button"
                                onClick={() => signOut(() => window.location.assign('/login'))}
                                className="rounded-full bg-[#762F50] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[#5E243F] active:scale-95 shadow-sm"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href={typeof route === 'function' ? route('login') : '/login'}
                                className="rounded-full px-4 py-2 text-xs font-semibold text-[#30302D] transition-colors hover:text-[#762F50]"
                            >
                                Log in
                            </Link>

                            <Link
                                href={typeof route === 'function' ? route('register') : '/register'}
                                className="rounded-full bg-[#AD5266] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#974356] active:scale-95"
                            >
                                Get started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
