import { isCancel } from '@clack/core';
import { cancel } from '@clack/prompts';

export function checkCancel(value: unknown): void {
  if (isCancel(value)) {
    doCancel();
  }
}

export function doCancel(message = 'Action cancelled.'): void {
  cancel(message);
  process.exit(0);
}
