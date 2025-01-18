import { Location, Order } from "@/lib/models/transactions";
import { Test } from "@/lib/tests";
import { compareStringsLossy } from "../utils";

export class LocationTest implements Test {

    private readonly location: Location;

    constructor(location: Location) {
        this.location = location;
    }

    name: string = "Location Test";

    description: string = "Test if the order is from the correct location";

    test(order: Order): boolean | 'UNKNOWN' {
        const address = order.address;
        if (!address) {
            return 'UNKNOWN';
        }

        switch (this.location.type) {
            case 'country':
                return compareStringsLossy(address.country, this.location.country);
            case 'province':
                return compareStringsLossy(address.province, this.location.province)
                    && compareStringsLossy(address.country, this.location.country);
            case 'city':
                return compareStringsLossy(address.city, this.location.city)
                    && compareStringsLossy(address.province, this.location.province)
                    && compareStringsLossy(address.country, this.location.country);
        }
    }
}
