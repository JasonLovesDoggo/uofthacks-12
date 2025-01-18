import { describe, expect, test, beforeEach, jest, it } from '@jest/globals';
import { executeRule, Rule, ruleSchema } from "@/lib/rules";
import { orderSchema } from "@/lib/models/transactions";
import { MerchantCategory } from '../models/category';


export const EMPTY_ORDER = Object.freeze(orderSchema.parse({
    date: new Date(),
    merchant: {
        name: '',
    },
    orderItems: [],
    total: 0,
}));


const EXAMPLE_ORDER = Object.freeze(orderSchema.parse({
    date: new Date(),
    merchant: {
        name: 'Test Merchant',
        category: MerchantCategory.RETAIL,
    },
    address: {
        number: '123',
        street: 'Main St',
        city: 'Toronto',
        province: 'Ontario',
        code: 'A1A 1A1',
        country: 'Canada',
    },
    orderItems: [
        {
            name: 'Test Item',
            price: 100,
            quantity: 1,
        }
    ],
    total: 100,
}));

describe('Rules', () => {
    describe('executeRule', () => {
        test('literal', () => {
            const trueRule = ruleSchema.parse({
                type: 'literal',
                value: true,
            });
            const falseRule = ruleSchema.parse({
                type: 'literal',
                value: false,
            });
            expect(executeRule(trueRule, EMPTY_ORDER)).toBe(true);
            expect(executeRule(falseRule, EMPTY_ORDER)).toBe(false);
        });

        test('and', () => {
            const rule1 = ruleSchema.parse({
                type: 'and',
                rules: [
                    { type: 'literal', value: true },
                    { type: 'literal', value: true },
                ],
            });

            expect(executeRule(rule1, EMPTY_ORDER)).toBe(true);

            const rule2 = ruleSchema.parse({
                type: 'and',
                rules: [
                    { type: 'literal', value: true },
                    { type: 'literal', value: false },
                ],
            });
            expect(executeRule(rule2, EMPTY_ORDER)).toBe(false);

            const rule3 = ruleSchema.parse({
                type: 'and',
                rules: [
                    { type: 'literal', value: true },
                    { type: 'literal', value: false },
                ],
            });
            expect(executeRule(rule3, EMPTY_ORDER)).toBe(false);

            const rule4 = ruleSchema.parse({
                type: 'and',
                rules: [
                    { type: 'literal', value: false },
                    { type: 'literal', value: false },
                ],
            });
            expect(executeRule(rule4, EMPTY_ORDER)).toBe(false);

            const rule5 = ruleSchema.parse({
                type: 'and',
                rules: [
                    { type: 'literal', value: true },
                    { type: 'literal', value: true },
                    { type: 'literal', value: true },
                    { type: 'literal', value: false },
                ],
            });
            expect(executeRule(rule5, EMPTY_ORDER)).toBe(false);
        });

        test('or', () => {
            const rule1 = ruleSchema.parse({
                type: 'or',
                rules: [
                    { type: 'literal', value: true },
                    { type: 'literal', value: false },
                ],
            });

            expect(executeRule(rule1, EMPTY_ORDER)).toBe(true);

            const rule2 = ruleSchema.parse({
                type: 'or',
                rules: [
                    { type: 'literal', value: false },
                    { type: 'literal', value: false },
                ],
            });
            expect(executeRule(rule2, EMPTY_ORDER)).toBe(false);

            const rule3 = ruleSchema.parse({
                type: 'or',
                rules: [
                    { type: 'literal', value: false },
                    { type: 'literal', value: false },
                    { type: 'literal', value: true },
                ],
            });
            expect(executeRule(rule3, EMPTY_ORDER)).toBe(true);
        });

        test('not', () => {
            const rule1 = ruleSchema.parse({
                type: 'not',
                rule: { type: 'literal', value: true },
            });
            expect(executeRule(rule1, EMPTY_ORDER)).toBe(false);

            const rule2 = ruleSchema.parse({
                type: 'not',
                rule: { type: 'literal', value: false },
            });
            expect(executeRule(rule2, EMPTY_ORDER)).toBe(true);
        });

        describe('test', () => {
            it('amount', () => {

                const rule1 = ruleSchema.parse({
                    type: 'test',
                    test: { type: 'amount', amount: 100 },
                });
                expect(executeRule(rule1, EXAMPLE_ORDER)).toBe(true);

                const rule2 = ruleSchema.parse({
                    type: 'test',
                    test: { type: 'amount', amount: 101 },
                });
                expect(executeRule(rule2, EXAMPLE_ORDER)).toBe(false);

                const rule3 = ruleSchema.parse({
                    type: 'test',
                    test: { type: 'amount', amount: 99 },
                });
                expect(executeRule(rule3, EXAMPLE_ORDER)).toBe(true);
            });

            it('category', () => {
                const rule1 = ruleSchema.parse({
                    type: 'test',
                    test: { type: 'category', category: MerchantCategory.RETAIL },
                });
                expect(executeRule(rule1, EXAMPLE_ORDER)).toBe(true);

                const rule2 = ruleSchema.parse({
                    type: 'test',
                    test: { type: 'category', category: MerchantCategory.FOOD_AND_DINING },
                });
                expect(executeRule(rule2, EXAMPLE_ORDER)).toBe(false);
            });

            it('location', () => {
                const rule1 = ruleSchema.parse({
                    type: 'test',
                    test: { type: 'location', location: { type: 'city', city: 'Toronto', province: 'Ontario', country: 'Canada' } },
                });
                expect(executeRule(rule1, EXAMPLE_ORDER)).toBe(true);

                const rule2 = ruleSchema.parse({
                    type: 'test',
                    test: { type: 'location', location: { type: 'province', province: 'Ontario', country: 'Canada' } },
                });
                expect(executeRule(rule2, EXAMPLE_ORDER)).toBe(true);

                const rule3 = ruleSchema.parse({
                    type: 'test',
                    test: { type: 'location', location: { type: 'country', country: 'Canada' } },
                });
                expect(executeRule(rule3, EXAMPLE_ORDER)).toBe(true);

                const rule4 = ruleSchema.parse({
                    type: 'test',
                    test: { type: 'location', location: { type: 'city', city: 'waterloo', province: 'Ontario', country: 'Canada' } },
                });
                expect(executeRule(rule4, EXAMPLE_ORDER)).toBe(false);

                const rule5 = ruleSchema.parse({
                    type: 'test',
                    test: { type: 'location', location: { type: 'province', province: 'Quebec', country: 'Canada' } },
                });
                expect(executeRule(rule5, EXAMPLE_ORDER)).toBe(false);

                const rule6 = ruleSchema.parse({
                    type: 'test',
                    test: { type: 'location', location: { type: 'country', country: 'United States' } },
                });
                expect(executeRule(rule6, EXAMPLE_ORDER)).toBe(false);
            });

            it('time', () => {
                const rule1 = ruleSchema.parse({
                    type: 'test',
                    test: { type: 'time', time: new Date(2069, 1, 1), condition: 'lte' },
                });
                expect(executeRule(rule1, EXAMPLE_ORDER)).toBe(true);

                const rule2 = ruleSchema.parse({
                    type: 'test',
                    test: { type: 'time', time: new Date(1969, 1, 1), condition: 'gte' },
                });
                expect(executeRule(rule2, EXAMPLE_ORDER)).toBe(true);

                const rule3 = ruleSchema.parse({
                    type: 'test',
                    test: { type: 'time', time: new Date(2069, 1, 1), condition: 'gte' },
                });
                expect(executeRule(rule3, EXAMPLE_ORDER)).toBe(false);

                const rule4 = ruleSchema.parse({
                    type: 'test',
                    test: { type: 'time', time: new Date(2069, 1, 1), condition: 'lte' },
                });
                expect(executeRule(rule4, EXAMPLE_ORDER)).toBe(true);
            });
        });

        it('unknown', () => {
            const rule1 = ruleSchema.parse({
                type: 'test',
                test: { type: 'category', category: MerchantCategory.BUSINESS_AND_B2B },
            });

            expect(executeRule(rule1, EMPTY_ORDER)).toBe(true);
        });
    });
});
