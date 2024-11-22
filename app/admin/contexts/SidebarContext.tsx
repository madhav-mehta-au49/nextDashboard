"use client"
import { createContext, useContext, useState } from 'react';

const SidebarContext = createContext({
  isSidebarOpen: true,
  toggleSidebar: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    console.log('Context: Sidebar state changing from', isSidebarOpen, 'to', !isSidebarOpen);
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}
export const useSidebar = () => useContext(SidebarContext);
