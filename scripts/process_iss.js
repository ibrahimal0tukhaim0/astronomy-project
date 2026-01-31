
import sharp from 'sharp';

async function processISS() {
    const inputPath = 'public/textures/iss_alpha.png'; // It's actually a JPG renamed
    const outputPath = 'public/textures/iss_transparent.webp';

    try {
        const image = sharp(inputPath);
        const { width, height } = await image.metadata();

        // 1. Create specific alpha mask based on luminance
        // Pixels darker than threshold become transparent
        // We use 'modulate' or raw buffer access? Raw buffer is best for "Magic Wand" effect.

        const data = await image
            .ensureAlpha()
            .raw()
            .toBuffer();

        // Data is [R, G, B, A, R, G, B, A...]
        // We iterate and modify A based on R,G,B
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Simple Threshold: If essentially black, make transparent
            // Space background might not be #000000, usually #050510 etc.
            // Let's set a safe threshold.
            if (r < 40 && g < 40 && b < 40) {
                data[i + 3] = 0; // Transparent
            } else {
                // Keep opaque
                // Optional: remove "halo" by feathering? 
                // For now, hard cut is fine for space assets against space.
                data[i + 3] = 255;
            }
        }

        // Reconstruct and save
        await sharp(data, { raw: { width, height, channels: 4 } })
            .toFormat('webp')
            .toFile(outputPath);

        console.log('Processed ISS texture with transparency');

    } catch (error) {
        console.error('Error processing ISS:', error);
    }
}

processISS();
