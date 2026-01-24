import os
import urllib.request
import ssl
import time

# Ensure directory exists
output_dir = "public/textures"

# Context to ignore SSL errors
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Mixed reliable sources
textures = {
    # Earth (Three-Globe - Reliable)
    "earth_daymap.jpg": "https://raw.githubusercontent.com/vasturiano/three-globe/master/example/img/earth-day.jpg",
    "earth_clouds.jpg": "https://raw.githubusercontent.com/vasturiano/three-globe/master/example/img/earth-clouds.png", # It is PNG there
    "earth_specular.jpg": "https://raw.githubusercontent.com/vasturiano/three-globe/master/example/img/earth-topology.png", # Topology as specular proxy? maybe. Or just skip.
    
    # Moon (Wikimedia Full Res - Retry)
    "moon.jpg": "https://upload.wikimedia.org/wikipedia/commons/d/db/Moonmap_from_clemine_spacecraft.jpg",
    
    # Mars (Wikimedia Full Res - Retry)
    "mars.jpg": "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg",
    
    # Saturn Ring (Wikimedia - Retry)
    "saturn_ring.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Saturn_Rings_Side_View.png/800px-Saturn_Rings_Side_View.png",
    
    # Pluto (Wikimedia - Retry)
    "pluto.jpg": "https://upload.wikimedia.org/wikipedia/commons/e/ef/Pluto_in_True_Color_-_High-Res.jpg"
}

print(f"Downloading {len(textures)} textures to {output_dir}...")

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

for filename, url in textures.items():
    filepath = os.path.join(output_dir, filename)
    if os.path.exists(filepath) and os.path.getsize(filepath) > 0:
        print(f"Skipping {filename} (already exists)")
        continue
        
    print(f"Downloading {filename}...")
    try:
        time.sleep(2) # Short delay
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=30) as response, open(filepath, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        print(f"✓ Saved {filename}")
    except Exception as e:
        print(f"✗ Failed to download {filename}: {e}")

print("Final download run complete.")
