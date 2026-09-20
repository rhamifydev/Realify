// Components
import { Form, Head } from '@inertiajs/react';
import { ArrowLeft, KeyRound, LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Forgot Password" />

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300">
                <KeyRound className="h-6 w-6" />
            </div>

            {status && (
                <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-50/90 p-3.5 text-sm font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-[11px] font-bold">✓</span>
                    <span>{status}</span>
                </div>
            )}

            <div className="space-y-5">
                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-1.5">
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    placeholder="name@company.com"
                                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 px-3.5 text-sm transition-all focus:bg-white focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10 dark:border-zinc-700 dark:bg-zinc-800/60"
                                />

                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            <div className="my-5">
                                <Button
                                    className="h-11 w-full rounded-xl bg-blue-900 text-sm font-bold text-white shadow-md shadow-blue-900/15 transition-all hover:bg-blue-800 hover:shadow-lg disabled:opacity-50 cursor-pointer"
                                    disabled={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing && (
                                        <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                    )}
                                    Send Password Reset Link
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="text-center text-xs text-slate-500 dark:text-slate-400">
                    <TextLink
                        href={login()}
                        className="inline-flex items-center gap-1 font-semibold text-blue-900 hover:text-blue-700 dark:text-blue-400"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to sign in
                    </TextLink>
                </div>
            </div>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Reset your password',
    description: 'Enter the email associated with your account and we’ll send you a recovery link.',
};
