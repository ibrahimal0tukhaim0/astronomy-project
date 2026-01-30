import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const texturesDir = path.join(__dirname, '../public/textures');

async function convertToWebP(dir) {
    const files = await readdir(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const fileStat = await stat(filePath);

        if (fileStat.isDirectory()) {
            await convertToWebP(filePath);
            continue;
        }

        const ext = path.extname(file).toLowerCase();
        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
            const outputPath = filePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');

            try {
                const originalSize = fileStat.size;
                await sharp(filePath)
                    .webp({ quality: 85 })
                    .toFile(outputPath);

                const newStat = await stat(outputPath);
                const savings = ((originalSize - newStat.size) / originalSize * 100).toFixed(1);
                console.log(`✅ ${file} → ${path.basename(outputPath)} (${savings}% smaller)`);
            } catch (err) {
                console.error(`❌ Failed: ${file}`, err.message);
            }
        }
    }
}

console.log('🔄 Converting images to WebP...\n');
convertToWebP(texturesDir).then(() => {
    console.log('\n✨ Conversion complete!');
});
