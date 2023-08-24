import { existsSync, mkdirSync } from 'fs';
import { dirname, join, parse, type ParsedPath } from 'path';
import sharp, { Sharp } from 'sharp';
import { DEFAULT_MAX_WIDTH_TRESHOLD, type ImageOptimizeOptions } from '../models/lib.model';
import { optimizeForExtension, resizeImage, toFile } from './utils/image.utils';

export async function optimizeImage(options: ImageOptimizeOptions): Promise<boolean> {
  const pathToImageFolder: string = dirname(options.pathToImage);

  // If we're already in an the output folder, do nothing
  // Probably better to do that in the glob pattern
  if (pathToImageFolder.includes(options.outputFolderName)) {
    return false;
  }

  const outputFolderPath: string = join(pathToImageFolder, options.outputFolderName);

  // If the output folder does not exist, create it
  if (!existsSync(outputFolderPath)) {
    mkdirSync(outputFolderPath);
  }

  const parsedPathToImage: ParsedPath = parse(options.pathToImage);
  const outputImagePath: string = join(outputFolderPath, parsedPathToImage.base);

  // If the file already exist, do nothing
  if (existsSync(outputImagePath)) {
    return false;
  }

  const imageExtension: string = parsedPathToImage.ext;
  let imageSharpInstance: Sharp = sharp(options.pathToImage);
  const imageWidthValue: number | undefined = (await imageSharpInstance.metadata()).width;
  let optimizedWidth: number | undefined = options.maxWidth;

  // If the max width is higher than the actual image width, then let's just keep the
  // actual image width for the optimization, this way we get a higher quality
  // For example:
  // - max width = 1920
  // - actual image width = 600
  // - we keep 600 and then get a quality according to this width which is higher than if we took 1920
  // ------
  // - max width = 500
  // - actual image width = 3000
  // - we keep 500, we will resize a lot the image, so let's keep a better quality
  if (imageWidthValue && (options.maxWidth ?? DEFAULT_MAX_WIDTH_TRESHOLD) >= imageWidthValue) {
    optimizedWidth = imageWidthValue;
  }

  imageSharpInstance = optimizeForExtension(imageSharpInstance, imageExtension, optimizedWidth);

  if (imageWidthValue && imageWidthValue > (options.maxWidth ?? DEFAULT_MAX_WIDTH_TRESHOLD)) {
    imageSharpInstance = resizeImage(imageSharpInstance, options.maxWidth);
  }

  await toFile(imageSharpInstance, outputImagePath, imageExtension).catch(() => false);

  return true;
}
