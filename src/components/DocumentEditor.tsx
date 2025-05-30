"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon, ShareIcon } from "@heroicons/react/24/solid";

interface Document {
  id: string;
  title: string;
  content: string | null;
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
  const [content, setContent] = useState(document.content || "");
  const [title, setTitle] = useState(document.title);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [shareCanEdit, setShareCanEdit] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

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
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setSaving(false);
      }
    }, 1000); // Debounce for 1 second

    return () => clearTimeout(saveTimeout);
  }, [content, title, document.id, document.title, document.content, canEdit]);

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
        throw new Error(data.message || "Something went wrong");
      }

      setShowShareModal(false);
      setShareEmail("");
      setShareCanEdit(false);
    } catch (err) {
      setShareError(
        err instanceof Error ? err.message : "Something went wrong"
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
            className="w-full text-3xl font-extrabold text-indigo-700 bg-transparent border-none focus:ring-0 p-0"
            readOnly={!canEdit}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition"
            >
              <ShareIcon className="h-5 w-5" />
              Share
            </button>
            {canEdit && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
              >
                <TrashIcon className="h-5 w-5" />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your document..."
          className="w-full min-h-[500px] rounded-lg border-gray-300 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 resize-none"
          readOnly={!canEdit}
        />
        {saving && (
          <div className="absolute bottom-4 right-4 text-sm text-gray-500">
            Saving...
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Share Document</h2>
            <form onSubmit={handleShare} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
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
                  className="w-full rounded-lg border-gray-300 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="canEdit"
                  checked={shareCanEdit}
                  onChange={(e) => setShareCanEdit(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label
                  htmlFor="canEdit"
                  className="text-sm font-medium text-gray-700"
                >
                  Allow editing
                </label>
              </div>
              {shareError && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-700">{shareError}</div>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
                >
                  Share
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
