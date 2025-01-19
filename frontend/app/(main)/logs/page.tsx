import React from "react";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";

import { OrdersTable } from "./table";

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) {
    return notFound();
  }

  const orderList = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, user.id));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900">
        Orders
      </h1>
      <OrdersTable data={orderList} />
    </div>
  );
}
