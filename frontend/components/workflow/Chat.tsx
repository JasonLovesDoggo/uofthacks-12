"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

export const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

      // Replace typing message with actual response
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          sender: "system",
          content: JSON.stringify(json.data, null, 2),
        },
      ]);
    } catch (error) {
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
