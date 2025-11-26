"use client";

import { orpc } from "@/lib/orpc";
import { useMutation } from "@tanstack/react-query";
import { type Editor } from "@tiptap/react";
import { useParams } from "next/navigation";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";

interface SaveChangesButtonProps {
    editor: Editor | null
}

export const SaveChangesButton = ({ editor }: SaveChangesButtonProps) => {
    const { workspace_id, project_id } = useParams<{ workspace_id: string, project_id: string }>();
    const saveNewContent = useMutation(orpc.project.update.mutationOptions());
    const handleSave = async () => {
        if (!editor) {
            console.error("Editor not available");
            return;
        }
        const htmlContent = editor.getHTML();
        const { success } = await saveNewContent.mutateAsync({ workspace_id, project_id, newContent: htmlContent });
        if (success) toast.success("Changes saved successfully!")
        else {
            toast.error("Failed to save changes");
        }
    }
    const { isPending } = saveNewContent;
    return (
        <div className="flex-1 grid justify-items-end">
            <Button onClick={handleSave} disabled={isPending} className="flex items-center">
                {isPending ?
                    <>
                        <Spinner />
                        Saving...
                    </>
                    :
                    "Save changes"
                }
            </Button>
        </div>
    )
}