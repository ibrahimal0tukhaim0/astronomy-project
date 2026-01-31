
import os
import sys
from PIL import Image, ImageDraw, ImageFont
import arabic_reshaper
from bidi.algorithm import get_display

def watermark_image(input_path, output_path, text):
    try:
        # Load image
        img = Image.open(input_path).convert("RGB")
        width, height = img.size
        draw = ImageDraw.Draw(img)
        
        # Configure font
        font_paths = [
            "/System/Library/Fonts/Supplemental/Arial.ttf",
            "/Library/Fonts/Arial.ttf",
            "/System/Library/Fonts/GeezaPro.ttc"
        ]
        
        font_size = int(height * 0.03) # 3% of height
        if font_size < 12: font_size = 12
        
        font = None
        for path in font_paths:
            if os.path.exists(path):
                try:
                    font = ImageFont.truetype(path, font_size)
                    break
                except:
                    continue
        
        if not font:
            font = ImageFont.load_default()
        
        # Reshape and reorder Arabic text
        reshaped_text = arabic_reshaper.reshape(text)
        bidi_text = get_display(reshaped_text)
        
        # Positioning (Bottom Left)
        bbox = draw.textbbox((0, 0), bidi_text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        margin = int(width * 0.02)
        position = (margin, height - text_height - margin - 5)
        
        # Draw background shadow for readability
        shadow_margin = 2
        draw.text((position[0]+shadow_margin, position[1]+shadow_margin), bidi_text, font=font, fill=(0,0,0,128))
        
        # Draw text
        draw.text(position, bidi_text, font=font, fill=(255, 255, 255, 200))
        
        # 1. Save as the main background asset
        img.save("src/assets/app_logo_bg.jpg", "JPEG", quality=95)
        
        # 2. Save high-res version to public for social sharing
        img.save("public/logo_final.jpg", "JPEG", quality=95)
        
        # 3. Generate Favicons/Icons
        img.resize((32, 32), Image.Resampling.LANCZOS).save("public/favicon.ico", format="ICO")
        img.resize((180, 180), Image.Resampling.LANCZOS).save("public/apple-touch-icon.png", "PNG")
        img.resize((192, 192), Image.Resampling.LANCZOS).save("public/logo192.png", "PNG")
        img.resize((1200, 630), Image.Resampling.LANCZOS).save("public/og-image.jpg", "JPEG", quality=90)
        
        print("Success: All assets updated with new image.")
        
    except Exception as e:
        print(f"Error processing image: {e}")
        sys.exit(1)

if __name__ == "__main__":
    watermark_image(
        "/Users/ibrahimaltukhaim/.gemini/antigravity/brain/a908bec9-07ab-4fd1-a94c-7abe7fadf0cf/uploaded_media_1769812832964.jpg",
        "src/assets/app_logo_bg.jpg",
        "جميع الحقوق محفوظة © 2026 تطبيق فلك وآية"
    )
