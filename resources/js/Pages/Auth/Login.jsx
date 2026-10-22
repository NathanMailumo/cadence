import React, { useState, useEffect, useRef } from 'react';
import { useSignIn, useClerk, useUser } from '@clerk/clerk-react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import CadenceLogo from '@/Components/CadenceLogo';
import CadenceLoader from '@/Components/CadenceLoader';

export default function Login() {
    const { isLoaded: isSignInLoaded, signIn, setActive } = useSignIn();
    const { signOut } = useClerk();
    const { isLoaded: isUserLoaded, isSignedIn, user } = useUser();
    const { props } = usePage();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [pendingSecondFactor, setPendingSecondFactor] = useState(false);

    // Check if error was passed in page props or query params
    const initialError =
        props.error ||
        props.flash?.error ||
        new URLSearchParams(window.location.search).get('error') ||
        '';

    const [error, setError] = useState(initialError);
    const [loading, setLoading] = useState(false);
    const syncInProgress = useRef(false);

    // Keep error banner updated if props change on redirect
    useEffect(() => {
        if (props.error || props.flash?.error) {
            setError(props.error || props.flash?.error);
        }
    }, [props.error, props.flash]);

    const syncAndRedirect = (clerkUserId, userEmail) => {
        if (syncInProgress.current) return;

        syncInProgress.current = true;
        setLoading(true);
        router.post(
            '/clerk-sync',
            {
                clerk_id: clerkUserId,
                email: userEmail,
                name: userEmail ? userEmail.split('@')[0] : 'User',
                profile_image_url: null,
            },
            {
                onError: (errors) => {
                    syncInProgress.current = false;
                    setLoading(false);
                    setError(
                        errors.email ||
                            errors.clerk_id ||
                            'Unable to finish signing you in. Please try again.',
                    );
                },
                onSuccess: () => {
                    router.visit('/dashboard', { replace: true });
                },
            },
        );
    };

    // Auto-sync & redirect if signed in (handles Google OAuth completion)
    useEffect(() => {
        if (isUserLoaded && isSignedIn && user) {
            const userEmail = user.primaryEmailAddress?.emailAddress;
            syncAndRedirect(user.id, userEmail);
        }
    }, [isUserLoaded, isSignedIn, user]);

    const handleGoogleLogin = async () => {
        if (!isSignInLoaded) return;

        setLoading(true);
        try {
            // Clear any lingering or conflicting session before starting Google login
            await signOut();
            await signIn.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: `${window.location.origin}/sso-callback`,
                redirectUrlComplete: `${window.location.origin}/sso-callback`,
            });
        } catch (err) {
            setLoading(false);
            setError(
                err.errors?.[0]?.message ||
                    'Unable to continue with Google. Please try again.',
            );
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isSignInLoaded) return;
        setError('');
        setLoading(true);

        try {
            const result = await signIn.create({
                identifier: email,
                password,
            });

            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId });
                syncAndRedirect(result.createdUserId || result.id, email);
            } else if (
                result.status === 'needs_second_factor' ||
                result.status === 'needs_first_factor'
            ) {
                const emailFactor = result.supportedFirstFactors?.find(
                    (f) => f.strategy === 'email_code',
                );

                if (emailFactor) {
                    await signIn.prepareFirstFactor({
                        strategy: 'email_code',
                        emailAddressId: emailFactor.emailAddressId,
                    });
                }
                setPendingSecondFactor(true);
            } else {
                setError(`Status: ${result.status}`);
            }
        } catch (err) {
            const msg = err.errors?.[0]?.message || '';
            if (
                msg.toLowerCase().includes('already signed in') ||
                msg.toLowerCase().includes('session')
            ) {
                try {
                    await signOut();
                    const retryResult = await signIn.create({
                        identifier: email,
                        password,
                    });
                    if (retryResult.status === 'complete') {
                        await setActive({
                            session: retryResult.createdSessionId,
                        });
                        syncAndRedirect(
                            retryResult.createdUserId || retryResult.id,
                            email,
                        );
                        return;
                    }
                } catch (retryErr) {
                    setError(
                        'Session conflict detected. Please try logging in again.',
                    );
                }
            } else {
                setError(msg || 'Invalid email or password.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        if (!isSignInLoaded) return;
        setError('');
        setLoading(true);

        try {
            let result;
            if (signIn.firstFactorVerification?.status === 'unverified') {
                result = await signIn.attemptFirstFactor({
                    strategy: 'email_code',
                    code,
                });
            } else {
                result = await signIn.attemptSecondFactor({
                    strategy: 'email_code',
                    code,
                });
            }

            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId });
                syncAndRedirect(result.createdUserId || result.id, email);
            } else {
                setError(`Verification status: ${result.status}`);
            }
        } catch (err) {
            setError(err.errors?.[0]?.message || 'Invalid verification code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#F0F0E9] font-sans text-[#30302D]">
            {loading && (
                <CadenceLoader
                    fullScreen
                    overlay
                    size="lg"
                    label="Signing you in"
                />
            )}
            <Head>
                <title>Cadence - Log In</title>
                <link
                    rel="icon"
                    type="image/svg+xml"
                    href="/images/cadence_logo.svg"
                />
            </Head>
            <Navbar />

            <div className="flex flex-1 flex-col justify-center p-4 sm:p-6 lg:p-8">
                <div className="mx-auto w-full max-w-md">
                    <div className="mb-8 flex flex-col items-center justify-center text-center">
                        <CadenceLogo
                            className="h-9 w-auto"
                            textClassName="text-2xl font-bold"
                        />
                        <p className="mt-2 text-xs text-[#73736C]">
                            Welcome back. Enter your details to continue
                            learning.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-[#D8DDD5] bg-[#FFFFFF] p-7 shadow-lg shadow-stone-200/50 sm:p-9">
                        {/* Error Message Banner */}
                        {error && (
                            <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                                {error}
                            </div>
                        )}

                        {!pendingSecondFactor ? (
                            <>
                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    className="flex w-full items-center justify-center gap-3 rounded-full border border-[#D8DDD5] bg-[#FFFFFF] p-3 text-xs font-semibold text-[#30302D] shadow-sm transition-all hover:bg-[#F7F7F2] active:scale-95"
                                >
                                    <svg
                                        className="h-4 w-4"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                        />
                                    </svg>
                                    Continue with Google
                                </button>

                                <div className="my-5 flex items-center gap-3">
                                    <div className="h-[1px] flex-1 bg-[#D8DDD5]"></div>
                                    <span className="text-[10px] font-bold uppercase text-[#73736C]">
                                        or
                                    </span>
                                    <div className="h-[1px] flex-1 bg-[#D8DDD5]"></div>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold uppercase text-[#30302D]">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            required
                                            className="w-full rounded-xl border border-[#D8DDD5] bg-[#F7F7F2] p-3 text-sm text-[#30302D] outline-none placeholder:text-[#8E9088] focus:border-[#AD5266] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#AD5266]"
                                            placeholder="you@example.com"
                                        />
                                    </div>

                                    <div>
                                        <div className="mb-1 flex items-center justify-between">
                                            <label className="text-xs font-semibold uppercase text-[#30302D]">
                                                Password
                                            </label>
                                            <Link
                                                href="/forgot-password"
                                                className="text-xs font-medium text-[#AD5266] hover:underline"
                                            >
                                                Forgot?
                                            </Link>
                                        </div>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            required
                                            className="w-full rounded-xl border border-[#D8DDD5] bg-[#F7F7F2] p-3 text-sm text-[#30302D] outline-none focus:border-[#AD5266] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#AD5266]"
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || !isSignInLoaded}
                                        className="w-full rounded-full bg-[#AD5266] p-3 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#974356] active:scale-95 disabled:opacity-50"
                                    >
                                        {loading ? 'Logging in...' : 'Log in'}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <form
                                onSubmit={handleVerifyCode}
                                className="space-y-4"
                            >
                                <div className="text-center">
                                    <h2
                                        className="text-base font-bold text-[#30302D]"
                                        style={{
                                            fontFamily: '"Manrope", sans-serif',
                                        }}
                                    >
                                        Verification Code Required
                                    </h2>
                                    <p className="mt-1 text-xs text-[#73736C]">
                                        Enter the verification code sent to{' '}
                                        <br />
                                        <strong className="text-[#30302D]">
                                            {email}
                                        </strong>
                                    </p>
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        value={code}
                                        onChange={(e) =>
                                            setCode(e.target.value)
                                        }
                                        required
                                        maxLength={6}
                                        className="w-full rounded-xl border border-[#D8DDD5] bg-[#F7F7F2] p-3 text-center text-2xl font-bold tracking-widest text-[#30302D] outline-none focus:border-[#AD5266] focus:bg-[#FFFFFF]"
                                        placeholder="123456"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-full bg-[#AD5266] p-3 text-xs font-semibold text-white shadow-sm hover:bg-[#974356] disabled:opacity-50"
                                >
                                    {loading
                                        ? 'Verifying...'
                                        : 'Verify & Log in'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setPendingSecondFactor(false)
                                    }
                                    className="w-full text-center text-xs font-medium text-[#73736C] hover:text-[#30302D]"
                                >
                                    ← Back to Log in
                                </button>
                            </form>
                        )}

                        <div className="mt-6 text-center text-xs text-[#73736C]">
                            Don't have an account?{' '}
                            <Link
                                href="/register"
                                className="font-semibold text-[#AD5266] hover:underline"
                            >
                                Register here
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
