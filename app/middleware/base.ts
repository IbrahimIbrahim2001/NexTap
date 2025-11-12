import { os } from "@orpc/server";

export const base = os.$context<{
    headers: Headers;
    request: Request
}>().errors({
    "BAD_REQUEST": {
        message: "bad request"
    },
    "NOT_FOUND": {
        message: "Not Found"
    },
    "FORBIDDEN": {
        message: "Forbidden"
    },
    "INTERNAL_SERVER_ERROR": {
        message: "Internal Server Error"
    },
    "UNAUTHORIZED": {
        message: "You are Unauthorized"
    },
})