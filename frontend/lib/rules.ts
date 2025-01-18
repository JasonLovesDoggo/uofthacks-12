import { z } from "zod";
import { locationSchema } from "./models/transactions";
import { MerchantCategorySchema } from "./models/category";

export const amountTestSchema = z.object({
    type: z.literal('amount'),
    amount: z.number(),
});

export const categoryTestSchema = z.object({
    type: z.literal('category'),
    category: MerchantCategorySchema,
});

export const locationTestSchema = z.object({
    type: z.literal('location'),
    location: locationSchema,
});

export const timeTestSchema = z.object({
    type: z.literal('time'),
    time: z.date(),
    condition: z.enum(['gte', 'lte']),
});

export const testRuleSchema = z.object({
    type: z.literal('test'),
    test: z.discriminatedUnion('type', [
        amountTestSchema,
        categoryTestSchema,
        locationTestSchema,
        timeTestSchema,
    ]),
});

export type TestRule = z.infer<typeof testRuleSchema>;

export type Rule = {
    type: 'and',
    rules: Rule[],
} | {
    type: 'or',
    rules: Rule[],
} | {
    type: 'not',
    rule: Rule,
} | TestRule;

export const ruleSchema: z.ZodType<Rule> = z.lazy(() =>
    z.discriminatedUnion('type', [
        // Leaf node
        testRuleSchema,

        // AND operator (multiple children)
        z.object({
            type: z.literal('and'),
            rules: z.array(ruleSchema).min(1)
        }),

        // OR operator (multiple children)
        z.object({
            type: z.literal('or'),
            rules: z.array(ruleSchema).min(1)
        }),

        z.object({
            type: z.literal('not'),
            rule: ruleSchema
        }),
    ])
);
