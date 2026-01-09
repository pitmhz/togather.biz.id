/**
 * ============================================
 * TOGATHER IMAGE UTILITIES
 * Blur Placeholder & Optimization Helpers
 * ============================================
 */

/**
 * Default blur data URL for image placeholders
 * A neutral gray blur that works with any image color
 */
export const DEFAULT_BLUR_DATA_URL =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+OhRPQAI+QN5c9qkVwAAAABJRU5ErkJggg==';

/**
 * Generate a colored blur placeholder
 * Creates a 1x1 pixel blur with the specified color
 * 
 * @param hexColor - Hex color code (e.g., '#6366f1')
 * @returns Base64 encoded blur data URL
 */
export function generateBlurPlaceholder(hexColor: string = '#e2e8f0'): string {
    // Convert hex to RGB
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Create SVG blur
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1">
      <rect width="1" height="1" fill="rgb(${r},${g},${b})"/>
    </svg>
  `.trim();

    // Base64 encode
    const base64 = Buffer.from(svg).toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Supabase Storage URL helper
 * Constructs the full URL for images stored in Supabase Storage
 * 
 * @param bucket - Storage bucket name
 * @param path - Path to the file within the bucket
 * @returns Full URL to the image
 */
export function getSupabaseStorageUrl(bucket: string, path: string): string {
    const projectId = 'hhbcqgxixntpdwlzpclr';
    return `https://${projectId}.supabase.co/storage/v1/object/public/${bucket}/${path}`;
}

/**
 * Image dimension presets for consistent sizing
 */
export const IMAGE_PRESETS = {
    // Hero sections
    hero: {
        width: 1920,
        height: 1080,
        aspectRatio: '16/9',
    },
    // News/blog cover images
    cover: {
        width: 1200,
        height: 630,
        aspectRatio: '1200/630',
    },
    // Card thumbnails
    thumbnail: {
        width: 400,
        height: 300,
        aspectRatio: '4/3',
    },
    // Avatar/profile images
    avatar: {
        width: 128,
        height: 128,
        aspectRatio: '1/1',
    },
    // Logo/icon
    icon: {
        width: 64,
        height: 64,
        aspectRatio: '1/1',
    },
} as const;

export type ImagePreset = keyof typeof IMAGE_PRESETS;

/**
 * Get optimized image props for Next.js Image component
 * 
 * @param src - Image source URL
 * @param preset - Image preset to use
 * @returns Props for Next.js Image component
 */
export function getOptimizedImageProps(
    src: string,
    preset: ImagePreset = 'thumbnail'
) {
    const config = IMAGE_PRESETS[preset];

    return {
        src,
        width: config.width,
        height: config.height,
        placeholder: 'blur' as const,
        blurDataURL: DEFAULT_BLUR_DATA_URL,
        style: {
            aspectRatio: config.aspectRatio,
            objectFit: 'cover' as const,
        },
    };
}
