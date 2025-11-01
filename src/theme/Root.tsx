import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { createSystem } from '@chakra-ui/react';
import { defaultConfig } from '@chakra-ui/react';
import { ColorModeProvider, useColorMode } from '../components/ui/color-mode';
import SiteStorage from '@generated/site-storage';

// Get the same storage key that Docusaurus uses for color mode
// Docusaurus uses 'theme' as the base key and applies a namespace
function getDocusaurusThemeStorageKey(): string {
  return `theme${SiteStorage.namespace}`;
}

const system = createSystem(defaultConfig, {
  preflight: false, // CRITICAL: Disable Chakra's CSS reset which was blocking text selection
})

// Component to sync Chakra UI color mode with next-themes
// Chakra UI v3 uses semantic tokens with _light/_dark conditions that resolve to CSS selectors:
// - _light → :root &, .light &  (base variables on :root)
// - _dark → .dark &, .dark .chakra-theme:not(.light) &  (dark variables under .dark)
// 
function ChakraColorModeSync({ children }) {
  const { colorMode } = useColorMode();
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  
  // Sync wrapper div class with color mode
  // This avoids React hydration timing issues by updating our own wrapper instead of HTML element
  React.useEffect(() => {
    if (!wrapperRef.current) return;
    
    const currentTheme = colorMode || 'light';
    
    // Chakra UI v3 expects .dark/.light classes (not chakra-ui-*)
    // These classes trigger Chakra's conditional CSS variables automatically
    wrapperRef.current.classList.remove('light', 'dark');
    wrapperRef.current.classList.add(currentTheme);
  }, [colorMode]);

  // Wrap children in a div with the color mode class
  // Chakra's CSS selectors like .dark { --chakra-colors-* } will cascade to all descendants
  // This approach works immediately on first render - no hydration timing issues!
  return (
    <div ref={wrapperRef} className={colorMode || 'light'}>
      {children}
    </div>
  );
}

export default function Root({ children }) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider storageKey={getDocusaurusThemeStorageKey()}>
        <ChakraColorModeSync>
          {children}
        </ChakraColorModeSync>
      </ColorModeProvider>
    </ChakraProvider>
  );
}