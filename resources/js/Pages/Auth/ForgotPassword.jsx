import React, { useState } from 'react';
import { useSignIn } from '@clerk/clerk-react';
import { Head, Link } from '@inertiajs/react';
import CadenceLogo from '@/Components/CadenceLogo';

export default function ForgotPassword() {
    const { isLoaded, signIn, setActive } = useSignIn();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [successfulCreation, setSuccessfulCreation] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Send reset code to email via Clerk
    const handleSendCode = async (e) => {
        e.preventDefault();
        if (!isLoaded) return;
        setError('');
        setLoading(true);

        try {
            await signIn.create({
                strategy: 'reset_password_email_code',
                identifier: email,
            });
            setSuccessfulCreation(true);
        } catch (err) {
            setError(err.errors?.[0]?.message || 'Failed to send reset code.');
        } finally {
            setLoading(false);
        }
    };

    // Verify code and set new password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!isLoaded) return;
        setError('');
        setLoading(true);

        try {
            const result = await signIn.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code,
                password,
            });

            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId });
                window.location.href = '/dashboard';
            }
        } catch (err) {
            setError(err.errors?.[0]?.message || 'Invalid code or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col justify-center bg-[#F0F0E9] p-4 font-sans text-[#30302D] sm:p-6 lg:p-8">
            <Head>
                <title>Cadence - Reset Password</title>
                <link
                    rel="icon"
                    type="image/svg+xml"
                    href="/images/cadence_logo.svg"
                />
                {/* Or use href="/logo.png" if your file is a PNG */}
            </Head>

            <div className="mx-auto w-full max-w-md">
                <div className="mb-8 flex flex-col items-center justify-center text-center">
                    <CadenceLogo
                        className="h-9 w-auto"
                        textClassName="text-2xl font-bold"
                    />
                    <p className="mt-2 text-xs text-[#73736C]">
                        Reset your account password
                    </p>
                </div>

                <div className="rounded-3xl border border-[#D8DDD5] bg-[#FFFFFF] p-7 shadow-lg shadow-stone-200/50 sm:p-9">
                    {error && (
                        <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                            {error}
                        </div>
                    )}

                    {!successfulCreation ? (
                        <form onSubmit={handleSendCode} className="space-y-4">
                            <p className="text-xs text-[#73736C]">
                                Enter your email address to receive a password
                                reset code.
                            </p>
                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase text-[#30302D]">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full rounded-xl border border-[#D8DDD5] bg-[#F7F7F2] p-3 text-sm text-[#30302D] outline-none placeholder:text-[#8E9088] focus:border-[#AD5266] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#AD5266]"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-full bg-[#AD5266] p-3 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#974356] active:scale-95 disabled:opacity-50"
                            >
                                {loading
                                    ? 'Sending code...'
                                    : 'Send reset code'}
                            </button>
                        </form>
                    ) : (
                        <form
                            onSubmit={handleResetPassword}
                            className="space-y-4"
                        >
                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase text-[#30302D]">
                                    Reset Code
                                </label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    required
                                    className="w-full rounded-xl border border-[#D8DDD5] bg-[#F7F7F2] p-3 text-center text-xl font-bold tracking-widest text-[#30302D] outline-none focus:border-[#AD5266] focus:bg-[#FFFFFF]"
                                    placeholder="123456"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase text-[#30302D]">
                                    New Password
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
                                disabled={loading}
                                className="w-full rounded-full bg-[#AD5266] p-3 text-xs font-semibold text-white shadow-sm hover:bg-[#974356] disabled:opacity-50"
                            >
                                {loading
                                    ? 'Resetting...'
                                    : 'Reset password & Log in'}
                            </button>
                        </form>
                    )}

                    <div className="mt-6 text-center text-xs text-[#73736C]">
                        <Link
                            href="/login"
                            className="font-semibold text-[#AD5266] hover:underline"
                        >
                            ← Back to Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
