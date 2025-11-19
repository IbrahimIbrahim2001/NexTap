import { MagicCard } from '@/components/ui/magic-card';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { ProjectSchema } from '@/db/schema';
import { ChevronRight } from 'lucide-react';

interface ProjectProps {
    project: ProjectSchema
}

export function Project({ project }: ProjectProps) {
    const { theme } = useTheme()
    return (
        <Link href={`project/${project.id}`}>
            <div className="flex">
                <Card className="w-full max-w-sm border-none p-0 shadow-none hover:scale-105 transition-transform duration-300">
                    <MagicCard
                        gradientColor={theme === "dark" ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"}
                        className="p-0 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-current rounded-full blur-sm opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                                    <div className="relative flex items-center justify-center w-12 h-12 bg-muted-foreground/20 dark:bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
                                        <div className="text-xl text-white filter drop-shadow-sm">
                                            {project.icon}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-foreground truncate drop-shadow-sm">
                                        {project.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground/80 truncate mt-1 font-medium">
                                        Explore project
                                    </p>
                                </div>
                                <div className="text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                                    <ChevronRight className='size-5' />
                                </div>
                            </div>
                        </CardContent>
                    </MagicCard>
                </Card>
            </div>
        </Link>
    )
}