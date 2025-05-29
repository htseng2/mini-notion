"use client";

import { useState, useEffect } from "react";

interface Document {
  id: string;
  title: string;
  content: string | null;
}

interface DocumentEditorProps {
  document: Document;
}

export default function DocumentEditor({ document }: DocumentEditorProps) {
  const [content, setContent] = useState(document.content || "");
  const [title, setTitle] = useState(document.title);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-save when content or title changes
  useEffect(() => {
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
  }, [content, title, document.id, document.title, document.content]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Document"
          className="w-full text-3xl font-extrabold text-indigo-700 mb-4 bg-transparent border-none focus:ring-0 p-0"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your document..."
          className="w-full min-h-[500px] rounded-lg border-gray-300 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 resize-none"
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
    </div>
  );
}
