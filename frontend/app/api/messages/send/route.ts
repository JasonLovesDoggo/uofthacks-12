import { NextResponse } from "next/server";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, message } = body;

    if (!to || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const twilioMessage = await client.messages.create({
      body: message,
      to: to, // The recipient's phone number
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
    });

    return NextResponse.json(
      {
        success: true,
        messageId: twilioMessage.sid,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
