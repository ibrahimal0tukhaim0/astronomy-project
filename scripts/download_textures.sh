#!/bin/bash

# Directory for textures
TEXTURE_DIR="public/textures/asteroids"
mkdir -p "$TEXTURE_DIR"

echo "📂 Created directory: $TEXTURE_DIR"

# Base URLs
CELESTIA_BASE="https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures"
RSS_EXPANSION_BASE="https://raw.githubusercontent.com/zilti/RSSExpansion/master/RSSExpansionTextures/PluginData"

# Function to download with fallback
download_texture() {
    local name=$1
    local url=$2
    local fallback_url=$3
    local output="$TEXTURE_DIR/$name.jpg"

    echo "⬇️  Downloading $name..."
    curl -s -f -L "$url" -o "$output"

    if [ $? -eq 0 ]; then
        echo "✅ Successfully downloaded $name"
    else
        echo "⚠️  Failed to download $name from primary source."
        if [ -n "$fallback_url" ]; then
            echo "🔄 Trying fallback source..."
            curl -s -f -L "$fallback_url" -o "$output"
            if [ $? -eq 0 ]; then
                echo "✅ Successfully downloaded $name from fallback"
            else
                echo "❌ Failed to download $name from fallback."
                # Create a placeholder if both fail? No, let's just warn for now.
            fi
        else
             echo "❌ No fallback provided for $name."
        fi
    fi
}

# 1. Ceres (Celestia Hires)
download_texture "ceres" "$CELESTIA_BASE/hires/ceres.jpg" ""

# 2. Vesta (Celestia Hires)
download_texture "vesta" "$CELESTIA_BASE/hires/vesta.jpg" ""

# 3. Eros (Celestia Hires)
download_texture "eros" "$CELESTIA_BASE/hires/eros.jpg" ""

# 4. Ida (Celestia Medres)
download_texture "ida" "$CELESTIA_BASE/medres/ida.jpg" ""

# 5. Gaspra (Celestia Medres)
download_texture "gaspra" "$CELESTIA_BASE/medres/gaspra.jpg" ""

# 6. Bennu (Celestia Hires)
download_texture "bennu" "$CELESTIA_BASE/hires/bennu.jpg" "$CELESTIA_BASE/lores/bennu.jpg"

# 7. Ryugu (Celestia Lores)
download_texture "ryugu" "$CELESTIA_BASE/lores/ryugu.jpg" ""

# 8. Halley (Generic Asteroid from Hires as fallback)
download_texture "halley" "$CELESTIA_BASE/hires/asteroid.jpg" ""

# 9. Pallas (Generic Asteroid from Hires as fallback)
download_texture "pallas" "$CELESTIA_BASE/hires/asteroid.jpg" ""

# 10. Juno (Generic Asteroid from Hires as fallback)
download_texture "juno" "$CELESTIA_BASE/hires/asteroid.jpg" ""

echo "🎉 Texture download process complete."
