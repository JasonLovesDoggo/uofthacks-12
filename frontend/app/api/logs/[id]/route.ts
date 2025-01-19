import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { Order, orders } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { ApiResponse } from "@/types/api";

/**
 * Returns an order by id
 */
export async function GET({ params }: any): Promise<NextResponse<ApiResponse<Order>>> {
    console.log('GET /api/logs/[id]', await params);
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({
            success: false,
            error: "Unauthorized",
            message: "Unauthorized",
        });
    }

    const order = await db.query.orders.findFirst({
        where: eq(orders.id, params.id),
    });

    if (!order) {
        return NextResponse.json({
            success: false,
            error: "Order not found",
            message: "Order not found",
        });
    }

    return NextResponse.json({
        success: true,
        message: "Order fetched successfully",
        data: order,
    });
}
