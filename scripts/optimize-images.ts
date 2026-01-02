#!/usr/bin/env npx ts-node

/**
 * Script to optimize lecture and assignment images for web use.
 * Creates optimized versions while keeping the originals.
 * 
 * Usage: npm run optimize-images
 */

import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

const MAX_WIDTH = 1920; // Max width for web images (Full HD)
const QUALITY = 85; // Quality for JPEG/WebP (1-100)
const PNG_COMPRESSION_LEVEL = 9; // PNG compression (0-9)

interface DirectoryConfig {
  source: string;
  output: string;
}

const DIRECTORIES: DirectoryConfig[] = [
  { source: 'static/img/lectures', output: 'static/img/lectures/web' },
  { source: 'static/img/assignments', output: 'static/img/assignments/web' },
  { source: 'static/img', output: 'static/img/web' },
];

interface ProcessResult {
  original: number;
  optimized: number;
  webp: number;
}

interface DirectoryResult {
  processed: number;
  totalOriginal: number;
  totalOptimized: number;
  totalWebP: number;
}

/**
 * Format bytes to human-readable size
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Process a single image file
 */
async function processImage(inputPath: string, outputPath: string): Promise<ProcessResult | null> {
  try {
    const metadata = await sharp(inputPath).metadata();
    const ext = path.extname(inputPath).toLowerCase();
    const baseName = path.basename(inputPath, ext);
    
    if (!metadata.width || !metadata.height) {
      throw new Error('Could not read image dimensions');
    }
    
    // Determine if it's a photo (JPEG) or graphic (PNG)
    const isPhoto = ['.jpg', '.jpeg'].includes(ext) || metadata.format === 'jpeg';
    
    // Calculate new dimensions (maintain aspect ratio)
    let width = metadata.width;
    let height = metadata.height;
    
    if (width > MAX_WIDTH) {
      height = Math.round((height * MAX_WIDTH) / width);
      width = MAX_WIDTH;
    }
    
    // Create output directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Build sharp pipeline
    let pipeline = sharp(inputPath);
    
    // Resize if needed (maintain aspect ratio)
    if (width !== metadata.width || height !== metadata.height) {
      pipeline = pipeline.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }
    
    // Optimize based on format
    if (isPhoto) {
      const jpgPath = outputPath.replace(/\.png$/, '.jpg');
      await pipeline
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toFile(jpgPath);
      
      // Also create WebP version
      await sharp(inputPath)
        .resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: QUALITY })
        .toFile(outputPath.replace(/\.png$/, '.webp'));
      
      // Update outputPath for stats
      outputPath = jpgPath;
    } else {
      // PNG optimization
      await pipeline
        .png({ 
          compressionLevel: PNG_COMPRESSION_LEVEL,
          quality: QUALITY,
          adaptiveFiltering: true,
        })
        .toFile(outputPath);
      
      // Also create WebP version
      await sharp(inputPath)
        .resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: QUALITY })
        .toFile(outputPath.replace(/\.png$/, '.webp'));
    }
    
    // Get file sizes
    const originalStats = fs.statSync(inputPath);
    const optimizedStats = fs.statSync(outputPath);
    const webpPath = outputPath.replace(/\.png$/, '.webp');
    const webpStats = fs.existsSync(webpPath) ? fs.statSync(webpPath) : null;
    
    // Calculate savings
    const savings = ((1 - optimizedStats.size / originalStats.size) * 100).toFixed(1);
    
    console.log(`  ✅ ${path.basename(inputPath)}`);
    console.log(`     Original: ${formatBytes(originalStats.size)}`);
    console.log(`     Optimized: ${formatBytes(optimizedStats.size)} (${savings}% smaller)`);
    if (webpStats) {
      const webpSavings = ((1 - webpStats.size / originalStats.size) * 100).toFixed(1);
      console.log(`     WebP: ${formatBytes(webpStats.size)} (${webpSavings}% smaller)`);
    }
    console.log(`     Dimensions: ${metadata.width}x${metadata.height} → ${width}x${height}`);
    
    return {
      original: originalStats.size,
      optimized: optimizedStats.size,
      webp: webpStats?.size || 0,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`  ❌ Error processing ${inputPath}:`, errorMessage);
    return null;
  }
}

/**
 * Process all images in a directory
 */
async function processDirectory(sourceDir: string, outputDir: string): Promise<DirectoryResult> {
  if (!fs.existsSync(sourceDir)) {
    console.log(`⚠️  Directory not found: ${sourceDir}`);
    return { processed: 0, totalOriginal: 0, totalOptimized: 0, totalWebP: 0 };
  }
  
  const files = fs.readdirSync(sourceDir).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png'].includes(ext);
  });
  
  if (files.length === 0) {
    console.log(`⚠️  No images found in ${sourceDir}`);
    return { processed: 0, totalOriginal: 0, totalOptimized: 0, totalWebP: 0 };
  }
  
  console.log(`\n📸 Processing ${files.length} image(s) from ${sourceDir}...`);
  
  let totalOriginal = 0;
  let totalOptimized = 0;
  let totalWebP = 0;
  let processed = 0;
  
  for (const file of files) {
    const inputPath = path.join(sourceDir, file);
    const outputPath = path.join(outputDir, file);
    
    const result = await processImage(inputPath, outputPath);
    if (result) {
      totalOriginal += result.original;
      totalOptimized += result.optimized;
      totalWebP += result.webp;
      processed++;
    }
  }
  
  return { processed, totalOriginal, totalOptimized, totalWebP };
}

/**
 * Main function
 */
async function main(): Promise<void> {
  console.log('🚀 Starting image optimization...\n');
  
  let totalProcessed = 0;
  let grandTotalOriginal = 0;
  let grandTotalOptimized = 0;
  let grandTotalWebP = 0;
  
  for (const dir of DIRECTORIES) {
    const sourcePath = path.join(__dirname, '..', dir.source);
    const outputPath = path.join(__dirname, '..', dir.output);
    
    const result = await processDirectory(sourcePath, outputPath);
    totalProcessed += result.processed;
    grandTotalOriginal += result.totalOriginal;
    grandTotalOptimized += result.totalOptimized;
    grandTotalWebP += result.totalWebP;
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log(`   Processed: ${totalProcessed} image(s)`);
  console.log(`   Total original size: ${formatBytes(grandTotalOriginal)}`);
  console.log(`   Total optimized size: ${formatBytes(grandTotalOptimized)}`);
  if (grandTotalWebP > 0) {
    console.log(`   Total WebP size: ${formatBytes(grandTotalWebP)}`);
  }
  const totalSavings = ((1 - grandTotalOptimized / grandTotalOriginal) * 100).toFixed(1);
  console.log(`   Total savings: ${totalSavings}%`);
  console.log('='.repeat(60));
  console.log('\n✅ Optimization complete!');
  console.log('   Optimized images are in the "web" subdirectories.');
  console.log('   Original images are preserved in their original locations.\n');
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

