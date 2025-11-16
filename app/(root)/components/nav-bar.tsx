"use client";
import { ModeToggle } from "@/components/mode-toggle";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { useParams } from "next/navigation";

export function Navbar() {
    const params = useParams<{ workspace_id: string }>()
    const { data: workspace } = authClient.useActiveOrganization()
    return (
        <nav className="w-full px-2 h-12 flex justify-between items-center border-b border-border">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-4" />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />
                {params.workspace_id &&
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href={workspace?.id}>
                                    {workspace?.name ? <p>{workspace?.name}</p>
                                        : <Skeleton className="w-20 h-4 transition-all duration-200" />
                                    }
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Project Name</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            </div>
            <div className="pe-4">
                <ModeToggle />
            </div>
        </nav>
    )
}
