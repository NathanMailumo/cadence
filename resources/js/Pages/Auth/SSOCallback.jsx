import React, { useEffect, useRef, useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Head, usePage } from '@inertiajs/react';
import { clerkSync } from '@/lib/clerkSync';
import CadenceLoader from '@/Components/CadenceLoader';

const firstMessage = (value) => (Array.isArray(value) ? value[0] : value);

export default function SSOCallback() {
    const { isLoaded, isSignedIn, user } = useUser();
    const clerk = useClerk();
    const { signOut, handleRedirectCallback } = clerk;
    const { props } = usePage();
    const laravelUser = props.auth?.user;

    const [error, setError] = useState('');
    const callbackStarted = useRef(false);
    const syncStarted = useRef(false);
    const isSignedInRef = useRef(false);
    isSignedInRef.current = isSignedIn;

    const searchParams = new URLSearchParams(window.location.search);
    const isRegistrationMode = searchParams.get('mode') === 'register';

    const goToLoginWithError = (message) => {
        window.location.replace('/login?error=' + encodeURIComponent(message));
    };

    // STEP 1: Finish the Google OAuth handshake with Clerk.
    // The custom navigate function is a no-op, so Clerk does NOT send the
    // browser to /dashboard. We must sync with Laravel first (step 2),
    // otherwise /dashboard sees no Laravel session and bounces to /login.
    useEffect(() => {
        if (laravelUser) {
            window.location.replace('/dashboard');
            return;
        }

        if (!isLoaded || isSignedIn || callbackStarted.current) return;
        callbackStarted.current = true;

        handleRedirectCallback(
            { signInUrl: '/login', signUpUrl: '/register' },
            async () => {},
        )
            .then(() => {
                // Safety net: if Clerk never produced a session, don't hang.
                setTimeout(() => {
                    if (!isSignedInRef.current) {
                        goToLoginWithError(
                            'Google sign in did not complete. Please try again.',
                        );
                    }
                }, 5000);
            })
            .catch((err) => {
                console.error('SSO callback error:', err);
                goToLoginWithError(
                    err?.errors?.[0]?.message ||
                        'Google sign in failed. Please try again.',
                );
            });
    }, [isLoaded, isSignedIn, laravelUser]);

    // STEP 2: Clerk session exists -> create the Laravel session -> dashboard.
    useEffect(() => {
        if (laravelUser) return;
        if (!isLoaded || !isSignedIn || !user || syncStarted.current) return;
        syncStarted.current = true;

        clerkSync(clerk, isRegistrationMode)
            .then(() => {
                window.location.replace('/dashboard');
            })
            .catch(async (err) => {
                console.error('Sync error:', err);
                const data = err.response?.data;
                const message =
                    firstMessage(data?.errors?.email) ||
                    'Unable to finish signing you in. Please try again.';

                // Always drop the Clerk session when Laravel sync fails,
                // otherwise Clerk and Laravel get out of step.
                try {
                    await signOut();
                } catch (signOutErr) {
                    console.error('Clerk sign out error:', signOutErr);
                }

                if (data?.code === 'account_exists') {
                    // Already registered -> back to the register form with error
                    window.location.replace(
                        '/register?error=' + encodeURIComponent(message),
                    );
                } else {
                    setError(message);
                }
            });
    }, [
        isLoaded,
        isSignedIn,
        user,
        laravelUser,
        isRegistrationMode,
        signOut,
        clerk,
    ]);

    return (
        <div className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#F0F0E9] font-sans">
            <Head title="Completing sign in..." />
            <CadenceLoader fullScreen size="lg" label="Setting up your space" />

            {error && (
                <div className="absolute z-50 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 shadow-md">
                    {error}{' '}
                    <a href="/login" className="underline">
                        Back to log in
                    </a>
                </div>
            )}
        </div>
    );
}
