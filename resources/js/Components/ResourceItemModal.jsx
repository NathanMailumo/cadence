import React, { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import { X } from 'lucide-react';

export default function ResourceItemModal({
    isOpen,
    onClose,
    resource,
    defaultType = null,
    onOpenYoutube = () => {},
}) {
    const [step, setStep] = useState('choose'); // 'choose', 'link', 'note', 'pq', 'revision'

    // Form for standard ResourceItems (link, note, pq)
    const itemForm = useForm({
        resource_id: resource?.id || '',
        type: 'note',
        title: '',
        url: '',
        content: '',
        description: '',
        file: null,
    });

    // Form for Revision Pack generation (routes to sessions.store)
    const revisionForm = useForm({
        course_title: resource?.course_name || '',
        course_code: resource?.course_code || '',
        input_option: 'text',
        focus_prompt: '',
        resource_id: resource?.id || '',
    });

    useEffect(() => {
        if (isOpen) {
            if (defaultType && defaultType !== 'choose') {
                setStep(defaultType);
            } else {
                setStep('choose');
            }

            itemForm.setData({
                resource_id: resource?.id || '',
                type: defaultType || 'note',
                title: '',
                url: '',
                content: '',
                description: '',
                file: null,
            });

            revisionForm.setData({
                course_title: resource?.course_name || '',
                course_code: resource?.course_code || '',
                input_option: 'text',
                focus_prompt: '',
                resource_id: resource?.id || '',
            });
        }
    }, [isOpen, defaultType, resource]);

    if (!isOpen) return null;

    const handleClose = () => {
        itemForm.reset();
        revisionForm.reset();
        setStep('choose');
        onClose();
    };

    // Handle standard resource item submission
    const handleItemSubmit = (e) => {
        e.preventDefault();
        itemForm.post(
            typeof route === 'function' ? route('resource-items.store') : '/resource-items',
            {
                forceFormData: Boolean(itemForm.data.file),
                onSuccess: () => handleClose(),
            },
        );
    };

    // Handle revision pack creation submission
    const handleRevisionSubmit = (e) => {
        e.preventDefault();
        revisionForm.post(
            typeof route === 'function' ? route('sessions.store') : '/sessions/create',
            {
                onSuccess: () => handleClose(),
            },
        );
    };

    const spaceName = resource?.course_name || 'space';

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) handleClose();
            }}
        >
            <div className="w-full max-w-lg rounded-3xl border border-[#D8DDD5] bg-[#FFFFFF] p-6 shadow-2xl transition-all sm:p-7">
                {/* 1. CHOOSER MODAL (MATCHES FIGMA FRAME 14:2370) */}
                {step === 'choose' && (
                    <div>
                        <div className="flex items-start justify-between border-b border-[#F0F0E9] pb-4">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#AD5266]">
                                    Add to {spaceName}
                                </span>
                                <h2
                                    className="mt-1 text-xl font-bold text-[#30302D]"
                                    style={{ fontFamily: '"Manrope", sans-serif' }}
                                >
                                    What would you like to add?
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D8DDD5] bg-[#FFFFFF] text-xs text-[#73736C] hover:bg-[#F7F7F2]"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mt-5 space-y-2.5">
                            {/* YouTube Video Option */}
                            <button
                                type="button"
                                onClick={() => {
                                    handleClose();
                                    onOpenYoutube();
                                }}
                                className="group flex w-full items-center justify-between rounded-2xl border border-[#D8DDD5] bg-[#FFFFFF] p-4 text-left transition-all hover:border-[#AD5266] hover:bg-[#FDF9FA]"
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 font-bold">
                                        Video
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#30302D] group-hover:text-[#AD5266]">
                                            YouTube Video
                                        </p>
                                        <p className="text-xs text-[#73736C]">
                                            Add educational videos from YouTube.
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs font-semibold text-gray-400 group-hover:text-[#AD5266] group-hover:translate-x-0.5 transition-all">→</span>
                            </button>

                            {/* Website Link Option */}
                            <button
                                type="button"
                                onClick={() => {
                                    itemForm.setData('type', 'link');
                                    setStep('link');
                                }}
                                className="group flex w-full items-center justify-between rounded-2xl border border-[#D8DDD5] bg-[#FFFFFF] p-4 text-left transition-all hover:border-[#AD5266] hover:bg-[#FDF9FA]"
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 font-bold">
                                        Link
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#30302D] group-hover:text-[#AD5266]">
                                            Website Link
                                        </p>
                                        <p className="text-xs text-[#73736C]">
                                            Save useful external websites and articles.
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs font-semibold text-gray-400 group-hover:text-[#AD5266] group-hover:translate-x-0.5 transition-all">→</span>
                            </button>

                            {/* Sticky Note Option */}
                            <button
                                type="button"
                                onClick={() => {
                                    itemForm.setData('type', 'note');
                                    setStep('note');
                                }}
                                className="group flex w-full items-center justify-between rounded-2xl border border-[#D8DDD5] bg-[#FFFFFF] p-4 text-left transition-all hover:border-[#AD5266] hover:bg-[#FDF9FA]"
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-900 font-bold">
                                        Note
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#30302D] group-hover:text-[#AD5266]">
                                            Sticky Note
                                        </p>
                                        <p className="text-xs text-[#73736C]">
                                            Write and save quick notes.
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs font-semibold text-gray-400 group-hover:text-[#AD5266] group-hover:translate-x-0.5 transition-all">→</span>
                            </button>

                            {/* Past Questions Option */}
                            <button
                                type="button"
                                onClick={() => {
                                    itemForm.setData('type', 'pq');
                                    setStep('pq');
                                }}
                                className="group flex w-full items-center justify-between rounded-2xl border border-[#D8DDD5] bg-[#FFFFFF] p-4 text-left transition-all hover:border-[#AD5266] hover:bg-[#FDF9FA]"
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700 font-bold">
                                        Document
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#30302D] group-hover:text-[#AD5266]">
                                            Past Questions
                                        </p>
                                        <p className="text-xs text-[#73736C]">
                                            Add past exam papers and practice questions.
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs font-semibold text-gray-400 group-hover:text-[#AD5266] group-hover:translate-x-0.5 transition-all">→</span>
                            </button>

                            {/* AI Revision Pack Option (FIGMA FRAME 14:4530) */}
                            <button
                                type="button"
                                onClick={() => setStep('revision')}
                                className="group flex w-full items-center justify-between rounded-2xl border-2 border-[#AD5266]/30 bg-[#FBF5F7] p-4 text-left transition-all hover:border-[#AD5266] hover:bg-[#F8EDF1]"
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#AD5266] text-white font-bold">
                                        AI
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#762F50]">
                                            Revision Pack
                                        </p>
                                        <p className="text-xs text-[#73736C]">
                                            Generate an AI-powered revision pack for a course or topic.
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-[#AD5266] group-hover:translate-x-0.5 transition-all">→</span>
                            </button>
                        </div>

                        <div className="mt-6 flex justify-end border-t border-[#F0F0E9] pt-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="rounded-full px-4 py-2 text-xs font-semibold text-[#73736C] hover:text-[#30302D]"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* 2. ADD WEBSITE LINK (MATCHES FIGMA FRAME 14:3409) */}
                {step === 'link' && (
                    <form onSubmit={handleItemSubmit}>
                        <div className="flex items-start justify-between border-b border-[#F0F0E9] pb-4">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#AD5266]">
                                    Resource
                                </span>
                                <h2 className="mt-1 text-xl font-bold text-[#30302D]" style={{ fontFamily: '"Manrope", sans-serif' }}>
                                    Add Website Link
                                </h2>
                                <p className="text-xs text-[#73736C]">Complete the details below to create this resource card.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setStep('choose')}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D8DDD5] bg-[#FFFFFF] text-xs text-[#73736C] hover:bg-[#F7F7F2]"
                            >
                                ←
                            </button>
                        </div>

                        <div className="mt-5 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-[#30302D]">
                                    Resource Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Give this resource a clear title"
                                    value={itemForm.data.title}
                                    onChange={(e) => itemForm.setData('title', e.target.value)}
                                    className="mt-1.5 w-full rounded-xl border border-[#D8DDD5] bg-[#F7F7F2] p-3 text-sm text-[#30302D] focus:border-[#AD5266] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#AD5266]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-[#30302D]">
                                    Link URL
                                </label>
                                <input
                                    type="url"
                                    required
                                    placeholder="https://example.com/article"
                                    value={itemForm.data.url}
                                    onChange={(e) => itemForm.setData('url', e.target.value)}
                                    className="mt-1.5 w-full rounded-xl border border-[#D8DDD5] bg-[#F7F7F2] p-3 text-sm text-[#30302D] focus:border-[#AD5266] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#AD5266]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-[#30302D]">
                                    Description (Optional)
                                </label>
                                <textarea
                                    rows="2"
                                    placeholder="Paste a short description or takeaway"
                                    value={itemForm.data.description}
                                    onChange={(e) => itemForm.setData('description', e.target.value)}
                                    className="mt-1.5 w-full rounded-xl border border-[#D8DDD5] bg-[#F7F7F2] p-3 text-sm text-[#30302D] focus:border-[#AD5266] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#AD5266]"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#F0F0E9] pt-4">
                            <button
                                type="button"
                                onClick={() => setStep('choose')}
                                className="rounded-full px-4 py-2 text-xs font-semibold text-[#73736C] hover:text-[#30302D]"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={itemForm.processing}
                                className="rounded-full bg-[#AD5266] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#974356] disabled:opacity-50"
                            >
                                {itemForm.processing ? 'Adding...' : 'Add resource'}
                            </button>
                        </div>
                    </form>
                )}

                {/* 3. ADD STICKY NOTE (MATCHES FIGMA FRAME 14:3811) */}
                {step === 'note' && (
                    <form onSubmit={handleItemSubmit}>
                        <div className="flex items-start justify-between border-b border-[#F0F0E9] pb-4">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#AD5266]">
                                    Resource
                                </span>
                                <h2 className="mt-1 text-xl font-bold text-[#30302D]" style={{ fontFamily: '"Manrope", sans-serif' }}>
                                    Add Sticky Note
                                </h2>
                                <p className="text-xs text-[#73736C]">Complete the details below to create this resource card.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setStep('choose')}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D8DDD5] bg-[#FFFFFF] text-xs text-[#73736C] hover:bg-[#F7F7F2]"
                            >
                                ←
                            </button>
                        </div>

                        <div className="mt-5 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-[#30302D]">
                                    Note Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Key idea to remember"
                                    value={itemForm.data.title}
                                    onChange={(e) => itemForm.setData('title', e.target.value)}
                                    className="mt-1.5 w-full rounded-xl border border-[#D8DDD5] bg-[#FAF8F2] p-3 text-sm text-[#30302D] focus:border-[#AD5266] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#AD5266]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-[#30302D]">
                                    Your Note
                                </label>
                                <textarea
                                    rows="5"
                                    required
                                    placeholder="Write a short note..."
                                    value={itemForm.data.content}
                                    onChange={(e) => itemForm.setData('content', e.target.value)}
                                    className="mt-1.5 w-full rounded-xl border border-[#D8DDD5] bg-[#FAF8F2] p-3 text-sm text-[#30302D] focus:border-[#AD5266] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#AD5266]"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#F0F0E9] pt-4">
                            <button
                                type="button"
                                onClick={() => setStep('choose')}
                                className="rounded-full px-4 py-2 text-xs font-semibold text-[#73736C] hover:text-[#30302D]"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={itemForm.processing}
                                className="rounded-full bg-[#AD5266] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#974356] disabled:opacity-50"
                            >
                                {itemForm.processing ? 'Adding...' : 'Add resource'}
                            </button>
                        </div>
                    </form>
                )}

                {/* 4. UPLOAD PAST QUESTIONS (MATCHES FIGMA FRAME 14:4213) */}
                {step === 'pq' && (
                    <form onSubmit={handleItemSubmit}>
                        <div className="flex items-start justify-between border-b border-[#F0F0E9] pb-4">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#AD5266]">
                                    Add a resource
                                </span>
                                <h2 className="mt-1 text-xl font-bold text-[#30302D]" style={{ fontFamily: '"Manrope", sans-serif' }}>
                                    Upload past questions
                                </h2>
                                <p className="text-xs text-[#73736C]">
                                    Add a past exam paper, practice question set, or another relevant academic document.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setStep('choose')}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D8DDD5] bg-[#FFFFFF] text-xs text-[#73736C] hover:bg-[#F7F7F2]"
                            >
                                ←
                            </button>
                        </div>

                        <div className="mt-5 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-[#30302D]">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. 2024 Midterm Exam Paper"
                                    value={itemForm.data.title}
                                    onChange={(e) => itemForm.setData('title', e.target.value)}
                                    className="mt-1.5 w-full rounded-xl border border-[#D8DDD5] bg-[#F7F7F2] p-3 text-sm text-[#30302D] focus:border-[#AD5266] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#AD5266]"
                                />
                            </div>

                            <div className="rounded-2xl border-2 border-dashed border-[#D8DDD5] bg-[#F7F7F2] p-5 text-center">
                                <label className="block cursor-pointer">
                                    <span className="text-sm font-semibold text-[#30302D]">
                                        Choose a document to upload
                                    </span>
                                    <span className="block mt-1 text-[11px] text-[#73736C]">
                                        PDF, DOCX, or Images · Maximum 5 MB per file
                                    </span>
                                    <input
                                        type="file"
                                        required
                                        accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                                        onChange={(e) => itemForm.setData('file', e.target.files?.[0] || null)}
                                        className="mt-3 block w-full text-xs text-gray-500 file:mr-3 file:rounded-full file:border-0 file:bg-[#FFFFFF] file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-[#30302D] hover:file:bg-[#F0F0E9]"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#F0F0E9] pt-4">
                            <button
                                type="button"
                                onClick={() => setStep('choose')}
                                className="rounded-full px-4 py-2 text-xs font-semibold text-[#73736C] hover:text-[#30302D]"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={itemForm.processing || !itemForm.data.file}
                                className="rounded-full bg-[#AD5266] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#974356] disabled:opacity-50"
                            >
                                {itemForm.processing ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>
                    </form>
                )}

                {/* 5. GENERATE REVISION PACK (MATCHES FIGMA FRAME 14:4530) */}
                {step === 'revision' && (
                    <form onSubmit={handleRevisionSubmit}>
                        <div className="flex items-start justify-between border-b border-[#F0F0E9] pb-4">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#AD5266]">
                                    AI Study Session
                                </span>
                                <h2 className="mt-1 text-xl font-bold text-[#30302D]" style={{ fontFamily: '"Manrope", sans-serif' }}>
                                    Generate a revision pack
                                </h2>
                                <p className="text-xs text-[#73736C]">
                                    This pack will be saved as a resource inside <strong className="text-[#30302D]">{spaceName}</strong>.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setStep('choose')}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D8DDD5] bg-[#FFFFFF] text-xs text-[#73736C] hover:bg-[#F7F7F2]"
                            >
                                ←
                            </button>
                        </div>

                        <div className="mt-5 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-[#30302D]">
                                    Course name
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Introduction to Algorithms"
                                    value={revisionForm.data.course_title}
                                    onChange={(e) => revisionForm.setData('course_title', e.target.value)}
                                    className="mt-1.5 w-full rounded-xl border border-[#D8DDD5] bg-[#F7F7F2] p-3 text-sm text-[#30302D] focus:border-[#AD5266] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#AD5266]"
                                />
                                {revisionForm.errors.course_title && (
                                    <p className="mt-1 text-[11px] text-rose-600">{revisionForm.errors.course_title}</p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs font-semibold uppercase text-[#30302D]">
                                        Topics or curriculum details
                                    </label>
                                    <span className="text-[10px] text-[#73736C]">Optional</span>
                                </div>
                                <textarea
                                    rows="4"
                                    placeholder="What should this revision pack focus on? (e.g. Binary Search Trees, Big O notation, dynamic programming)"
                                    value={revisionForm.data.focus_prompt}
                                    onChange={(e) => revisionForm.setData('focus_prompt', e.target.value)}
                                    className="mt-1.5 w-full rounded-xl border border-[#D8DDD5] bg-[#F7F7F2] p-3 text-sm text-[#30302D] focus:border-[#AD5266] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#AD5266]"
                                />
                                {revisionForm.errors.focus_prompt && (
                                    <p className="mt-1 text-[11px] text-rose-600">{revisionForm.errors.focus_prompt}</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#F0F0E9] pt-4">
                            <button
                                type="button"
                                onClick={() => setStep('choose')}
                                className="rounded-full px-4 py-2 text-xs font-semibold text-[#73736C] hover:text-[#30302D]"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={revisionForm.processing}
                                className="rounded-full bg-[#AD5266] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#974356] disabled:opacity-50 transition-all active:scale-95"
                            >
                                {revisionForm.processing ? 'Compiling revision pack...' : 'Generate and add to space'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
