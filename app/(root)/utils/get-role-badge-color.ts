export type Role = "owner" | "admin" | "member";
export function getBadgeColor(role: Role): string {
    switch (role) {
        case "owner": return "bg-accent";
        case "admin": return "bg-secondary";
        case "member": return "bg-accent";
        default: return "bg-primary";
    }
}