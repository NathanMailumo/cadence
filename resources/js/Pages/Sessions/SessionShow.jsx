import React, { useEffect, useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import 'katex/dist/katex.css';

export default function SessionShow({ session }) {
    const GENERATION_TIMEOUT_MS = 150000;
    const FAILED_OUTPUT = 'Failed to generate study materials.';
    const outputContent = session?.session_output?.content?.trim() || '';
    const hasOutput = Boolean(outputContent && outputContent !== FAILED_OUTPUT);

    const [generationFailed, setGenerationFailed] = useState(
        outputContent === FAILED_OUTPUT,
    );
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('notes'); // 'notes' or 'flashcards'
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    // Polling while AI is generating
    useEffect(() => {
        if (hasOutput || generationFailed) return;

        const createdAt = Date.parse(session?.created_at || '');
        const elapsed = Number.isNaN(createdAt) ? 0 : Date.now() - createdAt;
        const remainingTime = Math.max(GENERATION_TIMEOUT_MS - elapsed, 0);

        const timeout = setTimeout(() => {
            setGenerationFailed(true);
        }, remainingTime);

        const interval = setInterval(() => {
            router.reload({
                only: ['session'],
                preserveScroll: true,
            });
        }, 3000);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, [generationFailed, hasOutput, session?.created_at]);

    // Extract headings for Table of Contents
    const headings = useMemo(() => {
        if (!outputContent) return [];
        const lines = outputContent.split('\n');
        const extracted = [];
        for (const line of lines) {
            const match = line.match(/^(#{2,3})\s+(.*)$/);
            if (match) {
                const text = match[2].trim();
                const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                extracted.push({
                    level: match[1].length,
                    text,
                    id,
                });
            }
        }
        return extracted;
    }, [outputContent]);

    // Extract potential flashcards (Q&A pairs or bullet points with colon/dash)
    const flashcards = useMemo(() => {
        if (!outputContent) return [];
        const cards = [];
        const lines = outputContent.split('\n');
        for (const line of lines) {
            // Match pattern like "- Concept: Definition" or "Q: ... A: ..."
            const colonMatch = line.match(/^[-*]\s+\*\*([^*]+)\*\*:\s*(.+)$/);
            if (colonMatch) {
                cards.push({
                    question: colonMatch[1].trim(),
                    answer: colonMatch[2].trim(),
                });
                continue;
            }
            const qaMatch = line.match(/^(?:Q|Question):\s*(.+?)(?:\s*(?:A|Answer):\s*(.+))?$/i);
            if (qaMatch && qaMatch[2]) {
                cards.push({
                    question: qaMatch[1].trim(),
                    answer: qaMatch[2].trim(),
                });
            }
        }
        return cards.slice(0, 20);
    }, [outputContent]);

    const handleCopy = () => {
        if (!outputContent) return;
        navigator.clipboard.writeText(outputContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePrint = () => {
        window.print();
    };

    const spaceName = session?.resource?.course_name || 'Space';
    const spaceUrl = session?.resource_id
        ? (typeof route === 'function' ? route('resources.show', session.resource_id) : `/resources/${session.resource_id}`)
        : (typeof route === 'function' ? route('dashboard') : '/dashboard');

    const readingTime = useMemo(() => {
        const words = outputContent.split(/\s+/).length;
        const minutes = Math.ceil(words / 200);
        return `${minutes} min read`;
    }, [outputContent]);

    const showFailedState = generationFailed || outputContent === FAILED_OUTPUT;

    return (
        <AuthenticatedLayout>
            <Head title={`Cadence - ${session?.course_title || 'Revision Pack'}`} />

            <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                {/* BREADCRUMB & BACK NAVIGATION */}
                <div className="flex items-center justify-between border-b border-[#D8DDD5] pb-5">
                    <div className="flex items-center gap-2 text-xs text-[#73736C]">
                        <Link href={spaceUrl} className="font-semibold text-[#30302D] hover:text-[#AD5266] transition-colors">
                            ← Back to {spaceName}
                        </Link>
                        <span className="text-gray-300">/</span>
                        <span className="rounded-full bg-[#AD5266]/10 px-2 py-0.5 text-[10px] font-bold text-[#762F50]">
                            Revision Pack
                        </span>
                    </div>

                    {hasOutput && (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="rounded-full border border-[#D8DDD5] bg-[#FFFFFF] px-3.5 py-1.5 text-xs font-semibold text-[#30302D] hover:bg-[#F7F7F2] transition-colors shadow-sm"
                            >
                                {copied ? '✓ Copied' : 'Copy markdown'}
                            </button>
                            <button
                                type="button"
                                onClick={handlePrint}
                                className="rounded-full border border-[#D8DDD5] bg-[#FFFFFF] px-3.5 py-1.5 text-xs font-semibold text-[#30302D] hover:bg-[#F7F7F2] transition-colors shadow-sm"
                            >
                                Print / PDF
                            </button>
                        </div>
                    )}
                </div>

                {/* STUDY GUIDE HEADER HERO */}
                <div className="mt-6 rounded-3xl border border-[#D8DDD5] bg-[#FFFFFF] p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="rounded-full bg-[#AD5266] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                                    AI STUDY SESSION
                                </span>
                                {session.course_code && (
                                    <span className="text-xs font-semibold text-[#73736C]">
                                        {session.course_code}
                                    </span>
                                )}
                            </div>
                            <h1
                                className="mt-3 text-2xl font-bold tracking-tight text-[#30302D] sm:text-3xl lg:text-4xl"
                                style={{ fontFamily: '"Manrope", sans-serif' }}
                            >
                                {session.course_title}
                            </h1>
                            {session.focus_prompt && (
                                <p className="mt-2 text-sm text-[#73736C]">
                                    <strong className="text-[#30302D]">Focus area:</strong> {session.focus_prompt}
                                </p>
                            )}
                        </div>

                        {/* Metadata pills */}
                        <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                            <span className="rounded-xl bg-[#F0F0E9] px-3 py-1 text-xs font-semibold text-[#73736C]">
                                {readingTime}
                            </span>
                            <span className="rounded-xl bg-[#F0F0E9] px-3 py-1 text-xs font-semibold text-[#73736C]">
                                {session.session_output?.model_used ? `Model: ${session.session_output.model_used}` : 'Cadence AI'}
                            </span>
                        </div>
                    </div>

                    {/* VIEW MODE TABS (IF FLASHCARDS ARE AVAILABLE) */}
                    {hasOutput && flashcards.length > 0 && (
                        <div className="mt-6 flex rounded-full bg-[#F0F0E9] p-1 w-fit text-xs font-semibold">
                            <button
                                type="button"
                                onClick={() => setActiveTab('notes')}
                                className={`rounded-full px-4 py-1.5 transition-all ${
                                    activeTab === 'notes'
                                        ? 'bg-[#FFFFFF] text-[#30302D] shadow-sm'
                                        : 'text-[#73736C] hover:text-[#30302D]'
                                }`}
                            >
                                Study Guide
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('flashcards')}
                                className={`rounded-full px-4 py-1.5 transition-all ${
                                    activeTab === 'flashcards'
                                        ? 'bg-[#FFFFFF] text-[#30302D] shadow-sm'
                                        : 'text-[#73736C] hover:text-[#30302D]'
                                }`}
                            >
                                Interactive Flashcards ({flashcards.length})
                            </button>
                        </div>
                    )}
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="mt-8">
                    {/* 1. FAILED STATE */}
                    {showFailedState ? (
                        <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-12 text-center">
                            <span className="text-3xl">⚠️</span>
                            <h2 className="mt-3 text-lg font-bold text-rose-900" style={{ fontFamily: '"Manrope", sans-serif' }}>
                                Generation could not be completed
                            </h2>
                            <p className="mt-1 text-xs text-rose-700 max-w-md mx-auto">
                                The AI request timed out or did not return structured output. You can retry generating a new revision pack from the workspace.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href={spaceUrl}
                                    className="rounded-full bg-[#AD5266] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#974356]"
                                >
                                    Return to space
                                </Link>
                            </div>
                        </div>
                    ) : !hasOutput ? (
                        /* 2. LOADING STATE WITH CADENCE PULSE */
                        <div className="rounded-3xl border border-[#D8DDD5] bg-[#FFFFFF] p-12 text-center shadow-sm">
                            <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#AD5266] opacity-20" />
                                <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#AD5266] text-xl font-bold text-white shadow-md">
                                    AI
                                </span>
                            </div>

                            <h2
                                className="mt-6 text-xl font-bold text-[#30302D]"
                                style={{ fontFamily: '"Manrope", sans-serif' }}
                            >
                                Compiling your revision pack...
                            </h2>
                            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[#73736C]">
                                Cadence is synthesizing key course concepts, explanations, definitions, and practice questions. This usually takes around 20–30 seconds.
                            </p>

                            <div className="mt-8 mx-auto max-w-sm space-y-2">
                                <div className="flex items-center justify-between text-[11px] font-semibold text-[#73736C]">
                                    <span>Synthesizing notes</span>
                                    <span className="animate-pulse text-[#AD5266]">In progress...</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-[#F0F0E9]">
                                    <div className="h-full w-2/3 animate-pulse rounded-full bg-[#AD5266]" />
                                </div>
                            </div>
                        </div>
                    ) : activeTab === 'flashcards' && flashcards.length > 0 ? (
                        /* 3. FLASHCARDS MODE */
                        <div className="mx-auto max-w-2xl py-4">
                            <div className="flex items-center justify-between text-xs font-semibold text-[#73736C] pb-3">
                                <span>Card {activeCardIndex + 1} of {flashcards.length}</span>
                                <span>Click card to reveal answer</span>
                            </div>

                            {/* Flip Card */}
                            <div
                                onClick={() => setIsFlipped(!isFlipped)}
                                className={`cursor-pointer min-h-[260px] rounded-3xl border-2 p-8 flex flex-col justify-between transition-all duration-300 shadow-md ${
                                    isFlipped
                                        ? 'border-[#AD5266] bg-[#FBF5F7]'
                                        : 'border-[#D8DDD5] bg-[#FFFFFF] hover:border-[#AD5266]/50'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#AD5266]">
                                        {isFlipped ? 'Answer / Explanation' : 'Question / Concept'}
                                    </span>
                                    <span className="text-xs text-[#73736C]">
                                        {isFlipped ? 'Flip back' : 'Click to reveal'}
                                    </span>
                                </div>

                                <div className="my-6">
                                    <p
                                        className="text-lg font-bold text-[#30302D] leading-relaxed"
                                        style={{ fontFamily: '"Manrope", sans-serif' }}
                                    >
                                        {isFlipped
                                            ? flashcards[activeCardIndex].answer
                                            : flashcards[activeCardIndex].question}
                                    </p>
                                </div>

                                <div className="text-[11px] text-[#73736C]">
                                    Cadence Flashcard Trainer
                                </div>
                            </div>

                            {/* Card controls */}
                            <div className="mt-6 flex items-center justify-between">
                                <button
                                    type="button"
                                    disabled={activeCardIndex === 0}
                                    onClick={() => {
                                        setIsFlipped(false);
                                        setActiveCardIndex((i) => Math.max(0, i - 1));
                                    }}
                                    className="rounded-full border border-[#D8DDD5] bg-[#FFFFFF] px-5 py-2 text-xs font-semibold text-[#30302D] hover:bg-[#F7F7F2] disabled:opacity-40"
                                >
                                    ← Previous
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsFlipped(!isFlipped)}
                                    className="rounded-full bg-[#F0F0E9] px-4 py-2 text-xs font-semibold text-[#762F50] hover:bg-[#EAEAE4]"
                                >
                                    Flip Card
                                </button>
                                <button
                                    type="button"
                                    disabled={activeCardIndex === flashcards.length - 1}
                                    onClick={() => {
                                        setIsFlipped(false);
                                        setActiveCardIndex((i) => Math.min(flashcards.length - 1, i + 1));
                                    }}
                                    className="rounded-full bg-[#AD5266] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#974356] disabled:opacity-40"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* 4. STUDY GUIDE READING MODE */
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                            {/* Sticky Table of Contents Sidebar */}
                            {headings.length > 2 && (
                                <div className="hidden lg:block lg:col-span-1">
                                    <div className="sticky top-20 rounded-2xl border border-[#D8DDD5] bg-[#FFFFFF] p-5 shadow-sm">
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#73736C]">
                                            On this page
                                        </span>
                                        <nav className="mt-3 space-y-1.5 text-xs">
                                            {headings.map((h, i) => (
                                                <a
                                                    key={i}
                                                    href={`#${h.id}`}
                                                    className={`block truncate text-[#73736C] hover:text-[#AD5266] transition-colors ${
                                                        h.level === 3 ? 'pl-3 text-[11px]' : 'font-semibold text-[#30302D]'
                                                    }`}
                                                >
                                                    {h.text}
                                                </a>
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            )}

                            {/* Main Study Guide Body */}
                            <div className={`${headings.length > 2 ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
                                <div className="rounded-3xl border border-[#D8DDD5] bg-[#FFFFFF] p-6 shadow-sm sm:p-10">
                                    <article className="cadence-study-content max-w-none">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkMath]}
                                            rehypePlugins={[rehypeKatex]}
                                            components={{
                                                h1: ({ node, children, ...props }) => {
                                                    const text = String(children);
                                                    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                                                    return (
                                                        <h1
                                                            id={id}
                                                            className="mt-8 mb-4 border-b border-[#F0F0E9] pb-3 text-2xl font-bold tracking-tight text-[#30302D] sm:text-3xl first:mt-0"
                                                            style={{ fontFamily: '"Manrope", sans-serif' }}
                                                            {...props}
                                                        >
                                                            {children}
                                                        </h1>
                                                    );
                                                },
                                                h2: ({ node, children, ...props }) => {
                                                    const text = String(children);
                                                    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                                                    return (
                                                        <h2
                                                            id={id}
                                                            className="mt-8 mb-3 text-xl font-bold tracking-tight text-[#30302D] sm:text-2xl"
                                                            style={{ fontFamily: '"Manrope", sans-serif' }}
                                                            {...props}
                                                        >
                                                            {children}
                                                        </h2>
                                                    );
                                                },
                                                h3: ({ node, children, ...props }) => {
                                                    const text = String(children);
                                                    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                                                    return (
                                                        <h3
                                                            id={id}
                                                            className="mt-6 mb-2 text-base font-bold text-[#762F50]"
                                                            style={{ fontFamily: '"Manrope", sans-serif' }}
                                                            {...props}
                                                        >
                                                            {children}
                                                        </h3>
                                                    );
                                                },
                                                p: ({ node, children, ...props }) => (
                                                    <p className="mt-3 mb-3 text-sm leading-relaxed text-[#30302D]" {...props}>
                                                        {children}
                                                    </p>
                                                ),
                                                ul: ({ node, children, ...props }) => (
                                                    <ul className="my-3 space-y-1.5 pl-5 list-disc marker:text-[#AD5266] text-sm text-[#30302D]" {...props}>
                                                        {children}
                                                    </ul>
                                                ),
                                                ol: ({ node, children, ...props }) => (
                                                    <ol className="my-3 space-y-1.5 pl-5 list-decimal marker:text-[#762F50] marker:font-bold text-sm text-[#30302D]" {...props}>
                                                        {children}
                                                    </ol>
                                                ),
                                                li: ({ node, children, ...props }) => (
                                                    <li className="leading-relaxed" {...props}>
                                                        {children}
                                                    </li>
                                                ),
                                                blockquote: ({ node, children, ...props }) => (
                                                    <blockquote className="my-4 rounded-2xl border-l-4 border-[#AD5266] bg-[#FDF8FA] p-4 text-sm italic text-[#762F50]" {...props}>
                                                        {children}
                                                    </blockquote>
                                                ),
                                                code: ({ node, inline, children, ...props }) => {
                                                    if (inline) {
                                                        return (
                                                            <code className="rounded-md bg-[#F0F0E9] px-1.5 py-0.5 font-mono text-xs font-semibold text-[#762F50]" {...props}>
                                                                {children}
                                                            </code>
                                                        );
                                                    }
                                                    return (
                                                        <pre className="my-4 overflow-x-auto rounded-2xl bg-[#30302D] p-4 font-mono text-xs text-white">
                                                            <code {...props}>{children}</code>
                                                        </pre>
                                                    );
                                                },
                                                table: ({ node, children, ...props }) => (
                                                    <div className="my-4 overflow-x-auto rounded-2xl border border-[#D8DDD5]">
                                                        <table className="min-w-full divide-y divide-[#D8DDD5] text-xs text-[#30302D]" {...props}>
                                                            {children}
                                                        </table>
                                                    </div>
                                                ),
                                                th: ({ node, children, ...props }) => (
                                                    <th className="bg-[#F0F0E9] px-4 py-2.5 text-left font-bold text-[#762F50]" {...props}>
                                                        {children}
                                                    </th>
                                                ),
                                                td: ({ node, children, ...props }) => (
                                                    <td className="px-4 py-2 border-b border-[#F0F0E9]" {...props}>
                                                        {children}
                                                    </td>
                                                ),
                                            }}
                                        >
                                            {outputContent}
                                        </ReactMarkdown>
                                    </article>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
