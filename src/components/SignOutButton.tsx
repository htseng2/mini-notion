"use client";

import { signOut } from "next-auth/react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-2 rounded-lg bg-gray-100 px-5 py-3 text-gray-700 font-semibold hover:bg-gray-200 transition"
    >
      <ArrowRightOnRectangleIcon className="h-5 w-5" /> Sign Out
    </button>
  );
}
