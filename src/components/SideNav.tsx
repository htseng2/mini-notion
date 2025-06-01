"use client";

import { useState } from "react";
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
import { useDocuments } from "@/context/DocumentsContext";
import SearchModal from "./SearchModal";

interface Document {
  id: string;
  title: string;
  updatedAt: Date;
  canEdit?: boolean;
}

interface SideNavProps {
  userName?: string | null;
  userEmail?: string;
}

export default function SideNav({ userName, userEmail }: SideNavProps) {
  const { isExpanded, setIsExpanded } = useSideNav();
  const { ownedDocuments, sharedDocuments } = useDocuments();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearchModalOpen(true);
  };

  const handleSearchClick = () => {
    setIsSearchModalOpen(true);
  };

  const searchResults = [...ownedDocuments, ...sharedDocuments].filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 ${
          isExpanded ? "w-64" : "w-16"
        }`}
      >
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
        <div className="space-y-2">
          {/* Documents Link */}
          <Link
            href="/"
            className={`flex items-center hover:bg-gray-50 transition ${
              isExpanded ? "px-4 py-2 gap-3" : "p-4 justify-center"
            }`}
          >
            <DocumentTextIcon className="h-5 w-5 text-gray-600" />
            {isExpanded && <span className="text-gray-700">Documents</span>}
          </Link>

          {/* Search Button */}
          <button
            onClick={handleSearchClick}
            className={`flex items-center hover:bg-gray-50 transition w-full ${
              isExpanded ? "px-4 py-2 gap-3" : "p-4 justify-center"
            }`}
          >
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-600" />
            {isExpanded && <span className="text-gray-700">Search</span>}
          </button>
        </div>

        {/* Sign Out Button */}
        <div className="mt-auto">
          <div className="h-4" /> {/* 16px spacing before divider */}
          <div className="border-t border-gray-200" />
          <div className="h-4" /> {/* 16px spacing after divider */}
          <button
            onClick={() => {
              if (confirm("Are you sure you want to sign out?")) {
                signOut({ callbackUrl: "/" });
              }
            }}
            className={`flex items-center hover:bg-gray-50 transition w-full ${
              isExpanded ? "px-4 py-2 gap-3" : "p-4 justify-center"
            }`}
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-600" />
            {isExpanded && <span className="text-gray-700">Sign Out</span>}
          </button>
        </div>
      </div>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        searchResults={searchResults}
        searchQuery={searchQuery}
        onSearchQueryChange={handleSearch}
      />
    </>
  );
}
