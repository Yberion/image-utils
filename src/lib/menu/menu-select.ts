import { select } from '@clack/prompts';
import {
  ACTION,
  CONVERT_FROM_EXTENSION,
  CONVERT_TO_EXTENSION,
  CUSTOM_MAX_WIDTH_TRESHOLD,
  ConvertFromExtension,
  DEFAULT_CONVERT_FROM_EXTENSION,
  DEFAULT_CONVERT_TO_EXTENSION,
  DEFAULT_MAX_WIDTH_TRESHOLD,
  WIDTH_THRESHOLD,
  type Action,
  type ConvertToExtension,
  type WidthThreshold,
} from '../models/lib.model';
import { menuInputNumber } from './menu-input';
import { checkCancel } from './menu-misc';

export async function menuSelectAction(): Promise<Action> {
  const action: Action | symbol = await select({
    message: 'What action would you like to take?',
    options: [
      {
        value: ACTION.CONVERT_IMAGE,
        label: 'Convert image(s)',
        hint: 'It will optimize the original image(s) and create the associated converted image(s) with the provided dimension(s)',
      },
      { value: ACTION.OPTIMIZE_IMAGE, label: 'Optimize image(s)', hint: 'Optimize quality, size & metadatas' },
    ],
  });

  checkCancel(action);

  return action as Action;
}

export async function menuSelectMaxWidth(): Promise<number> {
  let maxWidth: number | symbol = await select({
    message: `Select the max width of the optimized image(s) (default: ${DEFAULT_MAX_WIDTH_TRESHOLD})`,
    initialValue: DEFAULT_MAX_WIDTH_TRESHOLD,
    options: Object.values(WIDTH_THRESHOLD).map((widthValue: WidthThreshold) => {
      if (widthValue === CUSTOM_MAX_WIDTH_TRESHOLD) {
        return { label: 'Custom max width', value: widthValue };
      }

      if (widthValue === DEFAULT_MAX_WIDTH_TRESHOLD) {
        return { value: widthValue, hint: 'default' };
      }

      return { value: widthValue };
    }),
  });

  checkCancel(maxWidth);

  // Custom width
  if ((maxWidth as number) === CUSTOM_MAX_WIDTH_TRESHOLD) {
    maxWidth = await menuInputNumber();
  }

  return maxWidth as number;
}

// I might probably change this to a 'multiselect' in the futur
export async function menuSelectConvertFrom(): Promise<ConvertFromExtension> {
  const fromExtension: ConvertFromExtension | symbol = await select({
    message: `Convert from (default: ${DEFAULT_CONVERT_FROM_EXTENSION})`,
    initialValue: DEFAULT_CONVERT_FROM_EXTENSION,
    options: Object.values(CONVERT_FROM_EXTENSION).map((convertFromExtension: ConvertFromExtension) => {
      if (convertFromExtension === DEFAULT_CONVERT_FROM_EXTENSION) {
        return { value: convertFromExtension, hint: 'default' };
      }

      return { value: convertFromExtension };
    }),
  });

  checkCancel(fromExtension);

  return fromExtension as ConvertFromExtension;
}

export async function menuSelectConvertTo(): Promise<ConvertToExtension> {
  const toExtension: ConvertToExtension | symbol = await select({
    message: `Convert to (default: ${DEFAULT_CONVERT_TO_EXTENSION})`,
    initialValue: DEFAULT_CONVERT_TO_EXTENSION,
    options: Object.values(CONVERT_TO_EXTENSION).map((convertToExtension: ConvertToExtension) => {
      if (convertToExtension === DEFAULT_CONVERT_TO_EXTENSION) {
        return { value: convertToExtension, hint: 'default' };
      }

      return { value: convertToExtension };
    }),
  });

  checkCancel(toExtension);

  return toExtension as ConvertToExtension;
}
