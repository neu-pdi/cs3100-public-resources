"use client";

/**
 * Stub toaster component for use when Pawtograder integration is not available
 * This provides a no-op implementation that matches the expected API
 */

interface ToasterOptions {
  title: string;
  description?: string;
}

class StubToaster {
  success(options: ToasterOptions) {
    console.log('[Toaster] Success:', options.title, options.description);
  }

  error(options: ToasterOptions) {
    console.error('[Toaster] Error:', options.title, options.description);
  }

  warning(options: ToasterOptions) {
    console.warn('[Toaster] Warning:', options.title, options.description);
  }

  info(options: ToasterOptions) {
    console.info('[Toaster] Info:', options.title, options.description);
  }
}

export const toaster = new StubToaster();
