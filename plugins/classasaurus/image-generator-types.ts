/**
 * Image Generator Types
 * 
 * Type definitions for the MDX image generation pipeline
 */

/**
 * An image reference extracted from an MDX file
 */
export interface ExtractedImage {
  /** The src path as specified in the MDX (e.g., "/img/lectures/web/l4-millers-law.png") */
  src: string;
  
  /** 
   * The generation prompt for the image.
   * Extracted from (in order of precedence):
   * - HTML/JSX: `prompt` attribute, falling back to `alt` attribute
   * - Markdown: title in quotes `![alt](src "title")`, falling back to alt text
   */
  alt: string;
  
  /** The base name derived from the src (e.g., "l4-millers-law") */
  baseName: string;
  
  /** The target directory for web-optimized output (e.g., "static/img/lectures/web") */
  targetDir: string;
  
  /** Source format: HTML img tag or markdown syntax */
  sourceFormat: 'html' | 'markdown';
  
  /** Line number in the source file where this image was found */
  lineNumber: number;
}

/**
 * Cache entry for a single generated image set
 */
export interface CacheEntry {
  /** The full prompt used for generation (system prefix + alt text) */
  prompt: string;
  
  /** Hash of the prompt for change detection */
  promptHash: string;
  
  /** ISO timestamp when the images were generated */
  generatedAt: string;
  
  /** Filenames of generated variations (e.g., ["l4-millers-law-v1.png", "l4-millers-law-v2.png"]) */
  variations: string[];
  
  /** Original full-size file paths in the cache directory */
  originalPaths: string[];
  
  /** Web-optimized file paths */
  webPaths: string[];
}

/**
 * The complete cache manifest structure
 */
export interface CacheManifest {
  /** Version of the cache format */
  version: number;
  
  /** Last updated timestamp */
  lastUpdated: string;
  
  /** Map of base name to cache entry */
  entries: {
    [baseName: string]: CacheEntry;
  };
}

/**
 * Gemini API request for image generation (OpenAI-compatible format)
 */
export interface GeminiImageRequest {
  model: string;
  messages: {
    role: 'user' | 'assistant' | 'system';
    content: string | Array<{
      type: 'text' | 'image_url';
      text?: string;
      image_url?: { url: string };
    }>;
  }[];
  max_tokens?: number;
  response_format?: {
    type: 'json_object';
  };
}

/**
 * Gemini API response structure (OpenAI-compatible format)
 */
export interface GeminiResponse {
  id: string;
  model: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  error?: {
    message: string;
    type: string;
    code: string;
  };
}

/**
 * Result of a single image generation attempt
 */
export interface GenerationResult {
  success: boolean;
  baseName: string;
  variationIndex: number;
  
  /** Base64 encoded image data (on success) */
  imageData?: string;
  
  /** Error message (on failure) */
  error?: string;
  
  /** Whether this was a rate limit error that should be retried */
  rateLimited?: boolean;
}

/**
 * Configuration for the image generator
 */
export interface ImageGeneratorConfig {
  /** Gemini API key (get one at https://aistudio.google.com/apikey) */
  apiKey: string;
  
  /** Model to use for generation */
  model: string;
  
  /** Base directory for the project */
  projectRoot: string;
  
  /** Directory for full-size original images */
  cacheDir: string;
  
  /** Path to the cache manifest file */
  manifestPath: string;
  
  /** Maximum concurrent API requests */
  concurrency: number;
  
  /** System prompt prefix for image generation */
  systemPrompt: string;
  
  /** Number of variations to generate per image */
  variationCount: number;
  
  /** Whether to force regeneration even if cached */
  force: boolean;
  
  /** Whether to run in dry-run mode (no actual generation) */
  dryRun: boolean;
}

/**
 * Result of processing an entire MDX file
 */
export interface ProcessingResult {
  /** Path to the MDX file */
  filePath: string;
  
  /** Total images found in the file */
  totalImages: number;
  
  /** Images that already exist */
  existingImages: number;
  
  /** Images that were generated */
  generatedImages: number;
  
  /** Images that failed to generate */
  failedImages: number;
  
  /** Images skipped (no alt text or other reason) */
  skippedImages: number;
  
  /** Detailed results for each image */
  imageResults: {
    baseName: string;
    status: 'exists' | 'generated' | 'failed' | 'skipped' | 'cached';
    message?: string;
  }[];
}

/**
 * CLI options parsed from command line arguments
 */
export interface CliOptions {
  /** Target file or directory */
  target: string;
  
  /** Dry run mode */
  dryRun: boolean;
  
  /** Force regeneration */
  force: boolean;
  
  /** Show help */
  help: boolean;
  
  /** Verbose output */
  verbose: boolean;
  
  /** Maximum concurrent requests */
  concurrency: number;
}

