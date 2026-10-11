import React, { useState, useRef } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const PRESET_AVATARS = [
    {
        id: 'bot-1',
        label: 'Cosmo Bot',
        url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Cosmo',
    },
    {
        id: 'bot-2',
        label: 'Gizmo Bot',
        url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Gizmo',
    },
    {
        id: 'bot-3',
        label: 'Spark Bot',
        url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Circuit',
    },
    {
        id: 'adv-1',
        label: 'Explorer Felix',
        url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix',
    },
    {
        id: 'adv-2',
        label: 'Explorer Maya',
        url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Maya',
    },
    {
        id: 'adv-3',
        label: 'Explorer Sam',
        url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sammy',
    },
    {
        id: 'per-1',
        label: 'Scholar Alex',
        url: 'https://api.dicebear.com/7.x/personas/svg?seed=Alex',
    },
    {
        id: 'per-2',
        label: 'Scholar Zoe',
        url: 'https://api.dicebear.com/7.x/personas/svg?seed=Zoe',
    },
    {
        id: 'per-3',
        label: 'Scholar Leo',
        url: 'https://api.dicebear.com/7.x/personas/svg?seed=Leo',
    },
    {
        id: 'fun-1',
        label: 'Super Star',
        url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Star',
    },
    {
        id: 'fun-2',
        label: 'Cool Cat',
        url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Chill',
    },
    {
        id: 'fun-3',
        label: 'Sunny Joy',
        url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Sunny',
    },
];

