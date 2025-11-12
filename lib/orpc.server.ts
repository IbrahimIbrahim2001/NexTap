import 'server-only'
import { headers } from 'next/headers'
import { createRouterClient } from '@orpc/server'
import { router } from '@/app/router'

globalThis.$client = createRouterClient(router, {
    context: async () => {
        const headersList = await headers()
        const request = new Request(process.env.CORS_ORIGIN!, {
            headers: Object.fromEntries(headersList.entries())
        })

        return {
            request,
            headers: headersList,
        }
    },
})