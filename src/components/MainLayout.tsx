"use client";

import { useSession } from "next-auth/react";
import { useSideNav } from "@/context/SideNavContext";
import SideNav from "@/components/SideNav";
import { DocumentsProvider } from "@/context/DocumentsContext";

function MainLayoutInner({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const { isExpanded } = useSideNav();

  if (!session?.user?.email) {
    return <>{children}</>;
  }

  return (
    <>
      <SideNav userName={session.user.name} userEmail={session.user.email} />
      <main
        className={`min-h-screen bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-slate-900 dark:via-background dark:to-slate-800 transition-all duration-300 ${
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
