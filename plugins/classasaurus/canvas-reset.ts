/**
 * Canvas Reset Module
 * 
 * Provides functions to delete/reset Canvas content created by the sync process.
 * Useful when instructors want to clear Canvas and start fresh.
 */

import { CanvasApi } from "@kth/canvas-api";

/**
 * Result of a reset operation
 */
export interface ResetResult {
  success: boolean;
  canvasCourseId: string;
  assignmentsDeleted: number;
  modulesDeleted: number;
  errors: string[];
}

/**
 * Extract detailed error message from Canvas API errors
 */
function getDetailedErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const errorAny = error as any;
    const details: string[] = [error.message];
    
    if (errorAny.statusCode) {
      details.unshift(`Status ${errorAny.statusCode}`);
    }
    if (errorAny.response) {
      try {
        const responseBody = typeof errorAny.response === 'string' 
          ? errorAny.response 
          : JSON.stringify(errorAny.response);
        details.push(`Response: ${responseBody}`);
      } catch {
        // ignore
      }
    }
    
    console.error('   Full error details:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    
    return details.join(' - ');
  }
  return String(error);
}

/**
 * Delete all assignments from a Canvas course
 */
export async function deleteAllAssignments(
  canvas: CanvasApi,
  canvasCourseId: string
): Promise<{ deleted: number; errors: string[] }> {
  const errors: string[] = [];
  let deleted = 0;
  
  console.log(`   Fetching assignments from Canvas course ${canvasCourseId}...`);
  
  try {
    // Get all assignments
    const assignments: any[] = [];
    const assignmentsResponse = canvas.listItems(`/api/v1/courses/${canvasCourseId}/assignments`);
    for await (const assignment of assignmentsResponse) {
      assignments.push(assignment);
    }
    
    console.log(`   Found ${assignments.length} assignment(s) to delete`);
    
    for (const assignment of assignments) {
      try {
        await canvas.request(
          `/api/v1/courses/${canvasCourseId}/assignments/${assignment.id}`,
          'DELETE',
          {}
        );
        deleted++;
        console.log(`   ✓ Deleted assignment: ${assignment.name}`);
      } catch (error) {
        const message = getDetailedErrorMessage(error);
        errors.push(`Failed to delete assignment "${assignment.name}": ${message}`);
        console.error(`   ✗ Failed to delete assignment "${assignment.name}": ${message}`);
      }
    }
  } catch (error) {
    const message = getDetailedErrorMessage(error);
    errors.push(`Failed to fetch assignments: ${message}`);
    console.error(`   ✗ Failed to fetch assignments: ${message}`);
  }
  
  return { deleted, errors };
}

/**
 * Delete all modules from a Canvas course
 */
export async function deleteAllModules(
  canvas: CanvasApi,
  canvasCourseId: string
): Promise<{ deleted: number; errors: string[] }> {
  const errors: string[] = [];
  let deleted = 0;
  
  console.log(`   Fetching modules from Canvas course ${canvasCourseId}...`);
  
  try {
    // Get all modules
    const modules: any[] = [];
    for await (const module of canvas.listItems(`/api/v1/courses/${canvasCourseId}/modules`)) {
      modules.push(module);
    }
    
    console.log(`   Found ${modules.length} module(s) to delete`);
    
    for (const module of modules) {
      try {
        await canvas.request(
          `/api/v1/courses/${canvasCourseId}/modules/${module.id}`,
          'DELETE',
          {}
        );
        deleted++;
        console.log(`   ✓ Deleted module: ${module.name}`);
      } catch (error) {
        const message = getDetailedErrorMessage(error);
        errors.push(`Failed to delete module "${module.name}": ${message}`);
        console.error(`   ✗ Failed to delete module "${module.name}": ${message}`);
      }
    }
  } catch (error) {
    const message = getDetailedErrorMessage(error);
    errors.push(`Failed to fetch modules: ${message}`);
    console.error(`   ✗ Failed to fetch modules: ${message}`);
  }
  
  return { deleted, errors };
}

/**
 * Reset a Canvas course by deleting all assignments and modules
 */
export async function resetCanvasCourse(
  canvas: CanvasApi,
  canvasCourseId: string
): Promise<ResetResult> {
  console.log(`\n🗑️  Resetting Canvas course ${canvasCourseId}...`);
  
  const result: ResetResult = {
    success: true,
    canvasCourseId,
    assignmentsDeleted: 0,
    modulesDeleted: 0,
    errors: [],
  };
  
  // Delete assignments
  console.log('\n   Deleting assignments...');
  const assignmentResult = await deleteAllAssignments(canvas, canvasCourseId);
  result.assignmentsDeleted = assignmentResult.deleted;
  result.errors.push(...assignmentResult.errors);
  
  // Delete modules
  console.log('\n   Deleting modules...');
  const moduleResult = await deleteAllModules(canvas, canvasCourseId);
  result.modulesDeleted = moduleResult.deleted;
  result.errors.push(...moduleResult.errors);
  
  result.success = result.errors.length === 0;
  
  if (result.success) {
    console.log(`\n   ✅ Reset complete: ${result.assignmentsDeleted} assignments, ${result.modulesDeleted} modules deleted`);
  } else {
    console.log(`\n   ⚠️  Reset completed with ${result.errors.length} errors`);
  }
  
  return result;
}

/**
 * Initialize Canvas client and reset a course
 * Convenience function for CLI usage
 */
export async function resetCanvasCourseWithCredentials(
  canvasUrl: string,
  apiToken: string,
  canvasCourseId: string
): Promise<ResetResult> {
  
  const canvas = new CanvasApi(canvasUrl, apiToken);
  
  return resetCanvasCourse(canvas, canvasCourseId);
}
