/**
 * Canvas Sync Module
 * 
 * Synchronizes course content (assignments and modules) to Canvas LMS.
 * Creates stub entries with links back to the public course website.
 * Supports updating existing assignments and modules by matching names.
 */

import type { CourseConfig, CourseSchedule, Assignment, LectureMapping, Lab, CourseSection } from './types';
import { CanvasApi } from "@kth/canvas-api";

/**
 * Result of a sync operation
 */
export interface SyncResult {
  success: boolean;
  sectionId: string;
  canvasCourseId: string;
  assignmentsCreated: number;
  assignmentsUpdated: number;
  assignmentsSkipped: number;
  modulesCreated: number;
  modulesUpdated: number;
  modulesSkipped: number;
  errors: string[];
}

/**
 * Generate the HTML stub content for an assignment
 */
function generateAssignmentStub(assignment: Assignment, siteUrl: string): string {
  const assignmentUrl = assignment.url 
    ? `${siteUrl.replace(/\/$/, '')}${assignment.url}`
    : siteUrl;
  
  return `
<p><strong>View the full assignment on the course website:</strong></p>
<p><a href="${assignmentUrl}" target="_blank">${assignment.title}</a></p>
<p><em>All assignment details, instructions, and submission guidelines are available on the course website.</em></p>
`.trim();
}

/**
 * Convert assignment due date and time to ISO format
 */
function formatDueDateTime(dueDate: string, dueTime?: string, timeZone?: string): string {
  const time = dueTime || '23:59';
  const [hours, minutes] = time.split(':');
  
  // Create date in the specified timezone
  const date = new Date(`${dueDate}T${hours}:${minutes}:00`);
  
  // If timezone is provided, we need to adjust. For simplicity, we'll use the date as-is
  // since Canvas accepts ISO strings and the actual timezone handling should be done by Canvas
  return date.toISOString();
}

/**
 * Fetch all existing assignments from Canvas
 */
async function fetchExistingAssignments(
  canvas: CanvasApi,
  canvasCourseId: string
): Promise<Map<string, any>> {
  const assignmentsMap = new Map<string, any>();
  
  try {
    const assignmentsResponse = canvas.listItems(`/api/v1/courses/${canvasCourseId}/assignments`);
    for await (const assignment of assignmentsResponse) {
      assignmentsMap.set(assignment.name, assignment);
    }
  } catch (error) {
    console.warn(`   ⚠️  Failed to fetch existing assignments: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  return assignmentsMap;
}

/**
 * Sync assignments to a Canvas course
 */
async function syncAssignmentsToCanvas(
  canvas: CanvasApi,
  canvasCourseId: string,
  assignments: Assignment[],
  siteUrl: string,
  defaultTimeZone?: string
): Promise<{ created: number; updated: number; skipped: number; errors: string[] }> {
  const errors: string[] = [];
  let created = 0;
  let updated = 0;
  let skipped = 0;
  
  // Fetch existing assignments first
  const existingAssignments = await fetchExistingAssignments(canvas, canvasCourseId);
  
  for (const assignment of assignments) {
    try {
      const dueAt = formatDueDateTime(
        assignment.dueDate, 
        assignment.dueTime,
        assignment.timeZone || defaultTimeZone
      );
      
      const assignmentData = {
        assignment: {
          name: assignment.title,
          description: generateAssignmentStub(assignment, siteUrl),
          due_at: dueAt,
          points_possible: assignment.points || 0,
          submission_types: ['none'], // Stub only - no submission through Canvas
          published: true,
        }
      };
      
      // Check if assignment already exists (match by name)
      const existing = existingAssignments.get(assignment.title);
      
      if (existing) {
        // Check if update is needed (compare key fields)
        const assignmentUrl = assignment.url 
          ? `${siteUrl.replace(/\/$/, '')}${assignment.url}`
          : siteUrl;
        const existingDueAt = existing.due_at ? new Date(existing.due_at).toISOString() : null;
        const needsUpdate = existing.name !== assignment.title ||
                           existing.points_possible !== (assignment.points || 0) ||
                           existingDueAt !== dueAt ||
                           !existing.description?.includes(assignmentUrl);
        
        if (needsUpdate) {
          // Update existing assignment
          await canvas.request(
            `/api/v1/courses/${canvasCourseId}/assignments/${existing.id}`,
            'PUT',
            assignmentData,
          );
          updated++;
          console.log(`   ✓ Updated assignment: ${assignment.title}`);
        } else {
          // No change needed, skip
          skipped++;
          console.log(`   ⊙ Skipped (no change): ${assignment.title}`);
        }
      } else {
        // Create new assignment
        await canvas.request(
          `/api/v1/courses/${canvasCourseId}/assignments`,
          'POST',
          assignmentData,
        );
        created++;
        console.log(`   ✓ Created assignment: ${assignment.title}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`Failed to sync assignment "${assignment.title}": ${message}`);
      console.error(`   ✗ Failed to sync assignment "${assignment.title}": ${message}`);
    }
  }
  
  return { created, updated, skipped, errors };
}

