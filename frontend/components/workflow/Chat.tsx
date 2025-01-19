"use client";

import { useState } from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface ChatMessage {
  sender: "user" | "system";
  content: string;
}

export const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", content: input }]);
    const currentInput = input;
    setInput("");

    try {
      const response = await fetch("/api/workflow/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: currentInput }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Request failed:", {
          status: response.status,
          statusText: response.statusText,
          error: error.error,
        });
        throw new Error(`Request failed with status ${response.status}`);
      }

      const workflowNode = await response.json();
      console.log("Generated workflow node:", workflowNode);
      setMessages((prev) => [
        ...prev,
        {
          sender: "system",
          content: `Generated workflow node: ${JSON.stringify(workflowNode, null, 2)}`,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "system",
          content: "Error: Failed to get response from server",
        },
      ]);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col justify-end space-y-2 overflow-y-auto p-2">
        {messages.map((message, i) => (
          <div
            key={i}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-2 ${
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 p-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your prompt..."
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
};
