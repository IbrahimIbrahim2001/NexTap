import * as z from "zod";
import { base } from "../middleware/base";
export const router = {
    hello_world: base
        .route({
            method: "GET",
            path: "/hello_world",
        })
        .input(z.void())
        .output(z.string())
        .handler(() => {
            console.log("hello world");
            return "hello world"
        })
}