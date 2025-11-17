import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Organization } from "better-auth/plugins";

interface WorkspaceAvatarProps {
    workspace: Organization | undefined,
    height?: string,
    width?: string
}
function getWorkspaceColor(workspaceIdentifier: string): string {
    let hash = 0;
    for (let i = 0; i < workspaceIdentifier.length; i++) {
        hash = workspaceIdentifier.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
        'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500',
        'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
        'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
        'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500',
        'bg-rose-500'
    ];
    return colors[Math.abs(hash % colors.length)];
}


export default function WorkspaceAvatar({ workspace, height, width }: WorkspaceAvatarProps) {
    if (!workspace) return null;

    const fallbackColor = getWorkspaceColor(workspace.slug || workspace.name);
    return (
        <Avatar className={`${height} ${width}  rounded-lg`}>
            <AvatarImage src={workspace?.logo ?? undefined} alt={workspace.slug} />
            <AvatarFallback className={`rounded-lg ${fallbackColor}`}>{workspace.name.charAt(0).toLocaleUpperCase()}</AvatarFallback>
        </Avatar>
    )
}
