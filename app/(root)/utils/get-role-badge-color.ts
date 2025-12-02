import { ProjectSchema } from "@/db/schema";

export type Role = "owner" | "admin" | "member";
export function getBadgeColor(role: Role): string {
    switch (role) {
        case "owner": return "bg-primary";
        case "admin": return "bg-secondary";
        case "member": return "bg-accent";
        default: return "bg-primary";
    }
}

export function getBadgeBorderColor(role: Role): string {
    switch (role) {
        case "owner": return "border-primary";
        case "admin": return "border-secondary ";
        case "member": return "border-accent ";
        default: return "border-primary";
    }
}

export function getBadgeTextColor(role: Role): string {
    switch (role) {
        case "owner": return "text-primary";
        case "admin": return "text-secondary";
        case "member": return "text-accent";
        default: return "text-primary";
    }
}



export function getProjectStatusBadgeColor(status: ProjectSchema["status"] | undefined): string {
    switch (status) {
        case "in progress": return "bg-secondary";
        case "finished": return "bg-destructive";
        default: return "bg-secondary";
    }
}


export function getProjectStatusBadgeBorderColor(status: ProjectSchema["status"] | undefined): string {
    switch (status) {
        case "in progress": return "border-secondary";
        case "finished": return "border-destructive";
        default: return "border-secondary";
    }
}

export function getProjectStatusBadgeTextColor(status: ProjectSchema["status"] | undefined): string {
    switch (status) {
        case "in progress": return "text-secondary";
        case "finished": return "text-destructive";
        default: return "text-secondary";
    }
}