"use client";

import { signOut } from "next-auth/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useSideNav } from "@/context/SideNavContext";

interface SideNavProps {
  userName?: string | null;
  userEmail?: string;
}

export default function SideNav({ userName, userEmail }: SideNavProps) {
  const { isExpanded, setIsExpanded } = useSideNav();

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 ${
        isExpanded ? "w-64" : "w-16"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-4 hover:bg-gray-50 transition flex items-center justify-center"
        >
          {isExpanded ? (
            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
          )}
        </button>

        {/* User Info */}
        <div
          className={`p-4 border-b border-gray-200 ${
            isExpanded ? "block" : "hidden"
          }`}
        >
          <div className="text-sm font-medium text-gray-900 truncate">
            {userName}
          </div>
          <div className="text-xs text-gray-600 truncate">{userEmail}</div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition"
              >
                <DocumentTextIcon className="h-5 w-5 text-gray-600" />
                {isExpanded && <span>Documents</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Sign Out Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-600" />
            {isExpanded && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
