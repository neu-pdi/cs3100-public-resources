/**
 * Swizzled CodeBlock component that wraps the original with error handling.
 * 
 * This fixes the error:
 * "Cannot destructure property 'scrollWidth' of 'codeBlockRef.current' as it is null"
 * 
 * This error occurs when Reveal.js triggers layout recalculations on slides containing
 * code blocks. Docusaurus's useCodeWordWrap hook tries to access the code block ref
 * before it's mounted, causing the destructuring to fail.
 * 
 * The solution is to wrap the CodeBlock in an error boundary that catches and suppresses
 * this specific benign error, allowing the component to recover on the next render.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import OriginalCodeBlock from '@theme-original/CodeBlock';
import type CodeBlockType from '@theme/CodeBlock';
import type { WrapperProps } from '@docusaurus/types';

type Props = WrapperProps<typeof CodeBlockType>;

interface ErrorBoundaryState {
  hasError: boolean;
  errorKey: number;
}

/**
 * Error boundary specifically for CodeBlock components.
 * Catches the useCodeWordWrap null ref error and allows recovery.
 */
class CodeBlockErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, errorKey: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Check if this is the specific useCodeWordWrap error
    if (
      error.message?.includes('scrollWidth') &&
      error.message?.includes('codeBlockRef')
    ) {
      // Return state update to trigger re-render
      return { hasError: true };
    }
    // Re-throw other errors
    throw error;
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Only log in development and only for unexpected errors
    if (
      process.env.NODE_ENV === 'development' &&
      !error.message?.includes('scrollWidth')
    ) {
      console.error('CodeBlock error:', error, errorInfo);
    }
  }

  componentDidUpdate(
    prevProps: { children: ReactNode },
    prevState: ErrorBoundaryState
  ): void {
    // Reset error state after a brief delay to allow recovery
    if (this.state.hasError && !prevState.hasError) {
      // Use requestAnimationFrame to defer the reset to next frame
      // This gives React and Reveal.js time to stabilize
      requestAnimationFrame(() => {
        this.setState((state) => ({
          hasError: false,
          errorKey: state.errorKey + 1,
        }));
      });
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Return a placeholder during the brief error state
      // The component will re-render shortly via componentDidUpdate
      return (
        <div
          style={{
            minHeight: '1em',
            background: 'transparent',
          }}
        />
      );
    }

    return (
      <React.Fragment key={this.state.errorKey}>
        {this.props.children}
      </React.Fragment>
    );
  }
}

export default function CodeBlockWrapper(props: Props): JSX.Element {
  return (
    <CodeBlockErrorBoundary>
      <OriginalCodeBlock {...props} />
    </CodeBlockErrorBoundary>
  );
}

