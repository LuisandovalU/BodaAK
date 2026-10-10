"""
Trocea las paginas renderizadas del PDF para poder inspeccionarlas.

- contacto.jpg : la tira completa partida en bandas colocadas en fila
                 (para ver de un vistazo el ORDEN de las secciones)
- pN-cM.jpg    : trozos verticales legibles de cada pagina
"""
from PIL import Image
import glob
import os

PAGINAS = sorted(glob.glob("scratch/pdf_pages/page-*.png"))
ANCHO_CHUNK = 900
N_CHUNKS = 5
os.makedirs("scratch/pdf_chunks", exist_ok=True)

paginas = [Image.open(p).convert("RGB") for p in PAGINAS]
print("paginas:", [f"{p.size[0]}x{p.size[1]}" for p in paginas])

# ---------- 1. tira completa apilada ----------
tiras = []
for p in paginas:
    a = ANCHO_CHUNK
    tiras.append(p.resize((a, round(p.size[1] * a / p.size[0])), Image.LANCZOS))
total_alto = sum(t.size[1] for t in tiras)
tira = Image.new("RGB", (ANCHO_CHUNK, total_alto), "white")
y = 0
for t in tiras:
    tira.paste(t, (0, y))
    y += t.size[1]
print(f"tira completa: {tira.size[0]}x{tira.size[1]}  (relacion 1:{tira.size[1]/tira.size[0]:.0f})")

# ---------- 2. hoja de contacto: bandas en fila ----------
N_BANDAS = 6
alto_banda = total_alto // N_BANDAS
bandas = []
for i in range(N_BANDAS):
    y0 = i * alto_banda
    y1 = total_alto if i == N_BANDAS - 1 else y0 + alto_banda
    bandas.append(tira.crop((0, y0, ANCHO_CHUNK, y1)))
h = max(b.size[1] for b in bandas)
contacto = Image.new("RGB", (ANCHO_CHUNK * N_BANDAS, h), "white")
for i, b in enumerate(bandas):
    contacto.paste(b, (i * ANCHO_CHUNK, 0))
contacto.save("scratch/pdf_chunks/contacto.jpg", "JPEG", quality=80, optimize=True)
print(f"contacto.jpg: {contacto.size[0]}x{contacto.size[1]} ({os.path.getsize('scratch/pdf_chunks/contacto.jpg')//1024} KB)")

# ---------- 3. trozos legibles por pagina ----------
for i, t in enumerate(tiras, start=1):
    alto = t.size[1]
    paso = alto // N_CHUNKS
    for c in range(N_CHUNKS):
        y0 = c * paso
        y1 = alto if c == N_CHUNKS - 1 else y0 + paso
        trozo = t.crop((0, y0, ANCHO_CHUNK, y1))
        ruta = f"scratch/pdf_chunks/p{i}-c{c+1}.jpg"
        trozo.save(ruta, "JPEG", quality=82, optimize=True)
    print(f"pagina {i}: {N_CHUNKS} trozos de {ANCHO_CHUNK}x{paso}")
