import { Order } from "@/lib/models/transactions";

export interface Test {
    /** Test name */
    name: string;
    /** Test description */
    description: string;
    /** Returns true if order passes the test, false if it fails, "UNKNOWN" if it cannot be determined */
    test(order: Order): boolean | 'UNKNOWN';
}
