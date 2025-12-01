"use client";

import {
    Field,
    FieldError,
    FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
    slug: z.string().min(2).max(10)
})

export function UpdateWorkspaceSlug({ workspaceSlug }: { workspaceSlug?: string }) {
    const { workspace_id } = useParams<{ workspace_id: string }>()
    const [isEditing, setIsEditing] = useState(false);
    const [slug, setSlug] = useState(workspaceSlug);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            slug: "",
        },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        const { slug } = data;
        setSlug(data.slug);
        const { data: res, error } = await authClient.organization.update({
            data: {
                slug,
            },
            organizationId: workspace_id,
        });
        setIsEditing(false);
        form.reset();
        if (res) {
            toast.success("updated organization slug");
        }
        if (error) {
            toast.error(error.message);
        }
    }

    const handleCancel = () => {
        form.reset();
        setIsEditing(false);
    }
    const isSubmitting = form.formState.isSubmitting;
    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Controller
                name="slug"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="flex justify-between">
                            <p>{!isEditing ? <>Slug: {slug}</> : "Update slug"}</p>
                            {isEditing ? (
                                <Button type="button" variant="ghost" size="icon-sm" onClick={handleCancel}>
                                    <X className="size-4" />
                                </Button>
                            ) : (
                                <Button type="button" variant="ghost" size="icon-sm" onClick={() => setIsEditing(true)}>
                                    <Edit className="size-4" />
                                </Button>
                            )}
                        </FieldLabel>
                        {isEditing && (
                            <Input
                                {...field}
                                aria-invalid={fieldState.invalid}
                                placeholder="new slug"
                                autoComplete="slug"
                            />
                        )}
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />
            {isEditing && (
                <Field>
                    <div className="flex justify-end mt-3">
                        <Button type="submit" size="sm" disabled={isSubmitting} className="flex items-center">
                            {isSubmitting ?
                                <>
                                    <Spinner />
                                    Updating
                                </>
                                : "Update"
                            }
                        </Button>
                    </div>
                </Field>
            )}
        </form>
    )
}