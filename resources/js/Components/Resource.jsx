import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function Resource({
    isOpen,
    onClose,
    defaultResourceType = 'private',
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        course_name: '',
        resource_type: defaultResourceType || 'private',
    });

    useEffect(() => {
        if (isOpen) {
            setData('resource_type', defaultResourceType);
        }
    }, [defaultResourceType, isOpen, setData]);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        post('/resources', {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-space-title"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="w-full max-w-md rounded-3xl border border-[#D8DDD5] bg-[#FFFFFF] p-6 shadow-xl sm:p-7">
                {/* MODAL HEADER */}
                <div className="flex items-start justify-between gap-4 border-b border-[#F0F0E9] pb-4">
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#AD5266]">
                            New Workspace
                        </span>
                        <h2
                            id="create-space-title"
                            className="mt-1 text-xl font-bold text-[#30302D]"
                            style={{ fontFamily: '"Manrope", sans-serif' }}
                        >
                            Create a Space
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D8DDD5] bg-[#FFFFFF] text-xs text-[#73736C] transition-colors hover:bg-[#F7F7F2] hover:text-[#30302D]"
                        aria-label="Close dialog"
                    >
                        ✕
                    </button>
                </div>

                {/* FORM */}
                <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-1.5">
                        <label
                            htmlFor="course_name"
                            className="text-xs font-semibold uppercase tracking-wide text-[#30302D]"
                        >
                            Space Name / Course
                        </label>
                        <input
                            id="course_name"
                            value={data.course_name}
                            type="text"
                            required
                            placeholder="e.g. Biology · Year 12, Microeconomics"
                            onChange={(e) =>
                                setData('course_name', e.target.value)
                            }
                            className="w-full rounded-xl border border-[#D8DDD5] bg-[#F7F7F2] px-3.5 py-2.5 text-sm font-medium text-[#30302D] outline-none placeholder:text-[#8E9088] focus:border-[#AD5266] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#AD5266]"
                        />
                        {errors.course_name && (
                            <p className="text-[11px] font-semibold text-rose-600">
                                {errors.course_name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label
                            htmlFor="resource-type"
                            className="text-xs font-semibold uppercase tracking-wide text-[#30302D]"
                        >
                            Space Type
                        </label>
                        <select
                            id="resource-type"
                            value={data.resource_type}
                            onChange={(e) =>
                                setData('resource_type', e.target.value)
                            }
                            className="w-full rounded-xl border border-[#D8DDD5] bg-[#F7F7F2] px-3.5 py-2.5 text-sm font-medium text-[#30302D] outline-none focus:border-[#AD5266] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#AD5266]"
                        >
                            <option value="private">
                                🔒 Private space (Only you)
                            </option>
                            <option value="public">
                                👥 Collaborative space (Invite classmates)
                            </option>
                        </select>
                        {errors.resource_type && (
                            <p className="text-[11px] font-semibold text-rose-600">
                                {errors.resource_type}
                            </p>
                        )}
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full px-4 py-2 text-xs font-semibold text-[#73736C] hover:text-[#30302D]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-full bg-[#AD5266] px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#974356] disabled:opacity-50"
                        >
                            {processing ? 'Creating...' : 'Create Space'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
