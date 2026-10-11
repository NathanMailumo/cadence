import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

export default function YouTubePickerModal({ isOpen, onClose, onSelectVideo }) {
    const [mode, setMode] = useState('search'); // 'search' or 'direct'
    const [query, setQuery] = useState('');
    const [directUrl, setDirectUrl] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');
        try {
            const response = await axios.get('/youtube/search', {
                params: { q: query },
            });
            setResults(response.data);
            if (response.data.length === 0) {
                setError('No videos found. Try a direct URL!');
            }
        } catch (err) {
            setError('Search provider unavailable. You can paste a direct YouTube link.');
        } finally {
            setLoading(false);
        }
    };

    const getYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    const handleDirectUrlSubmit = async (e) => {
        e.preventDefault();
        const videoId = getYouTubeId(directUrl);

        if (!videoId) {
            setError('Invalid YouTube URL. Please enter a valid video link.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch(
                `https://www.youtube.com/oembed?url=${encodeURIComponent(directUrl)}&format=json`,
            );

            if (!res.ok) throw new Error('Could not fetch video info');

            const data = await res.json();

            const customVideo = {
                id: videoId,
                title: data.title,
                uploader: data.author_name || 'YouTube',
                thumbnail:
                    data.thumbnail_url ||
                    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                url: directUrl,
            };

            onSelectVideo(customVideo);
        } catch {
            // Fallback object with direct thumbnail
            const fallbackVideo = {
                id: videoId,
                title: 'YouTube Video',
                uploader: 'YouTube',
                thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                url: directUrl,
            };
            onSelectVideo(fallbackVideo);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="w-full max-w-lg rounded-3xl border border-[#D8DDD5] bg-[#FFFFFF] p-6 shadow-2xl transition-all sm:p-7">
                {/* HEADER */}
                <div className="flex items-start justify-between border-b border-[#F0F0E9] pb-4">
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#AD5266]">
                            Add a resource
                        </span>
                        <h2 className="mt-1 text-xl font-bold text-[#30302D]" style={{ fontFamily: '"Manrope", sans-serif' }}>
                            Add a YouTube video
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D8DDD5] bg-[#FFFFFF] text-xs text-[#73736C] hover:bg-[#F7F7F2]"
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* TABS (SEARCH VS DIRECT URL) */}
                <div className="mt-4 flex rounded-full bg-[#F0F0E9] p-1 text-xs font-semibold">
                    <button
                        type="button"
                        onClick={() => {
                            setMode('search');
                            setError('');
                        }}
                        className={`flex-1 rounded-full py-1.5 transition-all ${
                            mode === 'search'
                                ? 'bg-[#FFFFFF] text-[#30302D] shadow-sm'
                                : 'text-[#73736C] hover:text-[#30302D]'
                        }`}
                    >
                        Search YouTube
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setMode('direct');
                            setError('');
                        }}
                        className={`flex-1 rounded-full py-1.5 transition-all ${
                            mode === 'direct'
                                ? 'bg-[#FFFFFF] text-[#30302D] shadow-sm'
                                : 'text-[#73736C] hover:text-[#30302D]'
                        }`}
                    >
                        Paste a YouTube URL
                    </button>
                </div>

                {/* MODE 1: SEARCH */}
                {mode === 'search' ? (
                    <div className="mt-4 space-y-4">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Search for educational videos..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="flex-1 rounded-xl border border-[#D8DDD5] bg-[#F7F7F2] px-3.5 py-2 text-sm text-[#30302D] placeholder:text-[#8E9088] focus:border-[#AD5266] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#AD5266]"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-xl bg-[#AD5266] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#974356] disabled:opacity-50"
                            >
                                {loading ? '...' : 'Search'}
                            </button>
                        </form>

                        {error && <p className="text-xs text-rose-600">{error}</p>}

                        {/* Search Results */}
                        <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                            {results.length > 0 ? (
                                results.map((v) => (
                                    <div
                                        key={v.id}
                                        onClick={() => onSelectVideo(v)}
                                        className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-[#D8DDD5] p-2.5 transition-all hover:border-[#AD5266] hover:bg-[#FDF9FA]"
                                    >
                                        <img
                                            src={v.thumbnail}
                                            alt=""
                                            className="h-14 w-20 rounded-xl object-cover"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-xs font-bold text-[#30302D] group-hover:text-[#AD5266]">
                                                {v.title}
                                            </p>
                                            <p className="truncate text-[11px] text-[#73736C]">
                                                {v.uploader}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center text-xs text-[#73736C]">
                                    Search results will appear here. Results use Cadence's YouTube provider when connected.
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* MODE 2: DIRECT URL (MATCHES FIGMA FRAME 14:3080) */
                    <form onSubmit={handleDirectUrlSubmit} className="mt-4 space-y-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase text-[#30302D]">
                                YouTube video URL
                            </label>
                            <input
                                type="url"
                                required
                                placeholder="https://www.youtube.com/watch?v=..."
                                value={directUrl}
                                onChange={(e) => setDirectUrl(e.target.value)}
                                className="mt-1.5 w-full rounded-xl border border-[#D8DDD5] bg-[#F7F7F2] p-3 text-sm text-[#30302D] placeholder:text-[#8E9088] focus:border-[#AD5266] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#AD5266]"
                            />
                            <p className="mt-1.5 text-[11px] text-[#73736C]">
                                Supports standard YouTube, Shorts, embed, and youtu.be links.
                            </p>
                            {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-full px-4 py-2 text-xs font-semibold text-[#73736C] hover:text-[#30302D]"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !directUrl}
                                className="rounded-full bg-[#AD5266] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#974356] disabled:opacity-50"
                            >
                                {loading ? 'Fetching...' : 'Add video'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
