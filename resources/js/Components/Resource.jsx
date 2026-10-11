import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Globe2, LockKeyhole, X } from 'lucide-react';

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

    const isCollaborative = data.resource_type === 'public';

    const handleSubmit = (event) => {
        event.preventDefault();

        post('/resources', {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#30302D]/30 p-4 backdrop-blur-[2px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-space-title"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="w-full max-w-[470px] rounded-[15px] bg-white px-[30px] py-[36px] shadow-[0_18px_45px_rgba(48,48,45,0.16)]">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#AD5266]">
                            Create a resource space
                        </p>
                        <h2
                            id="create-space-title"
                            className="mt-3 text-[16px] font-medium tracking-[-0.02em] text-[#30302D]"
                        >
                            Name your space
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="mt-[-2px] flex h-7 w-7 items-center justify-center text-[#73736C] transition hover:text-[#30302D]"
                        aria-label="Close dialog"
                    >
                        <X size={22} strokeWidth={1.8} />
                    </button>
                </div>

                <form className="mt-7" onSubmit={handleSubmit}>
                    <label
                        htmlFor="course_name"
                        className="text-[12px] font-bold text-[#30302D]"
                    >
                        Space name
                    </label>
                    <input
                        id="course_name"
                        value={data.course_name}
                        type="text"
                        required
                        placeholder="e.g. Year 12 study group"
                        onChange={(event) =>
                            setData('course_name', event.target.value)
                        }
                        className="mt-2.5 h-[51px] w-full rounded-[10px] border border-[#D8DDD5] bg-[#F0F0E9] px-4 text-[14px] text-[#30302D] outline-none placeholder:text-[#A5A59D] focus:border-[#AD5266] focus:bg-white focus:ring-1 focus:ring-[#AD5266]"
                    />
                    {errors.course_name && (
                        <p className="mt-1.5 text-[11px] font-semibold text-rose-600">
                            {errors.course_name}
                        </p>
                    )}

                    <div className="mt-3.5 flex min-h-[70px] items-center gap-3 rounded-[10px] border border-[#D8DDD5] px-3.5">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px] bg-[#F1E5EA] text-[#762F50]">
                            {isCollaborative ? (
                                <Globe2 size={22} strokeWidth={1.8} />
                            ) : (
                                <LockKeyhole size={20} strokeWidth={1.8} />
                            )}
                        </span>
                        <div>
                            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#73736C]">
                                Type of resource space
                            </p>
                            <p className="mt-1 text-[15px] font-bold text-[#30302D]">
                                {isCollaborative
                                    ? 'Collaborative space'
                                    : 'Private space'}
                            </p>
                        </div>
                    </div>
                    {errors.resource_type && (
                        <p className="mt-1.5 text-[11px] font-semibold text-rose-600">
                            {errors.resource_type}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={processing || !data.course_name.trim()}
                        className="mt-5 h-[43px] w-full rounded-[9px] bg-[#C6A4B3] text-[14px] font-bold text-white transition hover:bg-[#AD5266] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {processing ? 'Creating space...' : 'Create space'}
                    </button>
                </form>
            </div>
        </div>
    );
}
