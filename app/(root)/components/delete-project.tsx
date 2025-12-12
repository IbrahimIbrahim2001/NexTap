"use client";
import { Button } from "@/components/ui/button";
import { ProjectSchema } from "@/db/schema";
import { orpc } from "@/lib/orpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export function DeleteProject() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { workspace_id, project_id } = useParams<{ workspace_id: string, project_id: string }>()
    const mutate = useMutation(orpc.project.delete.mutationOptions({
        onMutate: async (data) => {
            const projectListKey = orpc.project.list.queryKey({ input: { workspace_id: data.workspace_id } });
            await queryClient.cancelQueries({ queryKey: projectListKey });
            const previous = queryClient.getQueryData<ProjectSchema[]>(projectListKey);
            queryClient.setQueryData<ProjectSchema[]>(projectListKey, (old) => {
                if (!old) return old;
                return old.filter(project => project.id !== data.project_id);
            })
            return {
                previous,
                projectListKey,
                project_id: data.project_id
            }
        },
        onSuccess: (data, _variables, context) => {
            if (data.success) {
                toast.success("Project deleted successfully.");
                queryClient.invalidateQueries({ queryKey: context.projectListKey });
                router.push(`/workspace/${workspace_id}/project`);
            }
        },
        onError: (_err, _variables, context) => {
            if (context?.previous) {
                toast.error("Failed to delete project. Please try again.");
            }
        }
    }));
    const handleDelete = () => {
        mutate.mutateAsync({ workspace_id, project_id })
    }
    return (
        <Button onClick={handleDelete} type="button" variant="destructive" className="w-full transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-red-500/20 active:scale-[0.98]">
            <Trash className="size-4" /> Delete Project
        </Button>
    )
}
