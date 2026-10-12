import React, { useState } from 'react';
import { useSignUp, useClerk } from '@clerk/clerk-react';
import { Head, Link, router } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import CadenceLogo from '@/Components/CadenceLogo';

export default function Register() {
    const { isLoaded: isSignUpLoaded, signUp, setActive } = useSignUp();
    const { signOut } = useClerk();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [pendingVerification, setPendingVerification] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const syncAndRedirect = (clerkUserId, userEmail) => {
        router.post(
            '/clerk-sync',
            {
                clerk_id: clerkUserId,
                email: userEmail,
                name: `${firstName} ${lastName}`.trim() || 'User',
                profile_image_url: null,
            },
            {
                onError: (errors) => {
                    setError(
                        errors.email ||
                            errors.clerk_id ||
                            'Failed to sync account. Please log in.',
                    );
                },
                onSuccess: () => {
                    window.location.assign('/dashboard');
                },
            },
        );
    };

    const handleGoogleSignUp = async () => {
        if (!isSignUpLoaded || loading) return;
        setError('');
        setLoading(true);

        try {
            await signUp.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: `${window.location.origin}/sso-callback`,
                redirectUrlComplete: `${window.location.origin}/sso-callback?complete=1`,
            });
        } catch (err) {
            setError(
                err.errors?.[0]?.message ||
                    'Unable to continue with Google. Please try again.',
            );
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isSignUpLoaded) return;
        setError('');
        setLoading(true);

        try {
            await signUp.create({
                firstName,
                lastName,
                emailAddress: email,
                password,
            });

            await signUp.prepareEmailAddressVerification({
                strategy: 'email_code',
            });
            setPendingVerification(true);
        } catch (err) {
            const msg = err.errors?.[0]?.message || '';
            if (
                msg.toLowerCase().includes('already signed in') ||
                msg.toLowerCase().includes('session')
            ) {
                try {
                    await signOut();
                    await signUp.create({
                        firstName,
                        lastName,
                        emailAddress: email,
                        password,
                    });
                    await signUp.prepareEmailAddressVerification({
                        strategy: 'email_code',
                    });
                    setPendingVerification(true);
                    return;
                } catch (retryErr) {
                    setError(
                        'Session conflict resolved. Please click Create Account again.',
                    );
                }
            } else {
                setError(msg || 'Failed to create account.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!isSignUpLoaded) return;
        setError('');
        setLoading(true);

        try {
            const result = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId });
                syncAndRedirect(result.createdUserId, email);
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
            <Head title="Cadence - Get Started" />
            <Navbar />

            <div className="flex flex-1 flex-col justify-center p-4 sm:p-6 lg:p-8">
                <div className="mx-auto w-full max-w-md">
                    <div className="mb-8 flex flex-col items-center justify-center text-center">
                        <CadenceLogo
                            className="h-9 w-auto"
                            textClassName="text-2xl font-bold"
                        />
                        <p className="mt-2 text-xs text-[#73736C]">
                            Create your account to start gathering and
                            organizing study resources.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-[#D8DDD5] bg-[#FFFFFF] p-7 shadow-lg shadow-stone-200/50 sm:p-9">
                        {error && (
                            <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                                {error}
                            </div>
                        )}

                        {!pendingVerification ? (
                            <>
                                <button
                                    type="button"
                                    onClick={handleGoogleSignUp}
                                    disabled={loading || !isSignUpLoaded}
                                    className="flex w-full items-center justify-center gap-3 rounded-full border border-[#D8DDD5] bg-[#FFFFFF] p-3 text-xs font-semibold text-[#30302D] shadow-sm transition-all hover:bg-[#F7F7F2] active:scale-95 disabled:cursor-wait disabled:opacity-60"
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
                                    {loading
                                        ? 'Connecting to Google...'
                                        : 'Continue with Google'}
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
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="mb-1 block text-xs font-semibold uppercase text-[#30302D]">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                value={firstName}
                                                onChange={(e) =>
                                                    setFirstName(e.target.value)
                                                }
                                                required
                                                className="w-full rounded-xl border border-[#D8DDD5] bg-[#F7F7F2] p-3 text-sm text-[#30302D] outline-none focus:border-[#AD5266] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#AD5266]"
                                                placeholder="Alex"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-xs font-semibold uppercase text-[#30302D]">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                value={lastName}
                                                onChange={(e) =>
                                                    setLastName(e.target.value)
                                                }
                                                required
                                                className="w-full rounded-xl border border-[#D8DDD5] bg-[#F7F7F2] p-3 text-sm text-[#30302D] outline-none focus:border-[#AD5266] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#AD5266]"
                                                placeholder="Morgan"
                                            />
                                        </div>
                                    </div>

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
                                            className="w-full rounded-xl border border-[#D8DDD5] bg-[#F7F7F2] p-3 text-sm text-[#30302D] outline-none focus:border-[#AD5266] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#AD5266]"
                                            placeholder="alex@cadence.study"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-semibold uppercase text-[#30302D]">
                                            Password
                                        </label>
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
                                        disabled={loading || !isSignUpLoaded}
                                        className="w-full rounded-full bg-[#AD5266] p-3 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#974356] active:scale-95 disabled:opacity-50"
                                    >
                                        {loading
                                            ? 'Creating account...'
                                            : 'Create account'}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <form onSubmit={handleVerify} className="space-y-4">
                                <div className="text-center">
                                    <h2
                                        className="text-base font-bold text-[#30302D]"
                                        style={{
                                            fontFamily: '"Manrope", sans-serif',
                                        }}
                                    >
                                        Verify your email
                                    </h2>
                                    <p className="mt-1 text-xs text-[#73736C]">
                                        We sent a 6-digit code to <br />
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
                                        : 'Verify & Continue'}
                                </button>
                            </form>
                        )}

                        <div className="mt-6 text-center text-xs text-[#73736C]">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="font-semibold text-[#AD5266] hover:underline"
                            >
                                Log in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
