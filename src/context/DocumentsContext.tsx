"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";

interface Document {
  id: string;
  title: string;
  content: string | null;
  updatedAt: Date;
  userId: string;
  canEdit?: boolean;
}

interface DocumentsContextType {
  ownedDocuments: Document[];
  setOwnedDocuments: (docs: Document[]) => void;
  sharedDocuments: Document[];
  setSharedDocuments: (docs: Document[]) => void;
}

const DocumentsContext = createContext<DocumentsContextType | undefined>(
  undefined
);

export function DocumentsProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [ownedDocuments, setOwnedDocuments] = useState<Document[]>([]);
  const [sharedDocuments, setSharedDocuments] = useState<Document[]>([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!session?.user?.email) return;
      const response = await fetch("/api/documents");
      const data = await response.json();
      setOwnedDocuments(data.ownedDocuments);
      setSharedDocuments(data.sharedDocuments);
    };
    fetchDocuments();
  }, [session]);

  return (
    <DocumentsContext.Provider
      value={{
        ownedDocuments,
        setOwnedDocuments,
        sharedDocuments,
        setSharedDocuments,
      }}
    >
      {children}
    </DocumentsContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentsContext);
  if (context === undefined) {
    throw new Error("useDocuments must be used within a DocumentsProvider");
  }
  return context;
}
