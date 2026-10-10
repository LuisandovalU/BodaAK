"""
Genera public/images/bg-paper-1.jpg a partir de la textura REAL extraida del
PDF (scratch/pdf_assets/obj021.png, 1080x1920), empalmada sin costuras para
que background-repeat: repeat-y no muestre ninguna linea de corte.
"""
from PIL import Image
import os
import statistics as st

ORIGEN = "scratch/pdf_assets/obj021.png"
DESTINO = "public/images/bg-paper-1.jpg"
BANDA = 200


def gris(im):
    g = im.convert("L")
    return g.size[0], g.size[1], g.load()


def ruido(im):
    w, h, px = gris(im)
    xs = list(range(0, w, 5))
    return [sum(abs(px[x, y] - px[x, y + 1]) for x in xs) / len(xs) for y in range(0, h - 1, 29)]


def costura(im):
    w, h, px = gris(im)
    xs = list(range(0, w, 5))
    v = [abs(px[x, h - 1] - px[x, 0]) for x in xs]
    return sum(v) / len(v), max(v)


src = Image.open(ORIGEN).convert("RGB")
L = src.size[1]
m0, x0 = costura(src)
nat0 = ruido(src)
print(f"papel del PDF: {src.size[0]}x{L}")
print(f"ANTES   costura media {m0:5.2f} (max {x0:>3})  |  grano natural mediana {st.median(nat0):4.2f} max {max(nat0):4.2f}")

# crossfade de bucle: el inicio se funde con las filas que siguen al corte
M = L - BANDA
out = Image.new("RGB", (src.size[0], M))
out.paste(src.crop((0, 0, src.size[0], M)), (0, 0))
sp, op = src.load(), out.load()
for k in range(BANDA):
    t = (BANDA - 1 - k) / (BANDA - 1)
    for x in range(src.size[0]):
        a, b = sp[x, k], sp[x, M + k]
        op[x, k] = (round(a[0] * (1 - t) + b[0] * t),
                    round(a[1] * (1 - t) + b[1] * t),
                    round(a[2] * (1 - t) + b[2] * t))
for x in range(src.size[0]):
    op[x, 0] = sp[x, M]

m1, x1 = costura(out)
nat1 = ruido(out)
peores = sum(1 for v in nat1 if v >= m1)
print(f"DESPUES costura media {m1:5.2f} (max {x1:>3})  |  grano natural mediana {st.median(nat1):4.2f} max {max(nat1):4.2f}")
print(f"        filas naturales peores que la costura: {peores}/{len(nat1)}")
print("VEREDICTO:", "SIN COSTURA perceptible" if m1 <= st.median(nat1) * 1.6 else "sigue habiendo costura")

out.save(DESTINO, "JPEG", quality=92, optimize=True, progressive=True)
print(f"guardado {DESTINO} ({out.size[0]}x{out.size[1]}, {os.path.getsize(DESTINO)//1024} KB)")
