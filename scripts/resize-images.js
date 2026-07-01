const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const TARGET_WIDTH = 800;
const TARGET_HEIGHT = 1067;

async function processImage(inputPath) {
  try {
    const metadata = await sharp(inputPath).metadata();
    const tmpPath = inputPath + '.tmp';

    await sharp(inputPath)
      .resize(TARGET_WIDTH, TARGET_HEIGHT, {
        fit: 'contain',
        background: { r: 245, g: 245, b: 245, alpha: 1 }
      })
      .png()
      .toFile(tmpPath);

    fs.renameSync(tmpPath, inputPath);
    console.log(`✓ ${path.basename(inputPath)} (${metadata.width}x${metadata.height} -> ${TARGET_WIDTH}x${TARGET_HEIGHT})`);
  } catch (error) {
    console.error(`✗ ${path.basename(inputPath)}: ${error.message}`);
  }
}

async function main() {
  const productsDir = path.join(__dirname, '../public/products');
  const folders = fs.readdirSync(productsDir);

  for (const folder of folders) {
    const folderPath = path.join(productsDir, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.png'));
    console.log(`\nProcessing ${folder} (${files.length} files)...`);

    for (const file of files) {
      await processImage(path.join(folderPath, file));
    }
  }

  console.log('\n✅ Done!');
}

main();
