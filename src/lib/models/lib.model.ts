type ObjectValues<T> = T[keyof T];

export const ACTION = {
  CONVERT_IMAGE: 'CONVERT_IMAGE',
  OPTIMIZE_IMAGE: 'OPTIMIZE_IMAGE',
} as const;

export type Action = ObjectValues<typeof ACTION>;

export const WIDTH_THRESHOLD = {
  CUSTOM: -1,
  WIDTH_720: 720, // 720x480
  WIDTH_1280: 1280, // 1280x720
  WIDTH_1920: 1920, // 1920x1080
  WIDTH_2560: 2560, // 2560x1440
} as const;

export type WidthThreshold = ObjectValues<typeof WIDTH_THRESHOLD>;

// Add more value for fine grained quality control
// >= min && < max
export const JPG_QUALITY_CONTROL = {
  QUALITY_88: { min: 1, max: 720, quality: 88 },
  QUALITY_80: { min: 720, max: 1280, quality: 80 },
  QUALITY_72: { min: 1280, max: 1920, quality: 72 },
  QUALITY_64: { min: 1920, max: Infinity, quality: 64 },
} as const;

export type JpgQualityControl = ObjectValues<typeof JPG_QUALITY_CONTROL>;

export const CONVERT_FROM_EXTENSION = {
  JPG_JPEG: 'jpg, jpeg',
  PNG: 'png',
} as const;

export type ConvertFromExtension = ObjectValues<typeof CONVERT_FROM_EXTENSION>;

export const CONVERT_TO_EXTENSION = {
  WEBP: 'webp',
} as const;

export type ConvertToExtension = ObjectValues<typeof CONVERT_TO_EXTENSION>;

type PathToImage = {
  pathToImage: string;
};

export type ImageOptimizeOptions = PathToImage & {
  outputFolderName: string;
  maxWidth?: number;
};

export const DEFAULT_FOLDER_NAME = 'images';
export const OPTIMIZED_FOLDER_NAME = 'optimized';
export const DEFAULT_MAX_WIDTH_TRESHOLD: WidthThreshold = WIDTH_THRESHOLD.WIDTH_1920;
export const CUSTOM_MAX_WIDTH_TRESHOLD: WidthThreshold = WIDTH_THRESHOLD.CUSTOM;
export const DEFAULT_JPG_QUALITY_CONTROL: JpgQualityControl = JPG_QUALITY_CONTROL.QUALITY_88;
export const DEFAULT_CONVERT_FROM_EXTENSION: ConvertFromExtension = CONVERT_FROM_EXTENSION.JPG_JPEG;
export const DEFAULT_CONVERT_TO_EXTENSION: ConvertToExtension = CONVERT_TO_EXTENSION.WEBP;
export const CONCURRENT_IMAGE_PROCESSING_NUMBER = 4;
