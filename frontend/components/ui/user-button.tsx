"use client";

import { useSession } from "next-auth/react";

import SignOutButton from "../auth/sign-out-button";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export const UserButton = () => {
  const { data } = useSession();

  if (!data?.user) {
    return null;
  }

  const initials = data.user.name
    ?.split(" ")
    .map((str) => str[0])
    .join("");

  const { name, email, image } = data.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-9 rounded-lg border-primary/20 bg-primary/5 px-4 font-medium text-primary/90 transition-all hover:bg-primary/10 hover:text-primary"
        >
          <Avatar className="mr-1 size-6 bg-primary/50">
            <AvatarImage src={image || "/placeholder-avatar.webp"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {name?.split(" ")[0]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{email}</p>
        </div>
        <SignOutButton className="w-full justify-start px-2 py-1.5 text-sm" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
