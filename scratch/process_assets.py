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
from PIL import Image, ImageOps
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


def process_downloads_fotos():
    """Convierte las fotos adicionales de Descargas/Fotos sin tocar las existentes."""
    source_dir = Path.home() / "Downloads" / "Fotos"
    files = sorted(
        path for path in source_dir.iterdir()
        if path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
    )
    print("\n--- PROCESANDO FOTOS ADICIONALES ---")
    print(f"Archivos encontrados: {len(files)}")

    for number, source in enumerate(files, start=6):
        output_name = f"foto-novios-{number}.webp"
        destination = OUTPUT_DIR / output_name
        with Image.open(source) as img:
            image = ImageOps.exif_transpose(img).convert("RGB")
            if max(image.size) > 1800:
                image.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
            image.save(destination, format="WEBP", quality=86, method=6)
        print(f"✓ Guardado {output_name} ({destination.stat().st_size // 1024} KB)")


def process_desktop_calligraphy():
    """Exporta las dos caligrafías entregadas en el Escritorio con alfa."""
    desktop = Path.home() / "Desktop"
    assets = {
        "WhatsApp Image 2026-10-03 at 15.04.33.jpeg": "caligrafia-dress-code.webp",
        "WhatsApp Image 2026-10-03 at 15.04.34.jpeg": "caligrafia-detalles.webp",
        "caligrafia-asistencia.png": "caligrafia-asistencia.webp",
        "caligrafia-ubi.png": "caligrafia-ubi.webp",
        "caligrafia-fbi.png": "caligrafia-fbi.webp",
    }
    print("--- PROCESANDO CALIGRAFÍAS DEL ESCRITORIO ---")
    for source_name, output_name in assets.items():
        source = desktop / source_name
        destination = OUTPUT_DIR / output_name
        if not source.exists():
            print(f"No se encontró {source_name}")
            continue

        with Image.open(source) as img:
            image = img.convert("RGB")
            image.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
            # Aísla la tinta del papel escaneado sin dejar textura semitransparente.
            pixels = []
            for red, green, blue in image.getdata():
                if output_name == "caligrafia-dress-code.webp":
                    # La caligrafía de Dress Code es durazno sobre blanco.
                    ink_contrast = red - blue
                    alpha = max(0, min(255, (ink_contrast - 9) * 12))
                else:
                    # Las demás caligrafías son azul marino sobre papel cálido.
                    ink_contrast = blue - max(red, green)
                    alpha = max(0, min(255, (ink_contrast - 9) * 5))
                pixels.append((red, green, blue, alpha))
            transparent = Image.new("RGBA", image.size)
            transparent.putdata(pixels)
            bbox = transparent.getchannel("A").getbbox()
            if bbox:
                padding = 24
                left = max(0, bbox[0] - padding)
                top = max(0, bbox[1] - padding)
                right = min(transparent.width, bbox[2] + padding)
                bottom = min(transparent.height, bbox[3] + padding)
                transparent = transparent.crop((left, top, right, bottom))
            transparent.save(destination, format="WEBP", quality=92, method=6)
            print(f"✓ Guardado {output_name} ({destination.stat().st_size // 1024} KB)")

if __name__ == "__main__":
    if "--downloads-fotos" in sys.argv:
        process_downloads_fotos()
        sys.exit(0)
    if "--desktop-calligraphy" in sys.argv:
        process_desktop_calligraphy()
        sys.exit(0)
    process_flores()
    process_novios()
    print("\n¡Procesamiento completo!")
