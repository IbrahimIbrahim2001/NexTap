"use client";
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
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { Trash } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
export function DeleteAccount() {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleDelete = async () => {
        setIsSubmitting(true);
        await authClient.deleteUser({
            callbackURL: "/login"
        }, {
            onSuccess: () => {
                setIsSubmitting(false)
                setOpen(false);
                toast.success("deleted your account successfully")
                redirect("/login");
            },
            onError: (error) => {
                setIsSubmitting(false)
                setOpen(false);
                toast.error(error.error.message)
            }
        });
    }
    return (
        <>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive" className="transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-red-500/20 active:scale-[0.98]">
                        <Trash className="size-4" /> Delete account
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure you want to delete your account?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this account
                            and remove its data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/50 transition-colors delay-75" disabled={isSubmitting}>
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
        </>
    )
}