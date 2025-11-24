import { RPCHandler } from '@orpc/server/fetch'
import { onError } from '@orpc/server'
import { router } from '@/app/router'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'


const handler = new RPCHandler(router, {
    interceptors: [
        onError((error) => {
            console.error(error)
        }),
    ],
})

async function handleRequest(request: Request) {

    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session) {
        return new Response('Unauthorized', { status: 401 })
    }

    const { response } = await handler.handle(request, {
        prefix: '/rpc',
        context: {
            headers: request.headers,
            request: request,
            // session,
        },
    })
    return response ?? new Response('Not found', { status: 404 })

}

export const HEAD = handleRequest
export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const PATCH = handleRequest
export const DELETE = handleRequest