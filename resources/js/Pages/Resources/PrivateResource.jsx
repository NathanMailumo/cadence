import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { FolderOpen, Plus, Trash2 } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ResourceCanvas from '@/Components/ResourceCanvas';
import ResourceItemModal from '@/Components/ResourceItemModal';
import YouTubePickerModal from '@/Components/YoutubePickerModal';

export default function PrivateResource({ resource, items = [] }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [activeAddType, setActiveAddType] = useState('choose');
    const [isYtModalOpen, setIsYtModalOpen] = useState(false);
    // const [selectedPracticeImage, setSelectedPracticeImage] = useState(null);

    const openAddModal = (type = 'choose') => {
        setActiveAddType(type);
        setIsAddModalOpen(true);
    };

    const handleDelete = (item) => {
        if (!window.confirm(`Delete "${item.title}"?`)) {
            return;
        }

        router.delete(
            typeof route === 'function'
                ? route('resource-items.destroy', item.id)
                : `/resource-items/${item.id}`,
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

        switch (item.type) {
            case 'video': {
                return (
                    <div
                        key={item.id}
                        className="group relative flex flex-col justify-between rounded-2xl border border-[#D8DDD5] bg-[#FFFFFF] p-4 pr-14 shadow-sm transition-all hover:-translate-y-1 hover:border-[#AD5266]/30 hover:shadow-md"
                    >
                        {/* Note: Include canDeleteItem(item) check if in PublicResource */}
                        <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-lg border border-[#F0D9DF] bg-[#FFF7F8] text-[#AD5266] transition-colors hover:bg-[#FCE8ED] hover:text-[#762F50]"
                            title="Delete resource"
                            aria-label={`Delete ${item.title}`}
                        >
                            <Trash2 size={14} strokeWidth={1.8} />
                        </button>
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
                        className="group relative flex flex-col justify-between rounded-2xl border border-[#D8DDD5] bg-[#FFFFFF] p-5 pr-16 shadow-sm transition-all hover:-translate-y-1 hover:border-[#AD5266]/30 hover:shadow-md"
                    >
                        <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-[#F0D9DF] bg-[#FFF7F8] text-[#AD5266] transition-colors hover:bg-[#FCE8ED] hover:text-[#762F50]"
                            title="Delete resource"
                            aria-label={`Delete ${item.title}`}
                        >
                            <Trash2 size={15} strokeWidth={1.8} />
                        </button>
                        <div>
                            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#73736C]">
                                <span className="flex items-center gap-1.5">
                                    <span>Link</span>
                                </span>
                                {metadata.domain && (
                                    <span className="text-[10px] lowercase text-gray-400">
                                        {metadata.domain}
                                    </span>
                                )}
                            </div>
                            <h3
                                className="mt-3 text-sm font-bold leading-snug text-[#30302D]"
                                style={{ fontFamily: '"Manrope", sans-serif' }}
                            >
                                {item.title}
                            </h3>
                            {item.description && (
                                <p className="mt-1 line-clamp-3 text-xs text-[#73736C]">
                                    {item.description}
                                </p>
                            )}
                        </div>
                        {item.url && (
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-4 flex items-center justify-between truncate rounded-xl bg-[#F7F7F2] px-3 py-1.5 text-[11px] font-semibold text-[#762F50] transition-colors hover:bg-[#F0F0E9]"
                            >
                                <span className="truncate">{item.url}</span>
                                {/* <span>↗</span> */}
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
                        className="group relative flex flex-col justify-between rounded-2xl border border-[#D8DDD5] bg-[#FFFFFF] p-5 pr-16 shadow-sm transition-all hover:-translate-y-1 hover:border-[#AD5266]/30 hover:shadow-md"
                    >
                        <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-[#F0D9DF] bg-[#FFF7F8] text-[#AD5266] transition-colors hover:bg-[#FCE8ED] hover:text-[#762F50]"
                            title="Delete resource"
                            aria-label={`Delete ${item.title}`}
                        >
                            <Trash2 size={15} strokeWidth={1.8} />
                        </button>
                        <div>
                            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#73736C]">
                                {/* <span>Document</span> */}
                                <span>PDF / QUESTIONS</span>
                            </div>
                            <h3
                                className="mt-3 text-sm font-bold text-[#30302D]"
                                style={{ fontFamily: '"Manrope", sans-serif' }}
                            >
                                {item.title}
                            </h3>
                            {item.description && (
                                <p className="mt-1 line-clamp-2 text-xs text-[#73736C]">
                                    {item.description}
                                </p>
                            )}
                            {fileUrl && isPdf && (
                                <iframe
                                    src={fileUrl}
                                    title={item.title}
                                    className="mt-3 h-32 w-full rounded-xl border border-[#E5E7EB] bg-white"
                                />
                            )}
                            {fileUrl && isImage && (
                                <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-3 block overflow-hidden rounded-xl border border-[#E5E7EB] bg-white"
                                >
                                    <img
                                        src={fileUrl}
                                        alt={item.title}
                                        className="h-24 w-full object-contain"
                                    />
                                </a>
                            )}
                        </div>
                        {fileUrl && (
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-4 flex items-center justify-between rounded-xl bg-[#F7F7F2] px-3 py-1.5 text-[11px] font-semibold text-[#762F50] transition-colors hover:bg-[#F0F0E9]"
                            >
                                <span>Open document</span>
                                {/* <span>↗</span> */}
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
                        className="group relative flex flex-col justify-between rounded-2xl border-2 border-[#AD5266]/30 bg-[#FDF8FA] p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-[#AD5266] hover:shadow-md"
                    >
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDelete(item);
                            }}
                            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-[#F0D9DF] bg-[#FFF7F8] text-[#AD5266] transition-colors hover:bg-[#FCE8ED] hover:text-[#762F50]"
                            title="Delete resource"
                            aria-label={`Delete ${item.title}`}
                        >
                            <Trash2 size={15} strokeWidth={1.8} />
                        </button>
                        <div>
                            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#AD5266]">
                                <span className="flex items-center gap-1.5">
                                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#AD5266] text-[9px] text-white">
                                        AI
                                    </span>
                                    REVISION PACK
                                </span>
                                <span className="rounded-full bg-[#AD5266]/10 px-2 py-0.5 text-[10px] font-bold text-[#762F50]">
                                    AI
                                </span>
                            </div>
                            <h3
                                className="mt-3 text-sm font-bold text-[#30302D] transition-colors group-hover:text-[#AD5266]"
                                style={{ fontFamily: '"Manrope", sans-serif' }}
                            >
                                {item.title}
                            </h3>
                            <p className="mt-1 text-xs text-[#73736C]">
                                {item.description ||
                                    'Generated study session with summary & flashcards.'}
                            </p>
                        </div>
                        <div className="mt-5 flex items-center justify-between border-t border-[#AD5266]/15 pt-3 text-[11px] font-bold text-[#AD5266]">
                            <span>Open revision pack</span>
                            <span className="transition-transform group-hover:translate-x-1">
                                {/* → */}
                            </span>
                        </div>
                    </Link>
                );

            case 'note':
            default:
                return (
                    <div
                        key={item.id}
                        className="group relative flex flex-col justify-between rounded-2xl border border-[#D8DDD5] bg-[#FAF8F2] p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-[#C5C9BE] hover:shadow-md"
                    >
                        <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-[#F0D9DF] bg-[#FFF7F8] text-[#AD5266] transition-colors hover:bg-[#FCE8ED] hover:text-[#762F50]"
                            title="Delete resource"
                            aria-label={`Delete ${item.title}`}
                        >
                            <Trash2 size={15} strokeWidth={1.8} />
                        </button>
                        <div>
                            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#8A7146]">
                                <span className="flex items-center gap-1.5">
                                    <span>Note</span>
                                    {/* NOTE */}
                                </span>
                            </div>
                            <h3
                                className="mt-3 text-sm font-bold text-[#30302D]"
                                style={{ fontFamily: '"Manrope", sans-serif' }}
                            >
                                {item.title}
                            </h3>
                            {item.content && (
                                <p className="mt-2 line-clamp-3 whitespace-pre-line text-xs leading-relaxed text-[#4A3E2C]">
                                    {item.content}
                                </p>
                            )}
                        </div>
                    </div>
                );
        }
    };

    const spaceName = resource?.course_name || 'Private Space';

    return (
        <AuthenticatedLayout>
            <Head>
                <title>Cadence - Private Resource</title>
                <link
                    rel="icon"
                    type="image/svg+xml"
                    href="/images/cadence_logo.svg"
                />
                {/* Or use href="/logo.png" if your file is a PNG */}
            </Head>
            <div className="flex min-h-full min-w-0 flex-1 flex-col bg-[#F0F0E9]">
                <header className="flex w-full flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-white px-4 py-3 sm:px-8 sm:py-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1E5EA] text-[#762F50]">
                            <FolderOpen size={19} strokeWidth={1.8} />
                        </span>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#AD5266]">
                                Private space
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

            {/* RESOURCE ADD MODAL */}
            <ResourceItemModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                resource={resource}
                defaultType={activeAddType}
                onOpenYoutube={() => setIsYtModalOpen(true)}
            />

            {/* YOUTUBE PICKER MODAL */}
            <YouTubePickerModal
                isOpen={isYtModalOpen}
                onClose={() => setIsYtModalOpen(false)}
                onSelectVideo={handleSaveVideo}
            />
        </AuthenticatedLayout>
    );
}
