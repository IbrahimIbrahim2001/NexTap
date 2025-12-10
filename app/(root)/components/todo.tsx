"use client";

import { TodoWithUser } from "@/app/router/workspace";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { getTaskStatusBadgeBorderColor } from "../utils/get-role-badge-color";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export function Todo({ task }: { task: TodoWithUser }) {
    const queryClient = useQueryClient();
    const mutate = useMutation(orpc.workspace.tasks.update.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: orpc.workspace.tasks.list.queryKey({ input: { workspace_id: task.organizationId } }) })
        },
    }));
    const activeMember = authClient.useActiveMemberRole();
    const mutateDelete = useMutation(orpc.workspace.tasks.delete.mutationOptions({
        onMutate: async (data) => {
            await queryClient.cancelQueries();
            const taskListKey = orpc.workspace.tasks.list.queryKey({ input: { workspace_id: data.workspace_id } });
            const previousData = queryClient.getQueryData<TodoWithUser[]>([taskListKey]);
            queryClient.setQueryData<TodoWithUser[]>([taskListKey], (old) => {
                if (!old) return [];
                return old.filter(task => task.id !== data.task_id);
            });
            return { previousData, taskListKey };
        },
        onSuccess: (data, _variables, context) => {
            if (data.success) {
                queryClient.invalidateQueries({ queryKey: context?.taskListKey });
                toast.success(data.message);
            }
        },
        onError(_error, _variables, context) {
            if (context?.previousData) {
                queryClient.setQueryData([context.taskListKey], context.previousData);
            }
            toast.error("Failed to delete the task. Please try again.");
        }
    }))
    const updateTaskStatus = async (status: TodoWithUser["status"]) => {
        await mutate.mutateAsync({
            workspace_id: task.organizationId,
            task_id: task.id,
            status
        });
    }
    const deleteTask = () => {
        if (activeMember.data?.role !== 'admin' && activeMember.data?.role !== 'owner') {
            toast.error("You don't have permission to delete this task.");
            return;
        }
        mutateDelete.mutateAsync({ workspace_id: task.organizationId, task_id: task.id });
    }
    return (
        <div
            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
        >
            <div className="flex-1 min-w-0">
                <p className="text-sm  font-semibold text-left wrap-break-word whitespace-normal">
                    {task.content}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    Assigned to: {task.member?.name}
                </p>
            </div>
            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Badge className={`${getTaskStatusBadgeBorderColor(task.status)}`}>
                            {task.status}
                        </Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="mr-8 w-40">
                        <DropdownMenuLabel className="text-muted-foreground text-xs">
                            update todo status
                        </DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => updateTaskStatus("to do")} className="hover:data-[variant=default]:bg-primary/90">
                            <p className="">To do</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateTaskStatus("in progress")} className="hover:data-[variant=default]:bg-secondary/90 ">
                            <p>in progress</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateTaskStatus("done")} className="hover:data-[variant=default]:bg-accent/90 ">
                            <p>done</p>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            onClick={deleteTask}
                            className="text-destructive focus:text-destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete task</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}