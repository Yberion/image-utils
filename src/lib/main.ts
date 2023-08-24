import { menu } from './menu/menu';

export async function main(): Promise<void> {
  await menu().catch(console.error);
}
