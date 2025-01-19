import type { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { ZodError } from "zod";

import { db } from "@/lib/db";
import { NewOrder, orders, users } from "@/lib/db/schema";
import { ingestRequestSchema } from "@/lib/models/ingest";
import { executeRule, ruleSchema } from "@/lib/rules";

type ApiResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json().then(ingestRequestSchema.parse);

    for (const { userId, order } of body) {
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: {
          id: true,
          rule: true,
        },
      });

      if (!user?.rule) {
        console.error(`User ${userId} has no rule configured`);
        return Response.json(
          {
            success: false,
            error: "User has no rule configured",
          },
          { status: 400 },
        );
      }

      const rule = ruleSchema.safeParse(user.rule);
      if (!rule.success) {
        console.error(`User ${userId} has invalid rule configuration`);
        return Response.json(
          {
            success: false,
            error: "Invalid rule configuration",
          },
          { status: 400 },
        );
      }

      const ruleViolated = await executeRule(rule.data, order);
      const {
        date,
        merchant: { name, category },
        address,
        orderItems = [], // Default to empty array if undefined
        total,
      } = order;

      // Validate required fields
      if (!category) {
        console.error(
          `Order for user ${userId} missing required merchant category`,
        );
        return Response.json(
          {
            success: false,
            error: "Missing required merchant category",
          },
          { status: 400 },
        );
      }

      if (!address) {
        console.error(
          `Order for user ${userId} missing required address information`,
        );
        return Response.json(
          {
            success: false,
            error: "Missing required merchant address information",
          },
          { status: 400 },
        );
      }

      const merchantLocation = `${address.province}, ${address.country}`;

      // Create a properly typed order object
      const newOrder: NewOrder = {
        userId: user.id,
        date,
        merchantName: name,
        merchantCategory: category,
        merchantLocation: merchantLocation,
        merchantAddress: address,
        orderItems: orderItems,
        total: total.toString(), // Convert number to string for PostgreSQL numeric type
        severity: ruleViolated ? "critical" : "low",
        resolved: false,
      };

      // Insert with validated and properly typed data
      await db.insert(orders).values(newOrder);
    }

    return Response.json(
      {
        success: true,
        message: "Orders processed successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing orders:", error);

    if (error instanceof ZodError) {
      return Response.json(
        {
          success: false,
          error: "Invalid request format",
        },
        { status: 400 },
      );
    }

    return Response.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
