import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    FolderOpen,
    Plus,
    Trash2,
    Users,
    Pencil,
    X,
    ExternalLink,
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ResourceCanvas from '@/Components/ResourceCanvas';
import ResourceItemModal from '@/Components/ResourceItemModal';
import InviteModal from '@/Components/Invite';
import YouTubePickerModal from '@/Components/YoutubePickerModal';

export default function PublicResource({
    resource,
    items = [],
    canInvite = false,
    inviteLink = '',
}) {
    const { props } = usePage();
    const currentClerkId = props.auth?.user?.clerk_id
        ? String(props.auth.user.clerk_id).trim()
        : null;
    const ownerClerkId = resource?.clerk_id
        ? String(resource.clerk_id).trim()
        : null;

    const isWorkspaceOwner = Boolean(
        currentClerkId && ownerClerkId && currentClerkId === ownerClerkId,
    );

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [activeAddType, setActiveAddType] = useState('choose');
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isYtModalOpen, setIsYtModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // New states for viewing and editing items
    const [viewingItem, setViewingItem] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editUrl, setEditUrl] = useState('');
    // const [editDescription, setEditDescription] = useState('');
    const [isEditYtModalOpen, setIsEditYtModalOpen] = useState(false);
    const [editFile, setEditFile] = useState(null);

    const collaborators = resource?.collaborators || [];
    const hasCollaborators = collaborators.length > 0;

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage('');
        }, 4000);
    };

    const canModifyItem = (item) => {
        if (!currentClerkId) return false;
        if (isWorkspaceOwner) return true;
        const itemClerkId = item?.clerk_id
            ? String(item.clerk_id).trim()
            : null;
        return Boolean(itemClerkId && itemClerkId === currentClerkId);
    };

    const openAddModal = (type = 'choose') => {
        setActiveAddType(type);
        setIsAddModalOpen(true);
    };

    const handleDelete = (item, e) => {
        if (e) e.stopPropagation();
        if (!window.confirm(`Delete "${item.title}"?`)) {
            return;
        }

        router.delete(
            typeof route === 'function'
                ? route('resource-items.destroy', item.id)
                : `/resource-items/${item.id}`,
        );
    };
    const handleEditClick = (item, e) => {
        if (e) e.stopPropagation();

        setEditingItem(item);
        setEditTitle(item.title || '');
        setEditContent(item.content || '');
        setEditUrl(item.url || '');
        // setEditDescription(item.description || '');
        setEditFile(null);

        if (item.type === 'video') {
            setIsEditYtModalOpen(true);
        }
    };

    const handleUpdateItem = (e) => {
        e.preventDefault();
        if (!editingItem) return;

        const formData = new FormData();
        formData.append('title', editTitle);
        formData.append('content', editContent);
        formData.append('url', editUrl);
        // formData.append('description', editDescription);
        if (editFile) {
            formData.append('file', editFile);
        }
        formData.append('_method', 'PUT');

        router.post(
            typeof route === 'function'
                ? route('resource-items.update', editingItem.id)
                : `/resource-items/${editingItem.id}`,
            formData,
            {
                forceFormData: true,
                onSuccess: () => {
                    setEditingItem(null);
                    setEditFile(null);
                },
            },
        );
    };

    const handleSaveVideo = (video) => {
        router.post(
            typeof route === 'function'
                ? route('resource-items.store')
                : '/resource-items',
            {
                resource_id: resource.id,
                type: 'video',
                title: video.title,
                url: video.url,
                description: `Channel: ${video.uploader}`,
                metadata: {
                    thumbnail_url: video.thumbnail,
                    author_name: video.uploader,
                },
            },
            {
                onSuccess: () => setIsYtModalOpen(false),
            },
        );
    };

    const renderCard = (item) => {
        const metadata = item.metadata || {};
        const canModify = canModifyItem(item);

        switch (item.type) {
            case 'video': {
                return (
                    <div
                        key={item.id}
                        onClick={() => setViewingItem(item)}
                        className="group relative flex cursor-pointer flex-col justify-between rounded-2xl border border-[#D8DDD5] bg-[#FFFFFF] p-4 pr-20 shadow-sm transition-all hover:-translate-y-1 hover:border-[#AD5266]/30 hover:shadow-md"
                    >
                        <div className="absolute right-2.5 top-2.5 z-10 flex items-center gap-1">
                            {canModify && (
                                <button
                                    type="button"
                                    onClick={(e) => handleEditClick(item, e)}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#D8DDD5] bg-[#FFFFFF] text-[#73736C] transition-colors hover:bg-[#F7F7F2] hover:text-[#30302D]"
                                    title="Edit resource"
                                >
                                    <Pencil size={13} strokeWidth={1.8} />
                                </button>
                            )}
                            {canModify && (
                                <button
                                    type="button"
                                    onClick={(e) => handleDelete(item, e)}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#F0D9DF] bg-[#FFF7F8] text-[#AD5266] transition-colors hover:bg-[#FCE8ED] hover:text-[#762F50]"
                                    title="Delete resource"
                                >
                                    <Trash2 size={13} strokeWidth={1.8} />
                                </button>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#AD5266]">
                                <span className="flex items-center gap-1.5">
                                    <span>Video</span>
                                </span>
                                {metadata.author_name && (
                                    <span className="max-w-[100px] truncate font-normal text-[#73736C]">
                                        {metadata.author_name}
                                    </span>
                                )}
                            </div>
                            <h3
                                className="mt-1.5 truncate text-xs font-bold text-[#30302D]"
                                style={{ fontFamily: '"Manrope", sans-serif' }}
                            >
                                {item.title}
                            </h3>
                            {metadata.thumbnail_url && (
                                <div className="mt-2 overflow-hidden rounded-lg border border-[#F0F0E9]">
                                    <img
                                        src={metadata.thumbnail_url}
                                        alt=""
                                        className="h-16 w-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                        {item.url && (
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="mt-3 flex items-center justify-between truncate rounded-lg bg-[#F7F7F2] px-2.5 py-1 text-[10px] font-semibold text-[#762F50] transition-colors hover:bg-[#F0F0E9]"
                            >
                                <span className="truncate">
                                    Watch on YouTube
                                </span>
                            </a>
                        )}
                    </div>
                );
            }

            case 'link':
                return (
                    <div
                        key={item.id}
                        onClick={() => setViewingItem(item)}
                        className="group relative flex cursor-pointer flex-col justify-between rounded-2xl border border-[#D8DDD5] bg-[#FFFFFF] p-4 pr-20 shadow-sm transition-all hover:-translate-y-1 hover:border-[#AD5266]/30 hover:shadow-md"
                    >
                        <div className="absolute right-2.5 top-2.5 z-10 flex items-center gap-1">
                            {canModify && (
                                <button
                                    type="button"
                                    onClick={(e) => handleEditClick(item, e)}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#D8DDD5] bg-[#FFFFFF] text-[#73736C] transition-colors hover:bg-[#F7F7F2]"
                                    title="Edit resource"
                                >
                                    <Pencil size={13} strokeWidth={1.8} />
                                </button>
                            )}
                            {canModify && (
                                <button
                                    type="button"
                                    onClick={(e) => handleDelete(item, e)}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#F0D9DF] bg-[#FFF7F8] text-[#AD5266] transition-colors hover:bg-[#FCE8ED]"
                                    title="Delete resource"
                                >
                                    <Trash2 size={13} strokeWidth={1.8} />
                                </button>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#73736C]">
                                <span>Link</span>
                                {metadata.domain && (
                                    <span className="text-[10px] lowercase text-gray-400">
                                        {metadata.domain}
                                    </span>
                                )}
                            </div>
                            <h3
                                className="mt-1.5 truncate text-xs font-bold text-[#30302D]"
                                style={{ fontFamily: '"Manrope", sans-serif' }}
                            >
                                {item.title}
                            </h3>
                            {item.description && (
                                <p className="mt-1 line-clamp-2 text-xs text-[#73736C]">
                                    {item.description}
                                </p>
                            )}
                        </div>
                        {item.url && (
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="mt-3 flex items-center justify-between truncate rounded-lg bg-[#F7F7F2] px-2.5 py-1 text-[10px] font-semibold text-[#762F50] transition-colors hover:bg-[#F0F0E9]"
                            >
                                <span className="truncate">{item.url}</span>
                            </a>
                        )}
                    </div>
                );

            case 'pq': {
                const fileUrl = metadata.file_url;
                const isPdf = metadata.mime_type === 'application/pdf';
                const isImage = metadata.mime_type?.startsWith('image/');
                return (
                    <div
                        key={item.id}
                        onClick={() => setViewingItem(item)}
                        className="group relative flex cursor-pointer flex-col justify-between rounded-2xl border border-[#D8DDD5] bg-[#FFFFFF] p-4 pr-20 shadow-sm transition-all hover:-translate-y-1 hover:border-[#AD5266]/30 hover:shadow-md"
                    >
                        <div className="absolute right-2.5 top-2.5 z-10 flex items-center gap-1">
                            {canModify && (
                                <button
                                    type="button"
                                    onClick={(e) => handleEditClick(item, e)}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#D8DDD5] bg-[#FFFFFF] text-[#73736C] transition-colors hover:bg-[#F7F7F2]"
                                    title="Edit resource"
                                >
                                    <Pencil size={13} strokeWidth={1.8} />
                                </button>
                            )}
                            {canModify && (
                                <button
                                    type="button"
                                    onClick={(e) => handleDelete(item, e)}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#F0D9DF] bg-[#FFF7F8] text-[#AD5266] transition-colors hover:bg-[#FCE8ED]"
                                    title="Delete resource"
                                >
                                    <Trash2 size={13} strokeWidth={1.8} />
                                </button>
                            )}
                        </div>
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-[#73736C]">
                                <span>PDF / Questions</span>
                            </div>
                            <h3
                                className="mt-1.5 truncate text-xs font-bold text-[#30302D]"
                                style={{ fontFamily: '"Manrope", sans-serif' }}
                            >
                                {item.title}
                            </h3>
                            {fileUrl && isImage && (
                                <div className="mt-2 overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">
                                    <img
                                        src={fileUrl}
                                        alt={item.title}
                                        className="h-16 w-full object-contain"
                                    />
                                </div>
                            )}
                        </div>
                        {fileUrl && (
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="mt-3 flex items-center justify-between rounded-lg bg-[#F7F7F2] px-2.5 py-1 text-[10px] font-semibold text-[#762F50] transition-colors hover:bg-[#F0F0E9]"
                            >
                                <span>Open document</span>
                            </a>
                        )}
                    </div>
                );
            }

            case 'revision':
                return (
                    <Link
                        key={item.id}
                        href={
                            item.study_session_id
                                ? typeof route === 'function'
                                    ? route(
                                          'sessions.show',
                                          item.study_session_id,
                                      )
                                    : `/session/${item.study_session_id}`
                                : '#'
                        }
                        className="group relative flex flex-col justify-between rounded-2xl border-2 border-[#AD5266]/30 bg-[#FDF8FA] p-4 pr-14 shadow-sm transition-all hover:-translate-y-1 hover:border-[#AD5266] hover:shadow-md"
                    >
                        {canModify && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDelete(item, e);
                                }}
                                className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-lg border border-[#F0D9DF] bg-[#FFF7F8] text-[#AD5266] transition-colors hover:bg-[#FCE8ED]"
                                title="Delete resource"
                            >
                                <Trash2 size={13} strokeWidth={1.8} />
                            </button>
                        )}
                        <div>
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#AD5266]">
                                <span className="flex items-center gap-1.5">
                                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#AD5266] text-[8px] text-white">
                                        AI
                                    </span>
                                    Revision Pack
                                </span>
                            </div>
                            <h3
                                className="mt-1.5 truncate text-xs font-bold text-[#30302D] group-hover:text-[#AD5266]"
                                style={{ fontFamily: '"Manrope", sans-serif' }}
                            >
                                {item.title}
                            </h3>
                            <p className="mt-1 line-clamp-2 text-[11px] text-[#73736C]">
                                {item.description || 'Generated study session.'}
                            </p>
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-[#AD5266]/15 pt-2 text-[10px] font-bold text-[#AD5266]">
                            <span>Open revision pack</span>
                        </div>
                    </Link>
                );

            case 'note':
            default:
                return (
                    <div
                        key={item.id}
                        onClick={() => setViewingItem(item)}
                        className="group relative flex cursor-pointer flex-col justify-between rounded-2xl border border-[#D8DDD5] bg-[#FAF8F2] p-4 pr-20 shadow-sm transition-all hover:-translate-y-1 hover:border-[#C5C9BE] hover:shadow-md"
                    >
                        <div className="absolute right-2.5 top-2.5 z-10 flex items-center gap-1">
                            {canModify && (
                                <button
                                    type="button"
                                    onClick={(e) => handleEditClick(item, e)}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#D8DDD5] bg-[#FFFFFF] text-[#73736C] transition-colors hover:bg-[#F7F7F2]"
                                    title="Edit resource"
                                >
                                    <Pencil size={13} strokeWidth={1.8} />
                                </button>
                            )}
                            {canModify && (
                                <button
                                    type="button"
                                    onClick={(e) => handleDelete(item, e)}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#F0D9DF] bg-[#FFF7F8] text-[#AD5266] transition-colors hover:bg-[#FCE8ED]"
                                    title="Delete resource"
                                >
                                    <Trash2 size={13} strokeWidth={1.8} />
                                </button>
                            )}
                        </div>
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A7146]">
                                <span>Note</span>
                            </div>
                            <h3
                                className="mt-1.5 truncate text-xs font-bold text-[#30302D]"
                                style={{ fontFamily: '"Manrope", sans-serif' }}
                            >
                                {item.title}
                            </h3>
                            {item.content && (
                                <p className="mt-1.5 line-clamp-3 whitespace-pre-line text-xs leading-relaxed text-[#4A3E2C]">
                                    {item.content}
                                </p>
                            )}
                        </div>
                    </div>
                );
        }
    };

    const spaceName = resource?.course_name || 'Collaborative Space';

    return (
        <AuthenticatedLayout>
            <Head>
                <title>Cadence - Public Resource</title>
                <link
                    rel="icon"
                    type="image/svg+xml"
                    href="/images/cadence_logo.svg"
                />
            </Head>
            <div className="flex min-h-full min-w-0 flex-1 flex-col bg-[#F0F0E9]">
                <header className="flex w-full flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-white px-4 py-3 sm:px-8 sm:py-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1E5EA] text-[#762F50]">
                            <FolderOpen size={19} strokeWidth={1.8} />
                        </span>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#AD5266]">
                                Collaborative space
                            </p>
                            <h1 className="truncate text-base font-medium tracking-[-0.03em] text-[#30302D] sm:text-xl">
                                {spaceName}
                            </h1>
                            <p className="text-xs text-[#73736C]">
                                {items.length}{' '}
                                {items.length === 1 ? 'resource' : 'resources'}
                            </p>
                        </div>
                    </div>
                    <div className="flex w-full shrink-0 items-center justify-end gap-2 sm:w-auto sm:gap-4">
                        {canInvite &&
                            (hasCollaborators ? (
                                <Link
                                    href={
                                        typeof route === 'function'
                                            ? route(
                                                  'resources.members',
                                                  resource.id,
                                              )
                                            : `/resources/${resource.id}/invited`
                                    }
                                    className="inline-flex items-center gap-2 rounded-lg border border-[#D8DDD5] bg-white px-3 py-2.5 text-[11px] font-bold text-[#30302D] hover:bg-[#F7F7F2] sm:px-4 sm:py-3 sm:text-xs"
                                >
                                    <Users size={15} /> Manage users
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsInviteModalOpen(true)}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8DDD5] bg-white px-3 py-2.5 text-[11px] font-bold text-[#30302D] hover:bg-[#F7F7F2] sm:px-4 sm:py-3 sm:text-xs"
                                >
                                    <Plus size={15} /> Invite
                                </button>
                            ))}
                        <button
                            type="button"
                            onClick={() => openAddModal('choose')}
                            className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#762F50] px-3 py-2.5 text-[11px] font-bold text-white transition hover:bg-[#5E243F] sm:flex-none sm:gap-2 sm:px-4 sm:py-3 sm:text-xs"
                        >
                            <Plus size={15} /> Add resource
                        </button>
                    </div>
                </header>
                <main className="relative min-h-0 flex-1 overflow-y-auto bg-[#F9F8F6] p-3 pb-20 [background-image:radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] sm:p-8 sm:pb-8">
                    <div className="h-full">
                        <ResourceCanvas
                            items={items}
                            renderCard={renderCard}
                            emptyState={
                                <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                                    <FolderOpen
                                        className="text-[#AD5266]"
                                        size={32}
                                        strokeWidth={1.6}
                                    />
                                    <h2 className="mt-4 text-lg font-bold text-[#30302D]">
                                        No resources added yet
                                    </h2>
                                    <p className="mt-2 text-sm text-[#73736C]">
                                        Click &quot;Add resource&quot; to get
                                        started.
                                    </p>
                                </div>
                            }
                        />
                    </div>
                </main>
            </div>

            {/* FULL-SCREEN VIEW MODAL */}
            {viewingItem && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
                    onClick={() => setViewingItem(null)}
                >
                    <div
                        className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between border-b pb-4">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#AD5266]">
                                    {viewingItem.type}
                                </span>
                                <h2 className="mt-1 text-lg font-bold text-[#30302D]">
                                    {viewingItem.title}
                                </h2>
                            </div>
                            <button
                                onClick={() => setViewingItem(null)}
                                className="flex h-8 w-8 items-center justify-center rounded-full border bg-gray-50 text-gray-500 hover:bg-gray-100"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="mt-5 space-y-4">
                            {viewingItem.description && (
                                <p className="text-xs text-[#73736C]">
                                    {viewingItem.description}
                                </p>
                            )}
                            {viewingItem.content && (
                                <div className="whitespace-pre-line rounded-xl bg-[#FAF8F2] p-4 text-sm leading-relaxed text-[#30302D]">
                                    {viewingItem.content}
                                </div>
                            )}
                            {viewingItem.metadata?.thumbnail_url &&
                                viewingItem.type === 'video' && (
                                    <div className="overflow-hidden rounded-xl border">
                                        <img
                                            src={
                                                viewingItem.metadata
                                                    .thumbnail_url
                                            }
                                            alt=""
                                            className="w-full object-cover"
                                        />
                                    </div>
                                )}
                            {viewingItem.metadata?.file_url && (
                                <div className="overflow-hidden rounded-xl border">
                                    {viewingItem.metadata.mime_type ===
                                    'application/pdf' ? (
                                        <iframe
                                            src={viewingItem.metadata.file_url}
                                            className="h-96 w-full"
                                            title={viewingItem.title}
                                        />
                                    ) : (
                                        <img
                                            src={viewingItem.metadata.file_url}
                                            alt=""
                                            className="w-full object-contain"
                                        />
                                    )}
                                </div>
                            )}
                            {viewingItem.url && (
                                <a
                                    href={viewingItem.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#762F50] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#5E243F]"
                                >
                                    Open Link / Video <ExternalLink size={14} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT ITEM MODAL */}
            {editingItem && editingItem.type !== 'video' && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
                    onClick={() => setEditingItem(null)}
                >
                    <div
                        className="w-full max-w-lg rounded-3xl border border-[#D8DDD5] bg-[#FFFFFF] p-6 shadow-2xl transition-all sm:p-7"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between border-b border-[#F0F0E9] pb-4">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#AD5266]">
                                    {editingItem.type === 'pq'
                                        ? 'Update Document'
                                        : 'Edit Resource'}
                                </span>
                                <h2
                                    className="mt-1 text-xl font-bold text-[#30302D]"
                                    style={{
                                        fontFamily: '"Manrope", sans-serif',
                                    }}
                                >
                                    Edit{' '}
                                    {editingItem.type === 'pq'
                                        ? 'Past Question'
                                        : editingItem.type}
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditingItem(null)}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D8DDD5] bg-[#FFFFFF] text-xs text-[#73736C] hover:bg-[#F7F7F2]"
                            >
                                <X size={15} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleUpdateItem}
                            className="mt-5 space-y-4"
                        >
                            <div>
                                <label className="block text-xs font-semibold uppercase text-[#30302D]">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) =>
                                        setEditTitle(e.target.value)
                                    }
                                    className="mt-1.5 w-full rounded-xl border border-[#D8DDD5] bg-[#F7F7F2] p-3 text-sm text-[#30302D] placeholder:text-[#8E9088] focus:border-[#AD5266] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#AD5266]"
                                    required
                                />
                            </div>

                            {editingItem.type === 'note' && (
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-[#30302D]">
                                        Content
                                    </label>
                                    <textarea
                                        value={editContent}
                                        onChange={(e) =>
                                            setEditContent(e.target.value)
                                        }
                                        rows={4}
                                        className="mt-1.5 w-full rounded-xl border border-[#D8DDD5] bg-[#F7F7F2] p-3 text-sm text-[#30302D] placeholder:text-[#8E9088] focus:border-[#AD5266] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#AD5266]"
                                    />
                                </div>
                            )}

                            {editingItem.type === 'link' && (
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-[#30302D]">
                                        URL
                                    </label>
                                    <input
                                        type="url"
                                        value={editUrl}
                                        onChange={(e) =>
                                            setEditUrl(e.target.value)
                                        }
                                        className="mt-1.5 w-full rounded-xl border border-[#D8DDD5] bg-[#F7F7F2] p-3 text-sm text-[#30302D] placeholder:text-[#8E9088] focus:border-[#AD5266] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#AD5266]"
                                        required
                                    />
                                </div>
                            )}

                            {editingItem.type === 'pq' && (
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-[#30302D]">
                                        Replace Document (Optional)
                                    </label>
                                    <label className="mt-1.5 block cursor-pointer rounded-2xl border-2 border-dashed border-[#D8DDD5] bg-[#F7F7F2] p-5 text-center text-xs text-[#73736C] transition-colors hover:border-[#AD5266]">
                                        <span className="font-semibold text-[#30302D]">
                                            {editFile
                                                ? editFile.name
                                                : 'Choose a new file to replace current one'}
                                        </span>
                                        <span className="mt-1 block text-[10px]">
                                            PDF, PNG, JPG, WEBP · Max 2MB
                                        </span>
                                        <input
                                            type="file"
                                            accept=".pdf,.png,.jpg,.jpeg,.webp"
                                            onChange={(e) =>
                                                setEditFile(
                                                    e.target.files?.[0] || null,
                                                )
                                            }
                                            className="sr-only"
                                        />
                                    </label>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3 border-t border-[#F0F0E9] pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingItem(null)}
                                    className="rounded-full px-4 py-2 text-xs font-semibold text-[#73736C] hover:text-[#30302D]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-full bg-[#AD5266] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#974356]"
                                >
                                    Save changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* SUCCESS TOAST NOTIFICATION */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 animate-bounce rounded-xl bg-[#762F50] px-4 py-3 text-xs font-bold text-white shadow-xl">
                    {toastMessage}
                </div>
            )}

            {/* RESOURCE ADD MODAL */}
            <ResourceItemModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                resource={resource}
                defaultType={activeAddType}
                onOpenYoutube={() => setIsYtModalOpen(true)}
            />

            {/* YOUTUBE PICKER MODAL */}
            {/* YOUTUBE EDIT MODAL */}
            <YouTubePickerModal
                isOpen={isEditYtModalOpen}
                editItem={editingItem}
                onClose={() => {
                    setIsEditYtModalOpen(false);
                    setEditingItem(null);
                }}
                onSelectVideo={(video, itemToEdit) => {
                    if (itemToEdit) {
                        router.put(
                            typeof route === 'function'
                                ? route('resource-items.update', itemToEdit.id)
                                : `/resource-items/${itemToEdit.id}`,
                            {
                                title: video.title,
                                url: video.url,
                            },
                            {
                                onSuccess: () => {
                                    setIsEditYtModalOpen(false);
                                    setEditingItem(null);
                                },
                            },
                        );
                    }
                }}
            />

            {/* INVITE MODAL */}
            <InviteModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                resourceId={resource.id}
                spaceName={spaceName}
                inviteLink={inviteLink}
                onSuccess={() => showToast('Invitation sent successfully!')}
            />
        </AuthenticatedLayout>
    );
}
