import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { Logs } from "@/lib/models/logs";
import { ApiResponse } from "@/types/api";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse<ApiResponse<Logs>>> {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({
            success: false,
            error: "Unauthorized",
            message: "Unauthorized",
        });
    }

    const logs = await db.query.orders.findMany({
        where: eq(orders.userId, user.id),
        orderBy: (orders, { desc }) => [desc(orders.date)],
    });

    console.log('/api/logs', logs);

    return NextResponse.json({
        success: true,
        message: "Logs fetched successfully",
        data: logs.map((log) => ({
            id: log.id,
            date: log.date,
            userId: log.userId,
            total: Number.parseFloat(log.total),
            merchant_name: log.merchantName,
            merchant_category: log.merchantCategory,
            merchant_location: log.merchantLocation,
            merchant_address: log.merchantAddress,
            order_items: log.orderItems.map((item) => item.name).join(", "),
            severity: log.severity,
            resolved: false,
        })),
    });
}
