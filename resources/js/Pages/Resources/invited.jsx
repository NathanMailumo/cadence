import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InviteModal from '@/Components/Invite';

export default function Invited({
    resource,
    collaborators = [],
    canInvite = false,
}) {
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    const handleRemoveUser = (userId) => {
        if (
            confirm(
                'Are you sure you want to remove this collaborator from the workspace?',
            )
        ) {
            router.delete(
                typeof route === 'function'
                    ? route('resources.collaborators.destroy', [
                          resource.id,
                          userId,
                      ])
                    : `/resources/${resource.id}/collaborators/${userId}`,
            );
        }
    };

    const spaceName = resource?.course_name || 'Resource space';

    return (
        <AuthenticatedLayout>
            <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                {/* HEADER (MATCHES FIGMA FRAME 14:1966) */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#D8DDD5] pb-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <Link
                                href={
                                    typeof route === 'function'
                                        ? route('resources.show', resource.id)
                                        : `/resources/${resource.id}`
                                }
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#73736C] hover:text-[#30302D] transition-colors"
                            >
                                <span>← Back to space</span>
                            </Link>
                            <span className="text-gray-300">/</span>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#AD5266]">
                                Collaborative space
                            </span>
                        </div>
                        <h1
                            className="mt-2 text-2xl font-bold tracking-tight text-[#30302D] sm:text-3xl"
                            style={{ fontFamily: '"Manrope", sans-serif' }}
                        >
                            Manage collaborators
                        </h1>
                        <p className="mt-1 text-xs text-[#73736C]">
                            {spaceName} · Manage who can access this resource space.
                        </p>
                    </div>

                    {canInvite && (
                        <div>
                            <button
                                type="button"
                                onClick={() => setIsInviteOpen(true)}
                                className="rounded-full bg-[#AD5266] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#974356] active:scale-95"
                            >
                                + Add users
                            </button>
                        </div>
                    )}
                </div>

                {/* COLLABORATORS LIST (FIGMA FRAME 14:1966) */}
                <div className="mt-8 rounded-3xl border border-[#D8DDD5] bg-[#FFFFFF] p-6 shadow-sm sm:p-8">
                    <div className="flex items-center justify-between border-b border-[#F0F0E9] pb-4">
                        <div>
                            <h2
                                className="text-base font-bold text-[#30302D]"
                                style={{ fontFamily: '"Manrope", sans-serif' }}
                            >
                                People with access
                            </h2>
                            <p className="text-xs text-[#73736C]">
                                Collaborators · {collaborators.length} {collaborators.length === 1 ? 'person' : 'people'}
                            </p>
                        </div>
                    </div>

                    {collaborators.length === 0 ? (
                        <div className="py-12 text-center">
                            <p className="text-xs text-[#73736C]">
                                No collaborators invited yet. Use the "Add users" button above to invite classmates.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#F0F0E9]">
                            {collaborators.map((user) => {
                                const isPending = user.pivot?.status === 'pending';
                                const initials = user.name
                                    ? user.name
                                          .split(' ')
                                          .map((n) => n[0])
                                          .join('')
                                          .substring(0, 2)
                                          .toUpperCase()
                                    : 'U';

                                return (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between py-4 text-xs transition-colors hover:bg-[#FDFBF7] px-2 rounded-xl"
                                    >
                                        <div className="flex items-center gap-3.5 min-w-0">
                                            {/* Avatar with initials */}
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F0F0E9] text-xs font-bold text-[#762F50]">
                                                {initials}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="truncate font-bold text-[#30302D]">
                                                        {user.name || 'Anonymous User'}
                                                    </p>
                                                    {user.pivot?.role === 'owner' && (
                                                        <span className="rounded-full bg-[#AD5266]/10 px-2 py-0.5 text-[10px] font-bold text-[#762F50]">
                                                            Owner
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="truncate text-[11px] text-[#73736C]">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {isPending ? (
                                                <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-[10px] font-bold text-amber-800">
                                                    Pending invite
                                                </span>
                                            ) : (
                                                <span className="rounded-full bg-[#F0F0E9] px-2.5 py-1 text-[10px] font-semibold text-[#73736C]">
                                                    {user.pivot?.role === 'owner' ? 'Owner' : 'Editor'}
                                                </span>
                                            )}

                                            {canInvite && user.pivot?.role !== 'owner' && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveUser(user.id)}
                                                    className="rounded-full p-1.5 text-gray-400 hover:text-rose-600 transition-colors"
                                                    title="Remove from workspace"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* INVITE MODAL */}
            <InviteModal
                isOpen={isInviteOpen}
                onClose={() => setIsInviteOpen(false)}
                resourceId={resource.id}
                spaceName={spaceName}
            />
        </AuthenticatedLayout>
    );
}
