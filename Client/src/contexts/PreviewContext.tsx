import { createContext, useContext, useState, ReactNode } from 'react';

interface PreviewContextType {
  isPreview: boolean;
  togglePreview: () => void;
}

const PreviewContext = createContext<PreviewContextType | undefined>(undefined);

export const PreviewProvider = ({ children }: { children: ReactNode }) => {
  const [isPreview, setIsPreview] = useState(false);

  const togglePreview = () => {
    setIsPreview((prev) => !prev);
  };

  return (
    <PreviewContext.Provider value={{ isPreview, togglePreview }}>
      {children}
    </PreviewContext.Provider>
  );
};

export const usePreview = () => {
  const context = useContext(PreviewContext);
  if (!context) {
    throw new Error('usePreview must be used within PreviewProvider');
  }
  return context;
};
