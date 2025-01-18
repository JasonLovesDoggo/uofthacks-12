"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { fetcher } from "@/lib/utils";
import { LoginSchema } from "@/lib/validations/login";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import AuthOptions from "./AuthOptions";

type Props = {};

const SignInForm = ({}: Props) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: { email: string; password: string }) => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (data.data?.redirect) {
          // Handle email verification redirect
          toast.info(data.message);
          router.push(data.data.redirect);
        } else if (data.success) {
          toast.success("Welcome back!");
          router.push("/");
        } else {
          toast.error(data.message || "Invalid email or password");
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <input
                  {...field}
                  placeholder="Enter your email"
                  className="text-textSecondary placeholder:text-textMuted flex h-10 w-full rounded-sm border border-border bg-white/10 px-3 py-2 lowercase shadow-[0_4px_6px] shadow-black/10 backdrop-blur-sm file:font-medium placeholder:capitalize focus-visible:outline-none focus-visible:ring focus-visible:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="pb-2">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <input
                  {...field}
                  type="password"
                  placeholder="Enter your password"
                  className="text-textSecondary placeholder:text-textMuted flex h-10 w-full rounded-sm border border-border bg-white/10 px-3 py-2 shadow-[0_4px_6px] shadow-black/10 backdrop-blur-sm file:font-medium focus-visible:outline-none focus-visible:ring focus-visible:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          variant="default"
          type="submit"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? "Signing In..." : "Sign In"}
        </Button>
      </form>
      <div className="relative flex items-center">
        <div className="flex-grow border-t border-border" />
        <span className="mx-3 text-sm text-muted-foreground">
          Or continue with
        </span>
        <div className="flex-grow border-t border-border" />
      </div>
      <AuthOptions disabled={isPending} />
    </Form>
  );
};

export default SignInForm;