/**
 * Generate lecture title with topics from config
 */
function generateLectureTitle(lecture: LectureMapping): string {
  const topics = lecture.topics || [];
  
  if (topics.length > 0) {
    // Join topics with semicolons, limit to reasonable length
    const topicsStr = topics.slice(0, 5).join('; '); // Limit to first 5 topics
    return `${topicsStr}`;
  }
  
  return `${lecture.lectureId}`;
}

/**
 * Fetch all existing modules from Canvas
 */
async function fetchExistingModules(
  canvas: CanvasApi,
  canvasCourseId: string
): Promise<Map<string, any>> {
  const modulesMap = new Map<string, any>();
  
  try {
    const modulesResponse = canvas.listItems(`/api/v1/courses/${canvasCourseId}/modules`);
    for await (const module of modulesResponse) {
      modulesMap.set(module.name, module);
    }
  } catch (error) {
    console.warn(`   ⚠️  Failed to fetch existing modules: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  return modulesMap;
}

/**
 * Normalize URL for consistent comparison (remove trailing slashes, etc.)
 */
function normalizeUrl(url: string): string {
  return url.trim().replace(/\/$/, '');
}

/**
 * Fetch all items in a module
 * Returns a map keyed by external_url for easier matching
 */
async function fetchModuleItems(
  canvas: CanvasApi,
  canvasCourseId: string,
  moduleId: string
): Promise<Map<string, any>> {
  const itemsMap = new Map<string, any>();
  
  try {
    const itemsResponse = canvas.listItems(`/api/v1/courses/${canvasCourseId}/modules/${moduleId}/items`);
    for await (const item of itemsResponse) {
      // Store by normalized URL for reliable matching (URLs don't change)
      if (item.external_url) {
        const normalizedUrl = normalizeUrl(item.external_url);
        itemsMap.set(normalizedUrl, item);
      }
      // Also store by title as fallback
      itemsMap.set(item.title, item);
    }
  } catch (error) {
    console.warn(`   ⚠️  Failed to fetch module items: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  return itemsMap;
}

/**
 * Sync lectures and labs as Canvas modules
 */
async function syncModulesToCanvas(
  canvas: CanvasApi,
  canvasCourseId: string,
  lectures: LectureMapping[],
  labs: Lab[] | undefined,
  siteUrl: string
): Promise<{ created: number; updated: number; skipped: number; errors: string[] }> {
  const errors: string[] = [];
  let created = 0;
  let updated = 0;
  let skipped = 0;
  const baseUrl = siteUrl.replace(/\/$/, '');
  
  // Fetch existing modules first
  const existingModules = await fetchExistingModules(canvas, canvasCourseId);
  
  // Find or create "Lectures" module container
  let lecturesModuleId: string;
  let lecturesModuleItems: Map<string, any>;
  
  const existingLecturesModule = existingModules.get('Lectures');
  if (existingLecturesModule) {
    lecturesModuleId = existingLecturesModule.id;
    lecturesModuleItems = await fetchModuleItems(canvas, canvasCourseId, lecturesModuleId);
    console.log(`   Found existing Lectures module with ${lecturesModuleItems.size} items`);
  } else {
    try {
      const lecturesModuleResponse = await canvas.request(
        `/api/v1/courses/${canvasCourseId}/modules`,
        'POST',
        { module: { name: 'Lectures', position: 1 } }
      );
      lecturesModuleId = lecturesModuleResponse.body.id;
      lecturesModuleItems = new Map();
      console.log(`   Created new Lectures module`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`Failed to create Lectures module: ${message}`);
      console.error(`   ✗ Failed to create Lectures module: ${message}`);
      return { created, updated, skipped, errors };
    }
  }
  
  // Add/update each lecture as an external URL item
  for (const lecture of lectures) {
    try {
      // Use topics from config
      const lectureTitle = generateLectureTitle(lecture);
      const lectureUrl = `${baseUrl}/lecture-notes/${lecture.lectureId}`;
      
      const moduleItemData = {
        module_item: {
          title: lectureTitle,
          type: 'ExternalUrl',
          external_url: lectureUrl,
          new_tab: true,
        }
      };
      
      // Check if item already exists (match by normalized URL)
      const normalizedLectureUrl = normalizeUrl(lectureUrl);
      const existingItem = lecturesModuleItems.get(normalizedLectureUrl);
      
      if (existingItem) {
        // Check if update is needed (only compare title since URL is what we match on)
        // Normalize titles for comparison (trim whitespace)
        const normalizedExistingTitle = (existingItem.title || '').trim();
        const normalizedNewTitle = lectureTitle.trim();
        const needsUpdate = normalizedExistingTitle !== normalizedNewTitle;
        
        if (needsUpdate) {
          // Update existing item
          await canvas.request(
            `/api/v1/courses/${canvasCourseId}/modules/${lecturesModuleId}/items/${existingItem.id}`,
            'PUT',
            moduleItemData,
          );
          updated++;
          console.log(`   ✓ Updated lecture module item: ${lectureTitle}`);
        } else {
          // No change needed, skip
          skipped++;
          console.log(`   ⊙ Skipped (no change): ${lectureTitle}`);
        }
      } else {
        // Create new item
        await canvas.request(
          `/api/v1/courses/${canvasCourseId}/modules/${lecturesModuleId}/items`,
          'POST',
          moduleItemData,
        );
        created++;
        console.log(`   ✓ Created lecture module item: ${lectureTitle}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`Failed to sync lecture item "${lecture.lectureId}": ${message}`);
      console.error(`   ✗ Failed to sync lecture item "${lecture.lectureId}": ${message}`);
    }
  }
  
  // Publish the lectures module
  try {
    await canvas.request(
      `/api/v1/courses/${canvasCourseId}/modules/${lecturesModuleId}`,
      'PUT',
      { module: { published: true } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    errors.push(`Failed to publish Lectures module: ${message}`);
    console.error(`   ✗ Failed to publish Lectures module: ${message}`);
  }
  
  // Find or create "Labs" module container if labs exist
  if (labs && labs.length > 0) {
    let labsModuleId: string;
    let labsModuleItems: Map<string, any>;
    
    const existingLabsModule = existingModules.get('Labs');
    if (existingLabsModule) {
      labsModuleId = existingLabsModule.id;
      labsModuleItems = await fetchModuleItems(canvas, canvasCourseId, labsModuleId);
      console.log(`   Found existing Labs module with ${labsModuleItems.size} items`);
    } else {
      try {
        const labsModuleResponse = await canvas.request(
          `/api/v1/courses/${canvasCourseId}/modules`,
          'POST',
          { module: { name: 'Labs', position: 2 } }
        );
        labsModuleId = labsModuleResponse.body.id;
        labsModuleItems = new Map();
        console.log(`   Created new Labs module`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        errors.push(`Failed to create Labs module: ${message}`);
        console.error(`   ✗ Failed to create Labs module: ${message}`);
        return { created, updated, skipped, errors };
      }
    }
    
    // Deduplicate labs by URL (since labs may have multiple entries for different sections)
    const seenLabUrls = new Set<string>();
    
    for (const lab of labs) {
      const labUrl = lab.url ? `${baseUrl}${lab.url}` : `${baseUrl}/labs/${lab.id}`;
      
      // Skip if we've already added this lab
      if (seenLabUrls.has(labUrl)) {
        continue;
      }
      seenLabUrls.add(labUrl);
      
      try {
        const moduleItemData = {
          module_item: {
            title: lab.title,
            type: 'ExternalUrl',
            external_url: labUrl,
            new_tab: true,
          }
        };
        
        // Check if item already exists (match by normalized URL)
        const normalizedLabUrl = normalizeUrl(labUrl);
        const existingItem = labsModuleItems.get(normalizedLabUrl);
        
        if (existingItem) {
          // Check if update is needed (only compare title since URL is what we match on)
          // Normalize titles for comparison (trim whitespace)
          const normalizedExistingTitle = (existingItem.title || '').trim();
          const normalizedNewTitle = lab.title.trim();
          const needsUpdate = normalizedExistingTitle !== normalizedNewTitle;
          
          if (needsUpdate) {
            // Update existing item
            await canvas.request(
              `/api/v1/courses/${canvasCourseId}/modules/${labsModuleId}/items/${existingItem.id}`,
              'PUT',
              moduleItemData,
            );
            updated++;
            console.log(`   ✓ Updated lab module item: ${lab.title}`);
          } else {
            // No change needed, skip
            skipped++;
            console.log(`   ⊙ Skipped (no change): ${lab.title}`);
          }
        } else {
          // Create new item
          await canvas.request(
            `/api/v1/courses/${canvasCourseId}/modules/${labsModuleId}/items`,
            'POST',
            moduleItemData,
          );
          created++;
          console.log(`   ✓ Created lab module item: ${lab.title}`);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        errors.push(`Failed to sync lab item "${lab.id}": ${message}`);
        console.error(`   ✗ Failed to sync lab item "${lab.id}": ${message}`);
      }
    }
    
    // Publish the labs module
    try {
      await canvas.request(
        `/api/v1/courses/${canvasCourseId}/modules/${labsModuleId}`,
        'PUT',
        { module: { published: true } }
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`Failed to publish Labs module: ${message}`);
      console.error(`   ✗ Failed to publish Labs module: ${message}`);
    }
  }
  
  return { created, updated, skipped, errors };
}

/**
 * Generate simple homepage HTML for Canvas
 * Includes course overview and navigation links
 */
function generateHomepageHtml(config: CourseConfig, siteUrl: string): string {
  const courseCode = config.courseCode || 'CS 3100';
  const semester = config.semester || 'Spring 2026';
  const baseUrl = siteUrl.replace(/\/$/, '');
  
  // Course overview text (from index.tsx)
  const overviewText = `
    <p>Most software outlives the assumptions it was built on. Requirements evolve, teams change, and the world around your code shifts in ways you didn't anticipate. This course teaches you to write software that can adapt—code that remains understandable, modifiable, and valuable over its entire lifecycle. You'll learn to think beyond immediate correctness to consider sustainability in multiple dimensions: technical longevity, economic viability, and the broader impacts your software has on its users and society.</p>
    
    <p>The assignments in this course center on <em>CookYourBooks</em>, a desktop application you'll build from domain model to polished GUI. It's real software—with messy requirements, design tradeoffs, and the need to coordinate with teammates. Midway through, you'll learn to leverage AI coding assistants while maintaining the judgment to know when they help and when they mislead. The work surfaces questions that matter beyond any single assignment:</p>
    
    <ul>
      <li>Why do some codebases become unmaintainable within months, while others remain flexible for decades?</li>
      <li>What does it mean for code to be "readable"—and why do experienced developers often disagree?</li>
      <li>How do you build software when the people paying for it want different things than the people using it?</li>
      <li>When does using an AI coding assistant make you more productive, and when does it waste your time or lead you astray?</li>
      <li>What separates high-functioning teams from groups where one person does all the work?</li>
      <li>How do you design software that works for users whose abilities and contexts differ from your own?</li>
      <li>When should you invest in more design upfront, and when should you just start coding?</li>
    </ul>
  `;
  
  // Navigation links (from index.tsx and sidebar)
  const navLinks = [
    { label: 'Schedule', url: `${baseUrl}/schedule` },
    { label: 'Syllabus', url: `${baseUrl}/syllabus` },
    { label: 'Lecture Notes', url: `${baseUrl}/lecture-notes` },
    { label: 'Assignments', url: `${baseUrl}/assignments` },
    { label: 'Staff', url: `${baseUrl}/staff` },
  ];
  
  const navHtml = navLinks.map(link => 
    `<a href="${link.url}" target="_blank" style="margin-right: 20px; font-weight: 500; text-decoration: none; color: #0066cc;">${link.label}</a>`
  ).join('\n    ');
  
  // AI Approach section
  const aiApproachText = `
    <h2>Our Approach to AI</h2>
    <p>AI coding assistants can generate code quickly, but they cannot judge whether that code solves the right problem, integrates cleanly, or will be maintainable. We restrict AI tools early while you build foundational competence, then explicitly teach effective human-AI collaboration once you can critically evaluate generated code. <a href="${baseUrl}/syllabus#artificial-intelligence" target="_blank">Read our full AI policy →</a></p>
  `;
  
  return `
    <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f0f7ff; border: 2px solid #0066cc; border-radius: 8px; padding: 20px; margin-bottom: 32px; text-align: center;">
        <p style="margin: 0; font-size: 16px; color: #333;">
          <strong style="color: #0066cc;">📚 Visit the full course website:</strong><br>
          <a href="${baseUrl}" target="_blank" style="font-size: 18px; font-weight: 600; color: #0066cc; text-decoration: none; margin-top: 8px; display: inline-block;">${baseUrl}</a>
        </p>
      </div>
      <p style="font-size: 14px; color: #666; margin-bottom: 8px;">${semester}</p>
      <h1 style="font-size: 32px; margin-bottom: 16px;">${courseCode}: Program Design & Implementation II</h1>
      
      ${overviewText}
      
      <div style="border-top: 1px solid #ddd; border-bottom: 1px solid #ddd; padding: 16px 0; margin: 32px 0; text-align: center;">
        ${navHtml}
      </div>
      
      ${aiApproachText}
      
    </div>
  `;
}

/**
 * Sync homepage to Canvas course front page
 */
async function syncHomepageToCanvas(
  canvas: CanvasApi,
  canvasCourseId: string,
  homepageHtml: string,
  siteUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Update the course front page
    await canvas.request(
      `/api/v1/courses/${canvasCourseId}/front_page`,
      'PUT',
      {
        wiki_page: {
          body: homepageHtml,
          published: true,
        }
      }
    );
    
    console.log(`   ✓ Updated Canvas course homepage`);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`   ✗ Failed to update Canvas course homepage: ${message}`);
    return { success: false, error: message };
  }
}

/**
 * Sync course content to Canvas for a single section
 */
async function syncSectionToCanvas(
  canvas: CanvasApi,
  section: CourseSection,
  config: CourseConfig,
  siteUrl: string
): Promise<SyncResult> {
  const result: SyncResult = {
    success: true,
    sectionId: section.id,
    canvasCourseId: section.canvasCourseId!,
    assignmentsCreated: 0,
    assignmentsUpdated: 0,
    assignmentsSkipped: 0,
    modulesCreated: 0,
    modulesUpdated: 0,
    modulesSkipped: 0,
    errors: [],
  };
  
  console.log(`\n📤 Syncing to Canvas course ${section.canvasCourseId} (Section ${section.id}: ${section.name})...`);
  
  // Sync assignments if enabled (default: true)
  const syncAssignments = config.canvas?.syncAssignments !== false;
  if (syncAssignments && config.assignments && config.assignments.length > 0) {
    console.log(`   Syncing ${config.assignments.length} assignments...`);
    const assignmentResult = await syncAssignmentsToCanvas(
      canvas,
      section.canvasCourseId!,
      config.assignments,
      siteUrl,
      section.timeZone
    );
    result.assignmentsCreated = assignmentResult.created;
    result.assignmentsUpdated = assignmentResult.updated;
    result.assignmentsSkipped = assignmentResult.skipped;
    result.errors.push(...assignmentResult.errors);
  }
  
  // Sync modules if enabled (default: true)
  const syncModules = config.canvas?.syncModules !== false;
  if (syncModules) {
    const lectureCount = config.lectures?.length || 0;
    const labCount = config.labs?.length || 0;
    console.log(`   Syncing ${lectureCount} lectures and ${labCount} labs as modules...`);
    const moduleResult = await syncModulesToCanvas(
      canvas,
      section.canvasCourseId!,
      config.lectures,
      config.labs,
      siteUrl
    );
    result.modulesCreated = moduleResult.created;
    result.modulesUpdated = moduleResult.updated;
    result.modulesSkipped = moduleResult.skipped;
    result.errors.push(...moduleResult.errors);
  }
  
  // Sync homepage if enabled (default: true)
  const syncHomepage = config.canvas?.syncHomepage !== false;
  if (syncHomepage) {
    console.log(`   Syncing homepage to Canvas course front page...`);
    const homepageHtml = generateHomepageHtml(config, siteUrl);
    const homepageResult = await syncHomepageToCanvas(
      canvas,
      section.canvasCourseId!,
      homepageHtml,
      siteUrl
    );
    if (!homepageResult.success && homepageResult.error) {
      result.errors.push(`Failed to sync homepage: ${homepageResult.error}`);
    }
  }
  
  result.success = result.errors.length === 0;
  
  if (result.success) {
    console.log(`   ✅ Sync complete: ${result.assignmentsCreated} created, ${result.assignmentsUpdated} updated, ${result.assignmentsSkipped} skipped assignments; ${result.modulesCreated} created, ${result.modulesUpdated} updated, ${result.modulesSkipped} skipped module items`);
  } else {
    console.log(`   ⚠️  Sync completed with ${result.errors.length} errors`);
  }
  
  return result;
}

/**
 * Main entry point for Canvas sync
 * 
 * @param config - Course configuration
 * @param schedule - Generated course schedule
 * @param siteUrl - Public site URL (url + baseUrl from Docusaurus config)
 * @param canvasUrl - Canvas instance URL
 * @param apiToken - Canvas API token
 */
export async function syncToCanvas(
  config: CourseConfig,
  schedule: CourseSchedule,
  siteUrl: string,
  canvasUrl: string,
  apiToken: string
): Promise<SyncResult[]> {
  console.log('\n🎨 Starting Canvas sync...');
  console.log(`   Canvas URL: ${canvasUrl}`);
  console.log(`   Site URL: ${siteUrl}`);
  
  
  // Initialize Canvas client
  const canvas = new CanvasApi(canvasUrl, apiToken); 
  
  const results: SyncResult[] = [];
  
  // Find sections with Canvas course IDs configured
  const sectionsToSync = config.sections.filter(s => s.canvasCourseId);
  
  if (sectionsToSync.length === 0) {
    console.log('   ℹ️  No sections have canvasCourseId configured. Skipping Canvas sync.');
    return results;
  }
  
  console.log(`   Found ${sectionsToSync.length} section(s) with Canvas course IDs`);
  
  // Sync each section
  for (const section of sectionsToSync) {
    const result = await syncSectionToCanvas(canvas, section, config, siteUrl);
    results.push(result);
  }
  
  // Summary
  const totalAssignmentsCreated = results.reduce((sum, r) => sum + r.assignmentsCreated, 0);
  const totalAssignmentsUpdated = results.reduce((sum, r) => sum + r.assignmentsUpdated, 0);
  const totalAssignmentsSkipped = results.reduce((sum, r) => sum + r.assignmentsSkipped, 0);
  const totalModulesCreated = results.reduce((sum, r) => sum + r.modulesCreated, 0);
  const totalModulesUpdated = results.reduce((sum, r) => sum + r.modulesUpdated, 0);
  const totalModulesSkipped = results.reduce((sum, r) => sum + r.modulesSkipped, 0);
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  
  console.log('\n📊 Canvas Sync Summary:');
  console.log(`   Sections synced: ${results.length}`);
  console.log(`   Assignments: ${totalAssignmentsCreated} created, ${totalAssignmentsUpdated} updated, ${totalAssignmentsSkipped} skipped`);
  console.log(`   Module items: ${totalModulesCreated} created, ${totalModulesUpdated} updated, ${totalModulesSkipped} skipped`);
  if (totalErrors > 0) {
    console.log(`   Errors: ${totalErrors}`);
  }
  
  return results;
}

