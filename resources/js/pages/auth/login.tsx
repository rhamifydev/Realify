import { useState } from 'react';
import { Form, Head } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
/* @chisel-registration */
import { register } from '@/routes';
/* @end-chisel-registration */
import { store } from '@/routes/login';
import { request } from '@/routes/password';
/* @chisel-passkeys */
import PasskeyVerify from '@/components/passkey-verify';
/* @end-chisel-passkeys */

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const fillDemo = (demoEmail: string) => {
        setEmail(demoEmail);
        setPassword('password');
    };

    return (
        <>
            <Head title="Log in" />

            {/* @chisel-passkeys */}
            <PasskeyVerify />
            {/* @end-chisel-passkeys */}

            {status && (
                <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-50/90 p-3.5 text-sm font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-[11px] font-bold">✓</span>
                    <span>{status}</span>
                </div>
            )}

            {/* Quick Demo Switcher */}
            <div className="mb-6 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/40">
                <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                        Explore Demo Accounts
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">1-Click autofill</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                    <button
                        type="button"
                        onClick={() => fillDemo('admin@rentify.demo')}
                        className={`flex flex-col items-start rounded-xl border p-2 text-left transition-all cursor-pointer ${
                            email === 'admin@rentify.demo'
                                ? 'border-red-500/50 bg-red-500/10 text-red-900 ring-2 ring-red-500/20 dark:text-red-300'
                                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-zinc-700 dark:bg-zinc-800'
                        }`}
                    >
                        <span className="text-xs font-bold">🛡️ Admin</span>
                        <span className="w-full truncate text-[10px] text-slate-500 dark:text-slate-400">Disputes</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => fillDemo('owner@rentify.demo')}
                        className={`flex flex-col items-start rounded-xl border p-2 text-left transition-all cursor-pointer ${
                            email === 'owner@rentify.demo'
                                ? 'border-amber-500/50 bg-amber-500/10 text-amber-900 ring-2 ring-amber-500/20 dark:text-amber-300'
                                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-zinc-700 dark:bg-zinc-800'
                        }`}
                    >
                        <span className="text-xs font-bold">🏠 Owner</span>
                        <span className="w-full truncate text-[10px] text-slate-500 dark:text-slate-400">Listings</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => fillDemo('agent@rentify.demo')}
                        className={`flex flex-col items-start rounded-xl border p-2 text-left transition-all cursor-pointer ${
                            email === 'agent@rentify.demo'
                                ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-900 ring-2 ring-indigo-500/20 dark:text-indigo-300'
                                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-zinc-700 dark:bg-zinc-800'
                        }`}
                    >
                        <span className="text-xs font-bold">👔 Agent</span>
                        <span className="w-full truncate text-[10px] text-slate-500 dark:text-slate-400">Mandates</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => fillDemo('tenant@rentify.demo')}
                        className={`flex flex-col items-start rounded-xl border p-2 text-left transition-all cursor-pointer ${
                            email === 'tenant@rentify.demo'
                                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-900 ring-2 ring-emerald-500/20 dark:text-emerald-300'
                                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-zinc-700 dark:bg-zinc-800'
                        }`}
                    >
                        <span className="text-xs font-bold">🔑 Tenant</span>
                        <span className="w-full truncate text-[10px] text-slate-500 dark:text-slate-400">Rentals</span>
                    </button>
                </div>
            </div>

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            <div className="grid gap-1.5">
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="name@company.com"
                                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 px-3.5 text-sm transition-all focus:bg-white focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10 dark:border-zinc-700 dark:bg-zinc-800/60"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-xs font-semibold text-blue-900 hover:text-blue-700 dark:text-blue-400"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 px-3.5 text-sm transition-all focus:bg-white focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10 dark:border-zinc-700 dark:bg-zinc-800/60"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-2.5 pt-1">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="rounded border-slate-300 data-[state=checked]:bg-blue-900 data-[state=checked]:border-blue-900"
                                />
                                <Label htmlFor="remember" className="text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
                                    Keep me signed in for 30 days
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 h-11 w-full rounded-xl bg-blue-900 text-sm font-bold text-white shadow-md shadow-blue-900/15 transition-all hover:bg-blue-800 hover:shadow-lg disabled:opacity-50 cursor-pointer"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Sign in to Account
                            </Button>
                        </div>

                        {/* @chisel-registration */}
                        <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                            Don't have an account yet?{' '}
                            <TextLink href={register()} tabIndex={5} className="font-bold text-blue-900 hover:text-blue-700 dark:text-blue-400 underline decoration-blue-900/20">
                                Create an account
                            </TextLink>
                        </div>
                        {/* @end-chisel-registration */}
                    </>
                )}
            </Form>
        </>
    );
}

Login.layout = {
    title: 'Welcome Back',
    description: 'Sign in to access your properties, bookings, and escrow vault.',
};
