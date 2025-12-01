"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { redirect, useParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export function DeleteWorkspace({ handleOpen }: { handleOpen: () => void }) {
    const [open, setOpen] = useState(false);
    const { workspace_id } = useParams<{ workspace_id: string }>()
    const [isSubmitting, setIsSubmitting] = useState(false);

    const deleteWorkspace = async () => {
        handleOpen(); //this will close the workspace's setting sheet
        setIsSubmitting(true);
        const { data, error } = await authClient.organization.delete({
            organizationId: workspace_id,
        });
        if (data) {
            toast.success("deleted workspace")
            redirect("/workspace");
        }
        if (error) {
            toast.error(error.message)
        }
        setIsSubmitting(false);
        setOpen(false);
    }
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" className="w-full transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-red-500/20 active:scale-[0.98]">
                    <Trash className="size-4" /> Delete workspace
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure you want to delete workspace?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this workspace
                        and remove its data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteWorkspace} className="bg-destructive hover:bg-destructive/50 transition-colors delay-75" disabled={isSubmitting}>
                        {isSubmitting ?
                            <>
                                <Spinner />
                                Deleting
                            </>
                            :
                            "Continue"
                        }
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
