"use client";

import { ThemeProvider } from "@/components/ui/theme-provider";
import { ReactNode, useState } from "react";
import { createQueryClient } from '@/lib/query/client';
import { QueryClientProvider } from '@tanstack/react-query'

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => createQueryClient())
    return (
        <>
            {/* here come the app providers */}
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </ThemeProvider>
        </>
    )
} 