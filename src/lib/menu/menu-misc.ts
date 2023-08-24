import { isCancel } from '@clack/core';
import { cancel } from '@clack/prompts';

export function checkCancel(value: unknown): void {
  if (isCancel(value)) {
    cancel('Action cancelled.');
    process.exit(0);
  }
}
