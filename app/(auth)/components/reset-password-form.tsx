"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { isStrongPassword } from "validator";
import z from "zod";

const formSchema = z.object({
    password: z.string().refine((password) => isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        returnScore: false
    }), "Password is not strong enough"),
    confirmPassword: z.string(),
})

export function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") as string;
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        },
    });
    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (values.password !== values.confirmPassword) {
            toast.error("Password do not match");
        } else {
            await authClient.resetPassword({
                newPassword: values.password,
                token
            }, {
                onSuccess: () => {
                    toast.success("Password updated successfully");
                    redirect("../login");
                },
                onError: (error) => {
                    toast.error(error.error.message);
                }
            })
        }
        form.reset()
    }

    if (!token) redirect("../login");
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
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-password">
                                        New Password
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-password"
                                        type="password"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter new password"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Controller
                            name="confirmPassword"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-password">
                                        Confirm Password
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-password"
                                        type="password"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Confirm password"
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
                            "Reset Password"
                        }
                    </Button>
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