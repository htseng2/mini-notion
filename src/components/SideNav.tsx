"use client";

import { useState, useRef } from "react";
import { signOut } from "next-auth/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useSideNav } from "@/context/SideNavContext";

interface Document {
  id: string;
  title: string;
  updatedAt: Date;
  canEdit?: boolean;
}

interface SideNavProps {
  userName?: string | null;
  userEmail?: string;
  documents: Document[];
  onSearch: (filteredDocs: Document[]) => void;
}

export default function SideNav({
  userName,
  userEmail,
  documents,
  onSearch,
}: SideNavProps) {
  const { isExpanded, setIsExpanded } = useSideNav();
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = documents.filter((doc) =>
      doc.title.toLowerCase().includes(query.toLowerCase())
    );
    onSearch(filtered);
  };

  const handleSearchIconClick = () => {
    setIsExpanded(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 200); // Wait for expand animation
  };

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

        {/* Search */}
        {isExpanded ? (
          <div className="p-4">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        ) : (
          <button
            className="flex items-center justify-center p-4 hover:bg-gray-50 transition"
            onClick={handleSearchIconClick}
            aria-label="Expand and search"
          >
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-600" />
          </button>
        )}

        {/* Documents Link */}
        {isExpanded ? (
          <div className="p-4">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition"
            >
              <DocumentTextIcon className="h-5 w-5 text-gray-600" />
              <span>Documents</span>
            </Link>
          </div>
        ) : (
          <Link
            href="/"
            className="flex items-center justify-center p-4 hover:bg-gray-50 transition"
          >
            <DocumentTextIcon className="h-5 w-5 text-gray-600" />
          </Link>
        )}

        {/* Sign Out Button */}
        <div className="mt-auto p-4 border-t border-gray-200">
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
