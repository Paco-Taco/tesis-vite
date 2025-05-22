// components/ui/accessibility-context.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface AccessibilityContextType {
  largeText: boolean;
  highContrast: boolean;
  letterSpacing: boolean;
  isDark: boolean;
  toggleLargeText: () => void;
  toggleHighContrast: () => void;
  toggleLetterSpacing: () => void;
  toggleTheme: () => void;
}

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

export const AccessibilityProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [letterSpacing, setLetterSpacing] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const root = document.documentElement; // esto apunta al <html>
    root.classList.toggle('a11y-large-text', largeText);
    document.body.classList.toggle('a11y-high-contrast', highContrast);
    document.body.classList.toggle('a11y-letter-spacing', letterSpacing);
  }, [largeText, highContrast, letterSpacing]);

  return (
    <AccessibilityContext.Provider
      value={{
        largeText,
        highContrast,
        letterSpacing,
        isDark,
        toggleLargeText: () => setLargeText((v) => !v),
        toggleHighContrast: () => setHighContrast((v) => !v),
        toggleLetterSpacing: () => setLetterSpacing((v) => !v),
        toggleTheme,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context)
    throw new Error(
      'useAccessibility must be used within AccessibilityProvider'
    );
  return context;
};
