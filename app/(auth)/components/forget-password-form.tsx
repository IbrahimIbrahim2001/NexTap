"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";


const formSchema = z.object({
    email: z.email(),
})

export function ForgetPasswordForm() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ""
        },
    });
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const { data, error } = await authClient.requestPasswordReset({
            email: values.email,
            redirectTo: `${process.env.NEXT_PUBLIC_CORS_ORIGIN}/reset-password`,
        });
        if (data) {
            toast.success("Email sent successfully")
            return;
        }
        if (error) {
            toast.error(error.message);
            return;
        }
    }
    return (
        <form
            id="form" onSubmit={form.handleSubmit(onSubmit)}
            className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
            <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
                <div className="text-center">
                    <Link
                        href="/"
                        aria-label="go home"
                        className="mx-auto block w-fit">
                        <Logo width={32} height={32} />
                    </Link>
                    <h1 className="mb-1 mt-4 text-xl font-semibold">Recover Password</h1>
                    <p className="text-sm">Enter your email to receive a reset link</p>
                </div>
                <div className="mt-6 space-y-6">
                    <div className="space-y-2">
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-email">
                                        Email
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-email"
                                        type="email"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter your email"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </div>
                    <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                        {form.formState.isSubmitting ?
                            <>
                                <Spinner />
                                Loading...
                            </>
                            :
                            "Send Reset Link"
                        }
                    </Button>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-muted-foreground text-sm">We&apos;ll send you a link to reset your password.</p>
                </div>
            </div>

            <div className="p-3">
                <p className="text-accent-foreground text-center text-sm">
                    Remembered your password?
                    <Button
                        asChild
                        variant="link"
                        className="px-2">
                        <Link href="/login">Log in</Link>
                    </Button>
                </p>
            </div>
        </form>
    )
}
