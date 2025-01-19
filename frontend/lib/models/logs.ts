import { z } from "zod";
import { addressSchema } from "./transactions";

export const logSchema = z.object({
    id: z.string(),
    date: z.coerce.date(),
    userId: z.string(),
    total: z.number(),
    merchant_name: z.string(),
    merchant_category: z.string(),
    merchant_location: z.string(),
    merchant_address: addressSchema,
    order_items: z.string({ description: "Stringified list of order items" }),
    severity: z.enum(['low', 'critical']),
    resolved: z.boolean(),
});
export type Log = z.infer<typeof logSchema>;

export const logsSchema = z.array(logSchema);
export type Logs = z.infer<typeof logsSchema>;
