import { intro, outro, spinner } from '@clack/prompts';
import { PromisePool, type Statistics, type Stoppable, type UsesConcurrency } from '@supercharge/promise-pool';
import {
  ACTION,
  CONCURRENT_IMAGE_PROCESSING_NUMBER,
  OPTIMIZED_FOLDER_NAME,
  type Action,
  type ConvertFromExtension,
  type ConvertToExtension,
} from '../models/lib.model';
import { convertToWebP } from '../processing/convert-image';
import { optimizeImage } from '../processing/optimize-image';
import { getImagePaths } from '../utils/file.utils';
import { menuInputFolderName } from './menu-input';
import { doCancel } from './menu-misc';
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
      doCancel('Could not find this action.');
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
    doCancel();
  }

  converterSpinner.stop('Convertion done!');
}

// --------------------------------------------------------------------------------
// ----------------------------------- OPTIMIZE -----------------------------------
// --------------------------------------------------------------------------------

async function actionOptimizeImage(selectedFolderName: string): Promise<void> {
  const imagePaths: string[] = getImagePaths(selectedFolderName);
  const optimizationMaxWidth: number = await menuSelectMaxWidth();

  const optimizationSpinner = spinner();
  optimizationSpinner.start('Optimizing image(s)');

  const startHrTime = process.hrtime();
  try {
    await PromisePool.for(imagePaths)
      .withConcurrency(CONCURRENT_IMAGE_PROCESSING_NUMBER)
      .onTaskFinished((_item: string, pool: Stoppable & Statistics<string> & UsesConcurrency) => {
        optimizationSpinner.message(
          `Optimizing image(s) : ${pool.processedCount()}/${imagePaths.length} in ${elapsedHrTime(startHrTime)} second(s) - ${Math.round(
            pool.processedPercentage()
          )}%`
        );
      })
      .process(async (imagePath: string) => {
        return await optimizeImage({ pathToImage: imagePath, outputFolderName: OPTIMIZED_FOLDER_NAME, maxWidth: optimizationMaxWidth });
      });
  } catch (e) {
    console.error(e);
    doCancel();
  }

  optimizationSpinner.stop(`${imagePaths.length} image(s) optimized in ${elapsedHrTime(startHrTime)} second(s)`);
}

function elapsedHrTime(startHrTime: [number, number]): string {
  return (process.hrtime(startHrTime)[0] + process.hrtime(startHrTime)[1] / 1e9).toFixed(3);
}
