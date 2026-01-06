"use client";

import { useState, useEffect } from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';
import type { CourseSchedule, CourseSection } from '../../plugins/classasaurus/types';

const STORAGE_KEY = 'cs3100.schedule.lectureSection';

// Extended config type with slides paths
interface ExtendedConfig {
  defaultSlidesPath?: string;
  instructorSlides?: Record<string, string>;
}

/**
 * Get the slides path for a given section based on instructor
 */
function getSlidesPathForSection(
  section: CourseSection | undefined,
  config: ExtendedConfig
): string {
  const defaultPath = config.defaultSlidesPath || '/lecture-slides';

  if (!section?.instructors || section.instructors.length === 0) {
    return defaultPath;
  }

  const instructor = section.instructors[0];
  return config.instructorSlides?.[instructor] || defaultPath;
}

/**
 * Hook to get the appropriate slides path based on the user's selected section.
 * 
 * Returns the instructor-specific slides path if the user has selected a section
 * and that section's instructor has a custom slides path defined in course.config.json.
 * Otherwise returns the default slides path.
 * 
 * @returns The slides path string, or undefined if config is not loaded yet
 */
export function useSlidesPath(): string | undefined {
  const [slidesPath, setSlidesPath] = useState<string | undefined>(undefined);
  
  // Get schedule data from classasaurus plugin
  const scheduleData = usePluginData('docusaurus-plugin-classasaurus') as CourseSchedule | undefined;
  const config = scheduleData?.config as (typeof scheduleData.config & ExtendedConfig) | undefined;
  const sections = config?.sections || [];

  useEffect(() => {
    if (!config) return;

    // Read section from localStorage
    const savedSection = typeof window !== 'undefined' 
      ? localStorage.getItem(STORAGE_KEY) 
      : null;
    
    const section = savedSection 
      ? sections.find(s => s.id === savedSection) 
      : undefined;
    
    const path = getSlidesPathForSection(section, config);
    setSlidesPath(path);

    // Listen for storage changes (in case section is changed in another tab or component)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        const newSection = e.newValue 
          ? sections.find(s => s.id === e.newValue) 
          : undefined;
        setSlidesPath(getSlidesPathForSection(newSection, config));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [config, sections]);

  return slidesPath;
}

/**
 * Get the default slides path from config (without section-specific logic).
 * Useful for SSR scenarios where we can't access localStorage.
 */
export function useDefaultSlidesPath(): string {
  const scheduleData = usePluginData('docusaurus-plugin-classasaurus') as CourseSchedule | undefined;
  const config = scheduleData?.config as (typeof scheduleData.config & ExtendedConfig) | undefined;
  return config?.defaultSlidesPath || '/lecture-slides';
}

