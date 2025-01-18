import { Test } from ".";
import { MerchantCategory } from "../models/category";
import { Order } from "../models/transactions";

export class CategoryTest implements Test {
    name: string = "Category Test";
    description: string = "Test if the order is from the correct category";
    category: MerchantCategory;

    constructor(category: MerchantCategory) {
        this.category = category;
    }

    test(order: Order): boolean | 'UNKNOWN' {
        if (order.merchant.category === undefined) {
            return 'UNKNOWN';
        }

        return order.merchant.category === this.category;
    }
}
