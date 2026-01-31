
import sharp from 'sharp';
import path from 'path';

async function cropAndMask() {
    const inputPath = 'public/textures/herbig_haro_bg.jpg';
    const outputPath = 'public/textures/herbig_haro_cropped.webp';

    try {
        const metadata = await sharp(inputPath).metadata();
        const width = metadata.width || 1000;
        const height = metadata.height || 1000;

        // Create a softer, larger radial gradient mask
        // Gradient starts fading at 30% and is completely transparent by 70%
        // This ensures edges are 100% gone and blending is seamless
        const maskSvg = Buffer.from(`
            <svg width="${width}" height="${height}">
                <defs>
                    <radialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" style="stop-color:white;stop-opacity:1" />
                        <stop offset="20%" style="stop-color:white;stop-opacity:0.9" />
                        <stop offset="60%" style="stop-color:black;stop-opacity:0" />
                    </radialGradient>
                </defs>
                <rect x="0" y="0" width="${width}" height="${height}" fill="url(#grad)" />
            </svg>
        `);

        console.log('Processing image with SUPER SOFT mask...');

        await sharp(inputPath)
            .composite([{
                input: maskSvg,
                blend: 'dest-in'
            }])
            .toFormat('webp')
            .toFile(outputPath);

        console.log(`Created soft-cropped texture at: ${outputPath}`);

    } catch (error) {
        console.error('Error processing image:', error);
    }
}

cropAndMask();
