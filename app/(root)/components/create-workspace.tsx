"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { createWorkspaceSchema, createWorkspaceSchemaType } from "@/schemas/create-workspace-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { ReactNode, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export function CreateWorkSpace({ trigger }: { trigger: ReactNode }) {
    const [open, setOpen] = useState(false);
    const form = useForm({
        resolver: zodResolver(createWorkspaceSchema),
        defaultValues: {
            name: "",
            slug: ""
        },
    })

    async function onSubmit(values: createWorkspaceSchemaType) {
        const { name, slug } = values;
        const { data, error } = await authClient.organization.create({
            name,
            slug,
        })
        if (data) {
            toast.success(`create workspace "${values.name}" successfully`)
            setOpen(false);
            form.reset();
            redirect(`/workspace/${data.id}/project`);
        } else if (error) {
            toast.error(error.message)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild className="group h-10">
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form id="form" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <DialogHeader>
                            <DialogTitle>Create New Workspace</DialogTitle>
                            <DialogDescription>
                                Add a new workspace to organize your projects and team members.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Controller
                                    name="name"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-workspace">
                                                Workspace Name
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-name"
                                                type="text"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Enter workspace name"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                            </div>
                            <div className="grid gap-3">
                                <Controller
                                    name="slug"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-slug">
                                                Workspace Slug
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-slug"
                                                type="text"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Enter workspace slug"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={form.formState.isSubmitting} className="flex items-center">
                                {form.formState.isSubmitting ?
                                    <>
                                        <Spinner />
                                        Creating...
                                    </>
                                    :
                                    "Create Workspace"
                                }
                            </Button>
                        </DialogFooter>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    )
}