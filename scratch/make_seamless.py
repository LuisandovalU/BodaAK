"""
Hace que la textura de papel sea PERFECTAMENTE repetible en vertical.

Sin esto, con background-repeat: repeat-y aparece una linea fina cada ~896 px
(la costura mide ~3x el grano natural de la textura), que se lee como un
"corte" entre secciones.

Construccion correcta (crossfade de bucle):
  Sea L el alto original y N la banda de fundido. El alto de salida es M = L - N.
    - output[y] = source[y]                para y en [N, M)   (zona intacta)
    - output[k] = (1-t)*source[k] + t*source[M+k]   para k en [0, N), t: 1 -> 0
  Asi la ultima fila del mosaico es source[M-1] y la primera es source[M], que
  son filas ADYACENTES en el original  ->  el empalme es continuo y natural.

Uso: python3 scratch/make_seamless.py
"""
from PIL import Image
import os
import statistics as st

ORIGEN = "public/assets/fondo0.webp"
DESTINO = "public/images/bg-paper-1.jpg"
ANCHO = 893
BANDA = 160  # filas de fundido


def filas_gris(im):
    g = im.convert("L")
    w, h = g.size
    px = g.load()
    return w, h, px


def ruido_natural(im):
    """Diferencia media entre filas contiguas reales (grano propio del papel)."""
    w, h, px = filas_gris(im)
    xs = list(range(0, w, 3))
    return [
        sum(abs(px[x, y] - px[x, y + 1]) for x in xs) / len(xs)
        for y in range(0, h - 1, 23)
    ]


def salto_empalme(im):
    """Diferencia entre la ultima y la primera fila = lo que se ve en la costura."""
    w, h, px = filas_gris(im)
    xs = list(range(0, w, 3))
    vals = [abs(px[x, h - 1] - px[x, 0]) for x in xs]
    return sum(vals) / len(vals), max(vals)


def informe(etiqueta, im):
    media, mx = salto_empalme(im)
    nat = ruido_natural(im)
    peores = sum(1 for v in nat if v >= media)
    print(
        f"{etiqueta:7s} alto {im.size[1]:>5}  costura media {media:5.2f} (max {mx:>3})  "
        f"grano natural mediana {st.median(nat):4.2f} max {max(nat):4.2f}  "
        f"| filas naturales peores que la costura: {peores}/{len(nat)}"
    )
    return media, st.median(nat)


# --- 1. Base ---
src = Image.open(ORIGEN).convert("RGB")
alto = round(src.size[1] * ANCHO / src.size[0])
src = src.resize((ANCHO, alto), Image.LANCZOS)
L = src.size[1]
print(f"textura base: {ANCHO}x{L}\n")
informe("ANTES", src)

# --- 2. Crossfade de bucle ---
M = L - BANDA
out = Image.new("RGB", (ANCHO, M))
out.paste(src.crop((0, 0, ANCHO, M)), (0, 0))  # zona intacta
sp, op = src.load(), out.load()
for k in range(BANDA):
    t = (BANDA - 1 - k) / (BANDA - 1)  # 1 -> 0
    fila = sp[0, M + k]
    for x in range(ANCHO):
        a = sp[x, k]
        b = sp[x, M + k]
        op[x, k] = (
            round(a[0] * (1 - t) + b[0] * t),
            round(a[1] * (1 - t) + b[1] * t),
            round(a[2] * (1 - t) + b[2] * t),
        )
# la fila 0 debe ser exactamente source[M] para empalmar con source[M-1]
for x in range(ANCHO):
    op[x, 0] = sp[x, M]

print()
media, mediana = informe("DESPUES", out)
ok = media <= mediana * 1.6
print("\nVEREDICTO:", "SIN COSTURA perceptible" if ok else "sigue habiendo costura")

# --- 3. Guardar ---
out.save(DESTINO, "JPEG", quality=90, optimize=True, progressive=True)
print(f"guardado {DESTINO}  ({out.size[0]}x{out.size[1]}, {os.path.getsize(DESTINO)//1024} KB)")
