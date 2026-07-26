import os
import glob
from PIL import Image

uploads_dir = os.path.join(os.cwd() if hasattr(os, 'cwd') else os.getcwd(), 'public', 'uploads')
os.makedirs(uploads_dir, exist_ok=True)

brain_dir = r'C:\Users\zizo-\.gemini\antigravity\brain\88a88524-2feb-428f-adf9-abab67861dd8'

# Helper to find latest png by keyword and convert to jpg
def convert_to_jpg(keyword, out_name):
    pattern = os.path.join(brain_dir, f"{keyword}*.png")
    matches = glob.glob(pattern)
    if matches:
        latest = max(matches, key=os.path.getmtime)
        out_path = os.path.join(uploads_dir, f"{out_name}.jpg")
        img = Image.open(latest).convert('RGB')
        img.save(out_path, 'JPEG', quality=95)
        print(f"✅ Converted {latest} -> {out_path}")
        return f"/uploads/{out_name}.jpg"
    print(f"⚠️ No match for {keyword}")
    return None

p1_jpg = convert_to_jpg('loose_eyeshadow_main', 'loose-eyeshadow-edited')
p1_lux = convert_to_jpg('loose_eyeshadow_luxury', 'loose-eyeshadow-luxury-edited')

p2_jpg = convert_to_jpg('mayar_spray_main', 'mayar-spray-edited')
p2_lux = convert_to_jpg('mayar_spray_luxury', 'mayar-spray-luxury-edited')

p3_jpg = convert_to_jpg('neutrogena_toner_main', 'neutrogena-toner-edited')

p4_jpg = convert_to_jpg('bioderma_sensibio_main', 'bioderma-sensibio-edited')
p4_lux = convert_to_jpg('bioderma_sensibio_luxury', 'bioderma-sensibio-luxury-edited')

print("All conversions complete!")
