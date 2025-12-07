"use client";
import { MemberWithUser, TodoWithUser } from "@/app/router/workspace";
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
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { orpc } from "@/lib/orpc";
import { createTaskSchema, createTaskSchemaType } from "@/schemas/create-task-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export default function CreateTask({ member, trigger }: { member: MemberWithUser, trigger: ReactNode }) {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient()
    const mutation = useMutation(orpc.workspace.tasks.create.mutationOptions({
        onMutate: async (data) => {
            await queryClient.cancelQueries();
            const taskListKey = orpc.workspace.tasks.list.queryKey({ input: { workspace_id: member.organizationId ?? data.workspace_id } });
            const previousData = queryClient.getQueryData([taskListKey]) as TodoWithUser;
            const tempId = crypto.randomUUID();
            const newTask = {
                id: tempId,
                organizationId: data.workspace_id,
                status: "to do",
                content: data.content,
                assigned_to: data.assigned_to,
                createdAt: new Date(),
                updatedAt: new Date(),
                member: {
                    id: data.assigned_to,
                    email: member.user.email,
                    name: member.user.name,
                    emailVerified: true,
                    image: member.user.image,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            } satisfies TodoWithUser
            queryClient.setQueryData<TodoWithUser[]>(taskListKey, (old) => {
                if (!old) return [newTask];
                return [...old, newTask];
            });
            return {
                previousData,
                tempId,
                taskListKey
            }
        },
        onSuccess: (data, _variables, context) => {
            if (data.success) {
                queryClient.setQueryData<TodoWithUser[]>(context.taskListKey, (old) => {
                    if (!old) return old;
                    return old?.map(task =>
                        task.id === context.tempId
                            ? { ...task, id: data.taskId as string }
                            : task
                    )
                })
            }
            toast.success(data.message);
        },
        onError: (error, _variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData([context.taskListKey], context.previousData)
            }
            toast.error(error.message || "Failed to create task");
        }
    }));
    const form = useForm<z.infer<typeof createTaskSchema>>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            workspace_id: member.organizationId,
            content: "",
            assigned_to: member.userId
        },
    })

    async function onSubmit(data: createTaskSchemaType) {
        mutation.mutateAsync(data);
        setOpen(false);
        form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild className="group h-8 w-full flex items-center">
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form id="form-rhf-input" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <DialogHeader>
                            <DialogTitle>
                                Create new task
                                <DialogDescription>assign task to members</DialogDescription>
                            </DialogTitle>
                        </DialogHeader>
                        <Controller
                            name="content"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-input-content">
                                        Task Content
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-rhf-input-content"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="add a new task"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={form.formState.isSubmitting} className="flex items-center">
                            {form.formState.isSubmitting ?
                                <>
                                    <Spinner />
                                    adding...
                                </>
                                :
                                "add task"
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}