//! Merchant categories determined based on Visa MCC codes

import { z } from "zod";

export const MerchantCategoryValues = [
    'RETAIL',
    'FOOD_AND_DINING',
    'SERVICES',
    'TRAVEL_AND_ENTERTAINMENT',
    'TRANSPORTATION',
    'FINANCIAL_SERVICES',
    'BUSINESS_AND_B2B'
] as const;

export type MerchantCategory = typeof MerchantCategoryValues[number];

export const MerchantCategorySchema = z.enum(MerchantCategoryValues);

export const MerchantCategory = {
    RETAIL: 'RETAIL',
    FOOD_AND_DINING: 'FOOD_AND_DINING',
    SERVICES: 'SERVICES',
    TRAVEL_AND_ENTERTAINMENT: 'TRAVEL_AND_ENTERTAINMENT',
    TRANSPORTATION: 'TRANSPORTATION',
    FINANCIAL_SERVICES: 'FINANCIAL_SERVICES',
    BUSINESS_AND_B2B: 'BUSINESS_AND_B2B'
} as const;
