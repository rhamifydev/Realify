import { Form, Head } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    return (
        <>
            <Head title="Create Account" />

            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-blue-600/15 bg-blue-50/70 p-3 text-xs text-blue-900 dark:bg-blue-950/30 dark:border-blue-500/20 dark:text-blue-300">
                <ShieldCheck className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                <span>Deposits held in licensed escrow until physical inspection.</span>
            </div>

            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-4"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-4">
                            <div className="grid gap-1.5">
                                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Full name
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="e.g. Babatunde Adeleke"
                                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 px-3.5 text-sm transition-all focus:bg-white focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10 dark:border-zinc-700 dark:bg-zinc-800/60"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-1"
                                />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="name@company.com"
                                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 px-3.5 text-sm transition-all focus:bg-white focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10 dark:border-zinc-700 dark:bg-zinc-800/60"
                                />
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Password
                                </Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Create secure password"
                                    passwordrules={passwordRules}
                                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 px-3.5 text-sm transition-all focus:bg-white focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10 dark:border-zinc-700 dark:bg-zinc-800/60"
                                />
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="password_confirmation" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Confirm password
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Re-enter password"
                                    passwordrules={passwordRules}
                                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 px-3.5 text-sm transition-all focus:bg-white focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10 dark:border-zinc-700 dark:bg-zinc-800/60"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-1"
                                />
                            </div>

                            <div className="pt-1">
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                                    By registering, you agree to Rentify's{' '}
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">Escrow Terms of Service</span> &{' '}
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">Privacy Policy</span>.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                className="mt-1 h-11 w-full rounded-xl bg-blue-900 text-sm font-bold text-white shadow-md shadow-blue-900/15 transition-all hover:bg-blue-800 hover:shadow-lg disabled:opacity-50 cursor-pointer"
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Create Free Account
                            </Button>
                        </div>

                        <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                            Already have an account?{' '}
                            <TextLink href={login()} tabIndex={6} className="font-bold text-blue-900 hover:text-blue-700 dark:text-blue-400 underline decoration-blue-900/20">
                                Sign in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Create Account',
    description: 'Join verified tenants & landlords using escrow-protected renting.',
};
