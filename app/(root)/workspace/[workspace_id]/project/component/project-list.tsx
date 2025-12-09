"use client";
import { Loader } from '@/app/(root)/components/loader';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { orpc } from '@/lib/orpc';
import { useQuery } from '@tanstack/react-query';
import { CreateProject } from './create-project';
import { Project } from './project';
import { Plus } from 'lucide-react';

export function ProjectList({ workspace_id }: { workspace_id: string }) {

    const { data: projects, isError, isLoading } = useQuery(orpc.project.list.queryOptions({ input: { workspace_id } }))
    if (isError) return <>Error</>
    if (isLoading) return <Loader />
    if (!projects || projects.length === 0)
        return (
            <div className='p-4'>
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <Logo width={32} height={32} />
                        </EmptyMedia>
                        <EmptyTitle className="text-secondary font-semibold">No Projects Yet</EmptyTitle>
                        <EmptyDescription>
                            You haven&apos;t created any Projects yet. Get started by creating
                            your first project.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <CreateProject trigger={<Button variant="outline">Create Project</Button>} />
                    </EmptyContent>
                </Empty>
            </div>
        )
    return (
        <div className=" px-6 py-8 w-full">
            <p className="text-lg font-semibold mb-4">Your Projects:</p>
            <div className="flex items-center justify-center">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full">
                    {projects?.map((project) => (
                        <Project key={project.id} project={project} />
                    ))}
                    <CreateProject trigger={
                        <Card className="border-2 border-dashed w-full md:max-w-sm h-full min-h-24 p-0 shadow-none hover:scale-105">
                            <CardContent className="p-6 h-full flex items-center justify-center">
                                <Plus className='size-10 text-foreground/80' />
                            </CardContent>
                        </Card>
                    }
                    />
                </div>
            </div>
        </div>
    )
}