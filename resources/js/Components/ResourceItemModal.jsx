import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import {
    BrainCircuit,
    FileText,
    Link2,
    MessageSquare,
    Plus,
    Upload,
    Video,
    X,
} from 'lucide-react';

const choices = [
    {
        type: 'youtube',
        label: 'YouTube Video',
        description: 'Add educational videos from YouTube.',
        icon: Video,
    },
    {
        type: 'link',
        label: 'Website Link',
        description: 'Save useful external websites and articles.',
        icon: Link2,
    },
    {
        type: 'note',
        label: 'Sticky Note',
        description: 'Write and save quick notes.',
        icon: MessageSquare,
    },
    {
        type: 'past_questions',
        label: 'Past Questions',
        description: 'Add past exam papers and practice questions.',
        icon: FileText,
    },
    {
        type: 'revision_pack',
        label: 'Revision Pack',
        description:
            'Generate an AI-powered revision pack for a course or topic.',
        icon: BrainCircuit,
    },
];

function getBackendType(type) {
    if (type === 'youtube') return 'video';
    if (type === 'past_questions') return 'pq';
    return type;
}

function getModalForType(type) {
    if (type === 'youtube') return 'youtube';
    if (type === 'past_questions') return 'past_questions';
    if (type === 'revision_pack') return 'revision_pack';
    return 'selection_grid';
}

