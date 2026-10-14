import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import {
    ArrowUpRight,
    FolderOpen,
    LockKeyhole,
    Plus,
    Users,
} from 'lucide-react';
import Resource from '@/Components/Resource';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

function ResourceCard({ resource }) {
    const isPrivate = resource.resource_type === 'private';
    const itemCount =
        resource.resource_items_count ?? resource.resourceItemsCount ?? 0;

    return (
        <Link
            href={
                isPrivate
                    ? `/resources/private/${resource.id}`
                    : `/resources/public/${resource.id}`
            }
            className="group flex min-h-[190px] flex-col justify-between rounded-2xl border border-[#D8DDD5] bg-white p-6 transition hover:-translate-y-1 hover:border-[#AD5266]/40 hover:shadow-lg"
        >
            <div>
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#AD5266]">
                        {isPrivate ? (
                            <LockKeyhole size={14} />
                        ) : (
                            <Users size={14} />
                        )}
                        {isPrivate ? 'Private space' : 'Collaborative space'}
                    </span>
                    <ArrowUpRight
                        size={16}
                        className="text-[#A5A59D] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#762F50]"
                    />
                </div>
                <h3 className="mt-8 truncate text-xl font-medium tracking-[-0.03em] text-[#30302D]">
                    {resource.course_name}
                </h3>
            </div>
            <div className="flex items-center justify-between border-t border-[#F0F0E9] pt-4 text-xs text-[#73736C]">
                <span>
                    {itemCount} {itemCount === 1 ? 'resource' : 'resources'}
                </span>
                <span className="font-semibold text-[#762F50]">Open space</span>
            </div>
        </Link>
    );
}

