#!/usr/bin/env python3
"""
Process wedding invitation assets:
1. Flowers: Remove background using rembg, crop bounding box, save as WebP with alpha.
2. Bride & Groom photos: Optimize size and convert to high quality WebP.
"""
import os
import re
import sys
from pathlib import Path
from PIL import Image
from rembg import remove, new_session

BASE_DIR = Path("/Users/luisalbertosandovalramos/Documents/BodaAK")
OUTPUT_DIR = BASE_DIR / "public" / "images"
FLORES_DIR = Path(os.path.expanduser("~/Downloads/fotos/flores"))
NOVIOS_DIR = Path(os.path.expanduser("~/Downloads/fotos/novios"))

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def process_flores():
    print("--- PROCESANDO FLORES ---")
    session = new_session("u2net")
    
    # Encontrar todas las flores 1 a 16
    files = list(FLORES_DIR.glob("*.jpg")) + list(FLORES_DIR.glob("*.jpeg")) + list(FLORES_DIR.glob("*.png"))
    print(f"Archivos encontrados en flores: {len(files)}")
    
    for f in sorted(files):
        # Extraer el número
        match = re.search(r'flor[-_\s]?(\d+)', f.name, re.IGNORECASE)
        if not match:
            print(f"Saltando archivo no reconocido: {f.name}")
            continue
        
        num = int(match.group(1))
        out_name = f"flor-{num}.webp"
        out_path = OUTPUT_DIR / out_name
        
        print(f"Procesando {f.name} -> {out_name}...")
        
        with Image.open(f) as img:
            img = img.convert("RGB")
            # Max dimension 1400px for processing speed and high retina quality
            if max(img.size) > 1600:
                img.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
            
            # Remover fondo
            nobg = remove(img, session=session)
            
            # Opcional: recortar bordes transparentes sobrantes con margen de 4px
            bbox = nobg.getbbox()
            if bbox:
                w, h = nobg.size
                left = max(0, bbox[0] - 4)
                upper = max(0, bbox[1] - 4)
                right = min(w, bbox[2] + 4)
                lower = min(h, bbox[3] + 4)
                nobg = nobg.crop((left, upper, right, lower))
            
            nobg.save(out_path, format="WEBP", quality=88, method=6)
            print(f"✓ Guardado {out_name} ({out_path.stat().st_size // 1024} KB)")

def process_novios():
    print("\n--- PROCESANDO FOTOS DE NOVIOS ---")
    files = list(NOVIOS_DIR.glob("*.jpg")) + list(NOVIOS_DIR.glob("*.jpeg")) + list(NOVIOS_DIR.glob("*.png"))
    print(f"Archivos encontrados en novios: {len(files)}")
    
    for f in sorted(files):
        name_lower = f.name.lower()
        if "final" in name_lower:
            out_name = "foto-novios-final.webp"
        else:
            match = re.search(r'foto-novios[-_\s]?(\d+)', name_lower)
            if not match:
                print(f"Saltando {f.name}")
                continue
            num = int(match.group(1))
            out_name = f"foto-novios-{num}.webp"
        
        out_path = OUTPUT_DIR / out_name
        print(f"Procesando {f.name} -> {out_name}...")
        
        with Image.open(f) as img:
            img = img.convert("RGB")
            # Max width 1600px (retina ready)
            if max(img.size) > 1800:
                img.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
            
            img.save(out_path, format="WEBP", quality=85, method=6)
            print(f"✓ Guardado {out_name} ({out_path.stat().st_size // 1024} KB)")

if __name__ == "__main__":
    process_flores()
    process_novios()
    print("\n¡Procesamiento completo!")
