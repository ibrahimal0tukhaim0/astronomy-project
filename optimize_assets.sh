#!/bin/bash
cd public/textures/asteroids || exit

echo "Starting optimization..."

# Resize JPGs to 1024x1024
for f in *.jpg; do
    if [ -f "$f" ]; then
        echo "Optimizing $f..."
        # Resize to 1024 max dimension, keep aspect ratio? Or force square? 
        # User said "1024x1024". Most maps are square 2:1 usually for equirectangular.
        # NASA textures are usually 2:1 (e.g. 4096x2048).
        # If I force 1024x1024 it might stretch.
        # Better: Resample to width 1024.
        
        # Check dimensions first? No, just force strict resize or aspect fit?
        # User said "1024x1024". I'll assume they want max dimension 1024.
        # sips --resampleWidth 1024 maintains aspect ratio. Better.
        
        sips --resampleWidth 1024 "$f" --out "temp_$f"
        mv "temp_$f" "$f"
    fi
done

# Do same for PNGs if any (except special ones? Asteroids dir usually just rocks)
for f in *.png; do
    if [ -f "$f" ]; then
         echo "Optimizing $f..."
         sips --resampleWidth 1024 "$f" --out "temp_$f"
         mv "temp_$f" "$f"
    fi
done

echo "Optimization complete."
