import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { createSystem } from '@chakra-ui/react';
import { defaultConfig } from '@chakra-ui/react';
import { ColorModeProvider, useColorMode } from '../components/ui/color-mode';
import { useTheme } from 'next-themes';
import SiteStorage from '@generated/site-storage';

// Get the same storage key that Docusaurus uses for color mode
// Docusaurus uses 'theme' as the base key and applies a namespace
function getDocusaurusThemeStorageKey(): string {
  return `theme${SiteStorage.namespace}`;
}

/**
 * Error Boundary to suppress the benign "scrollWidth" error during hot reload.
 * 
 * This error occurs when Docusaurus's useCodeWordWrap hook tries to access
 * a code block's ref during React's reconciliation/hot reload. The ref is
 * momentarily null, causing the destructuring to fail.
 * 
 * The error is transient - the component recovers on the next render - so we
 * simply reset the error boundary state to allow re-rendering.
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ScrollWidthErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Check if this is the scrollWidth error we want to suppress
    const isScrollWidthError = 
      error?.message?.includes('scrollWidth') &&
      (error?.message?.includes('null') || error?.message?.includes('undefined'));
    
    if (isScrollWidthError) {
      // Return state that will trigger immediate recovery
      return { hasError: true, error };
    }
    
    // For other errors, let them propagate (or handle differently)
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const isScrollWidthError = 
      error?.message?.includes('scrollWidth') &&
      (error?.message?.includes('null') || error?.message?.includes('undefined'));
    
    if (isScrollWidthError) {
      // Silently suppress - this is a known benign error during hot reload
      // Schedule a reset to allow the component to re-render
      setTimeout(() => {
        this.setState({ hasError: false, error: null });
      }, 0);
    } else {
      // Log other errors normally
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  componentDidUpdate(_prevProps: { children: React.ReactNode }, prevState: ErrorBoundaryState): void {
    // If we just caught a scrollWidth error, immediately try to recover
    if (this.state.hasError && this.state.error) {
      const isScrollWidthError = 
        this.state.error?.message?.includes('scrollWidth') &&
        (this.state.error?.message?.includes('null') || this.state.error?.message?.includes('undefined'));
      
      if (isScrollWidthError && prevState.hasError) {
        // Already scheduled reset in componentDidCatch
      }
    }
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      const isScrollWidthError = 
        this.state.error?.message?.includes('scrollWidth') &&
        (this.state.error?.message?.includes('null') || this.state.error?.message?.includes('undefined'));
      
      if (isScrollWidthError) {
        // For scrollWidth errors, just render children anyway
        // The error is transient and will resolve on next hot reload tick
        return this.props.children;
      }
      
      // For other errors, you might want to show a fallback UI
      // For now, still try to render children
      return this.props.children;
    }

    return this.props.children;
  }
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
  const { resolvedTheme, theme } = useTheme();
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  
  // Sync wrapper div class with color mode
  // This avoids React hydration timing issues by updating our own wrapper instead of HTML element
  const syncWrapperClass = React.useCallback((theme: 'light' | 'dark') => {
    if (!wrapperRef.current) return;
    wrapperRef.current.classList.remove('light', 'dark');
    wrapperRef.current.classList.add(theme);
  }, []);
  
  React.useEffect(() => {
    if (!wrapperRef.current) return;
    
    // Use resolvedTheme which is always "light" or "dark" (never "system")
    // resolvedTheme automatically updates when theme is "system" and system preference changes
    // It also updates when storage changes in another tab (next-themes handles cross-tab sync)
    const currentTheme: 'light' | 'dark' = (resolvedTheme || colorMode || 'light') as 'light' | 'dark';
    syncWrapperClass(currentTheme);
  }, [resolvedTheme, colorMode, syncWrapperClass]);
  
  // Listen for system preference changes when in system mode
  // This ensures the wrapper updates when system preference changes
  React.useEffect(() => {
    const storageKey = getDocusaurusThemeStorageKey();
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      const stored = localStorage.getItem(storageKey);
      // If storage is null (system mode) or "system", react to system changes
      if (stored === null || stored === 'system') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        syncWrapperClass(systemTheme);
      }
    };
    mediaQuery.addEventListener('change', handleSystemChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange);
    };
  }, [syncWrapperClass]);

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
    <ScrollWidthErrorBoundary>
      <ChakraProvider value={system}>
        <ColorModeProvider storageKey={getDocusaurusThemeStorageKey()}>
          <ChakraColorModeSync>
            {children}
          </ChakraColorModeSync>
        </ColorModeProvider>
      </ChakraProvider>
    </ScrollWidthErrorBoundary>
  );
}