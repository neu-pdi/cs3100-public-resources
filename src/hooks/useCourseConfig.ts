"use client";

import { usePluginData } from '@docusaurus/useGlobalData';
import type { CourseConfig, CourseSchedule } from '../../plugins/classasaurus/types';

/**
 * Hook to access course configuration data
 * Uses usePluginData to access the CourseSchedule returned by the Classasaurus plugin
 * The plugin's loadContent() returns CourseSchedule which includes the config
 * This works in both dev and prod modes via Docusaurus's global data system
 */
export function useCourseConfig(): CourseConfig | null {
  try {
    const scheduleData = usePluginData('docusaurus-plugin-classasaurus') as CourseSchedule | null | undefined;
    
    if (!scheduleData) {
      return null;
    }
    
    // CourseSchedule has a config property
    return scheduleData.config;
  } catch (error) {
    console.warn('Failed to load course config from plugin data:', error);
    return null;
  }
}

/**
 * Hook to access the full course schedule
 */
export function useCourseSchedule(): CourseSchedule | null {
  try {
    return usePluginData('docusaurus-plugin-classasaurus') as CourseSchedule | null | undefined;
  } catch (error) {
    console.warn('Failed to load course schedule from plugin data:', error);
    return null;
  }
}
