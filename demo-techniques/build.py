# -*- coding: utf-8 -*-
import base64, json
from pathlib import Path

ROOT = Path("/home/user/ARTCOL/hermes-perpetuelle")
LIB = ROOT / "assets/lib"
IMG = ROOT / "assets/img"
TPL = Path("/tmp/ecrin_demo/template.html")
OUT = Path("/tmp/Atelier_Techniques_Immersive.html")

def read(p): return p.read_text(encoding="utf-8", errors="replace")
def datauri(p):
    b = base64.b64encode(p.read_bytes()).decode("ascii")
    return f"data:image/jpeg;base64,{b}"

html = read(TPL)
html = html.replace("__LIB_THREE__",  read(LIB/"three.min.js"))
html = html.replace("__LIB_GSAP__",   read(LIB/"gsap.min.js"))
html = html.replace("__LIB_ST__",     read(LIB/"ScrollTrigger.min.js"))
html = html.replace("__LIB_LENIS__",  read(LIB/"lenis.min.js"))

scenes = ["hero-bag","atelier","leather","certification","revente","nouvelle_vie"]
images = [datauri(IMG/f"{n}.jpg") for n in scenes]
html = html.replace("__IMAGES__", json.dumps(images))

OUT.write_bytes(html.encode("utf-8"))
print(f"OK -> {OUT}  ({OUT.stat().st_size/1024/1024:.2f} MB)")
