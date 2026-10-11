import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { useClerk } from '@clerk/clerk-react';
import { LockKeyhole, LogOut, Plus, Users } from 'lucide-react';
import Resource from '@/Components/Resource';
import CadenceLogo from '@/Components/CadenceLogo';

export default function AuthenticatedLayout({ children }) {
    const { url, props } = usePage();
    const user = props.auth?.user;
    const privateResources = props.privateResources || [];
    const publicResources = props.publicResources || [];
    const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
    const [resourceModalType, setResourceModalType] = useState('private');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#F0F0E9] font-sans text-[#30302D] antialiased">
            <header className="fixed left-0 right-0 top-0 z-30 flex h-14 items-center border-b border-[#D8DDD5] bg-white px-4 md:hidden">
                <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D8DDD5] text-[#762F50]"
                    aria-label="Toggle navigation menu"
                >
                    {isMobileMenuOpen ? '×' : '☰'}
                </button>
                <Link href="/dashboard" className="ml-3">
                    <CadenceLogo
                        className="h-6 w-auto"
                        textClassName="text-lg"
                    />
                </Link>
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
                    <div className="flex items-center gap-3 px-3">
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
                            <p className="truncate text-sm font-semibold text-[#30302D]">
                                {user?.name || 'Cadence user'}
                            </p>
                            <p className="truncate text-[11px] text-[#A5A59D]">
                                {user?.email || 'Study workspace'}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden pt-14 transition-all md:ml-64 md:pt-0">
                {children}
            </main>

            <Resource
                isOpen={isResourceModalOpen}
                defaultResourceType={resourceModalType}
                onClose={() => setIsResourceModalOpen(false)}
            />
        </div>
    );
}
