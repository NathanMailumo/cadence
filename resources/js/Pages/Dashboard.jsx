import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Resource from '@/Components/Resource';
import { useUser } from '@clerk/clerk-react';

export default function Dashboard({ resources = [], pendingInvitations = [] }) {
    const { isLoaded, user } = useUser();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createModalType, setCreateModalType] = useState('private');

    const handleAccept = (resourceId) => {
        router.post(
            typeof route === 'function'
                ? route('resources.invitations.accept', resourceId)
                : `/resources/${resourceId}/accept`,
        );
    };

    const handleDecline = (resourceId) => {
        router.post(
            typeof route === 'function'
                ? route('resources.invitations.decline', resourceId)
                : `/resources/${resourceId}/decline`,
        );
    };

    const firstName = user?.firstName || user?.fullName?.split(' ')[0] || 'there';

    // Separate private and collaborative spaces
    const privateSpaces = resources.filter(
        (r) => r.resource_type === 'private' && r.clerk_id === user?.id,
    );
    const collaborativeSpaces = resources.filter(
        (r) => r.resource_type === 'public' || r.clerk_id !== user?.id,
    );

    const openCreateSpace = (type = 'private') => {
        setCreateModalType(type);
        setIsCreateModalOpen(true);
    };

    if (!isLoaded) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F0F0E9]">
                <div className="flex items-center gap-3">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#AD5266] border-t-transparent" />
                    <span className="text-xs font-semibold text-[#73736C]">Loading Cadence...</span>
                </div>
            </div>
        );
    }

    return (
        <AuthenticatedLayout resources={resources}>
            <Head title="Cadence - Dashboard" />

            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                {/* TOP HEADER (MATCHES FIGMA FRAME 8:196 & 14:709) */}
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#D8DDD5] bg-[#FFFFFF] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#AD5266]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#AD5266]" />
                            <span>Your Cadence</span>
                        </div>
                        <h1
                            className="mt-3 text-3xl font-bold tracking-tight text-[#30302D] sm:text-4xl"
                            style={{ fontFamily: '"Manrope", sans-serif', letterSpacing: '-0.03em' }}
                        >
                            Good {getGreeting()}, {firstName}.
                        </h1>
                        <p className="mt-1.5 text-sm text-[#73736C]">
                            Pick up where you left off, or make room for something new.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={() => openCreateSpace('private')}
                            className="rounded-full bg-[#AD5266] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#974356] active:scale-95"
                        >
                            + Create a Space
                        </button>
                        {resources.length > 0 && (
                            <Link
                                href={
                                    typeof route === 'function'
                                        ? route('sessions.create', { resource_id: resources[0]?.id })
                                        : `/sessions/create?resource_id=${resources[0]?.id}`
                                }
                                className="rounded-full border border-[#C5C9BE] bg-[#FFFFFF] px-5 py-2.5 text-xs font-semibold text-[#30302D] transition-all hover:bg-[#F7F7F2] active:scale-95"
                            >
                                New Revision Pack
                            </Link>
                        )}
                    </div>
                </div>

                {/* PENDING INVITATIONS NOTICE */}
                {pendingInvitations.length > 0 && (
                    <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
                        <div className="flex items-center gap-2">
                            <span className="text-sm">📩</span>
                            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                                Pending Invitations ({pendingInvitations.length})
                            </h2>
                        </div>
                        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {pendingInvitations.map((invite) => (
                                <div
                                    key={invite.id}
                                    className="flex items-center justify-between rounded-xl border border-amber-200 bg-white p-3.5 shadow-sm"
                                >
                                    <div className="min-w-0 pr-3">
                                        <p className="truncate text-xs font-bold text-[#30302D]">
                                            {invite.course_name}
                                        </p>
                                        <p className="truncate text-[11px] text-[#73736C]">
                                            Invited by {invite.user?.name || 'Collaborator'}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => handleAccept(invite.id)}
                                            className="rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white transition-opacity hover:opacity-90"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDecline(invite.id)}
                                            className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* FEATURED QUICK ACCESS BANNER (MATCHES FIGMA FRAME 8:196) */}
                <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
                    {/* Latest Revision Pack Card */}
                    <div className="flex flex-col justify-between rounded-3xl border border-[#D8DDD5] bg-[#FFFFFF] p-6 shadow-sm lg:col-span-1">
                        <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#AD5266]">
                                Latest Revision Pack
                            </span>
                            <h3
                                className="mt-3 text-xl font-bold text-[#30302D]"
                                style={{ fontFamily: '"Manrope", sans-serif' }}
                            >
                                Cell Biology Essentials
                            </h3>
                            <p className="mt-2 text-xs leading-relaxed text-[#73736C]">
                                Summary, key concepts, flashcards, and practice questions are organized and ready.
                            </p>
                        </div>
                        <div className="mt-6 flex items-center justify-between border-t border-[#F0F0E9] pt-4">
                            <span className="text-[11px] font-medium text-[#73736C]">
                                AI Study Pack
                            </span>
                            {resources.length > 0 ? (
                                <Link
                                    href={
                                        typeof route === 'function'
                                            ? route('resources.show', resources[0].id)
                                            : `/resources/${resources[0].id}`
                                    }
                                    className="text-xs font-bold text-[#AD5266] hover:underline"
                                >
                                    Open space →
                                </Link>
                            ) : (
                                <button
                                    onClick={() => openCreateSpace('private')}
                                    className="text-xs font-bold text-[#AD5266] hover:underline"
                                >
                                    Create a space →
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Quick Space Stats & Shortcuts */}
                    <div className="flex flex-col justify-between rounded-3xl border border-[#D8DDD5] bg-[#F7F7F2] p-6 lg:col-span-2">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#73736C]">
                                    Workspace Overview
                                </span>
                                <h3
                                    className="mt-1 text-lg font-bold text-[#30302D]"
                                    style={{ fontFamily: '"Manrope", sans-serif' }}
                                >
                                    {resources.length} Active {resources.length === 1 ? 'Space' : 'Spaces'}
                                </h3>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openCreateSpace('private')}
                                    className="rounded-full border border-[#D8DDD5] bg-[#FFFFFF] px-3.5 py-1.5 text-xs font-semibold text-[#30302D] hover:bg-[#F0F0E9] transition-colors"
                                >
                                    + Private space
                                </button>
                                <button
                                    onClick={() => openCreateSpace('public')}
                                    className="rounded-full border border-[#D8DDD5] bg-[#FFFFFF] px-3.5 py-1.5 text-xs font-semibold text-[#30302D] hover:bg-[#F0F0E9] transition-colors"
                                >
                                    + Collaborative space
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] p-4">
                                <span className="text-[10px] font-bold uppercase text-[#73736C]">Private</span>
                                <p className="mt-1 text-xl font-bold text-[#30302D]">
                                    {privateSpaces.length}
                                </p>
                                <p className="text-[11px] text-[#73736C]">Personal spaces</p>
                            </div>
                            <div className="rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] p-4">
                                <span className="text-[10px] font-bold uppercase text-[#73736C]">Shared</span>
                                <p className="mt-1 text-xl font-bold text-[#30302D]">
                                    {collaborativeSpaces.length}
                                </p>
                                <p className="text-[11px] text-[#73736C]">Collaborative</p>
                            </div>
                            <div className="col-span-2 rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] p-4 sm:col-span-1">
                                <span className="text-[10px] font-bold uppercase text-[#73736C]">Focus</span>
                                <p className="mt-1 text-xl font-bold text-[#AD5266]">
                                    Active
                                </p>
                                <p className="text-[11px] text-[#73736C]">All synced</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* YOUR SPACES SECTION (MATCHES FIGMA FRAME 8:196) */}
                <div className="mt-12">
                    <div className="flex items-center justify-between pb-4">
                        <div>
                            <h2
                                className="text-xl font-bold text-[#30302D]"
                                style={{ fontFamily: '"Manrope", sans-serif' }}
                            >
                                Your spaces
                            </h2>
                            <p className="text-xs text-[#73736C]">Keep learning close.</p>
                        </div>
                    </div>

                    {resources.length === 0 ? (
                        /* EMPTY ONBOARDING STATE (FIGMA FRAME 14:709) */
                        <div className="rounded-3xl border border-[#D8DDD5] bg-[#FFFFFF] p-8 text-center sm:p-12">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0F0E9] text-2xl text-[#AD5266]">
                                ✦
                            </div>
                            <h3
                                className="mt-4 text-xl font-bold text-[#30302D]"
                                style={{ fontFamily: '"Manrope", sans-serif' }}
                            >
                                Your study space starts here.
                            </h3>
                            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[#73736C]">
                                Bring your study resources together, collaborate with other students,
                                and turn any course into a focused AI revision pack.
                            </p>
                            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                                <button
                                    onClick={() => openCreateSpace('private')}
                                    className="rounded-full bg-[#AD5266] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#974356] transition-colors"
                                >
                                    Create a Space
                                </button>
                                <button
                                    onClick={() => openCreateSpace('public')}
                                    className="rounded-full border border-[#D8DDD5] bg-[#FFFFFF] px-6 py-2.5 text-xs font-semibold text-[#30302D] hover:bg-[#F7F7F2] transition-colors"
                                >
                                    Create Shared Space
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* SPACES GRID */
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {resources.map((space) => {
                                const isPrivate = space.resource_type === 'private';
                                const href = isPrivate
                                    ? (typeof route === 'function' ? route('resources.private', space.id) : `/resources/private/${space.id}`)
                                    : (typeof route === 'function' ? route('resources.public', space.id) : `/resources/public/${space.id}`);

                                return (
                                    <Link
                                        key={space.id}
                                        href={href}
                                        className="group flex flex-col justify-between rounded-2xl border border-[#D8DDD5] bg-[#FFFFFF] p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-[#AD5266]/40 hover:shadow-md"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                                                <span className={isPrivate ? 'text-[#73736C]' : 'text-[#AD5266]'}>
                                                    {isPrivate ? 'PRIVATE SPACE' : 'COLLABORATIVE SPACE'}
                                                </span>
                                                <span>{isPrivate ? '🔒' : '👥'}</span>
                                            </div>
                                            <h3
                                                className="mt-3 text-lg font-bold text-[#30302D] group-hover:text-[#AD5266] transition-colors"
                                                style={{ fontFamily: '"Manrope", sans-serif' }}
                                            >
                                                {space.course_name || space.name || 'Untitled space'}
                                            </h3>
                                            <p className="mt-1 text-xs text-[#73736C]">
                                                {space.course_code ? `${space.course_code} · ` : ''}
                                                {isPrivate ? 'Personal library' : 'Shared space'}
                                            </p>
                                        </div>

                                        <div className="mt-6 flex items-center justify-between border-t border-[#F0F0E9] pt-3 text-xs text-[#73736C]">
                                            <span>Open canvas</span>
                                            <span className="font-semibold group-hover:translate-x-1 transition-transform">→</span>
                                        </div>
                                    </Link>
                                );
                            })}

                            {/* Create New Space Card */}
                            <button
                                type="button"
                                onClick={() => openCreateSpace('private')}
                                className="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D8DDD5] bg-[#F7F7F2]/60 p-6 text-center transition-colors hover:border-[#AD5266] hover:bg-[#FFFFFF]"
                            >
                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFFFFF] text-lg font-bold text-[#AD5266] shadow-sm">
                                    +
                                </span>
                                <span className="mt-2 text-sm font-bold text-[#30302D]">
                                    Create a new space
                                </span>
                                <span className="text-[11px] text-[#73736C]">
                                    Gather resources & notes
                                </span>
                            </button>
                        </div>
                    )}
                </div>

                {/* GETTING STARTED THREE WAYS (FIGMA FRAME 14:709) */}
                <div className="mt-16 border-t border-[#D8DDD5] pt-12">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#AD5266]">
                        Everything in one rhythm
                    </span>
                    <h2
                        className="mt-1 text-xl font-bold text-[#30302D] sm:text-2xl"
                        style={{ fontFamily: '"Manrope", sans-serif' }}
                    >
                        Three ways to get started.
                    </h2>
                    <p className="mt-1 text-xs text-[#73736C]">
                        You do not need to set everything up at once. Start with a space, add what matters, and let Cadence help from there.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-[#D8DDD5] bg-[#FFFFFF] p-5 shadow-sm">
                            <span className="text-[11px] font-bold text-[#AD5266]">01 · TOGETHER</span>
                            <h3 className="mt-1 text-sm font-bold text-[#30302D]" style={{ fontFamily: '"Manrope", sans-serif' }}>
                                Collaborative Spaces
                            </h3>
                            <p className="mt-1 text-xs text-[#73736C]">
                                Create a shared canvas for your class, project group, or study partners.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-[#D8DDD5] bg-[#FFFFFF] p-5 shadow-sm">
                            <span className="text-[11px] font-bold text-[#AD5266]">02 · ORGANIZED</span>
                            <h3 className="mt-1 text-sm font-bold text-[#30302D]" style={{ fontFamily: '"Manrope", sans-serif' }}>
                                Study Resources
                            </h3>
                            <p className="mt-1 text-xs text-[#73736C]">
                                Keep useful videos, links, notes, and past questions within easy reach.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-[#D8DDD5] bg-[#FFFFFF] p-5 shadow-sm">
                            <span className="text-[11px] font-bold text-[#AD5266]">03 · FOCUSED</span>
                            <h3 className="mt-1 text-sm font-bold text-[#30302D]" style={{ fontFamily: '"Manrope", sans-serif' }}>
                                AI Revision Packs
                            </h3>
                            <p className="mt-1 text-xs text-[#73736C]">
                                Generate summaries, flashcards, and practice questions for any topic.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* RESOURCE CREATION MODAL */}
            <Resource
                isOpen={isCreateModalOpen}
                defaultResourceType={createModalType}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </AuthenticatedLayout>
    );
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
}
