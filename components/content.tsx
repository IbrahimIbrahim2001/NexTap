import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function ContentSection() {
    return (
        <section className="py-16 md:py-32" id='about'>
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid gap-6 md:grid-cols-2 md:gap-12">
                    <h2 className="text-4xl font-medium">NexTap: Where editing meets team collaboration.</h2>
                    <div className="space-y-6">
                        <p>Move beyond isolated documents. NexTap combines powerful Tiptap editing with organizational tools that help teams coordinate their work from draft to completion.</p>
                        <p>
                            Organize content in  <span className="font-bold">shared workspaces</span>, manage progress through <span className="font-bold">projects and todos</span>, and collaborate with <span className="font-bold">team members</span> through seamless invitations. Edit together in real-time while tracking tasks and milestones—all in one unified platform.
                        </p>
                        <Button
                            asChild
                            variant="secondary"
                            size="sm"
                            className="gap-1 pr-1.5">
                            <Link href="#">
                                <span>Learn More</span>
                                <ChevronRight className="size-2" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
