"use client";

import { ReactNode, useState } from "react";
import { createQueryClient } from '@/lib/query/client';
import { QueryClientProvider } from '@tanstack/react-query'

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => createQueryClient())
    return (
        <>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </>
    )
} 