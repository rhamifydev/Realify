import { Form, Head } from '@inertiajs/react';
import { Lock } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/password/confirm';
/* @chisel-passkeys */
import {
    index as confirmOptions,
    store as confirmStore,
} from '@/actions/Laravel/Passkeys/Http/Controllers/PasskeyConfirmationController';
import PasskeyVerify from '@/components/passkey-verify';
/* @end-chisel-passkeys */

export default function ConfirmPassword() {
    return (
        <>
            <Head title="Confirm Password" />

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300">
                <Lock className="h-6 w-6" />
            </div>

            {/* @chisel-passkeys */}
            <PasskeyVerify
                routes={{
                    options: confirmOptions(),
                    submit: confirmStore(),
                }}
                label="Confirm with passkey"
                loadingLabel="Confirming..."
                separator="Or confirm with password"
            />
            {/* @end-chisel-passkeys */}

            <Form {...store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <div className="space-y-4">
                        <div className="grid gap-1.5">
                            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                Password
                            </Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                placeholder="Enter your current password"
                                autoComplete="current-password"
                                autoFocus
                                className="h-11 rounded-xl border-slate-200 bg-slate-50/50 px-3.5 text-sm transition-all focus:bg-white focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10 dark:border-zinc-700 dark:bg-zinc-800/60"
                            />

                            <InputError message={errors.password} className="mt-1" />
                        </div>

                        <div className="pt-2">
                            <Button
                                className="h-11 w-full rounded-xl bg-blue-900 text-sm font-bold text-white shadow-md shadow-blue-900/15 transition-all hover:bg-blue-800 hover:shadow-lg disabled:opacity-50 cursor-pointer"
                                disabled={processing}
                                data-test="confirm-password-button"
                            >
                                {processing && <Spinner />}
                                Confirm Password
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </>
    );
}

ConfirmPassword.layout = {
    title: 'Security Verification',
    description:
        'This is a secure area of Rentify. Please confirm your password to proceed.',
};
