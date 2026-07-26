import os
import glob
from PIL import Image

uploads_dir = r'C:\Users\zizo-\OneDrive\Desktop\alipro\public\uploads'
os.makedirs(uploads_dir, exist_ok=True)

brain_dir = r'C:\Users\zizo-\.gemini\antigravity\brain\88a88524-2feb-428f-adf9-abab67861dd8'
desktop_dir = r'C:\Users\zizo-\OneDrive\Desktop\منتجات'

def convert_png_to_jpg(keyword, out_name):
    pattern = os.path.join(brain_dir, f"{keyword}*.png")
    matches = glob.glob(pattern)
    if matches:
        latest = max(matches, key=os.path.getmtime)
        out_path = os.path.join(uploads_dir, f"{out_name}.jpg")
        img = Image.open(latest).convert('RGB')
        img.save(out_path, 'JPEG', quality=95)
        print(f"✅ Generated AI JPG: {out_name}.jpg")
        return f"/uploads/{out_name}.jpg"
    return None

def convert_orig_to_jpg(orig_name, out_name):
    orig_path = os.path.join(desktop_dir, orig_name)
    if os.path.exists(orig_path):
        out_path = os.path.join(uploads_dir, f"{out_name}.jpg")
        img = Image.open(orig_path).convert('RGB')
        img.save(out_path, 'JPEG', quality=95)
        print(f"✅ Converted Original JPG: {out_name}.jpg")
        return f"/uploads/{out_name}.jpg"
    print(f"⚠️ Original not found: {orig_name}")
    return None

# Convert generated AI images
convert_png_to_jpg('panoxyl_toner_main', 'panoxyl-toner-edited')
convert_png_to_jpg('laroche_mela_b3_main', 'laroche-mela-b3-edited')
convert_png_to_jpg('laroche_micellar_foam', 'laroche-micellar-foam-edited')
convert_png_to_jpg('romantic_rain_mascara', 'romantic-rain-mascara-edited')
convert_png_to_jpg('sheglam_mascara', 'sheglam-mascara-edited')
convert_png_to_jpg('rare_beauty_lipsticks', 'rare-beauty-lipsticks-edited')

# Convert original product images to standard JPGs
convert_orig_to_jpg('WhatsApp Image 2026-07-25 at 3.14.29 PM.jpeg', 'panoxyl-toner-orig')
convert_orig_to_jpg('WhatsApp Image 2026-07-25 at 3.14.53 PM.jpeg', 'laroche-mela-b3-orig')
convert_orig_to_jpg('WhatsApp Image 2026-07-25 at 3.15.23 PM.jpeg', 'laroche-micellar-foam-orig')
convert_orig_to_jpg('WhatsApp Image 2026-07-25 at 3.15.44 PM.jpeg', 'romantic-rain-mascara-orig')
convert_orig_to_jpg('WhatsApp Image 2026-07-25 at 3.16.33 PM.jpeg', 'clean-queen-remover-orig')
convert_orig_to_jpg('WhatsApp Image 2026-07-25 at 3.17.29 PM.jpeg', 'nail-file-orig')
convert_orig_to_jpg('WhatsApp Image 2026-07-25 at 3.18.40 PM.jpeg', 'sheglam-mascara-orig')
convert_orig_to_jpg('WhatsApp Image 2026-07-25 at 3.19.54 PM.jpeg', 'mn-eyebrow-orig')
convert_orig_to_jpg('WhatsApp Image 2026-07-25 at 3.20.46 PM.jpeg', 'romantic-rain-eyeliner-orig')
convert_orig_to_jpg('WhatsApp Image 2026-07-25 at 3.21.04 PM.jpeg', 'sheglam-lipstick-orig')
convert_orig_to_jpg('WhatsApp Image 2026-07-25 at 3.21.29 PM.jpeg', 'rare-beauty-lipsticks-orig')

print("✨ All products images processed and converted to JPG successfully!")