export default function Dashboard() {
    const { props } = usePage();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createModalType, setCreateModalType] = useState('private');
    const resources = props.resources || [];
    const pendingInvitations = props.pendingInvitations || [];
    const [dismissedInvites, setDismissedInvites] = useState([]);

    const groupedResources = {
        private: resources.filter(
            (resource) => resource.resource_type === 'private',
        ),
        public: resources.filter(
            (resource) => resource.resource_type === 'public',
        ),
    };

    const openCreateSpace = (type) => {
        setCreateModalType(type);
        setIsCreateModalOpen(true);
    };

    const handleAcceptInvite = (invite) => {
        router.post(
            typeof route === 'function'
                ? route('resources.invitations.accept', invite.id)
                : `/resources/${invite.id}/accept`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload();
                },
            },
        );
    };

    const handleDeclineInvite = (invite) => {
        router.post(
            typeof route === 'function'
                ? route('resources.invitations.decline', invite.id)
                : `/resources/${invite.id}/decline`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDismissedInvites((prev) => [...prev, invite.id]);
                },
            },
        );
    };

    const activeInvites = pendingInvitations.filter(
        (inv) => !dismissedInvites.includes(inv.id),
    );

    return (
        <AuthenticatedLayout>
            <Head title="Cadence - Dashboard" />

            <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-10 sm:py-10 lg:px-12">
                <header className="flex flex-col justify-between gap-6 border-b border-[#D8DDD5] pb-8 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#AD5266]">
                            Your workspace
                        </p>
                        <h1 className="mt-3 text-4xl font-medium leading-none tracking-[-0.06em] text-[#30302D] sm:text-5xl">
                            Keep your learning
                            <br />
                            in rhythm.
                        </h1>
                        <p className="mt-4 max-w-md text-sm leading-6 text-[#73736C]">
                            Choose a resource space to continue, or create a new
                            one for your next course.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => openCreateSpace('private')}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#762F50] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#5E243F]"
                        >
                            <LockKeyhole size={15} />
                            Private space
                            <Plus size={15} />
                        </button>
                        <button
                            type="button"
                            onClick={() => openCreateSpace('public')}
                            className="inline-flex items-center gap-2 rounded-lg border border-[#D8DDD5] bg-white px-4 py-3 text-xs font-bold text-[#762F50] transition hover:border-[#AD5266] hover:bg-[#FDF9FA]"
                        >
                            <Users size={15} />
                            Collaborative space
                            <Plus size={15} />
                        </button>
                    </div>
                </header>

                {resources.length === 0 ? (
                    <section className="mt-10 grid gap-5 lg:grid-cols-[1fr_0.72fr]">
                        <div className="rounded-2xl bg-[#762F50] p-8 text-white sm:p-10">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                                <FolderOpen size={21} />
                            </span>
                            <p className="mt-12 text-[10px] font-bold uppercase tracking-[0.18em] text-[#E8C7D3]">
                                A clear place to begin
                            </p>
                            <h2 className="mt-3 max-w-md text-3xl font-medium leading-tight tracking-[-0.04em] sm:text-4xl">
                                Your first resource space is waiting.
                            </h2>
                            <p className="mt-4 max-w-md text-sm leading-6 text-[#E8C7D3]">
                                Create a private space for your own materials or
                                invite classmates into a collaborative one.
                            </p>
                            <button
                                type="button"
                                onClick={() => openCreateSpace('private')}
                                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-xs font-bold text-[#762F50] transition hover:bg-[#F7F7F2]"
                            >
                                Create your first space
                                <ArrowUpRight size={15} />
                            </button>
                        </div>
                        <div className="rounded-2xl border border-[#D8DDD5] bg-[#D9DED6] p-8 sm:p-10">
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#AD5266]">
                                What you can keep here
                            </p>
                            <div className="mt-10 space-y-5">
                                {[
                                    'Videos and useful links',
                                    'Practice question documents',
                                    'Notes and revision packs',
                                ].map((label, index) => (
                                    <div
                                        key={label}
                                        className="flex items-center gap-4 border-b border-[#C5CBC1] pb-4"
                                    >
                                        <span className="text-xs font-bold text-[#AD5266]">
                                            0{index + 1}
                                        </span>
                                        <span className="text-sm font-semibold text-[#30302D]">
                                            {label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                ) : (
                    <section className="mt-10">
                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#AD5266]">
                                    Your spaces
                                </p>
                                <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-[#30302D]">
                                    Continue where you left off
                                </h2>
                            </div>
                            <span className="text-xs text-[#A5A59D]">
                                {resources.length}{' '}
                                {resources.length === 1 ? 'space' : 'spaces'}
                            </span>
                        </div>
                        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {resources.map((resource) => (
                                <ResourceCard
                                    key={resource.id}
                                    resource={resource}
                                />
                            ))}
                            <button
                                type="button"
                                onClick={() =>
                                    openCreateSpace(
                                        groupedResources.private.length <=
                                            groupedResources.public.length
                                            ? 'private'
                                            : 'public',
                                    )
                                }
                                className="flex min-h-[190px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#C5CBC1] p-6 text-center text-[#73736C] transition hover:border-[#AD5266] hover:bg-[#FDF9FA] hover:text-[#762F50]"
                            >
                                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-current">
                                    <Plus size={18} />
                                </span>
                                <span className="mt-4 text-sm font-bold">
                                    Create another space
                                </span>
                            </button>
                        </div>
                    </section>
                )}
            </div>

            {/* PENDING INVITATION NOTIFICATION TOAST (BOTTOM RIGHT) */}
            {activeInvites.length > 0 && (
                <div className="fixed bottom-6 right-6 z-50 flex w-full max-w-sm flex-col gap-3">
                    {activeInvites.map((invite) => (
                        <div
                            key={invite.id}
                            className="rounded-2xl border border-[#D8DDD5] bg-white p-5 shadow-[0_12px_30px_rgba(48,48,45,0.15)]"
                        >
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#AD5266]">
                                Workspace invitation
                            </p>
                            <h4 className="mt-1 text-sm font-bold text-[#30302D]">
                                &ldquo;{invite.course_name}&rdquo;
                            </h4>
                            <p className="mt-1 text-xs text-[#73736C]">
                                You have been invited to join this collaborative
                                space.
                            </p>
                            <div className="mt-4 flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleAcceptInvite(invite)}
                                    className="flex-1 rounded-xl bg-[#762F50] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#5E243F]"
                                >
                                    Accept
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDeclineInvite(invite)}
                                    className="flex-1 rounded-xl border border-[#D8DDD5] bg-white px-3 py-2 text-xs font-bold text-[#73736C] transition hover:bg-[#F7F7F2] hover:text-[#30302D]"
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Resource
                isOpen={isCreateModalOpen}
                defaultResourceType={createModalType}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </AuthenticatedLayout>
    );
}
