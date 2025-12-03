"use client";

import { useCallback, useMemo, useState } from "react";

export function useAttachmentUpload() {
    const [isOpen, setOpen] = useState(false);
    const [stagedUrl, setStageUrl] = useState<string | null>(null);
    const [isUploading, setUploading] = useState(false);
    const onUploaded = useCallback((url: string) => {
        setStageUrl(url);
        setUploading(false);
    }, [])

    return useMemo(
        () => ({
            isOpen,
            setOpen,
            onUploaded,
            stagedUrl,
            setStageUrl,
            isUploading,
            setUploading
        }),
        [isOpen, setOpen, onUploaded, stagedUrl, setStageUrl, isUploading, setUploading]
    )
}