"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon, ShareIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useDocuments } from "@/context/DocumentsContext";
import RichTextEditor from "./RichTextEditor";

interface Document {
  id: string;
  title: string;
  content: string | null;
}

interface Share {
  id: string;
  canEdit: boolean;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

interface DocumentEditorProps {
  document: Document;
  canEdit: boolean;
}

export default function DocumentEditor({
  document,
  canEdit,
}: DocumentEditorProps) {
  const router = useRouter();
  const { setOwnedDocuments, setSharedDocuments } = useDocuments();
  const [content, setContent] = useState(document.content || "");
  const [title, setTitle] = useState(document.title);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [shareCanEdit, setShareCanEdit] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [shares, setShares] = useState<Share[]>([]);
  const [isLoadingShares, setIsLoadingShares] = useState(false);

  // Load existing shares
  useEffect(() => {
    if (showShareModal) {
      loadShares();
    }
  }, [showShareModal]);

  const loadShares = async () => {
    setIsLoadingShares(true);
    try {
      const response = await fetch(`/api/documents/${document.id}/shares`);
      if (!response.ok) {
        throw new Error("Failed to load shares");
      }
      const data = await response.json();
      setShares(data);
    } catch (err) {
      console.error("Error loading shares:", err);
    } finally {
      setIsLoadingShares(false);
    }
  };

  // Auto-save when content or title changes
  useEffect(() => {
    if (!canEdit) return;

    const saveTimeout = setTimeout(async () => {
      if (content === document.content && title === document.title) return;

      setSaving(true);
      setError(null);

      try {
        const response = await fetch(`/api/documents/${document.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Something went wrong");
        }

        // Refresh the documents list
        const docsResponse = await fetch("/api/documents");
        const docsData = await docsResponse.json();
        setOwnedDocuments(docsData.ownedDocuments);
        setSharedDocuments(docsData.sharedDocuments);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setSaving(false);
      }
    }, 1000); // Debounce for 1 second

    return () => clearTimeout(saveTimeout);
  }, [
    content,
    title,
    document.id,
    document.title,
    document.content,
    canEdit,
    setOwnedDocuments,
    setSharedDocuments,
  ]);

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this document? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/documents/${document.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Something went wrong");
      }

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsDeleting(false);
    }
  };

  const handleShare = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShareError(null);

    try {
      const response = await fetch(`/api/documents/${document.id}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: shareEmail,
          canEdit: shareCanEdit,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 409) {
          throw new Error("This user already has access to the document");
        }
        throw new Error(data.message || "Something went wrong");
      }

      // Clear the form
      setShareEmail("");
      setShareCanEdit(false);

      // Reload shares to get complete user data
      await loadShares();
    } catch (err) {
      setShareError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  };

  const handleRemoveShare = async (email: string) => {
    try {
      const response = await fetch(`/api/documents/${document.id}/share`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove share");
      }

      setShares((currentShares) =>
        currentShares.filter((share) => share.user.email !== email)
      );
    } catch (err) {
      console.error("Error removing share:", err);
    }
  };

  const handleUpdateShare = async (email: string, canEdit: boolean) => {
    try {
      const response = await fetch(`/api/documents/${document.id}/share`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, canEdit }),
      });

      if (!response.ok) {
        throw new Error("Failed to update share permissions");
      }

      setShares((currentShares) =>
        currentShares.map((share) =>
          share.user.email === email ? { ...share, canEdit } : share
        )
      );
    } catch (err) {
      console.error("Error updating share:", err);
      setShares((currentShares) =>
        currentShares.map((share) =>
          share.user.email === email ? { ...share, canEdit: !canEdit } : share
        )
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Document"
            className="w-full text-3xl font-extrabold text-primary bg-transparent border-none focus:ring-0 p-0 placeholder:text-muted-foreground"
            readOnly={!canEdit}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-primary hover:text-primary/80 hover:bg-accent rounded-lg transition"
            >
              <ShareIcon className="h-5 w-5" />
              Share
            </button>
            {canEdit && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-lg transition disabled:opacity-50"
              >
                <TrashIcon className="h-5 w-5" />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>
        </div>
        <RichTextEditor
          content={content}
          onChange={setContent}
          readOnly={!canEdit}
        />
        {saving && (
          <div className="absolute bottom-4 right-4 text-sm text-muted-foreground">
            Saving...
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 p-4">
          <div className="text-sm text-destructive">{error}</div>
        </div>
      )}

      {showShareModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background/95 backdrop-blur-sm rounded-lg p-6 max-w-md w-full shadow-2xl border border-border">
            <div className="flex items-center justify-between mb-6 border-b border-border pb-3">
              <h2 className="text-2xl font-bold text-primary">
                Share Document
              </h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleShare} className="space-y-4 mb-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                  className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground shadow-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-ring"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="canEdit"
                  checked={shareCanEdit}
                  onChange={(e) => setShareCanEdit(e.target.checked)}
                  className="rounded border-input text-primary focus:ring-primary"
                />
                <label
                  htmlFor="canEdit"
                  className="text-sm font-medium text-foreground"
                >
                  Allow editing
                </label>
              </div>
              {shareError && (
                <div className="rounded-md bg-destructive/10 border border-destructive/20 p-4">
                  <div className="text-sm text-destructive">{shareError}</div>
                </div>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
                >
                  Share
                </button>
              </div>
            </form>

            {isLoadingShares ? (
              <div className="text-center text-muted-foreground">
                Loading shares...
              </div>
            ) : shares.length > 0 ? (
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">
                  People with access
                </h3>
                <ul className="space-y-2">
                  {shares.map((share) => (
                    <li
                      key={share.id}
                      className="flex items-center justify-between bg-muted rounded-lg px-4 py-3"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-foreground">
                          {share.user?.name || "Unknown User"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {share.user?.email || "No email"}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`edit-${share.id}`}
                            checked={share.canEdit}
                            onChange={(e) =>
                              handleUpdateShare(
                                share.user?.email || "",
                                e.target.checked
                              )
                            }
                            className="rounded border-input text-primary focus:ring-primary"
                          />
                          <label
                            htmlFor={`edit-${share.id}`}
                            className="text-sm text-muted-foreground"
                          >
                            Allow editing
                          </label>
                        </div>
                        <button
                          onClick={() =>
                            handleRemoveShare(share.user?.email || "")
                          }
                          className="text-muted-foreground hover:text-destructive transition"
                          title="Remove access"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                No one has access to this document yet
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
