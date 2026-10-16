import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';

export default function InviteModal({
    isOpen,
    onClose,
    resourceId,
    spaceName = 'space',
    inviteLink,
}) {
    const [emailInput, setEmailInput] = useState('');
    const [emailTags, setEmailTags] = useState([]);
    const [validationError, setValidationError] = useState('');
    const [copied, setCopied] = useState(false);

    const { post, processing, errors, setData, reset, clearErrors } = useForm({
        email: '',
    });

    const handleClose = () => {
        reset();
        clearErrors();
        setEmailInput('');
        setEmailTags([]);
        setValidationError('');
        setCopied(false);
        onClose();
    };

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const addEmailTag = (rawEmail) => {
        const cleaned = rawEmail.trim().replace(/,$/, '');
        if (!cleaned) return;

        if (!isValidEmail(cleaned)) {
            setValidationError(`"${cleaned}" is not a valid email address.`);
            return;
        }

        if (emailTags.includes(cleaned)) {
            setValidationError(`"${cleaned}" has already been added.`);
            return;
        }

        setEmailTags((prevTags) => [...prevTags, cleaned]);
        setData('email', cleaned);
        setEmailInput('');
        setValidationError('');
    };

    const handleKeyDown = (e) => {
        if (['Enter', ',', ' '].includes(e.key)) {
            e.preventDefault();
            addEmailTag(emailInput);
        } else if (
            e.key === 'Backspace' &&
            !emailInput &&
            emailTags.length > 0
        ) {
            setEmailTags(emailTags.slice(0, -1));
        }
    };

    const handleBlur = () => {
        if (emailInput.trim()) {
            addEmailTag(emailInput);
        }
    };

    const removeTag = (indexToRemove) => {
        setEmailTags(emailTags.filter((_, idx) => idx !== indexToRemove));
        setValidationError('');
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();

        let currentTags = [...emailTags];
        if (emailInput.trim() && isValidEmail(emailInput.trim())) {
            currentTags.push(emailInput.trim());
            setEmailTags(currentTags);
            setEmailInput('');
        }

        if (currentTags.length === 0) {
            setValidationError('Please enter at least one email address.');
            return;
        }

        const targetEmail = currentTags[0];

        post(
            typeof route === 'function'
                ? route('resources.invite', resourceId)
                : `/resources/${resourceId}/invite`,
            {
                data: {
                    email: targetEmail,
                },
                onSuccess: () => {
                    handleClose();
                },
            },
        );
    };

    const handleCopyLink = async () => {
        const linkToCopy = inviteLink;
        if (!linkToCopy) {
            console.error('No invitation link was provided.');
            return;
        }
        try {
            await navigator.clipboard.writeText(linkToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    if (!isOpen) return null;

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
                {/* HEADER (MATCHES FIGMA FRAME 14:2134) */}
                <div className="flex items-start justify-between border-b border-[#F0F0E9] pb-4">
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#AD5266]">
                            Collaborative space
                        </span>
                        <h2
                            className="mt-1 text-xl font-bold text-[#30302D]"
                            style={{ fontFamily: '"Manrope", sans-serif' }}
                        >
                            Invite people to {spaceName}
                        </h2>
                        <p className="mt-1 text-xs text-[#73736C]">
                            Add collaborators by email. Enter multiple addresses
                            one at a time or separate them with commas.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D8DDD5] bg-[#FFFFFF] text-xs text-[#73736C] hover:bg-[#F7F7F2]"
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* FORM */}
                <form onSubmit={handleEmailSubmit} className="mt-5 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase text-[#30302D]">
                            Email addresses
                        </label>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 rounded-xl border border-[#D8DDD5] bg-[#F7F7F2] p-2 focus-within:border-[#AD5266] focus-within:bg-[#FFFFFF] focus-within:ring-1 focus-within:ring-[#AD5266]">
                            {emailTags.map((email, index) => (
                                <span
                                    key={index}
                                    className="flex items-center gap-1 rounded-full bg-[#AD5266]/10 px-2.5 py-1 text-xs font-semibold text-[#762F50]"
                                >
                                    <span>{email}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeTag(index)}
                                        className="text-gray-400 hover:text-rose-600"
                                    >
                                        <X size={13} />
                                    </button>
                                </span>
                            ))}
                            <input
                                type="email"
                                placeholder={
                                    emailTags.length === 0
                                        ? 'name@example.com'
                                        : 'Add another...'
                                }
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onBlur={handleBlur}
                                className="min-w-[140px] flex-1 border-0 bg-transparent p-1.5 text-sm text-[#30302D] placeholder:text-[#8E9088] focus:outline-none focus:ring-0"
                            />
                        </div>
                        {validationError && (
                            <p className="mt-1 text-xs text-rose-600">
                                {validationError}
                            </p>
                        )}
                        {errors.email && (
                            <p className="mt-1 text-xs text-rose-600">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* SHARE LINK SECTION - COMMENTED OUT TEMPORARILY */}
                    {/* 
                    <div className="rounded-2xl border border-[#D8DDD5] bg-[#F7F7F2] p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-[#30302D]">
                                    Share invitation link
                                </p>
                                <p className="text-[11px] text-[#73736C]">
                                    Direct invite link for this workspace
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleCopyLink}
                                className="rounded-full border border-[#D8DDD5] bg-[#FFFFFF] px-3.5 py-1 text-xs font-semibold text-[#30302D] transition-colors hover:bg-[#F0F0E9]"
                            >
                                {copied ? '✓ Copied' : 'Copy link'}
                            </button>
                        </div>
                    </div>
                    */}

                    {/* FOOTER ACTIONS */}
                    <div className="flex items-center justify-end gap-3 border-t border-[#F0F0E9] pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="rounded-full px-4 py-2 text-xs font-semibold text-[#73736C] hover:text-[#30302D]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-full bg-[#AD5266] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#974356] disabled:opacity-50"
                        >
                            {processing ? 'Sending...' : 'Send invitations'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
