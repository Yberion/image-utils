import { cancel, intro, outro, spinner } from '@clack/prompts';
import { PromisePool } from '@supercharge/promise-pool';
import {
  ACTION,
  CONCURRENT_IMAGE_PROCESSING_NUMBER,
  ConvertFromExtension,
  OPTIMIZED_FOLDER_NAME,
  type Action,
  type ConvertToExtension,
} from '../models/lib.model';
import { convertToWebP } from '../processing/convert-image';
import { optimizeImage } from '../processing/optimize-image';
import { getImagePaths } from '../utils/file.utils';
import { menuInputFolderName } from './menu-input';
import { menuSelectAction, menuSelectConvertFrom, menuSelectConvertTo, menuSelectMaxWidth } from './menu-select';

export async function menu(): Promise<void> {
  intro('Image Utilities');

  const action: Action = await menuSelectAction();
  const selectedFolderName: string = await menuInputFolderName();

  await processAction(action, selectedFolderName);

  outro('All done!');
}

// -------------------------------------------------------------------------------
// ----------------------------------- ACTIONS -----------------------------------
// -------------------------------------------------------------------------------

async function processAction(action: Action, selectedFolderName: string): Promise<void> {
  switch (action) {
    case ACTION.CONVERT_IMAGE: {
      await actionConvertImage(selectedFolderName);

      break;
    }
    case ACTION.OPTIMIZE_IMAGE: {
      await actionOptimizeImage(selectedFolderName);

      break;
    }
    default:
      // Just in case
      cancel(`Couldn't find this action.`);
      process.exit(0);
  }
}

// -------------------------------------------------------------------------------
// ----------------------------------- CONVERT -----------------------------------
// -------------------------------------------------------------------------------

async function actionConvertImage(selectedFolderName: string): Promise<void> {
  const fromExtension: ConvertFromExtension = await menuSelectConvertFrom();
  const toExtension: ConvertToExtension = await menuSelectConvertTo();
  console.log(fromExtension);
  console.log(toExtension);
  const imagePaths: string[] = getImagePaths(selectedFolderName);
  const converterSpinner = spinner();
  converterSpinner.start('Converting image(s)');

  try {
    for (const filePath of imagePaths) {
      await convertToWebP(filePath);
    }
  } catch (e) {
    console.error(e);
    cancel();
    process.exit(0);
  }

  converterSpinner.stop('Convertion done!');
}

// --------------------------------------------------------------------------------
// ----------------------------------- OPTIMIZE -----------------------------------
// --------------------------------------------------------------------------------

async function actionOptimizeImage(selectedFolderName: string): Promise<void> {
  const imagePaths: string[] = getImagePaths(selectedFolderName);
  const optimizationMaxWidth: number = await menuSelectMaxWidth();

  let optimizedImageCounter = 0;
  const optimizationSpinner = spinner();
  optimizationSpinner.start('Optimizing image(s)');

  try {
    const { results } = await PromisePool.for(imagePaths)
      .withConcurrency(CONCURRENT_IMAGE_PROCESSING_NUMBER)
      .process(async (imagePath: string) => {
        return await optimizeImage({ pathToImage: imagePath, outputFolderName: OPTIMIZED_FOLDER_NAME, maxWidth: optimizationMaxWidth });
      });

    optimizedImageCounter = results.filter((value) => value).length;
  } catch (e) {
    console.error(e);
    cancel();
    process.exit(0);
  }

  optimizationSpinner.stop(`${optimizedImageCounter} image(s) optimized`);
}
