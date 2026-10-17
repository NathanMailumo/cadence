import React from 'react';
import { X, ExternalLink } from 'lucide-react';

export default function ResourceShow({ item, onClose }) {
    if (!item) return null;

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
                            {item.type === 'video'
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
                        {item.metadata?.author_name && (
                            <p className="mt-0.5 truncate text-xs text-[#73736C]">
                                Channel: {item.metadata.author_name}
                            </p>
                        )}
                        {item.metadata?.domain && (
                            <p className="mt-0.5 truncate text-xs text-[#73736C]">
                                Domain: {item.metadata.domain}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D8DDD5] bg-[#FFFFFF] text-xs text-[#73736C] hover:bg-[#F7F7F2]"
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* Modal Body / Extended Info */}
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

                    {item.metadata?.thumbnail_url && item.type === 'video' && (
                        <div className="overflow-hidden rounded-2xl border border-[#D8DDD5]">
                            <img
                                src={item.metadata.thumbnail_url}
                                alt={item.title}
                                className="max-h-[320px] w-full object-cover"
                            />
                        </div>
                    )}

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

                    {item.url && (
                        <div className="pt-2">
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl bg-[#762F50] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#5E243F]"
                            >
                                Open External Link / Video{' '}
                                <ExternalLink size={14} />
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
