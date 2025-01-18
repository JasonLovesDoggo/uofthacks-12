import { z } from "zod";
import { MerchantCategorySchema } from "./category";

export const merchantSchema = z.object({
    name: z.string(),
    category: z.optional(MerchantCategorySchema),
}); // TODO: add more fields

export type Merchant = z.infer<typeof merchantSchema>;

export const addressSchema = z.object({
    /** Number */
    number: z.string(),
    /** Street */
    street: z.string(),
    /** City */
    city: z.string(),
    /** Province or state */
    province: z.string(),
    /** Postal code or zip code */
    code: z.string(),
    /** Country */
    country: z.string(),
}); // TODO: add more fields

export type Address = z.infer<typeof addressSchema>;


export const countryLocationSchema = z.object({
    type: z.literal('country'),
    country: z.string(),
});

export const provinceLocationSchema = z.object({
    type: z.literal('province'),
    province: z.string(),
    country: z.string(),
});

export const cityLocationSchema = z.object({
    type: z.literal('city'),
    city: z.string(),
    province: z.string(),
    country: z.string(),
});

export const locationSchema = z.union([
    countryLocationSchema,
    provinceLocationSchema,
    cityLocationSchema,
]);

export type Location = z.infer<typeof locationSchema>;

export const orderItemSchema = z.object({
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
}); // TODO: add more fields

export type OrderItem = z.infer<typeof orderItemSchema>;

export const orderSchema = z.object({
    /** Date of the order */
    date: z.date(),
    /** Merchant */
    merchant: merchantSchema,
    /** Address */
    address: z.optional(addressSchema),
    /** Order items */
    orderItems: z.array(orderItemSchema),
    /** Order total in $ */
    total: z.number(),
}); // TODO: Check

export type Order = z.infer<typeof orderSchema>;
