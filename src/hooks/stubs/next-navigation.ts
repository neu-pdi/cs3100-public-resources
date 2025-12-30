"use client";

/**
 * Stub hooks for Next.js navigation (not available in Docusaurus)
 * These provide no-op implementations
 */

export function useParams(): Record<string, string | string[] | undefined> {
  return {};
}

export function useRouter() {
  return {
    push: (path: string) => {
      if (typeof window !== 'undefined') {
        window.location.href = path;
      }
    },
    replace: (path: string) => {
      if (typeof window !== 'undefined') {
        window.location.replace(path);
      }
    },
    back: () => {
      if (typeof window !== 'undefined') {
        window.history.back();
      }
    },
    forward: () => {
      if (typeof window !== 'undefined') {
        window.history.forward();
      }
    },
    refresh: () => {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    },
  };
}
