import { globSync } from 'glob';
import { posix, win32 } from 'path';

const winSeparatorRegex = new RegExp(`\\${win32.sep}`, 'g');

export function getImagePaths(folderName: string, extensions: string[] = ['jpg', 'jpeg', 'png']): string[] {
  if (!extensions.length) {
    return [];
  }

  try {
    const extensionPattern = extensions.length > 1 ? `{${extensions.join()}}` : extensions[0];
    return globSync(`${folderName}/**/*.${extensionPattern}`.replace(winSeparatorRegex, posix.sep));
  } catch (e) {
    console.error(e);
    process.exit(0);
  }
}
