"use client";

import { useSession } from "next-auth/react";
import { useSideNav } from "@/context/SideNavContext";
import SideNav from "@/components/SideNav";
import { DocumentsProvider, useDocuments } from "@/context/DocumentsContext";

function MainLayoutInner({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const { isExpanded } = useSideNav();
  const { ownedDocuments, setFilteredOwnedDocs } = useDocuments();

  if (!session?.user?.email) {
    return <>{children}</>;
  }

  return (
    <>
      <SideNav
        userName={session.user.name}
        userEmail={session.user.email}
        documents={ownedDocuments}
        onSearch={setFilteredOwnedDocs}
      />
      <main
        className={`min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 transition-all duration-300 ${
          isExpanded ? "ml-64" : "ml-16"
        }`}
      >
        {children}
      </main>
    </>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DocumentsProvider>
      <MainLayoutInner>{children}</MainLayoutInner>
    </DocumentsProvider>
  );
}
