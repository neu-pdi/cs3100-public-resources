"use client";

/**
 * Stub hooks for office hours realtime functionality
 * These are no-op implementations for use when Pawtograder integration is not available
 */

export interface HelpQueue {
  id: number;
  name: string;
  is_active: boolean;
}

export interface HelpQueueAssignment {
  id: number;
  help_queue_id: number;
  ta_profile_id: number | null;
  is_active: boolean;
  started_at: string | null;
  ended_at: string | null;
  max_concurrent_students: number;
}

export interface OfficeHoursController {
  helpQueueAssignments: {
    create: (data: {
      class_id: number;
      help_queue_id: number;
      ta_profile_id: number;
      is_active: boolean;
      started_at: string;
      ended_at: string | null;
      max_concurrent_students: number;
    }) => Promise<HelpQueueAssignment>;
  };
}

/**
 * Stub hook for help queues
 * Returns empty array since we don't have Pawtograder integration
 */
export function useHelpQueues(): HelpQueue[] | null {
  return null;
}

/**
 * Stub hook for help queue assignments
 * Returns empty array since we don't have Pawtograder integration
 */
export function useHelpQueueAssignments(): HelpQueueAssignment[] | null {
  return null;
}

/**
 * Stub hook for office hours controller
 * Returns a no-op controller
 */
export function useOfficeHoursController(): OfficeHoursController {
  return {
    helpQueueAssignments: {
      create: async () => {
        throw new Error('Office hours controller not available - Pawtograder integration required');
      }
    }
  };
}