export default function ResourceItemModal({
    isOpen,
    onClose,
    resource,
    defaultType = null,
}) {
    const [activeModal, setActiveModal] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [youtubeMode, setYoutubeMode] = useState('search');
    const [youtubeQuery, setYoutubeQuery] = useState('');
    const [youtubeResults, setYoutubeResults] = useState([]);
    const [youtubeLoading, setYoutubeLoading] = useState(false);
    const [youtubeError, setYoutubeError] = useState('');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const itemForm = useForm({
        resource_id: resource?.id || '',
        type: 'link',
        title: '',
        url: '',
        content: '',
        description: '',
        file: null,
    });

    const revisionForm = useForm({
        course_title: resource?.course_name || '',
        course_code: resource?.course_code || '',
        input_option: 'text',
        focus_prompt: '',
        resource_id: resource?.id || '',
    });

    useEffect(() => {
        if (!isOpen) return;

        const type =
            defaultType && defaultType !== 'choose' ? defaultType : null;

        setSelectedType(type);
        setActiveModal(type ? getModalForType(type) : 'selection_grid');
        itemForm.setData({
            resource_id: resource?.id || '',
            type: getBackendType(type) || 'link',
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
        setYoutubeMode('search');
        setYoutubeQuery('');
        setYoutubeResults([]);
        setYoutubeLoading(false);
        setYoutubeError('');
        setYoutubeUrl('');
        setSelectedVideoUrl('');
        setSelectedFile(null);
        // useForm objects are intentionally excluded to avoid resetting a view
        // whenever a controlled input updates.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultType, isOpen, resource]);

    if (!isOpen) return null;

    const currentModal = activeModal || 'selection_grid';

    const handleClose = () => {
        itemForm.reset();
        revisionForm.reset();
        setActiveModal(null);
        setSelectedType(null);
        setYoutubeMode('search');
        setYoutubeQuery('');
        setYoutubeResults([]);
        setYoutubeLoading(false);
        setYoutubeError('');
        setYoutubeUrl('');
        setSelectedVideoUrl('');
        setSelectedFile(null);
        onClose();
    };

    const selectType = (type) => {
        setSelectedType(type);
        setActiveModal(getModalForType(type));

        if (['link', 'note', 'youtube', 'past_questions'].includes(type)) {
            itemForm.setData('type', getBackendType(type));
        }
        if (type !== 'youtube') {
            setYoutubeUrl('');
        }
        if (type !== 'past_questions') {
            setSelectedFile(null);
        }
    };

    const handleYoutubeSearch = async (event) => {
        event.preventDefault();
        if (!youtubeQuery.trim()) return;

        setYoutubeLoading(true);
        setYoutubeError('');
        try {
            const response = await axios.get('/youtube/search', {
                params: { q: youtubeQuery.trim() },
            });
            setYoutubeResults(response.data);
            if (!response.data.length) {
                setYoutubeError('No videos found. Try pasting a direct URL.');
            }
        } catch {
            setYoutubeResults([]);
            setYoutubeError(
                'Search is unavailable. You can paste a direct YouTube link.',
            );
        } finally {
            setYoutubeLoading(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (activeModal === 'revision_pack') {
            revisionForm.post(
                typeof route === 'function'
                    ? route('sessions.store')
                    : '/sessions/create',
                { onSuccess: handleClose },
            );
            return;
        }

        itemForm.setData({
            ...itemForm.data,
            type: getBackendType(selectedType),
            ...(isYoutube
                ? {
                      url:
                          youtubeMode === 'search'
                              ? selectedVideoUrl
                              : youtubeUrl,
                  }
                : {}),
        });
        itemForm.post(
            typeof route === 'function'
                ? route('resource-items.store')
                : '/resource-items',
            {
                forceFormData: activeModal === 'past_questions',
                onSuccess: handleClose,
            },
        );
    };

    const spaceName = resource?.course_name || 'space';
    const isSelectionGrid = currentModal === 'selection_grid';
    const isInlineItem = selectedType === 'link' || selectedType === 'note';
    const isRevision = currentModal === 'revision_pack';
    const isPastQuestions = currentModal === 'past_questions';
    const isYoutube = currentModal === 'youtube';
    const isProcessing = isRevision
        ? revisionForm.processing
        : itemForm.processing;
    const youtubeSubmissionUrl =
        youtubeMode === 'search' ? selectedVideoUrl : youtubeUrl;
    const submitDisabled =
        isProcessing ||
        (isPastQuestions && (!selectedFile || !itemForm.data.title.trim())) ||
        (isYoutube && !youtubeSubmissionUrl.trim()) ||
        (isRevision && !revisionForm.data.course_title.trim()) ||
        (currentModal === 'selection_grid' &&
            isInlineItem &&
            (!itemForm.data.title.trim() ||
                (selectedType === 'link' && !itemForm.data.url.trim()) ||
                (selectedType === 'note' && !itemForm.data.content.trim())));

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) handleClose();
            }}
        >
            <form
                method="POST"
                encType="multipart/form-data"
                action={
                    typeof route === 'function'
                        ? route('resource-items.store')
                        : '/resource-items'
                }
                onSubmit={handleSubmit}
                className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white px-6 py-5 shadow-2xl sm:px-7"
            >
                <input
                    type="hidden"
                    name="resource_id"
                    value={resource?.id || ''}
                />
                <input
                    type="hidden"
                    name="space_id"
                    value={resource?.id || ''}
                />
                <input
                    type="hidden"
                    name="type"
                    value={getBackendType(selectedType) || ''}
                />
                {isYoutube && (
                    <input
                        type="hidden"
                        name="title"
                        value={itemForm.data.title || 'YouTube Video'}
                    />
                )}
                {isYoutube && youtubeMode === 'search' && (
                    <input type="hidden" name="url" value={selectedVideoUrl} />
                )}

                <ModalHeader
                    activeModal={currentModal}
                    spaceName={spaceName}
                    onClose={handleClose}
                />

                {isSelectionGrid && (
                    <>
                        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                            {choices.map(
                                ({ type, label, description, icon: Icon }) => {
                                    const isSelected = selectedType === type;
                                    return (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => selectType(type)}
                                            className={`min-h-[116px] rounded-xl border p-3 text-left transition-colors ${
                                                isSelected
                                                    ? 'border-[#702B4B] bg-[#FDF4F6]'
                                                    : 'border-[#E2E2DA] bg-[#F7F6F1] hover:border-[#C98A9A]'
                                            }`}
                                        >
                                            <span
                                                className={`flex h-7 w-7 items-center justify-center rounded-md ${
                                                    isSelected
                                                        ? 'bg-[#702B4B] text-white'
                                                        : 'bg-[#E9E9E1] text-[#AD5266]'
                                                }`}
                                            >
                                                <Icon
                                                    size={15}
                                                    strokeWidth={1.8}
                                                />
                                            </span>
                                            <span className="mt-4 block text-[11px] font-bold text-[#30302D]">
                                                {label}
                                            </span>
                                            <span className="mt-1 block text-[9px] leading-[1.35] text-[#73736C]">
                                                {description}
                                            </span>
                                        </button>
                                    );
                                },
                            )}
                        </div>

                        {isInlineItem && (
                            <div className="mt-4 border-t border-[#E8E7E0] pt-4">
                                {selectedType === 'link' && (
                                    <>
                                        <BottomHeading title="ADD WEBSITE LINK" />
                                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                            <Field label="Resource title">
                                                <input
                                                    name="title"
                                                    type="text"
                                                    required
                                                    placeholder="Give this resource a clear title"
                                                    value={itemForm.data.title}
                                                    onChange={(event) =>
                                                        itemForm.setData(
                                                            'title',
                                                            event.target.value,
                                                        )
                                                    }
                                                    className={inputClass}
                                                />
                                            </Field>
                                            <Field label="Link or details">
                                                <input
                                                    name="url"
                                                    type="url"
                                                    required
                                                    placeholder="Paste a URL or add a short description"
                                                    value={itemForm.data.url}
                                                    onChange={(event) =>
                                                        itemForm.setData(
                                                            'url',
                                                            event.target.value,
                                                        )
                                                    }
                                                    className={inputClass}
                                                />
                                            </Field>
                                        </div>
                                    </>
                                )}
                                {selectedType === 'note' && (
                                    <>
                                        <BottomHeading title="ADD STICKY NOTE" />
                                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                            <Field label="Note title">
                                                <input
                                                    name="title"
                                                    type="text"
                                                    required
                                                    placeholder="e.g. Key idea to remember"
                                                    value={itemForm.data.title}
                                                    onChange={(event) =>
                                                        itemForm.setData(
                                                            'title',
                                                            event.target.value,
                                                        )
                                                    }
                                                    className={inputClass}
                                                />
                                            </Field>
                                            <Field label="Your note">
                                                <textarea
                                                    name="content"
                                                    required
                                                    rows="1"
                                                    placeholder="Write a short note"
                                                    value={
                                                        itemForm.data.content
                                                    }
                                                    onChange={(event) =>
                                                        itemForm.setData(
                                                            'content',
                                                            event.target.value,
                                                        )
                                                    }
                                                    className={`${inputClass} resize-none`}
                                                />
                                            </Field>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </>
                )}

                {isYoutube && (
                    <YoutubeView
                        mode={youtubeMode}
                        setMode={setYoutubeMode}
                        query={youtubeQuery}
                        setQuery={setYoutubeQuery}
                        results={youtubeResults}
                        url={youtubeUrl}
                        setUrl={(url) => {
                            setYoutubeUrl(url);
                            itemForm.setData('url', url);
                        }}
                        loading={youtubeLoading}
                        error={youtubeError}
                        onSearch={handleYoutubeSearch}
                        onSelect={(video) => {
                            itemForm.setData({
                                ...itemForm.data,
                                type: 'video',
                                title: video.title,
                                url: video.url,
                                description: `Channel: ${video.uploader}`,
                            });
                            setSelectedVideoUrl(video.url);
                        }}
                        selectedVideoUrl={selectedVideoUrl}
                    />
                )}

                {activeModal === 'past_questions' && (
                    <PastQuestionsView
                        title={itemForm.data.title}
                        setTitle={(title) => itemForm.setData('title', title)}
                        file={selectedFile}
                        setFile={(file) => {
                            setSelectedFile(file);
                            itemForm.setData('file', file);
                        }}
                    />
                )}

                {isRevision && (
                    <RevisionPackView
                        spaceName={spaceName}
                        courseName={revisionForm.data.course_title}
                        setCourseName={(value) =>
                            revisionForm.setData('course_title', value)
                        }
                        topics={revisionForm.data.focus_prompt}
                        setTopics={(value) =>
                            revisionForm.setData('focus_prompt', value)
                        }
                    />
                )}

                <div className="mt-4 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-lg border border-[#E2E2DA] px-4 py-2 text-xs font-semibold text-[#30302D] hover:bg-[#F7F6F1]"
                    >
                        Cancel
                    </button>
                    {!isSelectionGrid || isInlineItem ? (
                        <button
                            type="submit"
                            disabled={submitDisabled}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium text-white shadow-sm transition-colors ${
                                submitDisabled
                                    ? 'cursor-not-allowed bg-[#C98A9A]'
                                    : 'cursor-pointer bg-[#702B4B] hover:bg-[#59223C]'
                            }`}
                        >
                            <Plus size={13} />
                            {isProcessing
                                ? 'Adding...'
                                : isYoutube
                                  ? 'Add video'
                                  : isPastQuestions
                                    ? 'Upload'
                                    : isRevision
                                      ? 'Generate and add to space'
                                      : 'Add resource'}
                        </button>
                    ) : null}
                </div>
            </form>
        </div>
    );
}

function ModalHeader({ activeModal, spaceName, onClose }) {
    const isGrid = activeModal === 'selection_grid';
    return (
        <div className="flex items-start justify-between">
            <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#AD5266]">
                    {isGrid ? `Add to ${spaceName}` : 'Add a resource'}
                </span>
                <h2 className="mt-2 text-base font-medium text-[#30302D]">
                    {isGrid
                        ? 'What would you like to add?'
                        : activeModal === 'youtube'
                          ? 'Add a YouTube video'
                          : activeModal === 'past_questions'
                            ? 'Upload past questions'
                            : 'Generate a revision pack'}
                </h2>
            </div>
            <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="text-[#73736C] transition-colors hover:text-[#30302D]"
            >
                <X size={18} strokeWidth={1.8} />
            </button>
        </div>
    );
}

function YoutubeView({
    mode,
    setMode,
    query,
    setQuery,
    results,
    url,
    setUrl,
    loading,
    error,
    onSearch,
    onSelect,
    selectedVideoUrl,
}) {
    return (
        <div className="mt-4 border-t border-[#E8E7E0] pt-4">
            <div className="flex rounded-full bg-[#F0F0E9] p-1 text-xs font-semibold">
                <button
                    type="button"
                    onClick={() => setMode('search')}
                    className={`flex-1 rounded-full py-1.5 ${
                        mode === 'search'
                            ? 'bg-white text-[#30302D] shadow-sm'
                            : 'text-[#73736C]'
                    }`}
                >
                    Search YouTube
                </button>
                <button
                    type="button"
                    onClick={() => setMode('direct')}
                    className={`flex-1 rounded-full py-1.5 ${
                        mode === 'direct'
                            ? 'bg-white text-[#30302D] shadow-sm'
                            : 'text-[#73736C]'
                    }`}
                >
                    Paste a YouTube URL
                </button>
            </div>
            {mode === 'search' ? (
                <div className="mt-3 space-y-3">
                    <div className="flex gap-2">
                        <input
                            type="search"
                            placeholder="Search for educational videos..."
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            className={inputClass}
                        />
                        <button
                            type="button"
                            onClick={onSearch}
                            disabled={loading || !query.trim()}
                            className={`rounded-lg px-4 text-xs font-medium text-white shadow-sm transition-colors ${
                                loading || !query.trim()
                                    ? 'cursor-not-allowed bg-[#C98A9A]'
                                    : 'cursor-pointer bg-[#702B4B] hover:bg-[#59223C]'
                            }`}
                        >
                            {loading ? '...' : 'Search'}
                        </button>
                    </div>
                    {error && <p className="text-xs text-rose-600">{error}</p>}
                    <div className="max-h-40 overflow-y-auto rounded-xl border border-[#E2E2DA] bg-[#F7F6F1] p-3">
                        {results.length ? (
                            <div className="space-y-2">
                                {results.map((video) => (
                                    <button
                                        key={video.id}
                                        type="button"
                                        onClick={() => onSelect(video)}
                                        className={`flex w-full items-center gap-2 rounded-lg border-2 p-2 text-left transition-colors ${
                                            selectedVideoUrl === video.url
                                                ? 'border-[#702B4B] bg-[#FDF4F6]'
                                                : 'border-transparent bg-white hover:bg-[#FDF4F6]'
                                        }`}
                                    >
                                        <img
                                            src={video.thumbnail}
                                            alt=""
                                            className="h-10 w-14 rounded object-cover"
                                        />
                                        <span className="truncate text-xs font-semibold text-[#30302D]">
                                            {video.title}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="py-5 text-center text-xs text-[#73736C]">
                                Search results will appear here
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="mt-3">
                    <Field label="YouTube video URL">
                        <input
                            name="url"
                            type="url"
                            required
                            placeholder="https://www.youtube.com/watch?v=..."
                            value={url}
                            onChange={(event) => setUrl(event.target.value)}
                            className={inputClass}
                        />
                    </Field>
                    <p className="mt-1.5 text-[10px] text-[#73736C]">
                        Supports standard YouTube, Shorts, embed, and youtu.be
                        links.
                    </p>
                </div>
            )}
        </div>
    );
}

function PastQuestionsView({ title, setTitle, file, setFile }) {
    return (
        <div className="mt-4 border-t border-[#E8E7E0] pt-4">
            <p className="text-xs text-[#73736C]">
                Add a past exam paper, practice question set, or another
                relevant academic document.
            </p>
            <div className="mt-3 space-y-3">
                <Field label="Title">
                    <input
                        name="title"
                        type="text"
                        required
                        placeholder="e.g. 2024 Midterm Exam Paper"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        className={inputClass}
                    />
                </Field>
                <label className="block cursor-pointer rounded-xl border-2 border-dashed border-[#E2E2DA] bg-[#F7F6F1] p-6 text-center text-xs text-[#73736C]">
                    <Upload className="mx-auto mb-2 text-[#AD5266]" size={22} />
                    <span className="font-semibold text-[#30302D]">
                        {file ? file.name : 'Choose a document to upload'}
                    </span>
                    <span className="mt-1 block text-[10px]">
                        PDF, DOCX, PNG, JPG, or WEBP · Maximum 2 MB per file
                    </span>
                    <input
                        name="file"
                        type="file"
                        required
                        accept=".pdf,.docx,.png,.jpg,.jpeg,.webp"
                        onChange={(event) =>
                            setFile(event.target.files?.[0] || null)
                        }
                        className="sr-only"
                    />
                </label>
            </div>
        </div>
    );
}

function RevisionPackView({
    spaceName,
    courseName,
    setCourseName,
    topics,
    setTopics,
}) {
    return (
        <div className="mt-4 border-t border-[#E8E7E0] pt-4">
            <p className="inline-flex rounded-full bg-[#FDF4F6] px-3 py-1.5 text-[10px] font-semibold text-[#702B4B]">
                This pack will be saved as a resource inside {spaceName}
            </p>
            <div className="mt-3 space-y-3">
                <Field label="Course name">
                    <input
                        name="course_name"
                        type="text"
                        required
                        placeholder="e.g. Introduction to Algorithms"
                        value={courseName}
                        onChange={(event) => setCourseName(event.target.value)}
                        className={inputClass}
                    />
                </Field>
                <Field label="Topics or curriculum details (Optional)">
                    <textarea
                        name="topics"
                        rows="2"
                        placeholder="What should this revision pack focus on?"
                        value={topics}
                        onChange={(event) => setTopics(event.target.value)}
                        className={`${inputClass} resize-none`}
                    />
                </Field>
            </div>
        </div>
    );
}

const inputClass =
    'w-full rounded-lg border border-transparent bg-[#F1F0EB] px-3 py-2.5 text-xs text-[#30302D] outline-none placeholder:text-[#9A9A91] focus:border-[#AD5266] focus:bg-white focus:ring-1 focus:ring-[#AD5266]';

function Field({ label, children }) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold text-[#30302D]">
                {label}
            </span>
            {children}
        </label>
    );
}

function BottomHeading({ title }) {
    return (
        <div className="flex items-end justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#AD5266]">
                {title}
            </span>
            <span className="text-[10px] text-[#73736C]">
                Complete the details below to create this resource card.
            </span>
        </div>
    );
}
