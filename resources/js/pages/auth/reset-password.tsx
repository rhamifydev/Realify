import { Form, Head } from '@inertiajs/react';
import { KeyRound } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
    passwordRules: string;
};

export default function ResetPassword({ token, email, passwordRules }: Props) {
    return (
        <>
            <Head title="Reset Password" />

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300">
                <KeyRound className="h-6 w-6" />
            </div>

            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-4">
                        <div className="grid gap-1.5">
                            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                className="h-11 rounded-xl border-slate-200 bg-slate-100/70 px-3.5 text-sm text-slate-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-300 cursor-not-allowed"
                                readOnly
                            />
                            <InputError
                                message={errors.email}
                                className="mt-1"
                            />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                New Password
                            </Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                autoComplete="new-password"
                                className="h-11 rounded-xl border-slate-200 bg-slate-50/50 px-3.5 text-sm transition-all focus:bg-white focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10 dark:border-zinc-700 dark:bg-zinc-800/60"
                                autoFocus
                                placeholder="Create new password"
                                passwordrules={passwordRules}
                            />
                            <InputError message={errors.password} className="mt-1" />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="password_confirmation" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                Confirm New Password
                            </Label>
                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                autoComplete="new-password"
                                className="h-11 rounded-xl border-slate-200 bg-slate-50/50 px-3.5 text-sm transition-all focus:bg-white focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10 dark:border-zinc-700 dark:bg-zinc-800/60"
                                placeholder="Re-enter new password"
                                passwordrules={passwordRules}
                            />
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-1"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="mt-2 h-11 w-full rounded-xl bg-blue-900 text-sm font-bold text-white shadow-md shadow-blue-900/15 transition-all hover:bg-blue-800 hover:shadow-lg disabled:opacity-50 cursor-pointer"
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing && <Spinner />}
                            Reset Password
                        </Button>
                    </div>
                )}
            </Form>
        </>
    );
}

ResetPassword.layout = {
    title: 'Set New Password',
    description: 'Create a strong, new password for your Rentify account.',
};
