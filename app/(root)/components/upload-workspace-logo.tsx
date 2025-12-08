"use client";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
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
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { UploadDropzone } from "@uploadthing/react";
import { X } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Activity } from "react";
import { toast } from "sonner";
import { useAttachmentUpload } from "../workspace/[workspace_id]/hooks/use-attachment-upload";
;

export function UploadWorkSpaceLogo({ workspaceLogo }: { workspaceLogo: string | undefined | null }) {
    const upload = useAttachmentUpload();
    const { workspace_id } = useParams<{ workspace_id: string }>()
    const handleUploadLogo = async () => {
        await authClient.organization.update({
            data: {
                logo: upload.stagedUrl as string,
            },
            organizationId: workspace_id,
        }, {
            onSuccess: () => {
                upload.setOpen(false);;
                upload.setUploading(false);
            }
        });

    }

    const deleteLogo = async () => {
        await authClient.organization.update({
            data: {
                logo: "",
            },
            organizationId: workspace_id,
        }, {
            onSuccess: () => {
                upload.setOpen(false);
                toast.success("Deleted logo successfully")
            },
            onError: () => {
                toast.error("Failed to delete logo")
            }
        });
    }

    const handleClose = () => {
        upload.setOpen(false);
        upload.setStageUrl(null);
    }


    return (
        <Dialog open={upload.isOpen} onOpenChange={upload.setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                    upload
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        Upload workspace logo
                    </DialogTitle>
                    <DialogDescription>
                        max file size is 1 mb
                    </DialogDescription>
                </DialogHeader>
                <UploadDropzone<OurFileRouter, "imageUploader">
                    className="ut-uploading:opacity-90 ut-ready:bg-card ut-ready:border-border ut-ready:text-foreground ut-uploading:border-border ut-uploading:text-muted-foreground ut-button:bg-primary rounded-lg border-2"
                    appearance={{
                        container: "bg-card",
                        label: "text-muted-foreground hover:text-primary transition-color delay-75",
                        allowedContent: "text-xs text-muted-foreground",
                        uploadIcon: "text-muted-foreground"
                    }}
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                        const url = res[0].ufsUrl;
                        toast.success("Uploaded image successfully")
                        upload.onUploaded(url);
                    }}
                    onUploadError={(error: Error) => {
                        toast.error(error.message);
                    }}
                />
                <Activity mode={upload?.stagedUrl || workspaceLogo ? "visible" : "hidden"}>
                    <div className="relative w-fit">
                        <Image

                            src={((upload?.stagedUrl || workspaceLogo)?.trimStart() ?? undefined) as string}
                            alt="workspace logo"
                            width={100}
                            height={100}
                            className="rounded-lg border-2 hover:border-primary transition-colors delay-75 "
                        />
                        <Button type="button" variant='destructive' size="icon-xs" className=" absolute -top-2 -right-2 rounded-lg bg-destructive hover:bg-destructive/80" onClick={deleteLogo}>
                            <X className="size-4" />
                        </Button>
                    </div>
                </Activity>
                <DialogFooter>
                    <DialogClose onClick={handleClose} asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleUploadLogo} disabled={upload.isUploading || !upload.stagedUrl} type="submit" className="flex items-center">
                        {upload.isUploading ?
                            <>
                                <Spinner />
                                uploading...
                            </>
                            :
                            "Confirm"
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}