export default function Edit({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;
    const fileInputRef = useRef(null);

    // Modal state for avatar selector popup
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

    // Live preview state (file blob URL or preset avatar URL or current user image)
    const [previewUrl, setPreviewUrl] = useState(
        user?.profile_image_url || null,
    );

    // Profile Form State
    const profileForm = useForm({
        name: user?.name || '',
        email: user?.email || '',
        profile_image: null,
        avatar_url: '',
    });

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            profileForm.setData((prev) => ({
                ...prev,
                profile_image: file,
                avatar_url: '',
            }));
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSelectPreset = (url) => {
        profileForm.setData((prev) => ({
            ...prev,
            avatar_url: url,
            profile_image: null,
        }));
        setPreviewUrl(url);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setIsAvatarModalOpen(false);
    };

    const submitProfile = (e) => {
        e.preventDefault();
        profileForm.post(route('profile.update'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-[#F4F0EA] p-6 font-mono text-black md:p-12">
                <Head title="Cadence - Edit Profile" />

                <div className="mx-auto max-w-5xl space-y-8">
                    {/* Header Banner */}
                    <div className="flex items-center justify-between border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <div>
                            <span className="border-2 border-black bg-[#FF5050] px-2 py-1 text-xs font-bold uppercase tracking-widest text-white">
                                ACCOUNT SETTINGS
                            </span>
                            <h1 className="mt-2 text-3xl font-extrabold uppercase">
                                USER PROFILE
                            </h1>
                        </div>
                        <a
                            href="/dashboard"
                            className="border-4 border-black bg-[#FF5050] px-6 py-3 font-extrabold uppercase text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-x-1 hover:translate-y-1"
                        >
                            ← Dashboard
                        </a>
                    </div>
                    {/* Form Section: Avatar on Left, Information Form on Right */}
                    <form onSubmit={submitProfile}>
                        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                            {/* Left Column: Avatar / Picture */}
                            <div className="flex flex-col items-center border-4 border-black bg-white p-6 text-center shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] sm:p-8 lg:col-span-5">
                                <div className="mb-6 flex w-full items-center justify-between border-b-4 border-black pb-3">
                                    <h2 className="text-xl font-black uppercase">
                                        Profile Avatar
                                    </h2>
                                    <span className="border-2 border-black bg-[#FF5050] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                                        Photo
                                    </span>
                                </div>

                                {/* Avatar Preview (Circular like reference image) */}
                                <div className="relative mb-4 flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-4 border-black bg-[#F4F0EA] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:h-44 sm:w-44">
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Avatar Preview"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-5xl font-black text-black">
                                            {user?.name
                                                ? user.name
                                                      .charAt(0)
                                                      .toUpperCase()
                                                : 'U'}
                                        </span>
                                    )}
                                </div>

                                {/* User Display Info */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-black uppercase tracking-tight">
                                        {profileForm.data.name ||
                                            user?.name ||
                                            'User'}
                                    </h3>
                                    <span className="mt-1 inline-block border-2 border-black bg-red-50 px-2 py-0.5 text-[11px] font-extrabold uppercase text-[#FF5050]">
                                        Cadence Scholar
                                    </span>
                                </div>

                                {/* Avatar Actions */}
                                <div className="w-full space-y-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsAvatarModalOpen(true)
                                        }
                                        className="w-full border-4 border-black bg-[#FF5050] px-4 py-2.5 text-xs font-black uppercase text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-x-0.5 hover:translate-y-0.5"
                                    >
                                        Choose Avatar Preset
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        className="w-full border-4 border-black bg-white px-4 py-2.5 text-xs font-black uppercase text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-neutral-100"
                                    >
                                        Upload Photo
                                    </button>

                                    {/* Hidden File Input */}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/png,image/jpeg,image/webp,image/gif"
                                        className="hidden"
                                    />

                                    {/* Selected state indicator */}
                                    {profileForm.data.profile_image && (
                                        <div className="border-2 border-black bg-white p-2 text-center text-[11px] font-bold text-gray-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                            File ready:{' '}
                                            {
                                                profileForm.data.profile_image
                                                    .name
                                            }
                                        </div>
                                    )}
                                    {profileForm.data.avatar_url && (
                                        <div className="border-2 border-black bg-white p-2 text-center text-[11px] font-bold text-gray-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                            Preset avatar selected
                                        </div>
                                    )}

                                    {profileForm.errors.profile_image && (
                                        <p className="mt-2 text-xs font-bold text-red-600">
                                            {profileForm.errors.profile_image}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Right Column: Other Information (Inputs & Actions) */}
                            <div className="border-4 border-black bg-white p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] sm:p-8 lg:col-span-7">
                                <div className="mb-6 flex items-center justify-between border-b-4 border-black pb-3">
                                    <h2 className="text-xl font-black uppercase">
                                        Profile Information
                                    </h2>
                                    <span className="border-2 border-black bg-[#FF5050] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                                        Details
                                    </span>
                                </div>

                                <div className="space-y-6">
                                    {/* Full Name */}
                                    <div>
                                        <label className="mb-2 block text-xs font-black uppercase">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profileForm.data.name}
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full border-4 border-black bg-[#F4F0EA] p-3 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                                            required
                                        />
                                        {profileForm.errors.name && (
                                            <p className="mt-1 text-xs font-bold text-red-600">
                                                {profileForm.errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email Address */}
                                    <div>
                                        <label className="mb-2 block text-xs font-black uppercase">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={profileForm.data.email}
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    'email',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full border-4 border-black bg-[#F4F0EA] p-3 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                                            required
                                        />
                                        {profileForm.errors.email && (
                                            <p className="mt-1 text-xs font-bold text-red-600">
                                                {profileForm.errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Submit Actions */}
                                    <div className="flex items-center gap-4 pt-4">
                                        <button
                                            type="submit"
                                            disabled={profileForm.processing}
                                            className="border-4 border-black bg-[#FF5050] px-8 py-3.5 text-sm font-black uppercase text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-x-1 hover:translate-y-1 disabled:opacity-50"
                                        >
                                            {profileForm.processing
                                                ? 'Saving...'
                                                : 'Save Changes'}
                                        </button>

                                        {profileForm.recentlySuccessful && (
                                            <span className="border-2 border-black bg-green-200 px-3 py-1 text-xs font-bold uppercase text-green-700">
                                                Saved!
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* AVATAR OPTIONS POPUP MODAL */}
            {isAvatarModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 font-mono">
                    <div className="relative w-full max-w-2xl border-4 border-black bg-white p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] md:p-8">
                        {/* Modal Header */}
                        <div className="mb-6 flex items-center justify-between border-b-4 border-black pb-4">
                            <div>
                                <span className="border-2 border-black bg-[#FF5050] px-2 py-0.5 text-xs font-bold uppercase text-white">
                                    Avatars
                                </span>
                                <h3 className="mt-1 text-xl font-black uppercase">
                                    Choose An Avatar
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAvatarModalOpen(false)}
                                className="flex h-9 w-9 items-center justify-center border-2 border-black bg-[#FF5050] font-black text-white hover:bg-red-600"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Avatars Grid */}
                        <div className="grid max-h-[60vh] grid-cols-3 gap-4 overflow-y-auto p-1 sm:grid-cols-4">
                            {PRESET_AVATARS.map((avatar) => (
                                <button
                                    key={avatar.id}
                                    type="button"
                                    onClick={() =>
                                        handleSelectPreset(avatar.url)
                                    }
                                    className="group flex flex-col items-center justify-center rounded-xl border-2 border-black bg-[#F4F0EA] p-3 text-center transition-all hover:-translate-y-1 hover:border-black hover:bg-red-50 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                >
                                    <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-black bg-white p-1">
                                        <img
                                            src={avatar.url}
                                            alt={avatar.label}
                                            className="h-full w-full object-contain"
                                            loading="lazy"
                                        />
                                    </div>
                                    <span className="mt-2 text-[11px] font-black uppercase tracking-tight text-neutral-800">
                                        {avatar.label}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Modal Footer */}
                        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t-4 border-black pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAvatarModalOpen(false);
                                    fileInputRef.current?.click();
                                }}
                                className="border-2 border-black bg-[#FF5050] px-4 py-2 text-xs font-black uppercase text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5"
                            >
                                Upload From Computer Instead
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsAvatarModalOpen(false)}
                                className="border-2 border-black bg-gray-200 px-4 py-2 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
