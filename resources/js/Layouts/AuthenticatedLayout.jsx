import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Resource from '@/Components/Resource';
import CadenceLogo from '@/Components/CadenceLogo';
import { useClerk } from '@clerk/clerk-react';

export default function AuthenticatedLayout({ children, resources }) {
    const { url, props } = usePage();
    const user = props.auth?.user;

    const userResources =
        resources && resources.length > 0 ? resources : props.resources || [];

    const privateResources = userResources.filter(
        (item) =>
            item.resource_type === 'private' &&
            item.clerk_id === user?.clerk_id,
    );
    const publicResources = userResources.filter(
        (item) =>
            item.resource_type === 'public' || item.clerk_id !== user?.clerk_id,
    );

    const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
    const [resourceModalType, setResourceModalType] = useState('private');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isPrivateOpen, setIsPrivateOpen] = useState(true);
    const [isPublicOpen, setIsPublicOpen] = useState(true);

    const { signOut } = useClerk();

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (err) {
            console.warn('Clerk sign out error:', err);
        } finally {
            router.post(
                typeof route === 'function' ? route('logout') : '/logout',
                {},
                {
                    onFinish: () => {
                        window.location.href = '/login';
                    },
                },
            );
        }
    };

    return (
        <div className="flex min-h-screen bg-[#F0F0E9] font-sans text-[#30302D] antialiased">
            {/* MOBILE TOP NAVBAR */}
            <header className="fixed left-0 right-0 top-0 z-30 flex h-14 items-center justify-between border-b border-[#D8DDD5] bg-[#FFFFFF]/95 px-4 backdrop-blur-md md:hidden">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D8DDD5] bg-[#F7F7F2] text-[#30302D] transition-colors hover:bg-[#EAEAE4]"
                        aria-label="Toggle Navigation Menu"
                    >
                        {isMobileMenuOpen ? (
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        )}
                    </button>

                    <Link
                        href={
                            typeof route === 'function'
                                ? route('dashboard')
                                : '/dashboard'
                        }
                        className="flex items-center gap-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <CadenceLogo
                            className="h-6 w-auto"
                            textClassName="text-lg font-bold"
                        />
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#AD5266] text-xs font-bold text-white shadow-sm">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                </div>
            </header>

            {/* MOBILE BACKDROP OVERLAY */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* SIDEBAR NAVIGATION (MATCHES FIGMA FRAME 8:200, 14:709, 14:1103) */}
            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen select-none flex-col justify-between border-r border-[#D8DDD5] bg-[#FFFFFF] transition-all duration-300 ease-in-out md:translate-x-0 ${
                    isMobileMenuOpen
                        ? 'translate-x-0 shadow-2xl'
                        : '-translate-x-full'
                } ${isSidebarCollapsed ? 'w-20' : 'w-64 max-w-[80vw]'}`}
            >
                {/* TOP BRANDING & NAVIGATION LINKS */}
                <div className="custom-scrollbar flex-1 overflow-y-auto px-4 py-5">
                    {/* BRANDING HEADER */}
                    <div className="flex items-center justify-between border-b border-[#F0F0E9] pb-6">
                        <Link
                            href={
                                typeof route === 'function'
                                    ? route('dashboard')
                                    : '/dashboard'
                            }
                            className="flex items-center gap-2.5 overflow-hidden"
                            title="Cadence Home"
                        >
                            <CadenceLogo
                                className="h-7 w-auto shrink-0"
                                showText={!isSidebarCollapsed}
                                textClassName="text-xl font-bold tracking-tight text-[#762F50]"
                            />
                        </Link>

                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#D8DDD5] bg-[#F7F7F2] text-xs text-[#73736C] hover:text-[#30302D] md:hidden"
                            aria-label="Close menu"
                        >
                            ✕
                        </button>
                    </div>

                    {/* SECTION LABEL: WORKSPACE */}
                    <div className="mb-2 mt-6 px-2">
                        {!isSidebarCollapsed && (
                            <span className="text-[11px] font-bold uppercase tracking-widest text-[#73736C]">
                                Workspace
                            </span>
                        )}
                    </div>

                    {/* MAIN NAVIGATION LIST */}
                    <nav className="space-y-1 text-sm font-medium">
                        {/* 1. HOME */}
                        <Link
                            onClick={() => setIsMobileMenuOpen(false)}
                            href={
                                typeof route === 'function'
                                    ? route('dashboard')
                                    : '/dashboard'
                            }
                            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
                                url === '/dashboard' || url === '/'
                                    ? 'bg-[#F0F0E9] font-bold text-[#762F50]'
                                    : 'text-[#30302D] hover:bg-[#F7F7F2]'
                            }`}
                            title="Home"
                        >
                            <svg
                                className="h-5 w-5 shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.8"
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            {!isSidebarCollapsed && <span>Home</span>}
                        </Link>

                        {/* 2. PRIVATE SPACE */}
                        <div className="pt-2">
                            <div className="flex items-center justify-between px-3 py-1.5 text-xs text-[#73736C]">
                                {!isSidebarCollapsed && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsPrivateOpen(!isPrivateOpen)
                                        }
                                        className="flex items-center gap-2 font-semibold text-[#73736C] hover:text-[#30302D]"
                                    >
                                        <svg
                                            className="h-4 w-4 shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.8"
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                            />
                                        </svg>
                                        <span>Private space</span>
                                        <svg
                                            className={`h-3 w-3 transition-transform ${isPrivateOpen ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setResourceModalType('private');
                                        setIsResourceModalOpen(true);
                                    }}
                                    className="flex h-5 w-5 items-center justify-center rounded-md border border-[#D8DDD5] bg-[#FFFFFF] text-xs font-bold text-[#762F50] transition-colors hover:bg-[#F0F0E9]"
                                    title="Create private space"
                                >
                                    +
                                </button>
                            </div>

                            {!isSidebarCollapsed &&
                                isPrivateOpen &&
                                privateResources.length > 0 && (
                                    <div className="mt-1 space-y-0.5 pl-5 pr-1">
                                        {privateResources.map((item) => {
                                            const isActive =
                                                url.includes(
                                                    `/resources/private/${item.id}`,
                                                ) ||
                                                url.includes(
                                                    `/resources/${item.id}`,
                                                );
                                            return (
                                                <div
                                                    key={item.id}
                                                    className={`group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                                                        isActive
                                                            ? 'bg-[#F0F0E9] font-bold text-[#762F50]'
                                                            : 'text-[#73736C] hover:bg-[#F7F7F2] hover:text-[#30302D]'
                                                    }`}
                                                >
                                                    <Link
                                                        onClick={() =>
                                                            setIsMobileMenuOpen(
                                                                false,
                                                            )
                                                        }
                                                        href={
                                                            typeof route ===
                                                            'function'
                                                                ? route(
                                                                      'resources.private',
                                                                      item.id,
                                                                  )
                                                                : `/resources/private/${item.id}`
                                                        }
                                                        className="min-w-0 flex-1 truncate"
                                                    >
                                                        {item.course_name ||
                                                            item.name ||
                                                            item.title}
                                                    </Link>
                                                    <Link
                                                        method="delete"
                                                        href={
                                                            typeof route ===
                                                            'function'
                                                                ? route(
                                                                      'resources.destroy',
                                                                      item.id,
                                                                  )
                                                                : `/resources/${item.id}`
                                                        }
                                                        as="button"
                                                        onClick={(e) => {
                                                            if (
                                                                !window.confirm(
                                                                    'Delete this space?',
                                                                )
                                                            )
                                                                e.preventDefault();
                                                        }}
                                                        className="p-0.5 text-gray-400 opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100"
                                                        title="Delete space"
                                                    >
                                                        ✕
                                                    </Link>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                        </div>

                        {/* 3. COLLABORATIVE SPACE */}
                        <div className="pt-2">
                            <div className="flex items-center justify-between px-3 py-1.5 text-xs text-[#73736C]">
                                {!isSidebarCollapsed && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsPublicOpen(!isPublicOpen)
                                        }
                                        className="flex items-center gap-2 font-semibold text-[#73736C] hover:text-[#30302D]"
                                    >
                                        <svg
                                            className="h-4 w-4 shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.8"
                                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                            />
                                        </svg>
                                        <span>Collaborative</span>
                                        <svg
                                            className={`h-3 w-3 transition-transform ${isPublicOpen ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setResourceModalType('public');
                                        setIsResourceModalOpen(true);
                                    }}
                                    className="flex h-5 w-5 items-center justify-center rounded-md border border-[#D8DDD5] bg-[#FFFFFF] text-xs font-bold text-[#762F50] transition-colors hover:bg-[#F0F0E9]"
                                    title="Create collaborative space"
                                >
                                    +
                                </button>
                            </div>

                            {!isSidebarCollapsed &&
                                isPublicOpen &&
                                publicResources.length > 0 && (
                                    <div className="mt-1 space-y-0.5 pl-5 pr-1">
                                        {publicResources.map((item) => {
                                            const isOwner =
                                                item.clerk_id ===
                                                user?.clerk_id;
                                            const isActive =
                                                url.includes(
                                                    `/resources/public/${item.id}`,
                                                ) ||
                                                url.includes(
                                                    `/resources/${item.id}`,
                                                );
                                            return (
                                                <div
                                                    key={item.id}
                                                    className={`group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                                                        isActive
                                                            ? 'bg-[#F0F0E9] font-bold text-[#762F50]'
                                                            : 'text-[#73736C] hover:bg-[#F7F7F2] hover:text-[#30302D]'
                                                    }`}
                                                >
                                                    <Link
                                                        onClick={() =>
                                                            setIsMobileMenuOpen(
                                                                false,
                                                            )
                                                        }
                                                        href={
                                                            typeof route ===
                                                            'function'
                                                                ? route(
                                                                      'resources.public',
                                                                      item.id,
                                                                  )
                                                                : `/resources/public/${item.id}`
                                                        }
                                                        className="min-w-0 flex-1 truncate"
                                                    >
                                                        {item.course_name ||
                                                            item.name ||
                                                            item.title}
                                                    </Link>
                                                    {isOwner && (
                                                        <Link
                                                            method="delete"
                                                            href={
                                                                typeof route ===
                                                                'function'
                                                                    ? route(
                                                                          'resources.destroy',
                                                                          item.id,
                                                                      )
                                                                    : `/resources/${item.id}`
                                                            }
                                                            as="button"
                                                            onClick={(e) => {
                                                                if (
                                                                    !window.confirm(
                                                                        'Delete this collaborative space?',
                                                                    )
                                                                )
                                                                    e.preventDefault();
                                                            }}
                                                            className="p-0.5 text-gray-400 opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100"
                                                            title="Delete space"
                                                        >
                                                            ✕
                                                        </Link>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                        </div>
                    </nav>
                </div>

                {/* BOTTOM FOOTER: LOGOUT & COLLAPSE TOGGLE (MATCHES FIGMA FRAME 8:247-259) */}
                <div className="space-y-2 border-t border-[#D8DDD5] p-3">
                    {/* User profile info & Log out */}
                    <div className="flex items-center justify-between gap-2 px-2 py-1.5">
                        <div className="flex min-w-0 items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#AD5266] text-xs font-bold text-white shadow-sm">
                                {user?.name
                                    ? user.name.charAt(0).toUpperCase()
                                    : 'U'}
                            </div>
                            {!isSidebarCollapsed && (
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-bold text-[#30302D]">
                                        {user?.name || 'User'}
                                    </p>
                                    <p className="truncate text-[10px] text-[#73736C]">
                                        {user?.email || ''}
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#73736C] transition-colors hover:bg-rose-50 hover:text-rose-700"
                            title="Log out"
                            aria-label="Log out"
                        >
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Toggle Sidebar Collapse (Figma Frame 8:256) */}
                    <div className="hidden justify-end pt-1 md:flex">
                        <button
                            type="button"
                            onClick={() =>
                                setIsSidebarCollapsed(!isSidebarCollapsed)
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#D8DDD5] text-xs text-[#73736C] transition-colors hover:bg-[#F7F7F2] hover:text-[#30302D]"
                            title={
                                isSidebarCollapsed
                                    ? 'Expand sidebar'
                                    : 'Collapse sidebar'
                            }
                            aria-label="Toggle sidebar"
                        >
                            <svg
                                className={`h-4 w-4 transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT WORKSPACE */}
            <main
                className={`min-h-screen w-full overflow-x-hidden pt-14 transition-all duration-300 md:pt-0 ${
                    isSidebarCollapsed
                        ? 'md:ml-20 md:w-[calc(100%-5rem)]'
                        : 'md:ml-64 md:w-[calc(100%-16rem)]'
                }`}
            >
                {children}
            </main>

            {/* NEW RESOURCE MODAL */}
            <Resource
                isOpen={isResourceModalOpen}
                defaultResourceType={resourceModalType}
                onClose={() => setIsResourceModalOpen(false)}
            />
        </div>
    );
}
