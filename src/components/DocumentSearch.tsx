"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface Document {
  id: string;
  title: string;
  updatedAt: Date;
  canEdit?: boolean;
}

interface DocumentSearchProps {
  documents: Document[];
  onSearch: (filteredDocs: Document[]) => void;
}

export default function DocumentSearch({
  documents,
  onSearch,
}: DocumentSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = documents.filter((doc) =>
      doc.title.toLowerCase().includes(query.toLowerCase())
    );
    onSearch(filtered);
  };

  return (
    <div className="relative mb-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
}
