"""
Reconocimiento del PDF de referencia SIN librerias PDF.
Lee la estructura cruda para saber cuantas paginas tiene y que imagenes
lleva embebidas (formato, dimensiones y filtro de compresion).
"""
import glob
import re
import sys

PATRON = "/Users/luisalbertosandovalramos/Downloads/Invitaci*ngel y Kenia *.pdf"
rutas = glob.glob(PATRON)
if not rutas:
    sys.exit(f"No se encontro el PDF con patron {PATRON}")
RUTA = rutas[0]
print(f"archivo: {RUTA}\n")

datos = open(RUTA, "rb").read()
print(f"tamano: {len(datos)/1024/1024:.2f} MB\n")

# --- version y paginas ---
m = re.search(rb"%PDF-(\d\.\d)", datos[:1024])
print(f"version PDF: {m.group(1).decode() if m else '?'}")
print(f"objetos /Type /Page  : {len(re.findall(rb'/Type\s*/Page[^s]', datos))}")
print(f"objetos /Type /Pages : {len(re.findall(rb'/Type\s*/Pages', datos))}")

# --- imagenes ---
print("\n=== IMAGENES EMBEBIDAS ===")
imgs = []
for mm in re.finditer(rb"/Subtype\s*/Image", datos):
    ini = max(0, mm.start() - 1200)
    trozo = datos[ini:mm.start()]
    def campo(nombre, cast=str):
        r = re.search(rb"/" + nombre.encode() + rb"\s+([^\s/\[\]<>]+)", trozo)
        if not r:
            return None
        v = r.group(1)
        try:
            return cast(v.decode("latin-1"))
        except Exception:
            return v.decode("latin-1")
    ancho = campo("Width", int)
    alto = campo("Height", int)
    filtro = campo("Filter")
    cs = campo("ColorSpace")
    bpc = campo("BitsPerComponent")
    imgs.append((mm.start(), ancho, alto, filtro, cs, bpc))

print(f"total: {len(imgs)}\n")
print(f"{'#':>3} {'offset':>10} {'dimensiones':>14}  {'filtro':<26} {'colorspace':<14} bpc")
for i, (off, w, h, f, cs, bpc) in enumerate(imgs):
    dim = f"{w}x{h}" if w and h else "?"
    print(f"{i:>3} {off:>10} {dim:>14}  {str(f):<26} {str(cs):<14} {bpc}")

# --- cuantos JPEG crudos hay ---
soi = datos.count(b"\xff\xd8\xff")
eoi = datos.count(b"\xff\xd9")
print(f"\nmarcadores JPEG: {soi} SOI / {eoi} EOI")

# --- fuentes incrustadas ---
fuentes = set(re.findall(rb"/BaseFont\s*/([A-Za-z0-9+\-,_]+)", datos))
print(f"\n=== FUENTES ({len(fuentes)}) ===")
for f in sorted(x.decode('latin-1') for x in fuentes):
    print(f"  {f}")
