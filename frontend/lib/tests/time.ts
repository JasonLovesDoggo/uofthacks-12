import { Test } from ".";
import { Order } from "../models/transactions";

export class TimeTest implements Test {
    name: string = "Time Test";
    description: string = "Test if the order is from the correct time";
    condition: TimeCondition;
    time: Date;

    constructor(time: Date, condition: TimeCondition) {
        this.time = time;
        this.condition = condition;
    }

    test(order: Order): boolean | 'UNKNOWN' {
        switch (this.condition) {
            case 'gte':
                return order.date >= this.time;
            case 'lte':
                return order.date <= this.time;
        }
    }
}

export type TimeCondition = 'gte' | 'lte';
