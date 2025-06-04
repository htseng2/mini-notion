"use client";

import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { signOut } from "next-auth/react";

interface UserProfileProps {
  name?: string | null;
  email?: string;
}

export default function UserProfile({ name, email }: UserProfileProps) {
  if (!email) return null;

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 hover:bg-accent rounded-lg p-2 transition">
        <UserCircleIcon className="h-10 w-10 text-primary" />
        <span className="text-sm text-muted-foreground">{name || email}</span>
      </button>
      <div className="absolute inset-0 -bottom-2" />
      <div className="absolute left-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-2 px-4 py-3 text-foreground hover:bg-accent rounded-lg transition"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
