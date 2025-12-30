import type { Plugin } from '@docusaurus/types';
import type { LoadContext } from '@docusaurus/types';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

interface StaffImagesPluginOptions {
  /** Source directory for staff images (relative to project root) */
  sourceDir?: string;
  /** Output directory for processed images (relative to build output) */
  outputDir?: string;
  /** Target size for images (square) */
  size?: number;
  /** Quality for JPEG images (1-100) */
  quality?: number;
  /** Generate WebP versions */
  generateWebP?: boolean;
}

/**
 * Docusaurus plugin to automatically resize and crop staff headshot images
 * at build time for optimal performance.
 */
export default function pluginStaffImages(
  context: LoadContext,
  options: StaffImagesPluginOptions = {}
): Plugin<null> {
  const {
    sourceDir = 'static/img/staff',
    outputDir = 'img/staff',
    size = 300,
    quality = 85,
    generateWebP = true,
  } = options;

  return {
    name: 'docusaurus-plugin-staff-images',
    
    async postBuild({ outDir }) {
      const sourcePath = path.join(context.siteDir, sourceDir);
      const targetPath = path.join(outDir, outputDir);

      // Check if source directory exists
      if (!fs.existsSync(sourcePath)) {
        console.log(`📸 Staff images directory not found: ${sourcePath}`);
        return;
      }

      // Create target directory if it doesn't exist
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
      }

      // Get all image files (exclude .webp since we generate those)
      const files = fs.readdirSync(sourcePath).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png'].includes(ext);
      });

      if (files.length === 0) {
        console.log(`📸 No staff images found in ${sourceDir}`);
        return;
      }

      console.log(`📸 Processing ${files.length} staff image(s)...`);

      // Process each image
      for (const file of files) {
        const inputPath = path.join(sourcePath, file);
        const ext = path.extname(file).toLowerCase();
        const baseName = path.basename(file, ext);
        
        try {
          // Read image metadata
          const metadata = await sharp(inputPath).metadata();
          
          // Determine output format (prefer JPEG for photos, PNG for graphics)
          const isPhoto = ['.jpg', '.jpeg'].includes(ext) || metadata.format === 'jpeg';
          const outputExt = isPhoto ? '.jpg' : '.png';
          const outputPath = path.join(targetPath, `${baseName}${outputExt}`);

          // Resize and crop to square (center crop)
          const pipeline = sharp(inputPath)
            .resize(size, size, {
              fit: 'cover',
              position: 'center',
            });

          if (isPhoto) {
            await pipeline
              .jpeg({ quality, mozjpeg: true })
              .toFile(outputPath);
          } else {
            await pipeline
              .png({ quality, compressionLevel: 9 })
              .toFile(outputPath);
          }

          const stats = fs.statSync(outputPath);
          console.log(`  ✅ ${file} → ${baseName}${outputExt} (${(stats.size / 1024).toFixed(1)}KB)`);

          // Generate WebP version if enabled
          if (generateWebP) {
            const webpPath = path.join(targetPath, `${baseName}.webp`);
            await sharp(inputPath)
              .resize(size, size, {
                fit: 'cover',
                position: 'center',
              })
              .webp({ quality })
              .toFile(webpPath);
            
            const webpStats = fs.statSync(webpPath);
            console.log(`  ✅ ${file} → ${baseName}.webp (${(webpStats.size / 1024).toFixed(1)}KB)`);
          }
        } catch (error) {
          console.error(`  ❌ Error processing ${file}:`, error);
        }
      }

      console.log(`📸 Staff images processed successfully!`);
    },
  };
}
