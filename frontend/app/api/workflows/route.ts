import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    console.log('POST /api/workflows', body);

    return NextResponse.json({
        success: true,
        message: "Workflow saved",
        data: body,
    }); // TODO
}
