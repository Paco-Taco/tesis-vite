// components/ui/accessibility-context.tsx
import { createContext, useContext, useState, useEffect } from 'react';

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

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('a11y-large-text', largeText);
    document.body.classList.toggle('a11y-high-contrast', highContrast);
    document.body.classList.toggle('a11y-letter-spacing', letterSpacing);
  }, [largeText, highContrast, letterSpacing]);

  const toggleTheme = () => setIsDark((prev) => !prev);

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
