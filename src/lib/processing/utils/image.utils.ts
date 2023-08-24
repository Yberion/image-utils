import { OutputInfo, Sharp } from 'sharp';
import { DEFAULT_JPG_QUALITY_CONTROL, DEFAULT_MAX_WIDTH_TRESHOLD, JPG_QUALITY_CONTROL, type JpgQualityControl } from '../../models/lib.model';

export function optimizeForExtension(imageSharpInstance: Sharp, extension: string, imageWidth?: number): Sharp {
  switch (extension) {
    case '.jpeg':
    case '.jpg': {
      imageSharpInstance = optimizeForJpg(imageSharpInstance, getJpgQuality(imageWidth));

      break;
    }
    case '.png': {
      imageSharpInstance = optimizeForPng(imageSharpInstance);

      break;
    }
  }

  return imageSharpInstance;
}

export function resizeImage(imageSharpInstance: Sharp, width?: number): Sharp {
  return imageSharpInstance.resize(width ?? DEFAULT_MAX_WIDTH_TRESHOLD);
}

export function toFile(imageSharpInstance: Sharp, path: string, extension?: string): Promise<OutputInfo> {
  if (extension && (extension === '.jpg' || extension === '.jpeg')) {
    imageSharpInstance = imageSharpInstance.flatten({ background: { r: 255, g: 255, b: 255 } });
  }

  return imageSharpInstance.toFile(path);
}

function getJpgQuality(width?: number): number {
  if (!width) {
    return DEFAULT_JPG_QUALITY_CONTROL.quality;
  }

  let qualityControl: JpgQualityControl = DEFAULT_JPG_QUALITY_CONTROL;

  const foundQualityControl: JpgQualityControl | undefined = Object.values(JPG_QUALITY_CONTROL).find(
    (val: JpgQualityControl) => width >= val.min && width < val.max
  );

  if (foundQualityControl) {
    qualityControl = foundQualityControl;
  }

  return qualityControl.quality;
}

function optimizeForJpg(imageSharpInstance: Sharp, quality?: number): Sharp {
  return imageSharpInstance.toFormat('jpg', {
    quality: quality ?? DEFAULT_JPG_QUALITY_CONTROL.quality,
    trellisQuantisation: true,
    optimiseScans: true,
  });
}

function optimizeForPng(imageSharpInstance: Sharp): Sharp {
  return imageSharpInstance.toFormat('png', {
    quality: 10,
    effort: 9,
  });
}
