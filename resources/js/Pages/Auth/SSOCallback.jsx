import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import CadenceLoader from '@/Components/CadenceLoader';

export default function SSOCallback() {
    const { isLoaded, isSignedIn, user } = useUser();
    const { props } = usePage();
    const laravelUser = props.auth?.user;

    const [error, setError] = useState('');
    const syncStarted = useRef(false);

    useEffect(() => {
        // 1. If user is already logged into Laravel, push directly to dashboard
        if (laravelUser) {
            window.location.href = '/dashboard';
            return;
        }

        // 2. Once Clerk is loaded and user details are ready, perform sync
        if (isLoaded && isSignedIn && user && !syncStarted.current) {
            syncStarted.current = true;

            const email = user.primaryEmailAddress?.emailAddress;
            const fullName =
                user.fullName || user.firstName || email?.split('@')[0];

            if (!email) {
                setError('Email address is invalid');
                return;
            }

            axios
                .post('/clerk-sync', {
                    clerk_id: user.id,
                    email: email,
                    name: fullName,
                    profile_image_url: user.imageUrl || null,
                })
                .then(() => {
                    // Direct hard reload to dashboard without touching /login
                    window.location.href = '/dashboard';
                })
                .catch((err) => {
                    console.error('Sync error:', err);
                    setError(
                        'Unable to finish signing you in. Please try again.',
                    );
                });
        }
    }, [isLoaded, isSignedIn, user, laravelUser]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#F0F0E9] font-sans">
            <Head title="Completing sign in..." />
            <CadenceLoader fullScreen size="lg" label="Setting up your space" />

            {error && (
                <div className="absolute z-50 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 shadow-md">
                    {error}
                </div>
            )}
        </div>
    );
}
