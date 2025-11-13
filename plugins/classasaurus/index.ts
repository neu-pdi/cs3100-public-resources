import { LoadContext, Plugin } from "@docusaurus/types";
import path from 'path';
import fs from 'fs';
import type { ClassasaurusPluginOptions, CourseConfig, CourseSchedule } from './types';
import { validateCourseConfig } from './config-validator';
import { generateSchedule } from './schedule-generator';
import { extractHeadings, formatDateDisplay } from './utils';

export default async function pluginClassasaurus(
    context: LoadContext,
    options: ClassasaurusPluginOptions
): Promise<Plugin<CourseSchedule | null>> {
    console.log("🦕 Classasaurus plugin loaded");
    
    // Helper function to load config
    function loadConfig(): CourseConfig | null {
        let courseConfig: CourseConfig | null = null;
        
        try {
            if (options.config) {
                // Configuration provided directly
                courseConfig = options.config;
            } else if (options.configPath) {
                // Load from file
                const configPath = path.isAbsolute(options.configPath)
                    ? options.configPath
                    : path.join(context.siteDir, options.configPath);
                
                if (fs.existsSync(configPath)) {
                    const configContent = fs.readFileSync(configPath, 'utf-8');
                    
                    // Support both .json and .ts files
                    if (configPath.endsWith('.ts') || configPath.endsWith('.js')) {
                        // For TypeScript/JavaScript configs, clear require cache to get fresh version
                        delete require.cache[require.resolve(configPath)];
                        const configModule = require(configPath);
                        courseConfig = configModule.default || configModule;
                    } else {
                        // For JSON configs
                        courseConfig = JSON.parse(configContent) as CourseConfig;
                    }
                    
                    console.log(`📚 Loaded course configuration from ${configPath}`);
                } else {
                    console.warn(`⚠️  Configuration file not found: ${configPath}`);
                }
            }
        } catch (error) {
            console.error('❌ Error loading course configuration:', error);
            throw error;
        }
        
        return courseConfig;
    }
    
    /**
     * Generate COURSE.md content with course summary, lecture TOC, and assignments
     * Returns the markdown string
     */
    async function generateCourseMarkdownContent(
        schedule: CourseSchedule,
        siteDir: string,
        baseUrl: string
    ): Promise<string> {
        const config = schedule.config;
        const baseUrlNormalized = baseUrl.replace(/\/$/, '');
        const lectureNotesDir = path.join(siteDir, 'lecture-notes');
        const overviewPath = path.join(siteDir, 'assignments', 'cyb-overview.md');
        
        // Add frontmatter to disable sidebar
        let courseMarkdown = `---
title: Course Overview
description: Complete course overview with lectures and assignments
hide_table_of_contents: true
sidebar: false
---

# ${config.courseCode}: ${config.courseTitle}\n\n`;
        
        // Add course description
        if (config.metadata?.description) {
            courseMarkdown += `${config.metadata.description}\n\n`;
        }
        
        // Add mechanical description if present
        if (config.metadata?.mechanicalDescription) {
            courseMarkdown += `${config.metadata.mechanicalDescription}\n\n`;
        }
        
        // Generate lecture table of contents
        courseMarkdown += `# Lectures and associated learning objectives\n\n`;
        
        // Get all lecture files and sort them
        const lectureFiles: Array<{ id: string; path: string; content: string }> = [];
        
        if (fs.existsSync(lectureNotesDir)) {
            const files = fs.readdirSync(lectureNotesDir);
            for (const file of files) {
                if (file.endsWith('.md') || file.endsWith('.mdx')) {
                    const lectureId = file.replace(/\.(md|mdx)$/, '');
                    // Skip l0-summary
                    if (lectureId.startsWith('l0')) continue;
                    
                    const filePath = path.join(lectureNotesDir, file);
                    const content = fs.readFileSync(filePath, 'utf-8');
                    
                    // Extract title from frontmatter or first heading
                    let title = lectureId;
                    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
                    if (frontmatterMatch) {
                        const frontmatter = frontmatterMatch[1];
                        const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);
                        if (titleMatch) {
                            title = titleMatch[1].trim().replace(/^["']|["']$/g, '');
                        }
                    } else {
                        // Try to get from first heading
                        const headingMatch = content.match(/^#\s+(.+)$/m);
                        if (headingMatch) {
                            title = headingMatch[1].trim();
                        }
                    }
                    
                    lectureFiles.push({
                        id: lectureId,
                        path: filePath,
                        content,
                    });
                }
            }
        }
        
        // Sort lectures by ID (handling numeric sorting)
        lectureFiles.sort((a, b) => {
            return a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' });
        });
        
        // Create a map of lecture IDs to dates
        const lectureDateMap = new Map<string, string[]>();
        for (const lecture of config.lectures) {
            lectureDateMap.set(lecture.lectureId, lecture.dates);
        }
        
        // Generate TOC for each lecture
        for (const lectureFile of lectureFiles) {
            const lectureId = lectureFile.id;
            const dates = lectureDateMap.get(lectureId) || [];
            const dateStr = dates.length > 0 
                ? dates.map(d => formatDateDisplay(d)).join(', ')
                : '';
            
            // Extract title
            let title = lectureId;
            const frontmatterMatch = lectureFile.content.match(/^---\n([\s\S]*?)\n---/);
            if (frontmatterMatch) {
                const frontmatter = frontmatterMatch[1];
                const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);
                if (titleMatch) {
                    title = titleMatch[1].trim().replace(/^["']|["']$/g, '');
                }
            } else {
                const headingMatch = lectureFile.content.match(/^#\s+(.+)$/m);
                if (headingMatch) {
                    title = headingMatch[1].trim();
                }
            }
            
            // Generate lecture URL (Docusaurus route) with baseUrl
            const lectureUrl = `${baseUrlNormalized}/lecture-notes/${lectureId}`;
            
            // Format lecture header with date
            if (dateStr) {
                courseMarkdown += `## [${title}](${lectureUrl}) - ${dateStr}\n\n`;
            } else {
                courseMarkdown += `## [${title}](${lectureUrl})\n\n`;
            }
            
            // Extract level 2 headings
            const headings = extractHeadings(lectureFile.content);
            if (headings.length > 0) {
                for (const heading of headings) {
                    const headingUrl = `${lectureUrl}#${heading.id}`;
                    courseMarkdown += `- [${heading.text}](${headingUrl})\n`;
                }
                courseMarkdown += '\n';
            }
        }

        // Include cyb-overview.md content
        if (fs.existsSync(overviewPath)) {
            const overviewContent = fs.readFileSync(overviewPath, 'utf-8');
            // Remove frontmatter if present
            const overviewWithoutFrontmatter = overviewContent.replace(/^---\n[\s\S]*?---\n/, '');
            courseMarkdown += `---\n\n${overviewWithoutFrontmatter}\n\n---\n\n`;
        }
        
        // Generate assignments section
        if (config.assignments && config.assignments.length > 0) {
            courseMarkdown += `# Schedule of assignments \n\n`;
            
            // Sort assignments by due date
            const sortedAssignments = [...config.assignments].sort((a, b) => 
                a.dueDate.localeCompare(b.dueDate)
            );
            
            for (const assignment of sortedAssignments) {
                const assignedDateStr = formatDateDisplay(assignment.assignedDate);
                const dueDateStr = formatDateDisplay(assignment.dueDate);
                const dueTime = assignment.dueTime || '23:59';
                
                // Make the title a link if URL exists, otherwise just plain text
                let titleMarkdown = `### ${assignment.title}\n\n`;
                if (assignment.url) {
                    // Ensure assignment URL includes baseUrl if it's a relative path
                    const assignmentUrl = assignment.url.startsWith('/') 
                        ? `${baseUrlNormalized}${assignment.url}`
                        : assignment.url;
                    titleMarkdown = `### [${assignment.title}](${assignmentUrl})\n\n`;
                }
                courseMarkdown += titleMarkdown;
                
                courseMarkdown += `- **Assigned:** ${assignedDateStr}\n`;
                courseMarkdown += `- **Due:** ${dueDateStr} at ${dueTime}\n`;
                if (assignment.points) {
                    courseMarkdown += `- **Points:** ${assignment.points}\n`;
                }
                courseMarkdown += '\n';
            }
        }
        
        return courseMarkdown;
    }
    
    /**
     * Generate COURSE.md file with course summary, lecture TOC, and assignments
     * Writes the file to the specified output directory
     */
    async function generateCourseMarkdown(
        schedule: CourseSchedule,
        siteDir: string,
        outDir: string,
        baseUrl: string
    ): Promise<void> {
        const courseMarkdown = await generateCourseMarkdownContent(schedule, siteDir, baseUrl);
        const courseMdPath = path.join(outDir, 'COURSE.md');
        fs.writeFileSync(courseMdPath, courseMarkdown, 'utf-8');
        console.log(`📚 Generated COURSE.md at ${courseMdPath}`);
    }
    
    return {
        name: 'docusaurus-plugin-classasaurus',
        
        async loadContent() {
            console.log('🔄 loadContent() called - reloading course configuration...');
            
            // Load config on each content load (happens when watched files change)
            const courseConfig = loadConfig();
            
            if (!courseConfig) {
                return null;
            }
            
            try {
                // Validate configuration
                validateCourseConfig(courseConfig);
                
                // Generate schedule
                const courseSchedule = generateSchedule(courseConfig);
                console.log(`📅 Generated schedule with ${courseSchedule.allEntries.length} total class meetings`);
                
                // Log section info
                for (const section of courseConfig.sections) {
                    const sectionEntries = courseSchedule.scheduleBySection[section.id];
                    console.log(`   Section ${section.id} (${section.name}): ${sectionEntries.length} meetings`);
                }
                
                return courseSchedule;
            } catch (error) {
                console.error('❌ Error validating or generating schedule:', error);
                throw error;
            }
        },
        
        async contentLoaded({ content, actions }) {
            if (!content) {
                return;
            }
            
            const { createData, addRoute } = actions;
            
            // Make schedule data available globally
            const scheduleDataPath = await createData(
                'schedule.json',
                JSON.stringify(content, null, 2)
            );
            
            // Generate overview.md content and write to src/pages
            // Docusaurus automatically creates routes for files in src/pages
            const courseMarkdown = await generateCourseMarkdownContent(content, context.siteDir, context.baseUrl);
            
            // Write overview.md to src/pages directory (Docusaurus will automatically create a route)
            const pagesDir = path.join(context.siteDir, 'src', 'pages');
            if (!fs.existsSync(pagesDir)) {
                fs.mkdirSync(pagesDir, { recursive: true });
            }
            const overviewMdPath = path.join(pagesDir, 'overview.md');
            fs.writeFileSync(overviewMdPath, courseMarkdown, 'utf-8');
            
            // Also write to root for reference
            const rootOverviewMdPath = path.join(context.siteDir, 'overview.md');
            fs.writeFileSync(rootOverviewMdPath, courseMarkdown, 'utf-8');
            
            console.log(`📚 Overview page will be available at /overview (generated at ${overviewMdPath})`);
            
            // Optionally generate a schedule page
            if (options.generateSchedule !== false) {
                const scheduleRoute = options.scheduleRoute || '/schedule';
                
                // Resolve component path
                const componentPath = path.resolve(
                    context.siteDir,
                    'src/components/SchedulePage/index.tsx'
                );
                
                // Normalize the route path with baseUrl
                const normalizedPath = `${context.baseUrl.replace(/\/$/, '')}${scheduleRoute}`;
                
                addRoute({
                    path: normalizedPath,
                    component: componentPath,
                    exact: true,
                    modules: {
                        scheduleData: scheduleDataPath,
                    },
                });
                
                console.log(`📄 Schedule page will be available at ${normalizedPath}`);
            }
        },
        
        getPathsToWatch() {
            const pathsToWatch: string[] = [];
            
            // Watch the configuration file for changes
            if (options.configPath) {
                const configPath = path.isAbsolute(options.configPath)
                    ? options.configPath
                    : path.join(context.siteDir, options.configPath);
                pathsToWatch.push(configPath);
                console.log(`👀 Watching for changes: ${configPath}`);
            }
            
            // Watch lecture-notes and assignments directories for COURSE.md regeneration
            const lectureNotesDir = path.join(context.siteDir, 'lecture-notes');
            const assignmentsDir = path.join(context.siteDir, 'assignments');
            if (fs.existsSync(lectureNotesDir)) {
                pathsToWatch.push(lectureNotesDir);
            }
            if (fs.existsSync(assignmentsDir)) {
                pathsToWatch.push(assignmentsDir);
            }
            
            return pathsToWatch;
        },
        
        async postBuild({ outDir, content }) {
            if (content) {
                // Export schedule as JSON for external tools
                const scheduleJsonPath = path.join(outDir, 'schedule.json');
                fs.writeFileSync(
                    scheduleJsonPath,
                    JSON.stringify(content, null, 2)
                );
                console.log(`📦 Exported schedule to ${scheduleJsonPath}`);
                
                // overview.md is already generated in src/pages during contentLoaded
                // and will be included in the build automatically
            }
        },
    };
}

// Export types for use in other files
export type { ClassasaurusPluginOptions, CourseConfig, CourseSchedule } from './types';
// Export utilities
export * from './utils';
