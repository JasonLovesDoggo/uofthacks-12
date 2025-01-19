import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Order Details</h1>
          <p className="text-muted-foreground">
            Order from {order.merchantName} on {order.date.toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`rounded-full px-3 py-1 text-sm ${
              order.severity === "critical"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {order.severity}
          </div>
          <div
            className={`rounded-full px-3 py-1 text-sm ${
              order.resolved
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {order.resolved ? "Resolved" : "Pending"}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Merchant Information</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Name:</span> {order.merchantName}
            </p>
            <p>
              <span className="font-medium">Category:</span>{" "}
              {order.merchantCategory}
            </p>
            <p>
              <span className="font-medium">Location:</span>{" "}
              {order.merchantLocation}
            </p>
            <div className="mt-4">
              <h3 className="mb-2 font-medium">Address:</h3>
              <p>
                {order.merchantAddress.number} {order.merchantAddress.street}
              </p>
              <p>
                {order.merchantAddress.city}, {order.merchantAddress.province}{" "}
                {order.merchantAddress.code}
              </p>
              <p>{order.merchantAddress.country}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-medium">Order Items:</h3>
              <ul className="space-y-2">
                {order.orderItems.map((item, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <div>
                      <span>{item.name}</span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        x{item.quantity}
                      </span>
                    </div>
                    <span>${item.price.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>${Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="outline" className="mr-4">
          Back
        </Button>
        {!order.resolved && <Button>Mark as Resolved</Button>}
      </div>
    </div>
  );
}
