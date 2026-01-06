/**
 * Swizzled NavbarItem component to support custom navbar item types.
 * 
 * This component wraps the original NavbarItem and adds support for the
 * 'custom-slides' type, which renders a link to the appropriate lecture
 * slides based on the user's selected section.
 */

import React from 'react';
import NavbarItemOriginal from '@theme-original/NavbarItem';
import type NavbarItemType from '@theme/NavbarItem';
import type { WrapperProps } from '@docusaurus/types';
import SlidesNavbarItem from './SlidesNavbarItem';

type Props = WrapperProps<typeof NavbarItemType>;

// Extended props type to include our custom type
interface ExtendedProps extends Props {
  type?: string;
  mobile?: boolean;
  label?: string;
  position?: 'left' | 'right';
  className?: string;
}

export default function NavbarItem(props: Props): React.ReactElement {
  const extendedProps = props as ExtendedProps;
  
  // Handle our custom 'slides' type
  if (extendedProps.type === 'custom-slides') {
    return (
      <SlidesNavbarItem
        mobile={extendedProps.mobile}
        label={extendedProps.label || 'Lecture Slides'}
        position={extendedProps.position || 'left'}
        className={extendedProps.className}
      />
    );
  }
  
  // Pass through to original NavbarItem for all other types
  return <NavbarItemOriginal {...props} />;
}

