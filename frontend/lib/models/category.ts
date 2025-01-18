//! Merchant categories determined based on Visa MCC codes

import { z } from "zod";

export enum MerchantCategory {
    RETAIL = 'RETAIL',
    FOOD_AND_DINING = 'FOOD_AND_DINING',
    SERVICES = 'SERVICES',
    TRAVEL_AND_ENTERTAINMENT = 'TRAVEL_AND_ENTERTAINMENT',
    TRANSPORTATION = 'TRANSPORTATION',
    FINANCIAL_SERVICES = 'FINANCIAL_SERVICES',
    BUSINESS_AND_B2B = 'BUSINESS_AND_B2B',
}

// Zod schema for type validation
export const MerchantCategorySchema = z.nativeEnum(MerchantCategory);

// Type for the schema
export type MerchantCategoryType = z.infer<typeof MerchantCategorySchema>;
