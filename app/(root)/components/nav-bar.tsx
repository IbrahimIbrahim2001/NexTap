"use client";
import { ModeToggle } from "@/components/mode-toggle";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/lib/orpc";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Activity } from "react";

export function Navbar() {
    const params = useParams<{ workspace_id: string, project_id: string }>()
    const { data: workspace } = authClient.useActiveOrganization();
    const { data: project, isLoading: isLoadingProject } = useQuery(orpc.project.get.queryOptions({ input: { workspace_id: params.workspace_id!, project_id: params.project_id! } }));
    return (
        <nav className="w-full px-2 h-12 flex justify-between items-center border-b border-border">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-4" />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Activity mode={params.workspace_id ? "visible" : "hidden"}>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <Link href={`/workspace/${workspace?.id}/project`}>
                                    {workspace?.name ?
                                        <p>{workspace?.name}</p>
                                        : <Skeleton className="w-20 h-4 transition-all duration-200" />
                                    }
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <Activity mode={(params.project_id && isLoadingProject) || project ? "visible" : "hidden"}>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        {isLoadingProject ?
                                            <Skeleton className="w-26 h-4 transition-all duration-200" />
                                            : <p>{project?.name}</p>
                                        }
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </Activity>
                        </BreadcrumbList>
                    </Breadcrumb>
                </Activity>
            </div>
            <div className="pe-4">
                <ModeToggle />
            </div>
        </nav>
    )
}
