// Components
import { Form, Head } from '@inertiajs/react';
import { MailCheck, LogOut } from 'lucide-react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <>
            <Head title="Verify Email" />

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300">
                <MailCheck className="h-6 w-6" />
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-50/90 p-3.5 text-sm font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-[11px] font-bold">✓</span>
                    <span>A new verification link has been sent to your registered email address.</span>
                </div>
            )}

            <Form {...send.form()} className="space-y-4 text-center">
                {({ processing }) => (
                    <>
                        <Button
                            disabled={processing}
                            className="h-11 w-full rounded-xl bg-blue-900 text-sm font-bold text-white shadow-md shadow-blue-900/15 transition-all hover:bg-blue-800 hover:shadow-lg disabled:opacity-50 cursor-pointer"
                        >
                            {processing && <Spinner />}
                            Resend Verification Email
                        </Button>

                        <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                            <TextLink
                                href={logout()}
                                className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400"
                            >
                                <LogOut className="h-3.5 w-3.5" />
                                Sign out of this account
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

VerifyEmail.layout = {
    title: 'Verify Your Email',
    description:
        'Please check your inbox and click the verification link to activate your escrow protection.',
};
