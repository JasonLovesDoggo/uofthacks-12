import { db } from "@/lib/db";
import { alerts, users } from "@/lib/db/schema";
import { ingestRequestSchema } from "@/lib/models/ingest";
import { executeRule, Rule, ruleSchema } from "@/lib/rules";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { ZodError } from "zod";

export async function POST(
    request: NextRequest
): Promise<Response> {
    try {
        const body = await request.json().then(ingestRequestSchema.parse);
        for (const { userId, order } of body) {
            try {
                const user = await db.query.users.findFirst({
                    where: eq(users.id, userId),
                    columns: {
                        id: true,
                        rule: true,
                    }
                });

                if (user && user.rule) {
                    const rule = ruleSchema.safeParse(user.rule);
                    if (rule.success) {
                        const result = await executeRule(rule.data, order);
                        if (result) {
                            await db.insert(alerts).values({
                                userId: user.id,
                                order,
                            })
                        }
                    } else {
                        console.error(`User ${userId} has invalid rule`);
                        return Response.json({
                            status: 500
                        }, {
                            status: 500
                        });
                    }
                } else {
                    console.error(`User ${userId} has no rule`);
                    return Response.json({
                        status: 500
                    }, {
                        status: 500
                    });
                }
            } catch (error: unknown) {
                console.error(error);
                return Response.json({
                    status: 500
                }, {
                    status: 500
                });
            }
            const result = await executeRule(rule, order);

            if (result) {
                try {
                    await db.insert(alerts).values({
                        email,
                        rule: rule.toString(),
                        order
                    });
                } catch (error: unknown) {
                    console.error(error);
                    return Response.json({
                        status: 500
                    }, {
                        status: 500
                    });
                }
            }
        }

        return Response.json({
            status: 200
        }, {
            status: 200
        });
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            return Response.json({
                error: 'Failed to parse request body',
                status: 400
            }, {
                status: 400
            });
        }

        return Response.json({
            status: 500
        }, {
            status: 500
        });
    }
}
