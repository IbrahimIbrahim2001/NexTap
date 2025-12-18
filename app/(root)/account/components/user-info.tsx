"use client";
import { useSession } from "@/lib/auth-client"

export function UserInfo() {
    const user = useSession()?.data?.user;

    if (!user) {
        return null
    }
    return (
        <>
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">username</p>
                    <p className="text-sm text-muted-foreground">{user.name}</p>
                </div>
            </div>
        </>
    )
}
