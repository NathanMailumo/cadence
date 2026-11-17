import React from 'react';
import { X, ExternalLink, Play } from 'lucide-react';

function getYouTubeId(url) {
    if (!url) return null;
    try {
        const u = new URL(url);
        // https://www.youtube.com/watch?v=VIDEO_ID
        if (u.hostname.includes('youtube.com')) {
            return u.searchParams.get('v') || null;
        }
        // https://youtu.be/VIDEO_ID
        if (u.hostname === 'youtu.be') {
            return u.pathname.slice(1) || null;
        }
    } catch {
    }
    return null;
}

export default function ResourceShow({ item, onClose }) {
    if (!item) return null;

    const isVideo = item.type === 'video';
    const youtubeId = isVideo ? getYouTubeId(item.url) : null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-6"
            onClick={onClose}
        >
            <div
                className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#D8DDD5] bg-white p-5 shadow-2xl transition-all sm:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-start justify-between border-b border-[#F0F0E9] pb-4">
                    <div className="min-w-0 pr-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#AD5266]">
                            {isVideo
                                ? 'YouTube Video'
                                : item.type === 'pq'
                                  ? 'Practice Question / Document'
                                  : item.type}
                        </span>
                        <h2
                            className="mt-1 truncate text-base font-bold text-[#30302D] sm:text-lg"
                            style={{ fontFamily: '"Manrope", sans-serif' }}
                        >
                            {item.title}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D8DDD5] bg-[#FFFFFF] text-xs text-[#73736C] hover:bg-[#F7F7F2]"
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="mt-5 space-y-4">
                    {item.description && (
                        <p className="text-xs leading-relaxed text-[#73736C]">
                            {item.description}
                        </p>
                    )}

                    {item.content && (
                        <div className="whitespace-pre-line rounded-2xl border border-[#D8DDD5] bg-[#FAF8F2] p-4 text-sm leading-relaxed text-[#30302D]">
                            {item.content}
                        </div>
                    )}

                    {/* YouTube embed – shown when it's a YouTube video */}
                    {isVideo && youtubeId && (
                        <div className="overflow-hidden rounded-2xl border border-[#D8DDD5]">
                            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                                <iframe
                                    src={`https://www.youtube.com/embed/${youtubeId}`}
                                    title={item.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="absolute inset-0 h-full w-full border-0"
                                />
                            </div>
                        </div>
                    )}

                    {/* Thumbnail fallback – shown for video cards without a recognised YouTube ID */}
                    {isVideo && !youtubeId && item.metadata?.thumbnail_url && (
                        <div className="overflow-hidden rounded-2xl border border-[#D8DDD5]">
                            <img
                                src={item.metadata.thumbnail_url}
                                alt={item.title}
                                className="max-h-[320px] w-full object-cover"
                            />
                        </div>
                    )}

                    {/* File viewer (PDF / image) */}
                    {item.metadata?.file_url && (
                        <div className="overflow-hidden rounded-2xl border border-[#D8DDD5]">
                            {item.metadata.mime_type === 'application/pdf' ? (
                                <iframe
                                    src={item.metadata.file_url}
                                    className="h-[450px] w-full"
                                    title={item.title}
                                />
                            ) : (
                                <img
                                    src={item.metadata.file_url}
                                    alt={item.title}
                                    className="max-h-[450px] w-full bg-[#F7F7F2] object-contain"
                                />
                            )}
                        </div>
                    )}

                    {/* Action buttons */}
                    {item.url && (
                        <div className="flex flex-wrap gap-3 pt-2">
                            {/* For YouTube videos: watch on YouTube button */}
                            {isVideo && youtubeId && (
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#FF0000] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#CC0000]"
                                >
                                    <Play size={15} />
                                    Watch on YouTube
                                </a>
                            )}

                            {/* For non-YouTube or non-video: regular external link */}
                            {(!isVideo || !youtubeId) && (
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#762F50] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#5E243F]"
                                >
                                    Open External Link
                                    <ExternalLink size={14} />
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
