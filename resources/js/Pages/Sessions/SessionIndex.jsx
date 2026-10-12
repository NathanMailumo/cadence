import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function SessionIndex({ sessions = [] }) {
    return (
        <AuthenticatedLayout>
            <Head title="Cadence - Revision Packs" />

            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                {/* PAGE HEADER */}
                <div className="flex flex-col gap-4 border-b border-[#D8DDD5] pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#AD5266]">
                            Study Hub
                        </span>
                        <h1
                            className="mt-2 text-2xl font-bold tracking-tight text-[#30302D] sm:text-3xl"
                            style={{ fontFamily: '"Manrope", sans-serif' }}
                        >
                            Revision Packs
                        </h1>
                        <p className="mt-1 text-xs text-[#73736C]">
                            Your generated AI study packs and revision
                            materials.
                        </p>
                    </div>

                    <Link
                        href={
                            typeof route === 'function'
                                ? route('sessions.create')
                                : '/sessions/create'
                        }
                        className="rounded-full bg-[#AD5266] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#974356] active:scale-95"
                    >
                        + New Revision Pack
                    </Link>
                </div>

                {/* SESSIONS LIST */}
                <div className="mt-8">
                    {sessions.length === 0 ? (
                        <div className="rounded-3xl border border-[#D8DDD5] bg-[#FFFFFF] p-8 text-center sm:p-12">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0F0E9] text-xl text-[#AD5266]">
                                AI
                            </div>
                            <h3
                                className="mt-4 text-lg font-bold text-[#30302D]"
                                style={{ fontFamily: '"Manrope", sans-serif' }}
                            >
                                No revision packs yet
                            </h3>
                            <p className="mx-auto mt-1 max-w-sm text-xs text-[#73736C]">
                                Generate your first AI revision pack to turn
                                course topics into summaries, flashcards, and
                                practice questions.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href={
                                        typeof route === 'function'
                                            ? route('sessions.create')
                                            : '/sessions/create'
                                    }
                                    className="rounded-full bg-[#AD5266] px-5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#974356]"
                                >
                                    Create a Revision Pack
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {sessions.map((session) => (
                                <Link
                                    key={session.id}
                                    href={
                                        typeof route === 'function'
                                            ? route('sessions.show', session.id)
                                            : `/session/${session.id}`
                                    }
                                    className="group flex flex-col justify-between rounded-2xl border-2 border-[#AD5266]/30 bg-[#FDF8FA] p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-[#AD5266] hover:shadow-md"
                                >
                                    <div>
                                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#AD5266]">
                                            <span className="flex items-center gap-1.5">
                                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#AD5266] text-[9px] text-white">
                                                    AI
                                                </span>
                                                {session.course_code ||
                                                    'REVISION PACK'}
                                            </span>
                                            <span className="rounded-full bg-[#AD5266]/10 px-2 py-0.5 text-[10px] font-bold text-[#762F50]">
                                                AI
                                            </span>
                                        </div>
                                        <h3
                                            className="mt-3 text-base font-bold text-[#30302D] transition-colors group-hover:text-[#AD5266]"
                                            style={{
                                                fontFamily:
                                                    '"Manrope", sans-serif',
                                            }}
                                        >
                                            {session.course_title}
                                        </h3>
                                        {session.focus_prompt && (
                                            <p className="mt-1 line-clamp-2 text-xs text-[#73736C]">
                                                Focus: {session.focus_prompt}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-6 flex items-center justify-between border-t border-[#AD5266]/15 pt-3 text-[11px] font-bold text-[#AD5266]">
                                        <span>Open revision pack</span>
                                        <span className="transition-transform group-hover:translate-x-1">
                                            →
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
