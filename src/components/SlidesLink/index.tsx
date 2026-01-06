/**
 * SlidesLink Component
 * 
 * A link component that navigates to the appropriate lecture slides based on
 * the user's selected section. If the section's instructor has custom slides
 * defined in course.config.json (instructorSlides), those are used; otherwise
 * the default slides path is used.
 * 
 * This component can be used anywhere a link to slides is needed, and also
 * serves as the basis for the custom navbar item.
 */

import React from 'react';
import Link from '@docusaurus/Link';
import { useSlidesPath, useDefaultSlidesPath } from '../../hooks/useSlidesPath';

export interface SlidesLinkProps {
  /** Link content/children - defaults to "Lecture Slides" */
  children?: React.ReactNode;
  /** Additional CSS class name */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Append to the slides path (e.g., "/l1-intro") */
  append?: string;
}

/**
 * Link component that navigates to the appropriate lecture slides
 * based on the user's selected section.
 */
export default function SlidesLink({ 
  children = 'Lecture Slides',
  className,
  style,
  append = '',
}: SlidesLinkProps): React.ReactElement {
  // Use the hook to get section-specific path (client-side)
  const slidesPath = useSlidesPath();
  // Fallback to default path for SSR
  const defaultPath = useDefaultSlidesPath();
  
  // Use slidesPath once it's determined, fallback to default for initial render
  const href = (slidesPath || defaultPath) + append;
  
  return (
    <Link to={href} className={className} style={style}>
      {children}
    </Link>
  );
}

