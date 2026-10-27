import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { useClerk } from '@clerk/clerk-react';
import CadenceLogo from './CadenceLogo';

export default function Navbar() {
    const { signOut } = useClerk();
    const { auth } = usePage().props;

    const isAuthenticated = !!auth?.user;

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (err) {
            console.error('Clerk sign out error:', err);
        } finally {
            router.post(
                '/logout',
                {},
                {
                    onFinish: () => {
                        window.location.assign('/login');
                    },
                },
            );
        }
    };

    return (
        <nav className="sticky top-0 z-40 border-b border-[#D8DDD5] bg-[#FFFFFF]/90 px-4 py-3.5 backdrop-blur-md transition-all sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                <Link href="/" className="group flex items-center gap-2">
                    <CadenceLogo
                        className="h-7 w-auto transition-transform group-hover:scale-105"
                        textClassName="text-xl"
                    />
                </Link>

                <div className="flex items-center gap-3 sm:gap-4">
                    {isAuthenticated ? (
                        <>
                            <Link
                                href={
                                    typeof route === 'function'
                                        ? route('dashboard')
                                        : '/dashboard'
                                }
                                className="rounded-full border border-[#D8DDD5] bg-[#F0F0E9] px-4 py-2 text-xs font-semibold text-[#30302D] transition-all hover:bg-[#E5E5DE] active:scale-95"
                            >
                                Dashboard
                            </Link>

                            <button
                                type="button"
                                onClick={handleSignOut}
                                className="rounded-full bg-[#762F50] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#5E243F] active:scale-95"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href={
                                    typeof route === 'function'
                                        ? route('login')
                                        : '/login'
                                }
                                className="rounded-full px-4 py-2 text-xs font-semibold text-[#30302D] transition-colors hover:text-[#762F50]"
                            >
                                Log in
                            </Link>

                            <Link
                                href={
                                    typeof route === 'function'
                                        ? route('register')
                                        : '/register'
                                }
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
