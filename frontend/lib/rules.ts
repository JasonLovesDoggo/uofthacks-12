import { z } from "zod";
import { locationSchema, Order } from "./models/transactions";
import { MerchantCategorySchema } from "./models/category";
import { AmountTest } from "./tests/amount";
import { CategoryTest } from "./tests/category";
import { TimeTest } from "./tests/time";
import { LocationTest } from "./tests/location";

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

export const testSchema = z.discriminatedUnion('type', [
    amountTestSchema,
    categoryTestSchema,
    locationTestSchema,
    timeTestSchema,
]);

export type TestType = z.infer<typeof testSchema>;

export const testRuleSchema = z.object({
    type: z.literal('test'),
    test: testSchema,
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
} | TestRule | {
    type: 'literal',
    value: boolean,
};

export const ruleSchema: z.ZodType<Rule> = z.lazy(() =>
    z.discriminatedUnion('type', [
        testRuleSchema,

        z.object({
            type: z.literal('and'),
            rules: z.array(ruleSchema).min(1)
        }),

        z.object({
            type: z.literal('or'),
            rules: z.array(ruleSchema).min(1)
        }),

        z.object({
            type: z.literal('not'),
            rule: ruleSchema
        }),

        // For testing
        z.object({
            type: z.literal('literal'),
            value: z.boolean(),
        }),
    ])
);

/**
 * Execute a rule on an order
 * @param rule - The rule to execute
 * @param order - The order to execute the rule on
 * @param defaultValue - The default value to return if the rule is unknown
 * @returns Whether the rule is true or false
 */
export function executeRule(rule: Rule, order: Order, defaultValue: boolean = false): boolean {
    switch (rule.type) {
        case 'and':
            return rule.rules.every(r => executeRule(r, order, defaultValue));
        case 'or':
            return rule.rules.some(r => executeRule(r, order, defaultValue));
        case 'not':
            return !executeRule(rule.rule, order, defaultValue);
        case 'test':
            const testResult = executeTestRule(rule.test, order);
            if (testResult === 'UNKNOWN') {
                return defaultValue;
            }
            return testResult;
        case 'literal':
            return rule.value;
    }
}

/**
 * Execute a test rule on an order
 * @param test - The test rule to execute
 * @param order - The order to execute the test rule on
 * @returns Whether the test rule is true or false
 */
function executeTestRule(test: TestType, order: Order): boolean | 'UNKNOWN' {
    switch (test.type) {
        case 'amount':
            const amount = test.amount;
            return new AmountTest(amount).test(order);
        case 'category':
            const category = test.category;
            return new CategoryTest(category).test(order);
        case 'location':
            const location = test.location;
            return new LocationTest(location).test(order);
        case 'time':
            const time = test.time;
            const condition = test.condition;
            return new TimeTest(time, condition).test(order);
    }
}
