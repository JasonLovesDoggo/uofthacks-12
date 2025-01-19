import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { Card } from "@/components/ui/card";

export default async function LogPage({
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
    <div className="mx-auto max-w-[1400px] p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-medium">{order.merchantName}</h1>
          <span className="text-gray-500">{id}</span>
        </div>
        <button className="font-medium text-blue-600">View Original</button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-[300px_1fr_1fr] gap-8">
        {/* Reasons for Flagging */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-gray-500">
            REASONS FOR FLAGGING
          </h2>
          {order.severity === "critical" && (
            <Card className="space-y-2 p-4">
              <h3 className="font-medium">Contact information</h3>
              <p className="text-sm text-gray-600">
                Not your usual contact information
              </p>
            </Card>
          )}
          {Number(order.total) > 3000 && (
            <Card className="space-y-2 p-4">
              <h3 className="font-medium">Fails price criteria</h3>
              <p className="text-sm text-gray-600">Goes over $3000</p>
            </Card>
          )}
          <Card className="p-4">
            <h3 className="mb-3 font-medium">Is this you?</h3>
            <div className="flex gap-2">
              <button className="rounded-md bg-gray-200 px-4 py-1 text-sm">
                YES
              </button>
              <button className="rounded-md bg-gray-200 px-4 py-1 text-sm">
                NO
              </button>
            </div>
          </Card>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-gray-500">DETAILS</h2>
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-medium">Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-1 text-sm text-gray-500">Date</p>
                  <p>{order.date.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-gray-500">Time</p>
                  <p>{order.date.toLocaleTimeString()}</p>
                </div>
              </div>
              <div>
                <p className="mb-1 text-sm text-gray-500">Location</p>
                <p>{order.merchantLocation}</p>
              </div>
              <div>
                <p className="mb-1 text-sm text-gray-500">Shipping Address</p>
                <p>{`${order.merchantAddress.number} ${order.merchantAddress.street}, ${order.merchantAddress.city}`}</p>
              </div>
              <div>
                <p className="mb-1 text-sm text-gray-500">
                  Contact Information
                </p>
                <div className="flex items-center gap-2">
                  <p>{"437-111-1111"}</p>
                  {order.severity === "critical" && (
                    <span className="text-red-500">⚠</span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-500">
                ORDER SUMMARY
              </h2>
              <div className="flex items-center gap-2">
                {Number(order.total) > 3000 && (
                  <span className="text-red-500">⚠</span>
                )}
                <span className="text-sm font-medium">
                  TOTAL: ${Number(order.total).toFixed(2)}
                </span>
              </div>
            </div>
            <Card className="p-6">
              <div className="grid grid-cols-[1fr_100px_100px] gap-4 text-sm font-medium text-gray-500">
                <div>Order</div>
                <div>Qt</div>
                <div>Price</div>
              </div>
              <div className="mt-4 space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-[1fr_100px_100px]">
                    <div>{item.name}</div>
                    <div>{item.quantity}</div>
                    <div>{item.price}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Original Email */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-gray-500">ORIGINAL EMAIL</h2>
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-purple-700 text-white">
                A
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{order.merchantName}</p>
                    <p className="text-sm text-gray-500">
                      your_order_CAEN@orders.apple.com
                    </p>
                    <p className="text-sm text-blue-600">Hide details</p>
                  </div>
                  <span className="text-gray-400">↗</span>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    To: ilastkim@gmail.com
                  </p>
                  <p className="text-sm text-gray-500">
                    Date: {order.date.toLocaleDateString()},{" "}
                    {order.date.toLocaleTimeString()}
                  </p>
                </div>
                <div className="mt-6">
                  <h3 className="mb-2 text-lg">Thank you for your order.</h3>
                  <p className="text-sm text-gray-600">
                    We&apos;ll let you know when your items are on their way.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
