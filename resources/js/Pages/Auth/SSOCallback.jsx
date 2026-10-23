import React, { useEffect, useRef, useState } from 'react';
import {
    AuthenticateWithRedirectCallback,
    useUser,
    useClerk,
} from '@clerk/clerk-react';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import CadenceLoader from '@/Components/CadenceLoader';

export default function SSOCallback() {
    const { isLoaded, isSignedIn, user } = useUser();
    const { signOut } = useClerk();
    const { props } = usePage();
    const laravelUser = props.auth?.user;

    const [error, setError] = useState('');
    const syncStarted = useRef(false);

    useEffect(() => {
        if (laravelUser) {
            window.location.replace('/dashboard');
            return;
        }

        if (isLoaded && isSignedIn && user && !syncStarted.current) {
            syncStarted.current = true;

            const email = user.primaryEmailAddress?.emailAddress;
            const fullName =
                user.fullName || user.firstName || email?.split('@')[0];

            if (!email) {
                setError('Email address is invalid');
                return;
            }

            const searchParams = new URLSearchParams(window.location.search);
            const isRegistrationMode = searchParams.get('mode') === 'register';

            axios
                .post('/clerk-sync', {
                    clerk_id: user.id,
                    email: email,
                    name: fullName,
                    profile_image_url: user.imageUrl || null,
                    is_registration: isRegistrationMode,
                })
                .then(() => {
                    // Hard browser jump straight to dashboard
                    window.location.replace('/dashboard');
                })
                .catch(async (err) => {
                    console.error('Sync error:', err);
                    const responseErrors = err.response?.data?.errors;

                    try {
                        await signOut();
                    } catch (signOutErr) {
                        console.error('Clerk sign out error:', signOutErr);
                    }

                    if (
                        responseErrors?.email
                            ?.toLowerCase()
                            .includes('already') ||
                        responseErrors?.clerk_id
                            ?.toLowerCase()
                            .includes('already')
                    ) {
                        window.location.replace(
                            '/register?error=' +
                                encodeURIComponent(
                                    'Account already exists. Please log in.',
                                ),
                        );
                    } else {
                        setError(
                            responseErrors?.email ||
                                'Unable to finish signing you in. Please try again.',
                        );
                    }
                });
        }
    }, [isLoaded, isSignedIn, user, laravelUser, signOut]);

    return (
        <div className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#F0F0E9] font-sans">
            <Head title="Completing sign in..." />
            <CadenceLoader fullScreen size="lg" label="Setting up your space" />

            {/* Explicitly direct Clerk's callback component to land straight on dashboard upon token resolution */}
            <AuthenticateWithRedirectCallback
                signInForceRedirectUrl="/dashboard"
                signUpForceRedirectUrl="/dashboard"
                signInFallbackRedirectUrl="/dashboard"
                signUpFallbackRedirectUrl="/dashboard"
            />

            {error && (
                <div className="absolute z-50 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 shadow-md">
                    {error}
                </div>
            )}
        </div>
    );
}
