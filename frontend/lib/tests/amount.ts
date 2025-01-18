import { Order } from "@/lib/models/transactions";
import { Test } from ".";
import { z } from "zod";

export class AmountTest implements Test {
    name: string = "Amount Test";
    description: string = "Test if the order is at least a certain amount";
    amount: number;

    constructor(amount: number) {
        this.amount = amount;
    }

    test(order: Order): boolean | 'UNKNOWN' {
        return order.total >= this.amount;
    }
}
