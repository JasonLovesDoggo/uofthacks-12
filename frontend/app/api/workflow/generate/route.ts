import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

const requestSchema = z.object({
  prompt: z.string().min(1).max(500),
});

type WorkflowNode = {
  id: string;
  type: "trigger" | "condition" | "action";
  data: Record<string, unknown>;
  next?: WorkflowNode[];
};

const systemPrompt = `
You are a workflow generator. Given a natural language request, generate a valid WorkflowNode object in JSON format.
The WorkflowNode can be of type "trigger", "condition", or "action". Ensure the structure adheres to the following rules:
- A "trigger" node starts the workflow.
- A "condition" node must have a "field", "operator", and "value" in its data.
- An "action" node must have a "selectedAction" in its data.
- Each node must have a unique "id" (UUID).
- Use the "next" field to connect nodes in the workflow.

- Please ensure the response is valid JSON only, no additional text. We do not need formatting or comments.

Example output:
{
  "id": "249e053b-eda0-4aeb-899f-ec1a429be22b",
  "type": "trigger",
  "data": {},
  "next": [
    {
      "id": "03e2e739-874d-42a5-89b2-4b5862f9ba5d",
      "type": "condition",
      "data": {
        "field": "amount",
        "operator": "greater",
        "value": "200"
      },
      "next": [
        {
          "id": "8394f3fa-df42-4848-8b0e-9696efe1ad5a",
          "type": "action",
          "data": {
            "selectedAction": "sendEmail"
          }
        }
      ]
    }
  ]
}
`;

export async function POST(request: Request) {
  try {
    // Validate request body
    const body = await request.json();
    const { prompt } = requestSchema.parse(body);

    // Generate workflow
    const fullPrompt = `${systemPrompt}\n\nUser Request: ${prompt}`;
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Clean response text from markdown formatting
    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Validate and parse response
    let workflowNode: WorkflowNode;
    try {
      workflowNode = JSON.parse(cleanText);

      // Basic validation of workflow structure
      if (!workflowNode.id || !workflowNode.type) {
        throw new Error("Invalid workflow node structure");
      }
    } catch (parseError) {
      console.error("Failed to parse workflow node:", parseError);
      throw new Error(
        `Failed to parse workflow node: ${parseError instanceof Error ? parseError.message : "Invalid JSON format"}`,
      );
    }

    return NextResponse.json({
      success: true,
      data: workflowNode,
    });
  } catch (error) {
    console.error("Error generating workflow node:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate workflow node",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
