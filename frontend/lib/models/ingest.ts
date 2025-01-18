import { z } from "zod";
import { orderSchema } from "./transactions";

export const ingestRequestSchema = z.array(z.object({
    /** Email */
    email: z.string().email(),
    /** Order */
    order: orderSchema,
}));

export type IngestRequest = z.infer<typeof ingestRequestSchema>;

export const lsRequestSchema = z.object({
    name: z.string(),
    email: z.string().email(),
});

export type LsRequest = z.infer<typeof lsRequestSchema>;

export const lsResponseSchema = z.array(
    z.object({
        id: z.string(),
        name: z.string(),
        email: z.string().email(),
    })
);

export type LsResponse = z.infer<typeof lsResponseSchema>;
