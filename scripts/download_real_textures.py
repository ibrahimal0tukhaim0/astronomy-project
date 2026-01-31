import requests
import os

textures = {
    "public/textures/iss_solar.jpg": "https://upload.wikimedia.org/wikipedia/commons/0/04/International_Space_Station_solar_array_pair.jpg",
    "public/textures/iss_thermal.jpg": "https://upload.wikimedia.org/wikipedia/commons/f/ff/Multi-layer_insulation_close-up.jpg",
    "public/textures/iss_radiator.jpg": "https://upload.wikimedia.org/wikipedia/commons/0/0d/ISS_Main_Radiators.jpg"
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
}

for path, url in textures.items():
    try:
        print(f"Downloading {url} to {path}...")
        response = requests.get(url, headers=headers, allow_redirects=True)
        if response.status_code == 200:
            with open(path, 'wb') as f:
                f.write(response.content)
            print(f"Success! Size: {len(response.content)} bytes")
        else:
            print(f"Failed with status: {response.status_code}")
    except Exception as e:
        print(f"Error: {e}")
