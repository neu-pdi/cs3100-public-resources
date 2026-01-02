#!/usr/bin/env npx tsx

/**
 * Quick script to optimize a single image
 * Usage: npx tsx scripts/optimize-single-image.ts <image-path>
 */

import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

const MAX_WIDTH = 1920;
const QUALITY = 85;
const PNG_COMPRESSION_LEVEL = 9;

const imagePath = process.argv[2];

if (!imagePath) {
  console.error('Usage: npx tsx scripts/optimize-single-image.ts <image-path>');
  process.exit(1);
}

const fullPath = path.join(__dirname, '..', imagePath);

if (!fs.existsSync(fullPath)) {
  console.error(`Error: File not found: ${fullPath}`);
  process.exit(1);
}

const ext = path.extname(fullPath).toLowerCase();
const dir = path.dirname(fullPath);
const baseName = path.basename(fullPath, ext);
const outputDir = path.join(dir, 'web');
const outputPath = path.join(outputDir, path.basename(fullPath));

async function processImage() {
  try {
    const metadata = await sharp(fullPath).metadata();
    
    if (!metadata.width || !metadata.height) {
      throw new Error('Could not read image dimensions');
    }
    
    const isPhoto = ['.jpg', '.jpeg'].includes(ext) || metadata.format === 'jpeg';
    
    let width = metadata.width;
    let height = metadata.height;
    
    if (width > MAX_WIDTH) {
      height = Math.round((height * MAX_WIDTH) / width);
      width = MAX_WIDTH;
    }
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    let pipeline = sharp(fullPath);
    
    if (width !== metadata.width || height !== metadata.height) {
      pipeline = pipeline.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }
    
    if (isPhoto) {
      const jpgPath = outputPath.replace(/\.png$/, '.jpg');
      await pipeline
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toFile(jpgPath);
      
      await sharp(fullPath)
        .resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: QUALITY })
        .toFile(outputPath.replace(/\.png$/, '.webp'));
      
      console.log(`✅ Created optimized JPEG: ${jpgPath}`);
      console.log(`✅ Created WebP: ${outputPath.replace(/\.png$/, '.webp')}`);
    } else {
      await pipeline
        .png({ 
          compressionLevel: PNG_COMPRESSION_LEVEL,
          quality: QUALITY,
          adaptiveFiltering: true,
        })
        .toFile(outputPath);
      
      await sharp(fullPath)
        .resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: QUALITY })
        .toFile(outputPath.replace(/\.png$/, '.webp'));
      
      console.log(`✅ Created optimized PNG: ${outputPath}`);
      console.log(`✅ Created WebP: ${outputPath.replace(/\.png$/, '.webp')}`);
    }
    
    const originalStats = fs.statSync(fullPath);
    const optimizedStats = fs.statSync(outputPath);
    const webpPath = outputPath.replace(/\.png$/, '.webp');
    const webpStats = fs.existsSync(webpPath) ? fs.statSync(webpPath) : null;
    
    const savings = ((1 - optimizedStats.size / originalStats.size) * 100).toFixed(1);
    
    console.log(`\n📊 Results:`);
    console.log(`   Original: ${(originalStats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Optimized: ${(optimizedStats.size / 1024 / 1024).toFixed(2)} MB (${savings}% smaller)`);
    if (webpStats) {
      const webpSavings = ((1 - webpStats.size / originalStats.size) * 100).toFixed(1);
      console.log(`   WebP: ${(webpStats.size / 1024 / 1024).toFixed(2)} MB (${webpSavings}% smaller)`);
    }
    console.log(`   Dimensions: ${metadata.width}x${metadata.height} → ${width}x${height}`);
    
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

processImage();

