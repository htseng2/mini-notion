"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SideNavContextType {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

const SideNavContext = createContext<SideNavContextType | undefined>(undefined);

export function SideNavProvider({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <SideNavContext.Provider value={{ isExpanded, setIsExpanded }}>
      {children}
    </SideNavContext.Provider>
  );
}

export function useSideNav() {
  const context = useContext(SideNavContext);
  if (context === undefined) {
    throw new Error("useSideNav must be used within a SideNavProvider");
  }
  return context;
}
