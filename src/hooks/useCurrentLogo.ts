import { useAccessibility } from '@/context/accessibilityContext';
import { useEffect, useState } from 'react';
import logoUdcLight from '@/assets/img/logo-udc.png';
import logoUdcDark from '@/assets/img/logo-udc-negate.png';

export const useCurrentLogo = () => {
  const { isDark } = useAccessibility();
  const [currentLogo, setCurrentLogo] = useState(
    isDark ? logoUdcDark : logoUdcLight
  );

  useEffect(() => {
    setCurrentLogo(isDark ? logoUdcDark : logoUdcLight);
  }, [isDark]);

  return { currentLogo };
};
