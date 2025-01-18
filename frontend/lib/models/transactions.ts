import { z } from "zod";

export const merchantSchema = z.object({
    name: z.string(),
    category: z.optional(z.string()),
}); // TODO: add more fields

export type Merchant = z.infer<typeof merchantSchema>;

export const addressSchema = z.object({
    /** Street */
    street: z.string(),
    /** City */
    city: z.string(),
    /** Province or state */
    state: z.string(),
    /** Postal code or zip code */
    code: z.string(),
    /** Country */
    country: z.string(),
}); // TODO: add more fields

export type Address = z.infer<typeof addressSchema>;

export const orderItemSchema = z.object({
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
}); // TODO: add more fields

export type OrderItem = z.infer<typeof orderItemSchema>;

export const orderSchema = z.object({
    /** Merchant */
    merchant: merchantSchema,
    /** Address */
    address: z.optional(z.string()),
    /** Order items */
    orderItems: z.array(orderItemSchema),
    /** Order total in $ */
    total: z.number(),
}); // TODO: Check

export type Order = z.infer<typeof orderSchema>;
