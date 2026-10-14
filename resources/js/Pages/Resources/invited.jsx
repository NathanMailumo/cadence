import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Trash2, UserPlus } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InviteModal from '@/Components/Invite';

export default function Invited({
    resource,
    collaborators = [],
    canInvite = false,
}) {
    const { props } = usePage();
    const currentClerkId = props.auth?.user?.clerk_id
        ? String(props.auth.user.clerk_id).trim()
        : null;

    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage('');
        }, 4000);
    };

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
                {/* BACK LINK */}
                <div>
                    <Link
                        href={
                            typeof route === 'function'
                                ? route('resources.show', resource.id)
                                : `/resources/public/${resource.id}`
                        }
                        className="inline-flex items-center gap-2 text-xs font-semibold text-[#762F50] transition-colors hover:text-[#5E243F]"
                    >
                        <ArrowLeft size={14} />
                        Back to space
                    </Link>
                </div>

                {/* SUBTITLE AND MAIN TITLE */}
                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#AD5266]">
                            COLLABORATIVE SPACE
                        </p>
                        <h1
                            className="mt-2 text-4xl font-extrabold tracking-tight text-[#30302D] sm:text-5xl"
                            style={{ fontFamily: '"Manrope", sans-serif' }}
                        >
                            Manage collaborators
                        </h1>
                        <p className="mt-2 text-xs text-[#73736C]">
                            {spaceName} · Manage who can access this resource
                            space.
                        </p>
                    </div>

                    {canInvite && (
                        <div>
                            <button
                                type="button"
                                onClick={() => setIsInviteOpen(true)}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#762F50] px-5 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#5E243F] active:scale-95"
                            >
                                <UserPlus size={16} />
                                Add users
                            </button>
                        </div>
                    )}
                </div>

                {/* COLLABORATORS LIST CARD */}
                <div className="mt-10 overflow-hidden rounded-3xl border border-[#D8DDD5] bg-white shadow-sm">
                    {/* CARD HEADER */}
                    <div className="flex items-center justify-between border-b border-[#F0F0E9] px-6 py-5 sm:px-8">
                        <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#AD5266]">
                                PEOPLE WITH ACCESS
                            </p>
                            <h2
                                className="mt-1 text-2xl font-bold text-[#30302D]"
                                style={{ fontFamily: '"Manrope", sans-serif' }}
                            >
                                Collaborators
                            </h2>
                        </div>
                        <span className="rounded-full border border-[#D8DDD5] bg-[#F7F7F2] px-3 py-1 text-xs font-semibold text-[#73736C]">
                            {collaborators.length}{' '}
                            {collaborators.length === 1 ? 'person' : 'people'}
                        </span>
                    </div>

                    {/* CARD BODY */}
                    {collaborators.length === 0 ? (
                        <div className="py-16 text-center">
                            <p className="text-xs text-[#73736C]">
                                No collaborators invited yet. Click "Add users"
                                above to invite classmates.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#F0F0E9]">
                            {collaborators.map((user) => {
                                const initials = user.name
                                    ? user.name
                                          .split(' ')
                                          .map((n) => n[0])
                                          .join('')
                                          .substring(0, 2)
                                          .toUpperCase()
                                    : 'U';

                                const isYou =
                                    String(user.clerk_id).trim() ===
                                    currentClerkId;
                                const isOwner =
                                    user.pivot?.role === 'owner' ||
                                    user.clerk_id === resource.clerk_id;
                                const roleLabel = isOwner
                                    ? 'Owner'
                                    : user.pivot?.role === 'viewer'
                                      ? 'Viewer'
                                      : 'Editor';

                                return (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-[#FDF9FA] sm:px-8"
                                    >
                                        <div className="flex min-w-0 items-center gap-4">
                                            {/* AVATAR WITH INITIALS */}
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8DCE1] text-xs font-bold text-[#762F50]">
                                                {initials}
                                            </div>

                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="truncate text-sm font-bold text-[#30302D]">
                                                        {user.name ||
                                                            'Anonymous User'}
                                                    </p>
                                                    {isYou && (
                                                        <span className="rounded-full bg-[#E8DCE1] px-2 py-0.5 text-[9px] font-extrabold uppercase text-[#762F50]">
                                                            YOU
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="truncate text-xs text-[#73736C]">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {/* ROLE BADGE */}
                                            <span className="rounded-full bg-[#F0F0E9] px-3 py-1 text-xs font-medium text-[#73736C]">
                                                {roleLabel}
                                            </span>

                                            {/* DELETE TRASH BUTTON */}
                                            {canInvite && !isOwner && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveUser(
                                                            user.id,
                                                        )
                                                    }
                                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D8DDD5] bg-white text-[#73736C] transition-colors hover:border-[#AD5266] hover:bg-[#FFF7F8] hover:text-[#AD5266]"
                                                    title="Remove collaborator"
                                                >
                                                    <Trash2 size={15} />
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

            {/* SUCCESS TOAST NOTIFICATION (BOTTOM-RIGHT) */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 animate-bounce rounded-xl bg-[#762F50] px-4 py-3 text-xs font-bold text-white shadow-xl">
                    {toastMessage}
                </div>
            )}

            {/* INVITE MODAL */}
            <InviteModal
                isOpen={isInviteOpen}
                onClose={() => setIsInviteOpen(false)}
                resourceId={resource.id}
                spaceName={spaceName}
                onSuccess={() => showToast('Invitation sent successfully!')}
            />
        </AuthenticatedLayout>
    );
}
