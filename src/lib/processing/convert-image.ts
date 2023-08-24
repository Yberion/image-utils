import sharp from 'sharp';

export async function convertToWebP(_folderName: string): Promise<void> {
  await sharp('images/b2_opti.jpg').resize(600).toFormat('jpg', {}).toFile('images/b22_opti.jpg');
}
