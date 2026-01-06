/**
 * Custom Navbar Item for Lecture Slides
 * 
 * This component renders a navbar link that navigates to the appropriate
 * lecture slides based on the user's selected section. It uses the
 * useSlidesPath hook to determine the correct path.
 */

import React from 'react';
import { useSlidesPath, useDefaultSlidesPath } from '../../hooks/useSlidesPath';
import DefaultNavbarItem from '@theme-original/NavbarItem/DefaultNavbarItem';

interface Props {
  mobile?: boolean;
  label?: string;
  position?: 'left' | 'right';
  className?: string;
}

export default function SlidesNavbarItem({
  mobile = false,
  label = 'Lecture Slides',
  position = 'left',
  className,
}: Props): React.ReactElement {
  // Use the hook to get section-specific path (client-side)
  const slidesPath = useSlidesPath();
  // Fallback to default path for SSR
  const defaultPath = useDefaultSlidesPath();
  
  // Use slidesPath once it's determined, fallback to default for initial render
  const href = slidesPath || defaultPath;
  
  return (
    <DefaultNavbarItem
      mobile={mobile}
      label={label}
      to={href}
      position={position}
      className={className}
    />
  );
}

