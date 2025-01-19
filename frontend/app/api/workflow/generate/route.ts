import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

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

    const fullPrompt = `${systemPrompt}\n\nUser Request: ${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    const workflowNode = JSON.parse(text);

    return NextResponse.json(workflowNode);
  } catch (error) {
    console.error("Error generating workflow node:", error);
    return NextResponse.json(
      { error: "Failed to generate workflow node" },
      { status: 500 },
    );
  }
}
