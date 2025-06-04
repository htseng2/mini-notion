"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bars3Icon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { signOut } from "next-auth/react";

interface HamburgerMenuProps {
  userName?: string | null;
  userEmail?: string;
}

export default function HamburgerMenu({
  userName,
  userEmail,
}: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-accent transition"
      >
        <Bars3Icon className="h-6 w-6 text-muted-foreground" />
      </button>
      <div
        className={`absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-xl border border-border transition-all duration-200 z-50 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="p-3 border-b border-border bg-muted">
          <div className="text-sm font-medium text-foreground">{userName}</div>
          <div className="text-xs text-muted-foreground">{userEmail}</div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-2 px-4 py-3 text-foreground hover:bg-accent transition"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
