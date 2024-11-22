"use client"
import { createContext, useContext, useState } from 'react';

const SettingsContext = createContext({
  activeSettingsTab: 'account',
  setActiveSettingsTab: (tab: string) => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [activeSettingsTab, setActiveSettingsTab] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('activeSettingsTab') || 'account'
    }
    return 'account'
  });

  const handleSetActiveTab = (tab: string) => {
    setActiveSettingsTab(tab);
    localStorage.setItem('activeSettingsTab', tab);
  };

  return (
    <SettingsContext.Provider value={{ 
      activeSettingsTab, 
      setActiveSettingsTab: handleSetActiveTab 
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
