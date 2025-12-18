import { ReactNode, Suspense } from 'react'
import { AppSidebar } from './components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Navbar } from './components/nav-bar'

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <SidebarProvider defaultOpen={false}>
                <AppSidebar />
                <SidebarInset>
                    <main className="h-svh">
                        <Suspense>
                            <Navbar />
                        </Suspense>
                        <div className="w-full h-[calc(100vh-3rem)]">
                            {children}
                        </div>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}
