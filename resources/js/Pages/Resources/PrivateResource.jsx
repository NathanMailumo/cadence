import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
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
                        className="group relative flex flex-col justify-between rounded-2xl border border-[#D8DDD5] bg-[#FFFFFF] p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-[#AD5266]/30 hover:shadow-md"
                    >
                        <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            className="absolute right-3 top-3 z-10 rounded-full p-1 text-gray-400 opacity-0 transition-all hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                            title="Delete"
                        >
                            ✕
                        </button>
                        <div>
                            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#AD5266]">
                                <span className="flex items-center gap-1.5">
                                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#AD5266]/10 text-[9px] text-[#AD5266]">
                                        ▶
                                    </span>
                                    VIDEO
                                </span>
                                {metadata.author_name && (
                                    <span className="max-w-[130px] truncate font-normal text-[#73736C]">
                                        {metadata.author_name}
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
                                <p className="mt-1 line-clamp-2 text-xs text-[#73736C]">
                                    {item.description}
                                </p>
                            )}
                            {metadata.thumbnail_url && (
                                <div className="mt-3 overflow-hidden rounded-xl border border-[#F0F0E9]">
                                    <img
                                        src={metadata.thumbnail_url}
                                        alt=""
                                        className="h-28 w-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                        {item.url && (
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-4 flex items-center justify-between truncate rounded-xl bg-[#F7F7F2] px-3 py-1.5 text-[11px] font-semibold text-[#762F50] transition-colors hover:bg-[#F0F0E9]"
                            >
                                <span className="truncate">
                                    Watch on YouTube
                                </span>
                                <span>↗</span>
                            </a>
                        )}
                    </div>
                );
            }

            case 'link':
                return (
                    <div
                        key={item.id}
                        className="group relative flex flex-col justify-between rounded-2xl border border-[#D8DDD5] bg-[#FFFFFF] p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-[#AD5266]/30 hover:shadow-md"
                    >
                        <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            className="absolute right-3 top-3 z-10 rounded-full p-1 text-gray-400 opacity-0 transition-all hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                            title="Delete"
                        >
                            ✕
                        </button>
                        <div>
                            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#73736C]">
                                <span className="flex items-center gap-1.5">
                                    <span>🔗</span>
                                    LINK
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
                                <span>↗</span>
                            </a>
                        )}
                    </div>
                );

            case 'pq': {
                const fileUrl = metadata.file_url;
                const isPdf = metadata.mime_type === 'application/pdf';
                return (
                    <div
                        key={item.id}
                        className="group relative flex flex-col justify-between rounded-2xl border border-[#D8DDD5] bg-[#FFFFFF] p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-[#AD5266]/30 hover:shadow-md"
                    >
                        <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            className="absolute right-3 top-3 z-10 rounded-full p-1 text-gray-400 opacity-0 transition-all hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                            title="Delete"
                        >
                            ✕
                        </button>
                        <div>
                            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#73736C]">
                                <span>📄</span>
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
                        </div>
                        {fileUrl && (
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-4 flex items-center justify-between rounded-xl bg-[#F7F7F2] px-3 py-1.5 text-[11px] font-semibold text-[#762F50] transition-colors hover:bg-[#F0F0E9]"
                            >
                                <span>Open document</span>
                                <span>↗</span>
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
                            className="absolute right-3 top-3 z-10 rounded-full p-1 text-gray-400 opacity-0 transition-all hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                            title="Delete"
                        >
                            ✕
                        </button>
                        <div>
                            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#AD5266]">
                                <span className="flex items-center gap-1.5">
                                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#AD5266] text-[9px] text-white">
                                        ✦
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
                                →
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
                            className="absolute right-3 top-3 z-10 rounded-full p-1 text-gray-400 opacity-0 transition-all hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                            title="Delete"
                        >
                            ✕
                        </button>
                        <div>
                            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#8A7146]">
                                <span className="flex items-center gap-1.5">
                                    <span>📌</span>
                                    NOTE
                                </span>
                            </div>
                            <h3
                                className="mt-3 text-sm font-bold text-[#30302D]"
                                style={{ fontFamily: '"Manrope", sans-serif' }}
                            >
                                {item.title}
                            </h3>
                            {item.content && (
                                <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-[#4A3E2C]">
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
            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                {/* HEADER BAR (MATCHES FIGMA FRAME 14:1103) */}
                <div className="flex flex-col gap-4 border-b border-[#D8DDD5] pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="rounded-full bg-[#F0F0E9] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#73736C]">
                                Private space
                            </span>
                            {resource?.course_code && (
                                <span className="text-xs font-semibold text-[#73736C]">
                                    {resource.course_code}
                                </span>
                            )}
                        </div>
                        <h1
                            className="mt-2 text-2xl font-bold tracking-tight text-[#30302D] sm:text-3xl"
                            style={{ fontFamily: '"Manrope", sans-serif' }}
                        >
                            {spaceName}
                        </h1>
                        <p className="mt-1 text-xs text-[#73736C]">
                            Private · {items.length}{' '}
                            {items.length === 1 ? 'resource' : 'resources'}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => openAddModal('choose')}
                            className="rounded-full bg-[#AD5266] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#974356] active:scale-95"
                        >
                            + Add resource
                        </button>
                    </div>
                </div>

                {/* CONTENT AREA (MATCHES FIGMA CANVAS) */}
                <div className="mt-8">
                    {items.length === 0 ? (
                        <div className="rounded-3xl border border-[#D8DDD5] bg-[#FFFFFF] p-8 text-center sm:p-12">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0F0E9] text-xl text-[#AD5266]">
                                ✦
                            </div>
                            <h3
                                className="mt-4 text-lg font-bold text-[#30302D]"
                                style={{ fontFamily: '"Manrope", sans-serif' }}
                            >
                                This space is empty
                            </h3>
                            <p className="mx-auto mt-1 max-w-sm text-xs text-[#73736C]">
                                Add videos, web links, sticky notes, past
                                questions, or generate an AI revision pack.
                            </p>
                            <div className="mt-6">
                                <button
                                    type="button"
                                    onClick={() => openAddModal('choose')}
                                    className="rounded-full bg-[#AD5266] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#974356]"
                                >
                                    + Add what matters
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {items.map((item) => renderCard(item))}
                        </div>
                    )}
                </div>
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
