import { text } from '@clack/prompts';
import { existsSync } from 'fs';
import { join } from 'path';
import { coerce, integer, minValue, number, safeParse } from 'valibot';
import { DEFAULT_FOLDER_NAME } from '../models/lib.model';
import { checkCancel, doCancel } from './menu-misc';

export async function menuInputFolderName(): Promise<string> {
  let needExtraCheckingForDefaultValue = false;

  const folderNameInput: string | symbol = await text({
    message: `Name of the folder where the task will be performed (default: ${DEFAULT_FOLDER_NAME})`,
    placeholder: `${DEFAULT_FOLDER_NAME}`,
    defaultValue: DEFAULT_FOLDER_NAME,
    validate(input: string): string | void {
      if (!input) {
        needExtraCheckingForDefaultValue = true;

        return;
      }

      if (!existsSync(join(process.cwd(), input))) {
        return 'The folder does not exist';
      }
    },
  });

  checkCancel(folderNameInput);

  console.log(folderNameInput);

  // Need to test outside of the 'validate' function as the 'defaultValue'
  // seems to be an empty string in the 'validate' function if no value were supplied
  // TODO: create an issue about solving this problem (https://github.com/natemoo-re/clack/issues)
  if (needExtraCheckingForDefaultValue) {
    if (!existsSync(join(process.cwd(), folderNameInput as string))) {
      doCancel('The folder does not exist.');
    }
  }

  return folderNameInput as string;
}

export async function menuInputNumber(): Promise<number> {
  const inputNumberSchema = coerce(number([integer(), minValue(1)]), Number);
  let inputNumberResult = 0;

  const inputNumber: string | symbol = await text({
    message: 'Enter the number (0 < value < Infinity)',
    validate(input: string): string | void {
      const inputNumberValidation = safeParse(inputNumberSchema, input);

      if (!inputNumberValidation.success) {
        return inputNumberValidation.issues.map((issue) => issue.message).join(', ');
      }

      inputNumberResult = inputNumberValidation.output;
    },
  });

  checkCancel(inputNumber);

  return inputNumberResult;
}
