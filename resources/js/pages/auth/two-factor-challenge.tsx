import { Form, Head, setLayoutProps } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { KeyRound, ShieldCheck, Smartphone } from 'lucide-react';
import { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import { store } from '@/routes/two-factor/login';

export default function TwoFactorChallenge() {
    const [showRecoveryInput, setShowRecoveryInput] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');

    const authConfigContent = useMemo<{
        title: string;
        description: string;
        toggleText: string;
    }>(() => {
        if (showRecoveryInput) {
            return {
                title: 'Recovery code',
                description:
                    'Please confirm access to your account by entering one of your emergency recovery codes.',
                toggleText: 'login using an authentication code',
            };
        }

        return {
            title: 'Two-factor authentication',
            description:
                'Enter the 6-digit authentication code from your authenticator app.',
            toggleText: 'login using a recovery code',
        };
    }, [showRecoveryInput]);

    setLayoutProps({
        title: authConfigContent.title,
        description: authConfigContent.description,
    });

    const toggleRecoveryMode = (clearErrors: () => void): void => {
        setShowRecoveryInput(!showRecoveryInput);
        clearErrors();
        setCode('');
    };

    return (
        <>
            <Head title="Two-factor Authentication" />

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300">
                {showRecoveryInput ? (
                    <KeyRound className="h-6 w-6" />
                ) : (
                    <Smartphone className="h-6 w-6" />
                )}
            </div>

            <div className="space-y-6">
                <Form
                    {...store.form()}
                    className="space-y-4"
                    resetOnError
                    resetOnSuccess={!showRecoveryInput}
                >
                    {({ errors, processing, clearErrors }) => (
                        <>
                            {showRecoveryInput ? (
                                <div className="grid gap-1.5">
                                    <Label htmlFor="recovery_code" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Emergency Recovery Code
                                    </Label>
                                    <Input
                                        id="recovery_code"
                                        name="recovery_code"
                                        type="text"
                                        placeholder="xxxx-xxxx-xxxx"
                                        autoFocus={showRecoveryInput}
                                        required
                                        className="h-11 rounded-xl border-slate-200 bg-slate-50/50 px-3.5 text-sm transition-all focus:bg-white focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10 dark:border-zinc-700 dark:bg-zinc-800/60 font-mono text-center tracking-wider"
                                    />
                                    <InputError
                                        message={errors.recovery_code}
                                        className="mt-1"
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center space-y-4 py-2 text-center">
                                    <div className="flex w-full items-center justify-center">
                                        <InputOTP
                                            name="code"
                                            maxLength={OTP_MAX_LENGTH}
                                            value={code}
                                            onChange={(value) => setCode(value)}
                                            disabled={processing}
                                            pattern={REGEXP_ONLY_DIGITS}
                                            autoFocus
                                        >
                                            <InputOTPGroup className="gap-2">
                                                {Array.from(
                                                    { length: OTP_MAX_LENGTH },
                                                    (_, index) => (
                                                        <InputOTPSlot
                                                            key={index}
                                                            index={index}
                                                            className="h-12 w-11 rounded-xl border border-slate-200 text-lg font-bold shadow-xs transition-all focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 dark:border-zinc-700 dark:bg-zinc-800"
                                                        />
                                                    ),
                                                )}
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                    <InputError message={errors.code} />
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="mt-2 h-11 w-full rounded-xl bg-blue-900 text-sm font-bold text-white shadow-md shadow-blue-900/15 transition-all hover:bg-blue-800 hover:shadow-lg disabled:opacity-50 cursor-pointer"
                                disabled={processing}
                            >
                                {processing && <Spinner />}
                                Verify & Proceed
                            </Button>

                            <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                                <span>Can't access your phone? </span>
                                <button
                                    type="button"
                                    className="cursor-pointer font-semibold text-blue-900 hover:text-blue-700 dark:text-blue-400 underline decoration-blue-900/20"
                                    onClick={() =>
                                        toggleRecoveryMode(clearErrors)
                                    }
                                >
                                    {authConfigContent.toggleText}
                                </button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}
