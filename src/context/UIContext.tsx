import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UIContextType {
  isResumeOpen: boolean;
  setIsResumeOpen: (open: boolean) => void;
  isVisitorModalOpen: boolean | undefined;
  setIsVisitorModalOpen: (open: boolean | undefined) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState<boolean | undefined>(undefined);

  return (
    <UIContext.Provider
      value={{
        isResumeOpen,
        setIsResumeOpen,
        isVisitorModalOpen,
        setIsVisitorModalOpen,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUIContext = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUIContext must be used within a UIProvider');
  }
  return context;
};
