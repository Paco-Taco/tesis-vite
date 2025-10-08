import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PersonStanding,
  Contrast,
  Type,
  SunMoon,
  LetterText,
  Undo2,
} from 'lucide-react';

// shadcn/ui
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { useAccessibility } from '@/context/accessibilityContext';

/**
 * Modern, accessible floating action button (FAB) + Popover for accessibility controls.
 * - Uses shadcn components (Button, Popover, Switch, Tooltip, Separator)
 * - Subtle motion via Framer Motion
 * - Keyboard shortcut Alt/Option + A to toggle the panel
 * - Includes quick presets and a Reset button
 */
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
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // Hotkey: Alt/Option + A opens/closes the panel
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.altKey || e.metaKey) && e.code === 'KeyA') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Presets
  const applyPreset = (preset: 'reading' | 'contrast' | 'reset') => {
    if (preset === 'reading') {
      if (!largeText) toggleLargeText();
      if (!letterSpacing) toggleLetterSpacing();
      // keep theme/contrast as user had
    }
    if (preset === 'contrast') {
      if (!highContrast) toggleHighContrast();
      if (!isDark) toggleTheme();
    }
    if (preset === 'reset') {
      if (largeText) toggleLargeText();
      if (letterSpacing) toggleLetterSpacing();
      if (highContrast) toggleHighContrast();
      if (isDark) toggleTheme();
    }
  };

  const badge = useMemo(() => {
    const active = [largeText, highContrast, letterSpacing, isDark].filter(
      Boolean
    ).length;
    if (active === 0) return null;
    return (
      <span
        className={cn(
          'absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full text-[10px] font-medium',
          'bg-primary/90 text-primary-foreground shadow'
        )}
      >
        {active}
      </span>
    );
  }, [largeText, highContrast, letterSpacing, isDark]);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="fixed bottom-4 right-4 z-50">
        <Popover open={open} onOpenChange={setOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  ref={triggerRef}
                  size="icon"
                  className={cn(
                    'relative h-12 w-12 rounded-2xl shadow-lg',
                    'bg-primary text-primary-foreground',
                    'transition-transform hover:scale-[1.03] active:scale-95'
                  )}
                  aria-label="Opciones de accesibilidad"
                >
                  <PersonStanding className="h-6 w-6" />
                  {badge}
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="left">
              Accesibilidad (Alt/⌥ + A)
            </TooltipContent>
          </Tooltip>

          <AnimatePresence>
            {open && (
              <PopoverContent
                align="end"
                sideOffset={12}
                className={cn(
                  'w-100 p-0 border shadow-xl rounded-2xl overflow-hidden',
                  'bg-background'
                )}
                asChild
              >
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  role="dialog"
                  aria-label="Panel de accesibilidad"
                >
                  <div className="px-4 pt-4 pb-2">
                    <h3 className="text-base font-semibold tracking-tight">
                      Accesibilidad
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Ajusta la interfaz para una lectura más cómoda.
                    </p>
                  </div>

                  <Separator />

                  <div className="p-3 grid grid-cols-3 gap-2">
                    <Button
                      variant="secondary"
                      className="justify-start gap-2"
                      onClick={() => applyPreset('reading')}
                    >
                      <Type className="h-4 w-4" /> Lectura
                    </Button>
                    <Button
                      variant="secondary"
                      className="justify-start gap-2"
                      onClick={() => applyPreset('contrast')}
                    >
                      <Contrast className="h-4 w-4" /> Contraste
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start gap-2"
                      onClick={() => applyPreset('reset')}
                    >
                      <Undo2 className="h-4 w-4" /> Restaurar
                    </Button>
                  </div>

                  <Separator />

                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <Type className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="largeText" className="cursor-pointer">
                          Aumentar fuente
                        </Label>
                      </div>
                      <Switch
                        id="largeText"
                        checked={largeText}
                        onCheckedChange={toggleLargeText}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <Contrast className="h-4 w-4 text-muted-foreground" />
                        <Label
                          htmlFor="highContrast"
                          className="cursor-pointer"
                        >
                          Alto contraste
                        </Label>
                      </div>
                      <Switch
                        id="highContrast"
                        checked={highContrast}
                        onCheckedChange={toggleHighContrast}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <LetterText className="h-4 w-4 text-muted-foreground" />
                        <Label
                          htmlFor="letterSpacing"
                          className="cursor-pointer"
                        >
                          Espaciado en letras
                        </Label>
                      </div>
                      <Switch
                        id="letterSpacing"
                        checked={letterSpacing}
                        onCheckedChange={toggleLetterSpacing}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <SunMoon className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="darkMode" className="cursor-pointer">
                          Modo oscuro
                        </Label>
                      </div>
                      <Switch
                        id="darkMode"
                        checked={isDark}
                        onCheckedChange={toggleTheme}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="p-3 flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Consejo: Presiona{' '}
                      <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px]">
                        Alt
                      </kbd>{' '}
                      +{' '}
                      <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px]">
                        A
                      </kbd>
                    </div>
                  </div>
                </motion.div>
              </PopoverContent>
            )}
          </AnimatePresence>
        </Popover>
      </div>
    </TooltipProvider>
  );
};
