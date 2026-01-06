/**
 * Client module to suppress the annoying "scrollWidth" error during hot reload.
 * 
 * This error occurs when Docusaurus's useCodeWordWrap hook tries to access
 * a code block's ref during React's reconciliation/hot reload. The ref is
 * momentarily null, causing the destructuring to fail.
 * 
 * The error is benign - the component recovers on the next render - but the
 * dev error overlay makes it very disruptive during editing.
 * 
 * This module intercepts the error at multiple levels.
 */

const isScrollWidthError = (msg: string | undefined | null): boolean => {
  if (!msg) return false;
  return msg.includes('scrollWidth') && (msg.includes('null') || msg.includes('undefined'));
};

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Patch Error constructor to prevent the error from being created in the first place
  const OriginalError = window.Error;
  // @ts-expect-error - we're patching the global Error
  window.Error = function PatchedError(message?: string, options?: ErrorOptions) {
    if (isScrollWidthError(message)) {
      // Return a "silent" error that won't trigger the overlay
      const silentError = new OriginalError('', options);
      silentError.name = 'SuppressedError';
      // Make stack trace empty so it's not logged
      silentError.stack = '';
      return silentError;
    }
    return new OriginalError(message, options);
  } as ErrorConstructor;
  window.Error.prototype = OriginalError.prototype;
  
  // Suppress in error event handler (capture phase)
  window.addEventListener('error', (event) => {
    if (isScrollWidthError(event.message) || isScrollWidthError(event.error?.message)) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      return false;
    }
  }, true);

  // Suppress in error event handler
  const originalOnError = window.onerror;
  window.onerror = function (message, source, lineno, colno, error) {
    if (isScrollWidthError(typeof message === 'string' ? message : error?.message)) {
      return true;
    }
    if (originalOnError) {
      return originalOnError.call(this, message, source, lineno, colno, error);
    }
    return false;
  };

  // Also suppress in unhandledrejection
  window.addEventListener('unhandledrejection', (event) => {
    const message = event.reason?.message || String(event.reason);
    if (isScrollWidthError(message)) {
      event.preventDefault();
    }
  }, true);

  // Intercept console.error to suppress React error logs
  const originalConsoleError = console.error;
  console.error = function (...args: unknown[]) {
    const message = args.map(a => String(a)).join(' ');
    if (isScrollWidthError(message)) {
      return;
    }
    return originalConsoleError.apply(console, args);
  };

  // Patch dispatchEvent to catch the error overlay trigger
  const originalDispatchEvent = EventTarget.prototype.dispatchEvent;
  EventTarget.prototype.dispatchEvent = function(event: Event) {
    if (event.type === 'error') {
      const errorEvent = event as ErrorEvent;
      if (isScrollWidthError(errorEvent.message) || isScrollWidthError(errorEvent.error?.message)) {
        return false;
      }
    }
    return originalDispatchEvent.call(this, event);
  };
}

export default function onRouteDidUpdate() {
  // This export makes Docusaurus recognize this as a client module
}

