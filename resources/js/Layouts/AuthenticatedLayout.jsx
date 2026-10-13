import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { useClerk } from '@clerk/clerk-react';
import {
    Check,
    ChevronDown,
    Home,
    LockKeyhole,
    LogOut,
    Plus,
    Users,
} from 'lucide-react';
import Resource from '@/Components/Resource';
import CadenceLogo from '@/Components/CadenceLogo';

export default function AuthenticatedLayout({ children }) {
    const { url, props } = usePage();
    const user = props.auth?.user;
    const privateResources = props.privateResources || [];
    const publicResources = props.publicResources || [];
    const allResources = [...privateResources, ...publicResources];
    const currentResourceId =
        url.match(/\/resources\/(?:private|public)\/([^/?]+)/)?.[1] || '';
    const currentResource = allResources.find(
        (resource) => resource.id === currentResourceId,
    );
    const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
    const [resourceModalType, setResourceModalType] = useState('private');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileSpaceMenuOpen, setIsMobileSpaceMenuOpen] = useState(false);
    const [isMobileAccountMenuOpen, setIsMobileAccountMenuOpen] =
        useState(false);
    const { signOut } = useClerk();

    const openResourceModal = (type) => {
        setResourceModalType(type);
        setIsResourceModalOpen(true);
    };

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (err) {
            console.warn('Clerk sign out error:', err);
        } finally {
            router.post(
                '/logout',
                {},
                {
                    onFinish: () => {
                        window.location.href = '/login';
                    },
                },
            );
        }
    };

    const closeMobileMenu = () => setIsMobileMenuOpen(false);
    const goToResource = (resource) => {
        setIsMobileSpaceMenuOpen(false);
        window.location.href =
            resource.resource_type === 'public'
                ? `/resources/public/${resource.id}`
                : `/resources/private/${resource.id}`;
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#F0F0E9] font-sans text-[#30302D] antialiased">
            <header className="fixed left-0 right-0 top-0 z-30 flex h-14 items-center gap-3 border-b border-[#D8DDD5] bg-white px-4 md:hidden">
                <Link href="/dashboard" className="shrink-0">
                    <CadenceLogo className="h-7 w-7" showText={false} />
                </Link>
                {allResources.length > 0 && (
                    <div className="relative min-w-0 flex-1">
                        <button
                            type="button"
                            onClick={() =>
                                setIsMobileSpaceMenuOpen(
                                    !isMobileSpaceMenuOpen,
                                )
                            }
                            className="flex w-full items-center gap-2 rounded-xl border border-[#D8DDD5] bg-[#F7F7F2] px-3 py-2 text-left shadow-sm transition hover:border-[#C6A4B3] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#C6A4B3]/40"
                            aria-haspopup="menu"
                            aria-expanded={isMobileSpaceMenuOpen}
                            aria-label="Switch resource space"
                        >
                            {currentResource?.resource_type === 'public' ? (
                                <Users
                                    size={14}
                                    className="shrink-0 text-[#AD5266]"
                                />
                            ) : (
                                <LockKeyhole
                                    size={14}
                                    className="shrink-0 text-[#AD5266]"
                                />
                            )}
                            <span className="min-w-0 flex-1 truncate text-xs font-bold text-[#762F50]">
                                {currentResource?.course_name || 'Select a space'}
                            </span>
                            <ChevronDown
                                size={15}
                                className={`shrink-0 text-[#73736C] transition-transform ${
                                    isMobileSpaceMenuOpen ? 'rotate-180' : ''
                                }`}
                            />
                        </button>

                        {isMobileSpaceMenuOpen && (
                            <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 max-h-[min(20rem,70vh)] overflow-y-auto rounded-2xl border border-[#D8DDD5] bg-white p-2 shadow-[0_12px_30px_rgba(48,48,45,0.16)]">
                                {privateResources.length > 0 && (
                                    <div>
                                        <p className="px-3 pb-1 pt-2 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#A5A59D]">
                                            Private spaces
                                        </p>
                                        {privateResources.map((resource) => (
                                            <button
                                                key={resource.id}
                                                type="button"
                                                onClick={() => goToResource(resource)}
                                                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-[#30302D] transition hover:bg-[#F1E5EA] hover:text-[#762F50]"
                                            >
                                                <LockKeyhole
                                                    size={14}
                                                    className="shrink-0 text-[#AD5266]"
                                                />
                                                <span className="min-w-0 flex-1 truncate">
                                                    {resource.course_name}
                                                </span>
                                                {resource.id ===
                                                    currentResourceId && (
                                                    <Check
                                                        size={14}
                                                        className="shrink-0 text-[#762F50]"
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {publicResources.length > 0 && (
                                    <div className="mt-1 border-t border-[#F0F0E9] pt-1">
                                        <p className="px-3 pb-1 pt-2 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#A5A59D]">
                                            Collaborative spaces
                                        </p>
                                        {publicResources.map((resource) => (
                                            <button
                                                key={resource.id}
                                                type="button"
                                                onClick={() => goToResource(resource)}
                                                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-[#30302D] transition hover:bg-[#F1E5EA] hover:text-[#762F50]"
                                            >
                                                <Users
                                                    size={14}
                                                    className="shrink-0 text-[#AD5266]"
                                                />
                                                <span className="min-w-0 flex-1 truncate">
                                                    {resource.course_name}
                                                </span>
                                                {resource.id ===
                                                    currentResourceId && (
                                                    <Check
                                                        size={14}
                                                        className="shrink-0 text-[#762F50]"
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </header>

            {isMobileMenuOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-40 bg-black/20 md:hidden"
                    onClick={closeMobileMenu}
                    aria-label="Close navigation menu"
                />
            )}

            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-[#E5E7E1] bg-white transition-transform duration-300 md:translate-x-0 ${
                    isMobileMenuOpen
                        ? 'translate-x-0 shadow-2xl'
                        : '-translate-x-full'
                }`}
            >
                <div className="px-5 pt-6">
                    <div className="flex items-center justify-between border-b border-[#F0F0E9] pb-6">
                        <Link href="/dashboard" onClick={closeMobileMenu}>
                            <CadenceLogo
                                className="h-7 w-auto"
                                textClassName="text-xl"
                            />
                        </Link>
                        <button
                            type="button"
                            onClick={closeMobileMenu}
                            className="text-xl text-[#73736C] md:hidden"
                            aria-label="Close menu"
                        >
                            ×
                        </button>
                    </div>

                    <p className="mt-7 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#A5A59D]">
                        Workspace
                    </p>
                    <nav className="mt-4 space-y-2">
                        <Link
                            href="/dashboard"
                            onClick={closeMobileMenu}
                            className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                                url === '/dashboard' || url === '/'
                                    ? 'bg-[#F1E5EA] text-[#762F50]'
                                    : 'text-[#73736C] hover:bg-[#F7F7F2] hover:text-[#762F50]'
                            }`}
                        >
                            <span className="text-base" aria-hidden="true">
                                ⌂
                            </span>
                            Home
                        </Link>
                        <button
                            type="button"
                            onClick={() => openResourceModal('private')}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold text-[#73736C] transition hover:bg-[#F7F7F2] hover:text-[#762F50]"
                        >
                            <LockKeyhole size={16} strokeWidth={1.8} />
                            <span className="flex-1">Private space</span>
                            <Plus size={15} />
                        </button>
                        <div className="ml-8 space-y-1">
                            {privateResources.map((resource) => (
                                <Link
                                    key={resource.id}
                                    href={`/resources/private/${resource.id}`}
                                    onClick={closeMobileMenu}
                                    className="block truncate rounded-md px-2 py-1.5 text-xs text-[#8E9088] transition hover:bg-[#F7F7F2] hover:text-[#762F50]"
                                >
                                    {resource.course_name}
                                </Link>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => openResourceModal('public')}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold text-[#73736C] transition hover:bg-[#F7F7F2] hover:text-[#762F50]"
                        >
                            <Users size={16} strokeWidth={1.8} />
                            <span className="flex-1">Collaborative</span>
                            <Plus size={15} />
                        </button>
                        <div className="ml-8 space-y-1">
                            {publicResources.map((resource) => (
                                <Link
                                    key={resource.id}
                                    href={`/resources/public/${resource.id}`}
                                    onClick={closeMobileMenu}
                                    className="block truncate rounded-md px-2 py-1.5 text-xs text-[#8E9088] transition hover:bg-[#F7F7F2] hover:text-[#762F50]"
                                >
                                    {resource.course_name}
                                </Link>
                            ))}
                        </div>
                    </nav>
                </div>

                <div className="mt-auto border-t border-[#E5E7E1] px-5 py-5">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="mb-5 flex items-center gap-3 px-3 py-2 text-sm text-[#73736C] transition hover:text-[#762F50]"
                    >
                        <LogOut size={16} strokeWidth={1.8} />
                        Log out
                    </button>
                    <Link
                        href="/profile"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 px-3"
                    >
                        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#F1E5EA] text-sm font-bold text-[#762F50]">
                            {user?.profile_image_url ? (
                                <img
                                    src={user.profile_image_url}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                (user?.name || user?.email || 'A')
                                    .charAt(0)
                                    .toUpperCase()
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#30302D] hover:text-[#762F50]">
                                {user?.name || 'Cadence user'}
                            </p>
                            <p className="truncate text-[11px] text-[#A5A59D]">
                                {user?.email || 'Study workspace'}
                            </p>
                        </div>
                    </Link>
                </div>
            </aside>

            <main
                className={`flex h-screen min-w-0 flex-1 flex-col pb-16 pt-14 transition-all md:ml-64 md:pb-0 md:pt-0 ${
                    url.startsWith('/session/')
                        ? 'overflow-y-auto overflow-x-hidden'
                        : 'overflow-y-auto overflow-x-hidden md:overflow-hidden'
                }`}
            >
                {children}
            </main>

            <nav className="fixed bottom-0 left-0 right-0 z-40 grid h-16 grid-cols-4 border-t border-[#D8DDD5] bg-white/95 px-3 shadow-[0_-4px_18px_rgba(48,48,45,0.08)] backdrop-blur md:hidden">
                <Link
                    href="/dashboard"
                    className={`flex flex-col items-center justify-center gap-1 text-[10px] font-semibold ${
                        url === '/dashboard' || url === '/'
                            ? 'text-[#762F50]'
                            : 'text-[#73736C]'
                    }`}
                >
                    <Home size={18} strokeWidth={1.8} />
                    Home
                </Link>
                <button
                    type="button"
                    onClick={() => openResourceModal('private')}
                    className="flex flex-col items-center justify-center gap-1 text-[10px] font-semibold text-[#73736C]"
                >
                    <LockKeyhole size={18} strokeWidth={1.8} />
                    Private
                </button>
                <button
                    type="button"
                    onClick={() => openResourceModal('public')}
                    className="flex flex-col items-center justify-center gap-1 text-[10px] font-semibold text-[#73736C]"
                >
                    <Users size={18} strokeWidth={1.8} />
                    Collaborative
                </button>
                <button
                    type="button"
                    onClick={() =>
                        setIsMobileAccountMenuOpen(!isMobileAccountMenuOpen)
                    }
                    className={`flex flex-col items-center justify-center gap-1 text-[10px] font-semibold ${
                        isMobileAccountMenuOpen
                            ? 'text-[#762F50]'
                            : 'text-[#73736C]'
                    }`}
                    aria-haspopup="menu"
                    aria-expanded={isMobileAccountMenuOpen}
                    aria-label="Open account menu"
                >
                    <div className="flex h-[18px] w-[18px] items-center justify-center overflow-hidden rounded-full bg-[#F1E5EA] text-[9px] font-bold text-[#762F50]">
                        {user?.profile_image_url ? (
                            <img
                                src={user.profile_image_url}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            (user?.name || user?.email || 'A')
                                .charAt(0)
                                .toUpperCase()
                        )}
                    </div>
                    Account
                </button>
            </nav>

            {isMobileAccountMenuOpen && (
                <div
                    className="fixed bottom-[4.5rem] right-3 z-50 w-56 rounded-2xl border border-[#D8DDD5] bg-white p-2 shadow-[0_12px_30px_rgba(48,48,45,0.16)] md:hidden"
                    role="menu"
                >
                    <div className="flex items-center gap-3 rounded-xl bg-[#F7F7F2] px-3 py-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F1E5EA] text-sm font-bold text-[#762F50]">
                            {user?.profile_image_url ? (
                                <img
                                    src={user.profile_image_url}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                (user?.name || user?.email || 'A')
                                    .charAt(0)
                                    .toUpperCase()
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-[#30302D]">
                                {user?.name || 'Cadence user'}
                            </p>
                            <p className="truncate text-[10px] text-[#73736C]">
                                {user?.email || 'Study workspace'}
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/profile"
                        onClick={() => setIsMobileAccountMenuOpen(false)}
                        className="mt-2 flex w-full items-center rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-[#762F50] transition hover:bg-[#F1E5EA]"
                        role="menuitem"
                    >
                        Account settings
                    </Link>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-[#762F50] transition hover:bg-[#F1E5EA]"
                        role="menuitem"
                    >
                        <LogOut size={15} strokeWidth={1.8} />
                        Log out
                    </button>
                </div>
            )}

            <Resource
                isOpen={isResourceModalOpen}
                defaultResourceType={resourceModalType}
                onClose={() => setIsResourceModalOpen(false)}
            />
        </div>
    );
}
