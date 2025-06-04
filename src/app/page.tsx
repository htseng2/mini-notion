"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { PlusIcon, DocumentTextIcon } from "@heroicons/react/24/solid";
import { useDocuments } from "@/context/DocumentsContext";

export default function Home() {
  const { data: session } = useSession();
  const { ownedDocuments, sharedDocuments } = useDocuments();

  if (!session?.user?.email) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="rounded-2xl bg-card border border-border p-10 shadow-2xl text-center max-w-md w-full">
          <h1 className="text-4xl font-extrabold mb-4 text-primary">
            Welcome to Mini-Notion
          </h1>
          <p className="mb-8 text-muted-foreground text-lg">
            Sign in or sign up to start creating your notes!
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/signin"
              className="rounded-lg bg-primary px-6 py-3 text-primary-foreground font-semibold hover:bg-primary/90 transition"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-lg bg-secondary px-6 py-3 text-secondary-foreground font-semibold hover:bg-secondary/80 transition"
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
      <div className="w-full max-w-3xl mx-auto rounded-2xl bg-card border border-border shadow-2xl p-10">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-extrabold text-primary">
            Your Documents
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/documents/new"
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-primary-foreground font-semibold shadow hover:bg-primary/90 transition"
            >
              <PlusIcon className="h-5 w-5" /> New Document
            </Link>
          </div>
        </div>

        {ownedDocuments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              My Documents
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[...ownedDocuments]
                .sort(
                  (a, b) =>
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime()
                )
                .map((doc) => (
                  <li
                    key={doc.id}
                    className="rounded-xl border border-border bg-card p-6 shadow hover:shadow-lg transition flex flex-col justify-between min-h-[120px]"
                  >
                    <Link
                      href={`/documents/${doc.id}`}
                      className="text-xl font-semibold text-primary hover:text-primary/80 hover:underline flex items-center gap-2"
                    >
                      <DocumentTextIcon className="h-5 w-5" />
                      {doc.title}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-2">
                      Last updated:{" "}
                      {new Date(doc.updatedAt).toLocaleDateString()}
                    </p>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {sharedDocuments.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Shared with Me
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[...sharedDocuments]
                .sort(
                  (a, b) =>
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime()
                )
                .map((doc) => (
                  <li
                    key={doc.id}
                    className="rounded-xl border border-border bg-card p-6 shadow hover:shadow-lg transition flex flex-col justify-between min-h-[120px]"
                  >
                    <Link
                      href={`/documents/${doc.id}`}
                      className="text-xl font-semibold text-primary hover:text-primary/80 hover:underline flex items-center gap-2"
                    >
                      <DocumentTextIcon className="h-5 w-5" />
                      {doc.title}
                    </Link>
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">
                        Last updated:{" "}
                        {new Date(doc.updatedAt).toLocaleDateString()}
                      </p>
                      {!doc.canEdit && (
                        <p className="text-sm text-muted-foreground mt-1">
                          (View only)
                        </p>
                      )}
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {ownedDocuments.length === 0 && sharedDocuments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              You don&apos;t have any documents yet.
            </p>
            <Link
              href="/documents/new"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-primary-foreground font-semibold shadow hover:bg-primary/90 transition"
            >
              <PlusIcon className="h-5 w-5" /> Create Your First Document
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
