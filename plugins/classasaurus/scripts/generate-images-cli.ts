#!/usr/bin/env npx ts-node
/**
 * Generate Images CLI
 *
 * Command-line tool to generate missing lecture slide images from MDX/MD files.
 * Parses MDX/MD for images with alt text, generates variations via Google Gemini API,
 * and saves optimized versions for web use.
 *
 * Usage:
 *   # Generate for single file
 *   GEMINI_API_KEY=xxx npx ts-node plugins/classasaurus/scripts/generate-images-cli.ts \
 *     lecture-slides/l4-specs-contracts.mdx
 *
 *   # Generate for all MDX/MD files in a directory
 *   GEMINI_API_KEY=xxx npx ts-node plugins/classasaurus/scripts/generate-images-cli.ts \
 *     lecture-slides/
 *
 *   # Dry run (show what would be generated)
 *   GEMINI_API_KEY=xxx npx ts-node plugins/classasaurus/scripts/generate-images-cli.ts \
 *     --dry-run lecture-slides/l4-specs-contracts.mdx
 *
 *   # Force regenerate (ignore cache)
 *   GEMINI_API_KEY=xxx npx ts-node plugins/classasaurus/scripts/generate-images-cli.ts \
 *     --force lecture-slides/l4-specs-contracts.mdx
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  processMdxFile,
  getDefaultConfig,
  extractImagesFromMdx,
  debugGenerateImage,
} from '../image-generator';
import type { CliOptions, ImageGeneratorConfig, ProcessingResult } from '../image-generator-types';

// ============================================================================
// CLI Argument Parsing
// ============================================================================

function printHelp(): void {
  console.log(`
Generate Images CLI - Generate lecture slide images from MDX/MD files

Usage:
  npx ts-node plugins/classasaurus/scripts/generate-images-cli.ts [options] <target>

Arguments:
  <target>              MDX/MD file or directory containing MDX/MD files

Options:
  --dry-run             Show what would be generated without actually generating
  --force               Force regeneration even if cached (ignore prompt hash)
  --concurrency <n>     Maximum concurrent API requests (default: 3)
  --verbose             Show detailed output for each image
  --debug               Debug mode: process 1 image, print full API request/response
  --help                Show this help message

Environment Variables:
  GEMINI_API_KEY        Google Gemini API key for image generation.
                        Only required if new images need to be generated.
                        Not needed if all images exist or are cached.
                        Get one at: https://aistudio.google.com/apikey
  GEMINI_MODEL          Optional. Model to use (default: gemini-3-pro-image-preview)

Examples:
  # Generate missing images for a single lecture
  GEMINI_API_KEY=xxx npm run generate-images -- lecture-slides/l4-specs-contracts.mdx

  # Process all lecture slides
  GEMINI_API_KEY=xxx npm run generate-images -- lecture-slides/

  # Preview what would be generated
  GEMINI_API_KEY=xxx npm run generate-images -- --dry-run --verbose lecture-slides/

  # Force regenerate all images (ignores cache)
  GEMINI_API_KEY=xxx npm run generate-images -- --force lecture-slides/l4-specs-contracts.mdx
`);
}

interface ExtendedCliOptions extends CliOptions {
  debug: boolean;
}

function parseArgs(args: string[]): ExtendedCliOptions {
  const options: ExtendedCliOptions = {
    target: '',
    dryRun: false,
    force: false,
    help: false,
    verbose: false,
    concurrency: 3,
    debug: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--force':
        options.force = true;
        break;
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
      case '--debug':
        options.debug = true;
        break;
      case '--concurrency':
        options.concurrency = parseInt(nextArg, 10) || 3;
        i++;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      default:
        if (!arg.startsWith('-')) {
          options.target = arg;
        }
    }
  }

  return options;
}

// ============================================================================
// File Discovery
// ============================================================================

function isMarkdownFile(filename: string): boolean {
  return filename.endsWith('.mdx') || filename.endsWith('.md');
}

function findMarkdownFiles(targetPath: string, projectRoot: string): string[] {
  const fullPath = path.isAbsolute(targetPath)
    ? targetPath
    : path.join(projectRoot, targetPath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Target not found: ${fullPath}`);
  }

  const stats = fs.statSync(fullPath);

  if (stats.isFile()) {
    if (isMarkdownFile(fullPath)) {
      return [fullPath];
    }
    throw new Error(`Target is not an MDX/MD file: ${fullPath}`);
  }

  if (stats.isDirectory()) {
    const files: string[] = [];
    const entries = fs.readdirSync(fullPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isFile() && isMarkdownFile(entry.name)) {
        files.push(path.join(fullPath, entry.name));
      }
    }

    return files.sort();
  }

  throw new Error(`Invalid target: ${fullPath}`);
}

// ============================================================================
// Progress Reporting
// ============================================================================

function printSummary(results: ProcessingResult[]): void {
  console.log('\n' + '='.repeat(70));
  console.log('📊 Generation Summary');
  console.log('='.repeat(70));

  let totalImages = 0;
  let totalExisting = 0;
  let totalGenerated = 0;
  let totalFailed = 0;
  let totalSkipped = 0;

  for (const result of results) {
    totalImages += result.totalImages;
    totalExisting += result.existingImages;
    totalGenerated += result.generatedImages;
    totalFailed += result.failedImages;
    totalSkipped += result.skippedImages;
  }

  console.log(`   Files processed:    ${results.length}`);
  console.log(`   Total images found: ${totalImages}`);
  console.log(`   Already existing:   ${totalExisting}`);
  console.log(`   Generated:          ${totalGenerated}`);
  console.log(`   Skipped/cached:     ${totalSkipped}`);
  
  if (totalFailed > 0) {
    console.log(`   ❌ Failed:          ${totalFailed}`);
  }

  console.log('='.repeat(70));

  if (totalGenerated > 0) {
    console.log('\n✅ Generation complete!');
    console.log('   New images saved to static/img/ directories.');
    console.log('   Full-size originals cached in static/img/.image-cache/originals/');
  } else if (totalFailed === 0) {
    console.log('\n✅ All images are up to date!');
  } else {
    console.log('\n⚠️  Some images failed to generate. Check the errors above.');
  }
}

// ============================================================================
// Main Entry Point
// ============================================================================

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  // Check API key (but don't require it yet - may not be needed if everything is cached)
  const apiKey = process.env.GEMINI_API_KEY;
  const hasApiKey = Boolean(apiKey);

  // Validate target
  if (!options.target) {
    console.error('❌ Error: No target file or directory specified');
    printHelp();
    process.exit(1);
  }

  // Determine project root (where package.json is)
  const projectRoot = path.resolve(__dirname, '../../..');

  // Find markdown files
  let mdxFiles: string[];
  try {
    mdxFiles = findMarkdownFiles(options.target, projectRoot);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ Error: ${message}`);
    process.exit(1);
  }

  if (mdxFiles.length === 0) {
    console.log('⚠️  No MDX/MD files found in the target');
    process.exit(0);
  }

  // Build configuration
  const defaultConfig = getDefaultConfig(projectRoot);
  const config: ImageGeneratorConfig = {
    apiKey: apiKey || '',
    model: defaultConfig.model!,
    projectRoot,
    cacheDir: defaultConfig.cacheDir!,
    manifestPath: defaultConfig.manifestPath!,
    concurrency: options.concurrency,
    systemPrompt: defaultConfig.systemPrompt!,
    variationCount: defaultConfig.variationCount!,
    force: options.force,
    dryRun: options.dryRun,
  };

  // Print header
  console.log('\n🎨 Image Generator for Lecture Slides');
  console.log('='.repeat(70));
  console.log(`   Model:       ${config.model}`);
  console.log(`   Target:      ${options.target}`);
  console.log(`   Files:       ${mdxFiles.length}`);
  console.log(`   Concurrency: ${config.concurrency}`);
  if (!hasApiKey) {
    console.log(`   API Key:     ⚠️  Not set (will use cached data only)`);
  }
  if (options.dryRun) {
    console.log(`   Mode:        DRY RUN (no actual generation)`);
  }
  if (options.force) {
    console.log(`   Mode:        FORCE (ignoring cache)`);
  }
  if (options.debug) {
    console.log(`   Mode:        DEBUG (single request, full output)`);
  }
  console.log('='.repeat(70));

  // Debug mode: process just 1 image and print full API response
  if (options.debug) {
    const filePath = mdxFiles[0];
    const content = fs.readFileSync(filePath, 'utf-8');
    const images = extractImagesFromMdx(content, filePath);
    
    // Find first image that doesn't already exist
    const targetImage = images.find(img => {
      const targetPath = path.join(projectRoot, img.targetDir, `${img.baseName}.png`);
      return !fs.existsSync(targetPath);
    }) || images[0];

    if (!targetImage) {
      console.log('❌ No images found to debug');
      process.exit(1);
    }

    console.log(`\n🔍 Debug target: ${targetImage.baseName}`);
    console.log(`   Source: line ${targetImage.lineNumber}`);
    console.log(`   Alt text length: ${targetImage.alt.length} chars`);
    console.log(`   Alt text preview: ${targetImage.alt.substring(0, 200)}...`);

    // Check if we have a cached debug response (API key not needed if cached)
    const debugCachePath = path.join(config.cacheDir, 'debug', `${targetImage.baseName}-debug.json`);
    if (!hasApiKey && !fs.existsSync(debugCachePath)) {
      console.error('\n❌ Error: GEMINI_API_KEY required for debug mode (no cached response found)');
      console.error('   Set it with: export GEMINI_API_KEY=your-key-here');
      console.error('   Get a key at: https://aistudio.google.com/apikey');
      process.exit(1);
    }

    await debugGenerateImage(config, targetImage.alt, targetImage.baseName);
    process.exit(0);
  }

  // Process each file
  const results: ProcessingResult[] = [];

  for (const filePath of mdxFiles) {
    const relativePath = path.relative(projectRoot, filePath);
    console.log(`\n📄 Processing: ${relativePath}`);

    // Quick preview of images in file
    if (options.verbose) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const images = extractImagesFromMdx(content, filePath);
      console.log(`   Found ${images.length} image(s) with substantial alt text`);
      for (const img of images) {
        console.log(`   - ${img.baseName} (line ${img.lineNumber})`);
      }
    }

    try {
      const result = await processMdxFile(filePath, config);
      results.push(result);

      // Print per-file results
      if (options.verbose || result.failedImages > 0) {
        for (const ir of result.imageResults) {
          const icon = 
            ir.status === 'generated' ? '✅' :
            ir.status === 'exists' ? '📁' :
            ir.status === 'cached' ? '💾' :
            ir.status === 'failed' ? '❌' : '⏭️';
          console.log(`   ${icon} ${ir.baseName}: ${ir.message || ir.status}`);
        }
      } else {
        console.log(`   ✅ ${result.generatedImages} generated, ${result.existingImages} existing, ${result.skippedImages} skipped`);
      }

    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`   ❌ Error processing file: ${message}`);
      results.push({
        filePath,
        totalImages: 0,
        existingImages: 0,
        generatedImages: 0,
        failedImages: 1,
        skippedImages: 0,
        imageResults: [{ baseName: 'file', status: 'failed', message }],
      });
    }
  }

  // Print summary
  printSummary(results);

  // Exit with error code if any failures
  const totalFailed = results.reduce((sum, r) => sum + r.failedImages, 0);
  if (totalFailed > 0) {
    process.exit(1);
  }
}

// Run
main().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});

