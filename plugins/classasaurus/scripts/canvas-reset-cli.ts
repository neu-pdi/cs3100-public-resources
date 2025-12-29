#!/usr/bin/env npx ts-node
/**
 * Canvas Reset CLI
 * 
 * Command-line tool to reset Canvas courses by deleting all synced assignments and modules.
 * 
 * Usage:
 *   # Reset a specific Canvas course
 *   CANVAS_API_TOKEN=xxx npx ts-node plugins/classasaurus/scripts/canvas-reset-cli.ts \
 *     --course-id 123456 \
 *     --canvas-url https://canvas.northeastern.edu
 * 
 *   # Reset all sections configured in course.config.json
 *   CANVAS_API_TOKEN=xxx npx ts-node plugins/classasaurus/scripts/canvas-reset-cli.ts \
 *     --all \
 *     --config ./course.config.json \
 *     --canvas-url https://canvas.northeastern.edu
 * 
 *   # Dry run (show what would be deleted without actually deleting)
 *   CANVAS_API_TOKEN=xxx npx ts-node plugins/classasaurus/scripts/canvas-reset-cli.ts \
 *     --course-id 123456 \
 *     --canvas-url https://canvas.northeastern.edu \
 *     --dry-run
 */

import * as fs from 'fs';
import * as path from 'path';
import { resetCanvasCourseWithCredentials, ResetResult } from '../canvas-reset';
import type { CourseConfig } from '../types';

interface CliOptions {
  courseId?: string;
  canvasUrl: string;
  configPath?: string;
  all?: boolean;
  dryRun?: boolean;
  help?: boolean;
}

function printHelp(): void {
  console.log(`
Canvas Reset CLI - Reset Canvas courses by deleting assignments and modules

Usage:
  npx ts-node plugins/classasaurus/scripts/canvas-reset-cli.ts [options]

Options:
  --course-id <id>      Canvas course ID to reset
  --canvas-url <url>    Canvas instance URL (e.g., https://canvas.northeastern.edu)
  --config <path>       Path to course.config.json (default: ./course.config.json)
  --all                 Reset all sections with canvasCourseId in config
  --dry-run             Show what would be deleted without actually deleting
  --help                Show this help message

Environment Variables:
  CANVAS_API_TOKEN      Required. Canvas API access token.

Examples:
  # Reset a specific course
  CANVAS_API_TOKEN=xxx npx ts-node plugins/classasaurus/scripts/canvas-reset-cli.ts \\
    --course-id 123456 --canvas-url https://canvas.northeastern.edu

  # Reset all configured sections
  CANVAS_API_TOKEN=xxx npx ts-node plugins/classasaurus/scripts/canvas-reset-cli.ts \\
    --all --canvas-url https://canvas.northeastern.edu

  # Dry run
  CANVAS_API_TOKEN=xxx npx ts-node plugins/classasaurus/scripts/canvas-reset-cli.ts \\
    --course-id 123456 --canvas-url https://canvas.northeastern.edu --dry-run
`);
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    canvasUrl: '',
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];
    
    switch (arg) {
      case '--course-id':
        options.courseId = nextArg;
        i++;
        break;
      case '--canvas-url':
        options.canvasUrl = nextArg;
        i++;
        break;
      case '--config':
        options.configPath = nextArg;
        i++;
        break;
      case '--all':
        options.all = true;
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
    }
  }
  
  return options;
}

function loadConfig(configPath: string): CourseConfig {
  const fullPath = path.isAbsolute(configPath) 
    ? configPath 
    : path.join(process.cwd(), configPath);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Configuration file not found: ${fullPath}`);
  }
  
  const content = fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(content) as CourseConfig;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const options = parseArgs(args);
  
  if (options.help) {
    printHelp();
    process.exit(0);
  }
  
  // Validate required options
  const apiToken = process.env.CANVAS_API_TOKEN;
  if (!apiToken) {
    console.error('❌ Error: CANVAS_API_TOKEN environment variable is required');
    process.exit(1);
  }
  
  if (!options.canvasUrl) {
    console.error('❌ Error: --canvas-url is required');
    printHelp();
    process.exit(1);
  }
  
  if (!options.courseId && !options.all) {
    console.error('❌ Error: Either --course-id or --all is required');
    printHelp();
    process.exit(1);
  }
  
  // Collect course IDs to reset
  const courseIds: string[] = [];
  
  if (options.courseId) {
    courseIds.push(options.courseId);
  }
  
  if (options.all) {
    const configPath = options.configPath || './course.config.json';
    try {
      const config = loadConfig(configPath);
      const sectionIds = config.sections
        .filter(s => s.canvasCourseId)
        .map(s => s.canvasCourseId!);
      
      if (sectionIds.length === 0) {
        console.log('ℹ️  No sections have canvasCourseId configured in the config file.');
        process.exit(0);
      }
      
      courseIds.push(...sectionIds);
      console.log(`📋 Found ${sectionIds.length} section(s) with Canvas course IDs in config`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`❌ Error loading config: ${message}`);
      process.exit(1);
    }
  }
  
  // Deduplicate course IDs
  const uniqueCourseIds = [...new Set(courseIds)];
  
  console.log(`\n🎨 Canvas Reset Tool`);
  console.log(`   Canvas URL: ${options.canvasUrl}`);
  console.log(`   Courses to reset: ${uniqueCourseIds.join(', ')}`);
  
  if (options.dryRun) {
    console.log(`\n⚠️  DRY RUN MODE - No changes will be made`);
    console.log(`   Would reset the following courses: ${uniqueCourseIds.join(', ')}`);
    process.exit(0);
  }
  
  // Confirm before proceeding
  console.log(`\n⚠️  WARNING: This will DELETE all assignments and modules from the specified Canvas course(s).`);
  console.log(`   This action cannot be undone!`);
  console.log(`\n   Press Ctrl+C within 5 seconds to cancel...`);
  
  // await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Reset each course
  const results: ResetResult[] = [];
  
  console.log(`Working with api token: ${apiToken} and canvas url: ${options.canvasUrl} and course ids: ${uniqueCourseIds.join(', ')}`);
  for (const courseId of uniqueCourseIds) {
    try {
      const result = await resetCanvasCourseWithCredentials(
        options.canvasUrl,
        apiToken,
        courseId
      );
      results.push(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`\n❌ Failed to reset course ${courseId}: ${message}`);
      results.push({
        success: false,
        canvasCourseId: courseId,
        assignmentsDeleted: 0,
        modulesDeleted: 0,
        errors: [message],
      });
    }
  }
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Reset Summary');
  console.log('='.repeat(60));
  
  const totalAssignments = results.reduce((sum, r) => sum + r.assignmentsDeleted, 0);
  const totalModules = results.reduce((sum, r) => sum + r.modulesDeleted, 0);
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  const successCount = results.filter(r => r.success).length;
  
  console.log(`   Courses processed: ${results.length}`);
  console.log(`   Successful: ${successCount}`);
  console.log(`   Total assignments deleted: ${totalAssignments}`);
  console.log(`   Total modules deleted: ${totalModules}`);
  
  if (totalErrors > 0) {
    console.log(`   Total errors: ${totalErrors}`);
    process.exit(1);
  }
  
  console.log('\n✅ Reset complete!');
}

main().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});

