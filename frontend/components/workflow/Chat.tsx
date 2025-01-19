"use client";

import { useState } from "react";
import { useFlowManagement } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Edge, Node } from "reactflow";
import { z } from "zod";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const formSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(500, "Message too long"),
});

type ChatMessage = {
  sender: "user" | "system";
  content: string;
  status?: "typing" | "error";
};

export const Chat = ({
  setEdges,
  setNodes,
}: {
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // const { setNodes, setEdges } = useFlowManagement();

  // Convert workflow tree to ReactFlow nodes and edges
  const convertWorkflowToFlow = (workflowNode: any) => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Start trigger node at center of workspace
    const initialPosition = { x: 400, y: 50 };
    const NODE_WIDTH = 300;
    const VERTICAL_SPACING = 200;

    const processNode = (node: any, position = initialPosition) => {
      // Create ReactFlow node
      nodes.push({
        id: node.id,
        type: node.type,
        position,
        data: node.data || {},
      });

      // Process child nodes
      if (node.next && node.next.length > 0) {
        node.next.forEach((childNode: any, index: number) => {
          // Position child node below parent
          const childPosition = {
            x:
              position.x +
              (index - (node.next.length - 1) / 2) * (NODE_WIDTH + 50),
            y: position.y + VERTICAL_SPACING,
          };

          // Create edge from parent to child
          edges.push({
            id: `e${node.id}-${childNode.id}`,
            source: node.id,
            target: childNode.id,
          });

          // Process child node recursively
          processNode(childNode, childPosition);
        });
      }
    };

    processNode(workflowNode);
    return { nodes, edges };
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const userMessage = values.message;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { sender: "user", content: userMessage },
      { sender: "system", content: "", status: "typing" },
    ]);

    form.reset();

    try {
      setIsLoading(true);

      const response = await fetch("/api/workflow/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const json = await response.json();

      if (json.success && json.data) {
        console.log("API Response:", json.data);

        // Convert workflow to ReactFlow format
        const { nodes: flowNodes, edges: flowEdges } = convertWorkflowToFlow(
          json.data,
        );

        console.log("Generated Nodes:", flowNodes);
        console.log("Generated Edges:", flowEdges);

        // Update flow - use direct state update to bypass trigger node restriction
        setNodes((prevNodes) => [...prevNodes, ...flowNodes]);
        setEdges((prevEdges) => [...prevEdges, ...flowEdges]);

        // Update chat messages
        setMessages((prev) => [
          ...prev.slice(0, -1),
          {
            sender: "system",
            content:
              "Workflow generated successfully! Check the workspace to see the result.",
          },
        ]);
      } else {
        throw new Error(json.error || "Failed to generate workflow");
      }
    } catch (error) {
      console.error("error", error);

      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          sender: "system",
          content: "Error: Failed to get response from server",
          status: "error",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col justify-end space-y-2 overflow-y-auto p-2">
        {messages.map((message, i) => (
          <div
            key={i}
            className={cn(
              "flex",
              message.sender === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg p-2",
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : message.status === "error"
                    ? "bg-red-100 text-red-900"
                    : "bg-gray-100",
                message.status === "typing" && "animate-pulse",
              )}
            >
              {message.status === "typing" ? (
                <span className="text-gray-500">Typing...</span>
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 p-2">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Type your prompt..."
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
