"""Convierte los assets reales de public/assets/*.webp a public/images/
con los nombres exactos que espera el código (bg-paper-1.jpg, flower-*.png ...).

- PNG  -> conserva canal alfa (flores, íconos, caligrafías)
- JPG  -> aplana sobre crema (fondos, fotos)
"""
from pathlib import Path
from PIL import Image

SRC = Path("public/assets")
DST = Path("public/images")
DST.mkdir(parents=True, exist_ok=True)

CREAM = (245, 240, 232)

# (origen .webp, destino en public/images, max_dim)
MAP = [
    # ---- fondos de papel (JPG) ----
    ("fondo0.webp", "bg-paper-1.jpg", 1600),
    ("fondo1.webp", "bg-section-1.jpg", 1600),
    ("fondo2.webp", "bg-section-2.jpg", 1600),
    ("fondo3.webp", "bg-section-3.jpg", 1600),
    ("foto_rsvp.webp", "photo-rsvp.jpg", 1400),
    # ---- flores de esquina del Hero (PNG con alfa) ----
    ("corner_tl.webp", "flower-top-left.png", 900),
    ("corner_tr.webp", "flower-top-right.png", 900),
    ("corner_bl.webp", "flower-bottom-left.png", 900),
    ("corner_br.webp", "flower-bottom-right.png", 900),
    # ---- flores decorativas grandes (PNG con alfa) ----
    ("arreglo_floral_esquina.webp", "flower-corner-left.png", 700),
    ("flor_tallo_hortensia.webp", "flower-side-right.png", 700),
    ("ramo_vertical_lateral.webp", "flower-side-left.png", 700),
    ("flor_peonia_hero.webp", "flower-peony.png", 700),
    ("guirnalda_floral_top.webp", "flower-garland-top.png", 700),
    ("arreglo_floral_footer.webp", "flower-footer.png", 700),
    # ---- identidad ----
    ("monograma.webp", "monograma.png", 700),
    ("nombres_angel_y_kenia.webp", "names-script.png", 1100),
    ("save_the_date_title.webp", "save-the-date.png", 900),
    ("caligrafia_regalos.webp", "caligrafia-regalos.png", 900),
    ("caligrafia_importante.webp", "caligrafia-importante.png", 900),
    # ---- dress code ----
    ("dresscode_vestido.webp", "dresscode-women.png", 1000),
    ("dresscode_traje.webp", "dresscode-men.png", 1000),
    ("dresscode_corner.webp", "dresscode-corner-1.png", 400),
    ("dresscode_corner_alt.webp", "dresscode-corner-2.png", 400),
    # ---- iconos de "Importante" ----
    ("icon_champagne.webp", "icon-adults.png", 300),
    ("icon_parking.webp", "icon-parking.png", 300),
    ("icon_audio_taylorswift.webp", "icon-taylor.png", 300),
    ("icon_corazon.webp", "icon-heart.png", 300),
]

rows = []
for src_name, dst_name, max_dim in MAP:
    src = SRC / src_name
    dst = DST / dst_name
    if not src.exists():
        rows.append((dst_name, src_name, "FALTA ORIGEN", "-", "-"))
        continue

    im = Image.open(src)
    im.load()
    w0, h0 = im.size
    if max(w0, h0) > max_dim:
        scale = max_dim / max(w0, h0)
        im = im.resize((round(w0 * scale), round(h0 * scale)), Image.LANCZOS)

    has_alpha = im.mode in ("RGBA", "LA") or (
        im.mode == "P" and "transparency" in im.info
    )

    if dst.suffix.lower() == ".png":
        im = im.convert("RGBA") if has_alpha else im.convert("RGB")
        im.save(dst, "PNG", optimize=True)
    else:
        if has_alpha:
            bg = Image.new("RGB", im.size, CREAM)
            bg.paste(im.convert("RGBA"), mask=im.convert("RGBA").split()[-1])
            im = bg
        else:
            im = im.convert("RGB")
        im.save(dst, "JPEG", quality=88, optimize=True, progressive=True)

    rows.append(
        (dst_name, src_name, f"{im.size[0]}x{im.size[1]}", f"{dst.stat().st_size // 1024} KB", "alfa" if has_alpha else "opaco")
    )

w = max(len(r[0]) for r in rows)
print(f"{'DESTINO'.ljust(w)}  {'ORIGEN'.ljust(30)} {'TAMAÑO'.ljust(11)} {'PESO'.ljust(9)} CANAL")
print("-" * (w + 62))
for r in rows:
    print(f"{r[0].ljust(w)}  {r[1].ljust(30)} {r[2].ljust(11)} {r[3].ljust(9)} {r[4]}")

total = sum(f.stat().st_size for f in DST.iterdir() if f.is_file())
print("-" * (w + 62))
print(f"{len(rows)} archivos -> {total // 1024} KB en total en public/images/")
