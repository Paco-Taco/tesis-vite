import { useAccessibility } from '@/context/accessibilityContext';
import { useState } from 'react';
import { PersonStanding } from 'lucide-react';

export const AccessibilityTab = () => {
  const {
    toggleLargeText,
    toggleHighContrast,
    toggleLetterSpacing,
    toggleTheme,
    largeText,
    highContrast,
    letterSpacing,
    isDark,
  } = useAccessibility();

  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="p-3 rounded-full bg-green-800 text-white shadow-lg hover:bg-gray-800"
        aria-label="Opciones de accesibilidad"
      >
        <PersonStanding className="w-5 h-5 dark:stroke-white" />
      </button>

      {open && (
        <div className="mt-2 p-4 bg-white dark:bg-neutral-900 rounded-xl shadow-xl w-64 space-y-2 border text-sm text-black dark:text-white">
          <label className="flex justify-between items-center">
            <span>Aumentar fuente</span>
            <input
              type="checkbox"
              checked={largeText}
              onChange={toggleLargeText}
            />
          </label>
          <label className="flex justify-between items-center">
            <span>Alto contraste</span>
            <input
              type="checkbox"
              checked={highContrast}
              onChange={toggleHighContrast}
            />
          </label>
          <label className="flex justify-between items-center">
            <span>Espaciado letras</span>
            <input
              type="checkbox"
              checked={letterSpacing}
              onChange={toggleLetterSpacing}
            />
          </label>
          <label className="flex justify-between items-center">
            <span>Modo oscuro</span>
            <input type="checkbox" checked={isDark} onChange={toggleTheme} />
          </label>
        </div>
      )}
    </div>
  );
};
