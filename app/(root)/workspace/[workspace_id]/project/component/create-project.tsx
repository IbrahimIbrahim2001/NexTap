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
import { orpc } from "@/lib/orpc";
import { createProjectSchema, createProjectSchemaType } from "@/schemas/create-project-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

const ICON_OPTIONS = [
    "🚀", "💼", "📊", "🎨", "📝", "🔧", "⭐", "📚",
    "🎯", "💡", "🛠️", "📈", "🔍", "📱", "🌐", "💻"
];

export function CreateProject({ trigger }: { trigger: ReactNode }) {
    const [open, setOpen] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState("🚀");
    const router = useRouter();
    const queryClient = useQueryClient()
    const { data: activeWorkspace } = authClient.useActiveOrganization()
    const params = useParams<{ workspace_id: string }>();
    const mutateCreateProject = useMutation(orpc.project.create.mutationOptions({
        onSuccess: (data) => {
            if (data.success) {
                toast.success(data.message);
                setOpen(false);
                form.reset();
                router.push(`/workspace/${activeWorkspace?.id}/project/${data.projectId}`);
            } else {
                toast.error(data.message);
            }
            queryClient.invalidateQueries({
                queryKey: orpc.project.list.queryKey({ input: { workspace_id: params.workspace_id } })
            });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create project");
        }
    }));

    const form = useForm({
        resolver: zodResolver(createProjectSchema),
        defaultValues: {
            name: "",
            icon: "🚀",
            workspaceId: params.workspace_id
        },
    })

    function onSubmit(values: createProjectSchemaType) {
        mutateCreateProject.mutateAsync(values);
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
                            <DialogTitle>Create New Project</DialogTitle>
                            <DialogDescription>
                                Create a new project with a name and icon
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                            {/* Icon Selection */}
                            <div className="grid gap-3">
                                <Field>
                                    <FieldLabel>Project Icon</FieldLabel>
                                    <div className="grid grid-cols-8 gap-2 p-2 border rounded-md">
                                        {ICON_OPTIONS.map((icon) => (
                                            <button
                                                key={icon}
                                                type="button"
                                                className={`w-8 h-8 rounded flex items-center justify-center text-lg hover:bg-gray-100 ${selectedIcon === icon ? 'bg-blue-100 border border-blue-300' : ''
                                                    }`}
                                                onClick={() => {
                                                    setSelectedIcon(icon);
                                                    form.setValue('icon', icon);
                                                }}
                                            >
                                                {icon}
                                            </button>
                                        ))}
                                    </div>
                                </Field>
                            </div>

                            {/* Project Name */}
                            <div className="grid gap-3">
                                <Controller
                                    name="name"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-name">
                                                Project Name
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-name"
                                                type="text"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Enter project name"
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
                                    "Create Project"
                                }
                            </Button>
                        </DialogFooter>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    )
}