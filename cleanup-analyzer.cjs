const fs = require('fs');
const path = require('path');

console.log('🔍 DEEP PROJECT ANALYSIS\n');
console.log('═'.repeat(60));

// Scan all source files
const sourceFiles = [];
const codePatterns = {
    images: new Set(),
    videos: new Set(),
    fonts: new Set(),
    json: new Set(),
    css: new Set(),
    textures: new Set()
};

function scanDirectory(dir, excludes = ['node_modules', 'dist', 'build', '.git']) {
    try {
        if (!fs.existsSync(dir)) return;
        const items = fs.readdirSync(dir);
        items.forEach(item => {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                if (!excludes.includes(item)) {
                    scanDirectory(fullPath, excludes);
                }
            } else if (/\.(js|jsx|ts|tsx|html|css|scss)$/.test(item)) {
                sourceFiles.push(fullPath);
            }
        });
    } catch (e) {
        console.error(`Error scanning ${dir}:`, e.message);
    }
}

console.log('📂 Scanning source files...');
scanDirectory('./src');
scanDirectory('./public');

console.log(`✅ Found ${sourceFiles.length} source files\n`);

// Extract all asset references
console.log('🔎 Extracting asset references...\n');

sourceFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');

    // Images/Textures
    const imgMatches = content.matchAll(/['"`]([^'"`]*?\.(jpg|jpeg|png|gif|webp|svg|ico))['"`]/gi);
    for (const match of imgMatches) {
        codePatterns.images.add(path.basename(match[1]));
        codePatterns.textures.add(path.basename(match[1])); // Treat same
    }

    // Videos
    const vidMatches = content.matchAll(/['"`]([^'"`]*?\.(mp4|webm|mov|avi))['"`]/gi);
    for (const match of vidMatches) {
        codePatterns.videos.add(path.basename(match[1]));
    }
});

// Check actual files in directories
const assetDirs = {
    textures: './public/textures',
    videos: './public/videos'
};

const unusedFiles = {
    textures: [],
    videos: []
};

console.log('📊 ANALYSIS RESULTS:\n');
console.log('═'.repeat(60));

Object.entries(assetDirs).forEach(([type, dir]) => {
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);

        // Check against relevant sets
        let relevantSet = type === 'videos' ? codePatterns.videos : codePatterns.images;

        console.log(`\n${type.toUpperCase()}:`);

        files.forEach(file => {
            if (file.startsWith('.')) return;

            // Smart check: exact match OR contained in string (for dynamic loading)
            const isUsed = relevantSet.has(file);

            if (!isUsed) {
                const ext = path.extname(file).toLowerCase();
                const filePath = path.join(dir, file);
                const stats = fs.statSync(filePath);
                const sizeMB = (stats.size / 1048576).toFixed(2);

                // Final safety check: Grep the filename in all source code
                // This is slow but safe
                let foundInSource = false;
                for (const srcFile of sourceFiles) {
                    const content = fs.readFileSync(srcFile, 'utf8');
                    if (content.includes(file)) {
                        foundInSource = true;
                        break;
                    }
                }

                if (!foundInSource) {
                    unusedFiles[type].push({ file, path: filePath, size: sizeMB });
                    console.log(`  ❌ UNUSED: ${file} (${sizeMB} MB)`);
                } else {
                    // console.log(`  ✅ USED (Text Match): ${file}`);
                }
            }
        });
    }
});

// Calculate total waste
let totalWaste = 0;
let totalUnused = 0;

Object.values(unusedFiles).forEach(arr => {
    arr.forEach(item => {
        totalWaste += parseFloat(item.size);
        totalUnused++;
    });
});

console.log('\n' + '═'.repeat(60));
console.log('📈 SUMMARY:');
console.log(`  Total unused files: ${totalUnused}`);
console.log(`  Total wasted space: ${totalWaste.toFixed(2)} MB`);
console.log('═'.repeat(60));
