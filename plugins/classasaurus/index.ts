import { LoadContext, Plugin } from "@docusaurus/types";
import path from 'path';
import fs from 'fs';
import type { ClassasaurusPluginOptions, CourseConfig, CourseSchedule } from './types';
import { validateCourseConfig } from './config-validator';
import { generateSchedule } from './schedule-generator';

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
            // Watch the configuration file for changes
            if (options.configPath) {
                const configPath = path.isAbsolute(options.configPath)
                    ? options.configPath
                    : path.join(context.siteDir, options.configPath);
                console.log(`👀 Watching for changes: ${configPath}`);
                return [configPath];
            }
            return [];
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
            }
        },
    };
}

// Export types for use in other files
export type { ClassasaurusPluginOptions, CourseConfig, CourseSchedule } from './types';
// Export utilities
export * from './utils';
