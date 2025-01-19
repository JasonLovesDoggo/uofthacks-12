import { randomUUID } from "crypto";

import { db } from ".";
import { getCurrentUser } from "../auth";
import { MerchantCategory } from "../models/category";
import { Address, OrderItem } from "../models/transactions";
import { NewOrder, orders } from "./schema";

export const seedOrders = async (userId: string) => {
  const dummyOrders: NewOrder[] = [
    {
      id: randomUUID(),
      userId,
      date: new Date("2024-01-15T12:30:00"),
      merchantName: "Walmart Superstore",
      merchantCategory: MerchantCategory.RETAIL,
      merchantLocation: "Toronto",
      merchantAddress: {
        number: "123",
        street: "Queen Street West",
        city: "Toronto",
        province: "ON",
        code: "M5V 2A1",
        country: "Canada",
      } as Address,
      orderItems: [
        {
          name: "Groceries",
          price: 45.99,
          quantity: 1,
        },
        {
          name: "Household Items",
          price: 23.5,
          quantity: 2,
        },
      ] as OrderItem[],
      total: "92.99",
      severity: "low",
      resolved: false,
    },
    {
      id: randomUUID(),
      userId,
      date: new Date("2024-01-14T15:45:00"),
      merchantName: "The Keg Steakhouse",
      merchantCategory: MerchantCategory.FOOD_AND_DINING,
      merchantLocation: "Toronto",
      merchantAddress: {
        number: "456",
        street: "York Street",
        city: "Toronto",
        province: "ON",
        code: "M5J 0B6",
        country: "Canada",
      } as Address,
      orderItems: [
        {
          name: "Steak Dinner",
          price: 45.0,
          quantity: 2,
        },
        {
          name: "Wine",
          price: 35.0,
          quantity: 1,
        },
      ] as OrderItem[],
      total: "125.00",
      severity: "critical",
      resolved: false,
    },
    {
      id: randomUUID(),
      userId,
      date: new Date("2024-01-13T09:15:00"),
      merchantName: "Air Canada",
      merchantCategory: MerchantCategory.TRAVEL_AND_ENTERTAINMENT,
      merchantLocation: "Online",
      merchantAddress: {
        number: "789",
        street: "Portage Avenue",
        city: "Winnipeg",
        province: "MB",
        code: "R3B 2B3",
        country: "Canada",
      } as Address,
      orderItems: [
        {
          name: "Flight Ticket",
          price: 450.0,
          quantity: 1,
        },
      ] as OrderItem[],
      total: "450.00",
      severity: "critical",
      resolved: true,
    },
  ];

  try {
    await db.insert(orders).values(dummyOrders);
    console.log("Successfully seeded orders table");
  } catch (error) {
    console.error("Error seeding orders:", error);
    throw error;
  }
};
