import { ingestRequestSchema } from "@/lib/models/ingest";
import type { NextRequest } from "next/server";
import { ZodError } from "zod";

export async function POST(
    request: NextRequest
): Promise<Response> {
    try {
        const body = await request.json().then(ingestRequestSchema.parse);
        for (const order of body) {
            // TODO: run some rules
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
