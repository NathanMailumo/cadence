import React, { useEffect, useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CadenceLoader from '@/Components/CadenceLoader';
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
    const [activeTab, setActiveTab] = useState('notes');
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
                const id = text
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-');
                extracted.push({
                    level: match[1].length,
                    text,
                    id,
                });
            }
        }
        return extracted;
    }, [outputContent]);

    const flashcards = useMemo(() => {
        if (!outputContent) return [];

        const cards = [];
        for (const line of outputContent.split('\n')) {
            const colonMatch = line.match(/^[-*]\s+\*\*([^*]+)\*\*:\s*(.+)$/);
            if (colonMatch) {
                cards.push({
                    question: colonMatch[1].trim(),
                    answer: colonMatch[2].trim(),
                });
                continue;
            }

            const qaMatch = line.match(
                /^(?:Q|Question):\s*(.+?)(?:\s*(?:A|Answer):\s*(.+))?$/i,
            );
            if (qaMatch?.[2]) {
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
        ? typeof route === 'function'
            ? route('resources.show', session.resource_id)
            : `/resources/${session.resource_id}`
        : typeof route === 'function'
          ? route('dashboard')
          : '/dashboard';

    const readingTime = useMemo(() => {
        const words = outputContent.split(/\s+/).length;
        const minutes = Math.ceil(words / 200);
        return `${minutes} min read`;
    }, [outputContent]);

    const showFailedState = generationFailed || outputContent === FAILED_OUTPUT;

    return (
        <AuthenticatedLayout>
            {/* <Head
                title={`Cadence - ${session?.course_title || 'Revision Pack'}`}
            /> */}
            <Head>
                <title>{`Cadence - ${session?.course_title || 'Revision Pack'}`}</title>
                <link
                    rel="icon"
                    type="image/svg+xml"
                    href="/images/cadence_logo.svg"
                />
                {/* Or use href="/logo.png" if your file is a PNG */}
            </Head>

            <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                {/* BREADCRUMB & BACK NAVIGATION */}
                <div className="flex items-center justify-between border-b border-[#D8DDD5] pb-5">
                    <div className="flex items-center gap-2 text-xs text-[#73736C]">
                        <Link
                            href={spaceUrl}
                            className="rounded-full border border-[#D8DDD5] bg-[#FFFFFF] px-3.5 py-1.5 font-semibold text-[#30302D] shadow-sm transition-colors hover:bg-[#F7F7F2] hover:text-[#AD5266]"
                        >
                            ← Back to {spaceName} space
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
                                className="rounded-full border border-[#D8DDD5] bg-[#FFFFFF] px-3.5 py-1.5 text-xs font-semibold text-[#30302D] shadow-sm transition-colors hover:bg-[#F7F7F2]"
                            >
                                {copied ? '✓ Copied' : 'Copy markdown'}
                            </button>
                            <button
                                type="button"
                                onClick={handlePrint}
                                className="rounded-full border border-[#D8DDD5] bg-[#FFFFFF] px-3.5 py-1.5 text-xs font-semibold text-[#30302D] shadow-sm transition-colors hover:bg-[#F7F7F2]"
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
                                    <strong className="text-[#30302D]">
                                        Focus area:
                                    </strong>{' '}
                                    {session.focus_prompt}
                                </p>
                            )}
                        </div>

                        {/* Metadata pills */}
                        <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                            <span className="rounded-xl bg-[#F0F0E9] px-3 py-1 text-xs font-semibold text-[#73736C]">
                                {readingTime}
                            </span>
                        </div>
                    </div>

                    {hasOutput && flashcards.length > 0 && (
                        <div className="mt-6 flex w-full justify-end">
                            <div className="flex w-fit rounded-full bg-[#F0F0E9] p-1 text-xs font-semibold">
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
                        </div>
                    )}
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="mt-8">
                    {/* 1. FAILED STATE */}
                    {showFailedState ? (
                        <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-12 text-center">
                            <span className="text-3xl">⚠️</span>
                            <h2
                                className="mt-3 text-lg font-bold text-rose-900"
                                style={{ fontFamily: '"Manrope", sans-serif' }}
                            >
                                Generation could not be completed
                            </h2>
                            <p className="mx-auto mt-1 max-w-md text-xs text-rose-700">
                                The AI request timed out or did not return
                                structured output. You can retry generating a
                                new revision pack from the workspace.
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
                            <CadenceLoader
                                size="lg"
                                label="Generating your revision pack"
                            />

                            <h2
                                className="mt-6 text-xl font-bold text-[#30302D]"
                                style={{ fontFamily: '"Manrope", sans-serif' }}
                            >
                                Compiling your revision pack...
                            </h2>
                            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[#73736C]">
                                Cadence is synthesizing key course concepts,
                                explanations, definitions, and practice
                                questions. This usually takes around 20–30
                                seconds.
                            </p>

                            <div className="mx-auto mt-8 max-w-sm space-y-2">
                                <div className="flex items-center justify-between text-[11px] font-semibold text-[#73736C]">
                                    <span>Synthesizing notes</span>
                                    <span className="animate-pulse text-[#AD5266]">
                                        In progress...
                                    </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-[#F0F0E9]">
                                    <div className="h-full w-2/3 animate-pulse rounded-full bg-[#AD5266]" />
                                </div>
                            </div>
                        </div>
                    ) : activeTab === 'flashcards' && flashcards.length > 0 ? (
                        <div className="mx-auto w-full max-w-3xl py-4">
                            <div className="flex items-center justify-between px-1 pb-3 text-xs font-semibold text-[#73736C]">
                                <span>
                                    Card {activeCardIndex + 1} of{' '}
                                    {flashcards.length}
                                </span>
                                <span>Click card to reveal answer</span>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsFlipped((value) => !value)}
                                className={`flex min-h-[280px] w-full cursor-pointer flex-col justify-between rounded-3xl border-2 p-8 text-left shadow-md transition-all duration-300 sm:p-10 ${
                                    isFlipped
                                        ? 'border-[#AD5266] bg-[#FBF5F7]'
                                        : 'border-[#D8DDD5] bg-[#FFFFFF] hover:border-[#AD5266]/50'
                                }`}
                            >
                                <div className="flex w-full items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#AD5266]">
                                        {isFlipped
                                            ? 'Answer / Explanation'
                                            : 'Question / Concept'}
                                    </span>
                                    <span className="text-xs text-[#73736C]">
                                        {isFlipped
                                            ? 'Flip back'
                                            : 'Click to reveal'}
                                    </span>
                                </div>

                                <div className="my-6 min-w-0 text-lg font-bold leading-relaxed text-[#30302D] [&_.katex-display]:my-4 [&_.katex-display]:overflow-x-auto [&_.katex-display]:py-1 [&_.katex]:text-[1em]">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                        components={{
                                            p: ({ children, ...props }) => (
                                                <p
                                                    className="mb-3 last:mb-0"
                                                    style={{
                                                        fontFamily:
                                                            '"Manrope", sans-serif',
                                                    }}
                                                    {...props}
                                                >
                                                    {children}
                                                </p>
                                            ),
                                        }}
                                    >
                                        {isFlipped
                                            ? flashcards[activeCardIndex].answer
                                            : flashcards[activeCardIndex]
                                                  .question}
                                    </ReactMarkdown>
                                </div>

                                <span className="text-[11px] text-[#73736C]">
                                    Cadence Flashcard Trainer
                                </span>
                            </button>

                            <div className="mt-6 flex items-center justify-between px-1">
                                <button
                                    type="button"
                                    disabled={activeCardIndex === 0}
                                    onClick={() => {
                                        setIsFlipped(false);
                                        setActiveCardIndex((index) =>
                                            Math.max(0, index - 1),
                                        );
                                    }}
                                    className="rounded-full border border-[#D8DDD5] bg-[#FFFFFF] px-5 py-2 text-xs font-semibold text-[#30302D] hover:bg-[#F7F7F2] disabled:opacity-40"
                                >
                                    ← Previous
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsFlipped((value) => !value)
                                    }
                                    className="rounded-full bg-[#F0F0E9] px-4 py-2 text-xs font-semibold text-[#762F50] hover:bg-[#EAEAE4]"
                                >
                                    Flip Card
                                </button>
                                <button
                                    type="button"
                                    disabled={
                                        activeCardIndex ===
                                        flashcards.length - 1
                                    }
                                    onClick={() => {
                                        setIsFlipped(false);
                                        setActiveCardIndex((index) =>
                                            Math.min(
                                                flashcards.length - 1,
                                                index + 1,
                                            ),
                                        );
                                    }}
                                    className="rounded-full bg-[#AD5266] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#974356] disabled:opacity-40"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* 3. STUDY GUIDE READING MODE */
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                            {/* Sticky Table of Contents Sidebar */}
                            {headings.length > 2 && (
                                <div className="hidden lg:col-span-1 lg:block">
                                    <div className="sticky top-20 rounded-2xl border border-[#D8DDD5] bg-[#FFFFFF] p-5 shadow-sm">
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#73736C]">
                                            On this page
                                        </span>
                                        <nav className="mt-3 space-y-1.5 text-xs">
                                            {headings.map((h, i) => (
                                                <a
                                                    key={i}
                                                    href={`#${h.id}`}
                                                    className={`block truncate text-[#73736C] transition-colors hover:text-[#AD5266] ${
                                                        h.level === 3
                                                            ? 'pl-3 text-[11px]'
                                                            : 'font-semibold text-[#30302D]'
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
                            <div
                                className={`${headings.length > 2 ? 'lg:col-span-3' : 'lg:col-span-4'}`}
                            >
                                <div className="rounded-3xl border border-[#D8DDD5] bg-[#FFFFFF] p-6 shadow-sm sm:p-10">
                                    <article className="cadence-study-content max-w-none">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkMath]}
                                            rehypePlugins={[rehypeKatex]}
                                            components={{
                                                h1: ({
                                                    children,
                                                    ...props
                                                }) => {
                                                    const text =
                                                        String(children);
                                                    const id = text
                                                        .toLowerCase()
                                                        .replace(
                                                            /[^\w\s-]/g,
                                                            '',
                                                        )
                                                        .replace(/\s+/g, '-');
                                                    return (
                                                        <h1
                                                            id={id}
                                                            className="mb-4 mt-8 border-b border-[#F0F0E9] pb-3 text-2xl font-bold tracking-tight text-[#30302D] first:mt-0 sm:text-3xl"
                                                            style={{
                                                                fontFamily:
                                                                    '"Manrope", sans-serif',
                                                            }}
                                                            {...props}
                                                        >
                                                            {children}
                                                        </h1>
                                                    );
                                                },
                                                h2: ({
                                                    children,
                                                    ...props
                                                }) => {
                                                    const text =
                                                        String(children);
                                                    const id = text
                                                        .toLowerCase()
                                                        .replace(
                                                            /[^\w\s-]/g,
                                                            '',
                                                        )
                                                        .replace(/\s+/g, '-');
                                                    return (
                                                        <h2
                                                            id={id}
                                                            className="mb-3 mt-8 text-xl font-bold tracking-tight text-[#30302D] sm:text-2xl"
                                                            style={{
                                                                fontFamily:
                                                                    '"Manrope", sans-serif',
                                                            }}
                                                            {...props}
                                                        >
                                                            {children}
                                                        </h2>
                                                    );
                                                },
                                                h3: ({
                                                    children,
                                                    ...props
                                                }) => {
                                                    const text =
                                                        String(children);
                                                    const id = text
                                                        .toLowerCase()
                                                        .replace(
                                                            /[^\w\s-]/g,
                                                            '',
                                                        )
                                                        .replace(/\s+/g, '-');
                                                    return (
                                                        <h3
                                                            id={id}
                                                            className="mb-2 mt-6 text-base font-bold text-[#762F50]"
                                                            style={{
                                                                fontFamily:
                                                                    '"Manrope", sans-serif',
                                                            }}
                                                            {...props}
                                                        >
                                                            {children}
                                                        </h3>
                                                    );
                                                },
                                                p: ({ children, ...props }) => (
                                                    <p
                                                        className="mb-3 mt-3 text-sm leading-relaxed text-[#30302D]"
                                                        {...props}
                                                    >
                                                        {children}
                                                    </p>
                                                ),
                                                ul: ({
                                                    children,
                                                    ...props
                                                }) => (
                                                    <ul
                                                        className="my-3 list-disc space-y-1.5 pl-5 text-sm text-[#30302D] marker:text-[#AD5266]"
                                                        {...props}
                                                    >
                                                        {children}
                                                    </ul>
                                                ),
                                                ol: ({
                                                    children,
                                                    ...props
                                                }) => (
                                                    <ol
                                                        className="my-3 list-decimal space-y-1.5 pl-5 text-sm text-[#30302D] marker:font-bold marker:text-[#762F50]"
                                                        {...props}
                                                    >
                                                        {children}
                                                    </ol>
                                                ),
                                                li: ({
                                                    children,
                                                    ...props
                                                }) => (
                                                    <li
                                                        className="leading-relaxed"
                                                        {...props}
                                                    >
                                                        {children}
                                                    </li>
                                                ),
                                                blockquote: ({
                                                    children,
                                                    ...props
                                                }) => (
                                                    <blockquote
                                                        className="my-4 rounded-2xl border-l-4 border-[#AD5266] bg-[#FDF8FA] p-4 text-sm italic text-[#762F50]"
                                                        {...props}
                                                    >
                                                        {children}
                                                    </blockquote>
                                                ),
                                                code: ({
                                                    inline,
                                                    children,
                                                    ...props
                                                }) => {
                                                    if (inline) {
                                                        return (
                                                            <code
                                                                className="rounded-md bg-[#F0F0E9] px-1.5 py-0.5 font-mono text-xs font-semibold text-[#762F50]"
                                                                {...props}
                                                            >
                                                                {children}
                                                            </code>
                                                        );
                                                    }
                                                    return (
                                                        <pre className="my-4 overflow-x-auto rounded-2xl bg-[#30302D] p-4 font-mono text-xs text-white">
                                                            <code {...props}>
                                                                {children}
                                                            </code>
                                                        </pre>
                                                    );
                                                },
                                                table: ({
                                                    children,
                                                    ...props
                                                }) => (
                                                    <div className="my-4 overflow-x-auto rounded-2xl border border-[#D8DDD5]">
                                                        <table
                                                            className="min-w-full divide-y divide-[#D8DDD5] text-xs text-[#30302D]"
                                                            {...props}
                                                        >
                                                            {children}
                                                        </table>
                                                    </div>
                                                ),
                                                th: ({
                                                    children,
                                                    ...props
                                                }) => (
                                                    <th
                                                        className="bg-[#F0F0E9] px-4 py-2.5 text-left font-bold text-[#762F50]"
                                                        {...props}
                                                    >
                                                        {children}
                                                    </th>
                                                ),
                                                td: ({
                                                    children,
                                                    ...props
                                                }) => (
                                                    <td
                                                        className="border-b border-[#F0F0E9] px-4 py-2"
                                                        {...props}
                                                    >
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
