"use client";

/**
 * Stub hooks for class profiles
 * These are no-op implementations for use when Pawtograder integration is not available
 */

export interface ClassProfile {
  private_profile_id: number | null;
  public_profile_id?: number | null;
}

/**
 * Stub hook to check if current user is a student
 * Returns false since we don't have authentication
 */
export function useIsStudent(): boolean {
  return false;
}

/**
 * Stub hook to check if current user is a grader or instructor
 * Returns false since we don't have authentication
 */
export function useIsGraderOrInstructor(): boolean {
  return false;
}

/**
 * Stub hook to get class profiles
 * Returns null since we don't have authentication
 */
export function useClassProfiles(): ClassProfile {
  return {
    private_profile_id: null,
    public_profile_id: null
  };
}
