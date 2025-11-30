"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
const formSchema = z.object({
    email: z.email(),
    role: z.enum(["admin", "member"]),
})

export default function AddMember() {
    const { data: activeOrganization } = authClient.useActiveOrganization()
    const [open, setOpen] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            role: "member",
        },
    })
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const { email, role } = values;
        const { data, error } = await authClient.organization.inviteMember({
            email: email,
            role: role,
            organizationId: activeOrganization?.id,
        });
        if (data) {
            toast.success("Email sent successfully");
        }
        if (error) {
            console.error('Invitation error:', error);
            toast.error(error.message);
        }
        setOpen(false);
        form.reset();
    }
    const isLoading = form.formState.isSubmitting
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    Invite member
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[450px]">
                <DialogHeader>
                    <DialogTitle>
                        Add new member
                    </DialogTitle>
                    <DialogDescription>
                        New member will receive an invitation email
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <form id="form-rhf-new-member" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-rhf-email">
                                            User email
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-rhf-email"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="user email"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="role"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field
                                        orientation="responsive"
                                        data-invalid={fieldState.invalid}
                                    >
                                        <FieldContent>
                                            <FieldLabel htmlFor="form-rhf-select-role">
                                                Role
                                            </FieldLabel>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </FieldContent>
                                        <Select
                                            name={field.name}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger
                                                id="form-rhf-select-role"
                                                aria-invalid={fieldState.invalid}
                                                className="min-w-[120px]"
                                            >
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent position="item-aligned" defaultValue="member">
                                                <SelectItem value="member">member</SelectItem>
                                                <SelectItem value="admin">admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                        <Field orientation="horizontal" className="grid place-items-end mt-4">
                            <Button disabled={isLoading} type="submit" variant="default" className="flex items-center w-32">
                                {isLoading ?
                                    <>
                                        <Spinner />
                                        Please wait
                                    </>
                                    :
                                    "Invite"
                                }
                            </Button>
                        </Field>
                    </form>
                </div>
            </DialogContent>
        </Dialog >
    )
}
