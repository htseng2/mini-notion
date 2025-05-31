"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { PlusIcon, DocumentTextIcon } from "@heroicons/react/24/solid";
import { useDocuments } from "@/context/DocumentsContext";

export default function Home() {
  const { data: session } = useSession();
  const { filteredOwnedDocs, filteredSharedDocs } = useDocuments();

  if (!session?.user?.email) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="rounded-2xl bg-white p-10 shadow-2xl text-center max-w-md w-full">
          <h1 className="text-4xl font-extrabold mb-4 text-indigo-700">
            Welcome to Mini-Notion
          </h1>
          <p className="mb-8 text-gray-600 text-lg">
            Sign in or sign up to start creating your notes!
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/signin"
              className="rounded-lg bg-indigo-600 px-6 py-3 text-white font-semibold hover:bg-indigo-500 transition"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-lg bg-gray-200 px-6 py-3 text-gray-800 font-semibold hover:bg-gray-300 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="w-full max-w-3xl mx-auto rounded-2xl bg-white shadow-2xl p-10">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-extrabold text-indigo-700">
            Your Documents
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/documents/new"
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-white font-semibold shadow hover:bg-indigo-500 transition"
            >
              <PlusIcon className="h-5 w-5" /> New Document
            </Link>
          </div>
        </div>

        {filteredOwnedDocs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              My Documents
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredOwnedDocs.map((doc) => (
                <li
                  key={doc.id}
                  className="rounded-xl border bg-white p-6 shadow hover:shadow-lg transition flex flex-col justify-between min-h-[120px]"
                >
                  <Link
                    href={`/documents/${doc.id}`}
                    className="text-xl font-semibold text-indigo-700 hover:underline flex items-center gap-2"
                  >
                    <DocumentTextIcon className="h-6 w-6 text-indigo-400" />
                    {doc.title}
                  </Link>
                  <div className="text-xs text-gray-500 mt-3">
                    Last updated: {new Date(doc.updatedAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {filteredSharedDocs.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Shared with Me
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredSharedDocs.map((doc) => (
                <li
                  key={doc.id}
                  className="rounded-xl border bg-white p-6 shadow hover:shadow-lg transition flex flex-col justify-between min-h-[120px]"
                >
                  <Link
                    href={`/documents/${doc.id}`}
                    className="text-xl font-semibold text-indigo-700 hover:underline flex items-center gap-2"
                  >
                    <DocumentTextIcon className="h-6 w-6 text-indigo-400" />
                    {doc.title}
                  </Link>
                  <div className="flex flex-col gap-1">
                    <div className="text-xs text-gray-500">
                      Last updated: {new Date(doc.updatedAt).toLocaleString()}
                    </div>
                    <div className="text-xs text-indigo-600">
                      {doc.canEdit ? "Can edit" : "View only"}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {filteredOwnedDocs.length === 0 && filteredSharedDocs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <span className="text-6xl mb-4">📝</span>
            <div className="text-lg font-medium mb-2">No documents yet</div>
            <div className="mb-4">
              Click{" "}
              <span className="font-semibold text-indigo-600">
                New Document
              </span>{" "}
              to create your first note!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
