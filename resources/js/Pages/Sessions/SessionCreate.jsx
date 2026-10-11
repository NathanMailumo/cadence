import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function SessionCreate({ resourceId = null }) {
    const [mode, setMode] = useState('topics'); // 'topics' or 'resource'

    const { data, setData, post, processing, errors } = useForm({
        course_title: '',
        course_code: '',
        input_option: 'text', // 'file' or 'text'
        file: null,
        focus_prompt: '',
        resource_id: resourceId,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(typeof route === 'function' ? route('sessions.store') : '/sessions/create');
    };

    return (
        <AuthenticatedLayout>
            <Head title="Cadence - Create Revision Pack" />

            <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                {/* PAGE HEADER */}
                <div className="border-b border-[#D8DDD5] pb-6">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#AD5266]">
                        AI Study Tool
                    </span>
                    <h1
                        className="mt-2 text-2xl font-bold tracking-tight text-[#30302D] sm:text-3xl"
                        style={{ fontFamily: '"Manrope", sans-serif' }}
                    >
                        Create a Revision Pack
                    </h1>
                    <p className="mt-1 text-xs text-[#73736C]">
                        Generate structured study notes, flashcards, key concepts, and practice questions.
                    </p>
                </div>

                {/* MODE SELECTION TABS */}
                <div className="mt-8 flex rounded-full bg-[#FFFFFF] p-1.5 border border-[#D8DDD5] shadow-sm">
                    <button
                        type="button"
                        onClick={() => {
                            setMode('topics');
                            setData('input_option', 'text');
                        }}
                        className={`flex-1 rounded-full py-2 text-xs font-semibold transition-all ${
                            mode === 'topics'
                                ? 'bg-[#AD5266] text-white shadow-sm'
                                : 'text-[#73736C] hover:text-[#30302D]'
                        }`}
                    >
                        Topics & Curriculum Directives
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setMode('resource');
                            setData('input_option', 'file');
                        }}
                        className={`flex-1 rounded-full py-2 text-xs font-semibold transition-all ${
                            mode === 'resource'
                                ? 'bg-[#AD5266] text-white shadow-sm'
                                : 'text-[#73736C] hover:text-[#30302D]'
                        }`}
                    >
                        Upload Document / Slides
                    </button>
                </div>

                {/* FORM CONTAINER */}
                <form
                    onSubmit={handleSubmit}
                    className="mt-6 rounded-3xl border border-[#D8DDD5] bg-[#FFFFFF] p-6 shadow-sm sm:p-8"
                >
                    {/* COURSE IDENTIFICATION */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold uppercase text-[#30302D]">
                                Course Title <span className="text-[#AD5266]">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Data Structures and Algorithms"
                                value={data.course_title}
                                onChange={(e) => setData('course_title', e.target.value)}
                                className="mt-1.5 w-full rounded-xl border border-[#D8DDD5] bg-[#F7F7F2] p-3 text-sm text-[#30302D] outline-none focus:border-[#AD5266] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#AD5266]"
                                required
                            />
                            {errors.course_title && (
                                <p className="mt-1 text-xs text-rose-600">{errors.course_title}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase text-[#30302D]">
                                Course Code
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. CS201"
                                value={data.course_code}
                                onChange={(e) => setData('course_code', e.target.value)}
                                className="mt-1.5 w-full rounded-xl border border-[#D8DDD5] bg-[#F7F7F2] p-3 text-sm text-[#30302D] outline-none focus:border-[#AD5266] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#AD5266]"
                            />
                            {errors.course_code && (
                                <p className="mt-1 text-xs text-rose-600">{errors.course_code}</p>
                            )}
                        </div>
                    </div>

                    {/* DYNAMIC CONTENT INPUT */}
                    <div className="mt-5">
                        {mode === 'topics' ? (
                            <div>
                                <label className="block text-xs font-semibold uppercase text-[#30302D]">
                                    Focus Area & Topics Outline <span className="text-[#AD5266]">*</span>
                                </label>
                                <textarea
                                    rows={6}
                                    placeholder="List the specific topics, chapters, exam areas, or questions you want this revision pack to emphasize..."
                                    value={data.focus_prompt}
                                    onChange={(e) => setData('focus_prompt', e.target.value)}
                                    className="mt-1.5 w-full rounded-xl border border-[#D8DDD5] bg-[#F7F7F2] p-3 text-sm text-[#30302D] outline-none focus:border-[#AD5266] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#AD5266]"
                                    required
                                />
                                {errors.focus_prompt && (
                                    <p className="mt-1 text-xs text-rose-600">{errors.focus_prompt}</p>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-[#30302D]">
                                        Focus Area or Target Chapters <span className="text-[#AD5266]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Focus on Chapter 4: Memory Hierarchy"
                                        value={data.focus_prompt}
                                        onChange={(e) => setData('focus_prompt', e.target.value)}
                                        className="mt-1.5 w-full rounded-xl border border-[#D8DDD5] bg-[#F7F7F2] p-3 text-sm text-[#30302D] outline-none focus:border-[#AD5266] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#AD5266]"
                                        required
                                    />
                                    {errors.focus_prompt && (
                                        <p className="mt-1 text-xs text-rose-600">{errors.focus_prompt}</p>
                                    )}
                                </div>

                                <div className="rounded-2xl border-2 border-dashed border-[#D8DDD5] bg-[#F7F7F2] p-6 text-center">
                                    <label className="block cursor-pointer">
                                        <span className="text-sm font-semibold text-[#30302D]">
                                            Upload course notes or slides
                                        </span>
                                        <span className="block mt-1 text-[11px] text-[#73736C]">
                                            PDF, DOCX, PPTX, or TXT · Maximum 5 MB
                                        </span>
                                        <input
                                            type="file"
                                            required
                                            accept=".pdf,.docx,.txt,.pptx"
                                            onChange={(e) => setData('file', e.target.files?.[0] || null)}
                                            className="mt-3 block w-full text-xs text-gray-500 file:mr-3 file:rounded-full file:border-0 file:bg-[#FFFFFF] file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-[#30302D] hover:file:bg-[#F0F0E9]"
                                        />
                                    </label>
                                    {errors.file && (
                                        <p className="mt-2 text-xs text-rose-600">{errors.file}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="mt-8 flex items-center justify-end gap-3 border-t border-[#F0F0E9] pt-5">
                        <Link
                            href={
                                resourceId
                                    ? (typeof route === 'function' ? route('resources.show', resourceId) : `/resources/${resourceId}`)
                                    : (typeof route === 'function' ? route('dashboard') : '/dashboard')
                            }
                            className="rounded-full px-5 py-2.5 text-xs font-semibold text-[#73736C] hover:text-[#30302D]"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-full bg-[#AD5266] px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#974356] active:scale-95 disabled:opacity-50"
                        >
                            {processing ? 'Compiling revision pack...' : 'Generate Revision Pack'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
