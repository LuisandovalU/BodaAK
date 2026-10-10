"""
Extrae las imagenes embebidas del PDF de referencia (sin librerias PDF).

- DCTDecode   (JPEG)  -> directo
- FlateDecode (zlib)  -> se descomprime, se revierte el predictor PNG y se
                         detecta el numero de canales por tamano de buffer
- Aplica /SMask como canal alfa cuando existe

Uso: python3 scratch/pdf_extract.py
"""
import glob
import io
import os
import re
import zlib

from PIL import Image, ImageStat

RUTA = glob.glob("/Users/luisalbertosandovalramos/Downloads/Invitaci*ngel y Kenia *.pdf")[0]
SALIDA = "scratch/pdf_assets"
os.makedirs(SALIDA, exist_ok=True)
datos = open(RUTA, "rb").read()

# --- indice de objetos ---
OBJS = {int(m.group(1)): m.end() for m in re.finditer(rb"(\d+)\s+0\s+obj", datos)}


def campo(dic, nombre):
    r = re.search(rb"/" + nombre.encode() + rb"\s*/?([^\s/\[\]<>]+)", dic)
    return r.group(1).decode("latin-1") if r else None


def dict_y_stream(num):
    pos = OBJS.get(num)
    if pos is None:
        return None, None
    s = datos.find(b"stream", pos)
    if s == -1:
        return None, None
    d0 = datos.find(b"<<", pos)
    dic = datos[d0:s] if (d0 != -1 and d0 < s) else datos[pos:s]
    st = s + 6
    while st < len(datos) and datos[st] in (13, 10):
        st += 1
    lm = re.search(rb"/Length\s+(\d+)(?!\s+\d+\s+R)", dic)
    crudo = datos[st : st + int(lm.group(1))] if lm else datos[st : datos.find(b"endstream", st)]
    return dic, crudo


def quitar_predictor(crudo, ancho, alto, canales):
    fila_bytes = ancho * canales
    salida = bytearray()
    previa = bytearray(fila_bytes)
    pos = 0
    for _ in range(alto):
        if pos >= len(crudo):
            return None
        tipo = crudo[pos]
        pos += 1
        fila = bytearray(crudo[pos : pos + fila_bytes])
        if len(fila) < fila_bytes:
            return None
        pos += fila_bytes
        if tipo == 1:
            for i in range(canales, fila_bytes):
                fila[i] = (fila[i] + fila[i - canales]) & 0xFF
        elif tipo == 2:
            for i in range(fila_bytes):
                fila[i] = (fila[i] + previa[i]) & 0xFF
        elif tipo == 3:
            for i in range(fila_bytes):
                izq = fila[i - canales] if i >= canales else 0
                fila[i] = (fila[i] + ((izq + previa[i]) >> 1)) & 0xFF
        elif tipo == 4:
            for i in range(fila_bytes):
                a = fila[i - canales] if i >= canales else 0
                b = previa[i]
                c = previa[i - canales] if i >= canales else 0
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                fila[i] = (fila[i] + pr) & 0xFF
        elif tipo != 0:
            return None
        salida += fila
        previa = fila
    return bytes(salida)


def decodifica(num, prof=0):
    if prof > 3:
        return None
    dic, crudo = dict_y_stream(num)
    if not dic or crudo is None:
        return None
    w, h = campo(dic, "Width"), campo(dic, "Height")
    filtro = campo(dic, "Filter") or ""
    if not (w and h and w.isdigit() and h.isdigit()):
        return None
    w, h = int(w), int(h)

    if "DCTDecode" in filtro:
        try:
            im = Image.open(io.BytesIO(crudo))
            im.load()
            return im.convert("RGB")
        except Exception:
            return None

    if "FlateDecode" in filtro:
        try:
            desc = zlib.decompress(crudo)
        except Exception:
            return None
        for c in (3, 4, 1):
            buf = desc
            if b"/Predictor" in dic:
                buf = quitar_predictor(desc, w, h, c)
            if buf and len(buf) >= w * h * c:
                modo = {1: "L", 3: "RGB", 4: "CMYK"}[c]
                try:
                    im = Image.frombytes(modo, (w, h), buf[: w * h * c])
                except Exception:
                    continue
                if c == 4:
                    im = im.convert("RGB")
                sm = re.search(rb"/SMask\s+(\d+)\s+0\s+R", dic)
                if sm:
                    mask = decodifica(int(sm.group(1)), prof + 1)
                    if mask is not None:
                        if mask.mode != "L":
                            mask = mask.convert("L")
                        if mask.size != im.size:
                            mask = mask.resize(im.size)
                        im = im.convert("RGBA")
                        im.putalpha(mask)
                return im
    return None


# --- recorre los objetos que son imagenes ---
nums = [n for n, pos in OBJS.items() if re.match(rb"\s*<<", datos[pos : pos + 400]) and b"/Subtype /Image" in datos[pos : pos + 800]]
filas = []
for n in sorted(nums):
    im = decodifica(n)
    if im is None:
        filas.append({"n": n, "ok": False})
        continue
    ruta = f"{SALIDA}/obj{n:03d}.png"
    im.save(ruta)
    st = ImageStat.Stat(im.convert("RGB"))
    media = tuple(round(v) for v in st.mean)
    desv = round(sum(st.stddev) / 3, 1)
    filas.append({"n": n, "ok": True, "size": im.size, "media": media, "desv": desv,
                  "alfa": im.mode == "RGBA", "px": im.size[0] * im.size[1], "ruta": ruta})

ok = [f for f in filas if f["ok"]]
print(f"imagenes: {len(filas)}   decodificadas: {len(ok)}   fallidas: {len(filas)-len(ok)}\n")
print(f"{'obj':>5} {'dimensiones':>12} {'KB':>7} {'media RGB':<18} {'desv':>6} {'alfa':>5}")
print("-" * 62)
for f in sorted(ok, key=lambda x: -x["px"]):
    kb = os.path.getsize(f["ruta"]) // 1024
    print(f"{f['n']:>5} {str(f['size'][0])+'x'+str(f['size'][1]):>12} {kb:>7} {str(f['media']):<18} {f['desv']:>6} {str(f['alfa']):>5}")

print("\n--- candidatos a TEXTURA DE PAPEL (claro, uniforme, grande) ---")
for f in sorted(ok, key=lambda x: -x["px"]):
    r, g, b = f["media"]
    if r > 225 and g > 220 and b > 205 and f["desv"] < 12 and f["px"] > 300_000:
        print(f"  obj{f['n']:>4}  {f['size'][0]}x{f['size'][1]}  media {f['media']}  desv {f['desv']}  alfa={f['alfa']}")
