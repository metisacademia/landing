#!/usr/bin/env python3
"""Generate QR codes for the Fenearte static mini-site.

Usage from client/public/expo/fenearte:
    python3 scripts/generate_qr.py --base-url https://metisacademia.com.br/expo/fenearte/

Outputs:
    qrcodes/<slug>.png
    qrcodes/<slug>.svg
    qrcodes/links.csv
"""
from __future__ import annotations

import argparse
import csv
import re
from html import unescape
from pathlib import Path
from urllib.parse import urljoin

import qrcode
from qrcode.constants import ERROR_CORRECT_M
from qrcode.image.pil import PilImage
from qrcode.image.svg import SvgPathImage

ROOT = Path(__file__).resolve().parents[1]
ARTESAOS_DIR = ROOT / "artesaos"
OUT_DIR = ROOT / "qrcodes"


def normalize_base_url(base_url: str) -> str:
    base_url = base_url.strip()
    if not base_url:
        raise SystemExit("--base-url não pode ser vazio")
    if not base_url.endswith("/"):
        base_url += "/"
    return base_url


def page_title(path: Path) -> str:
    html = path.read_text(encoding="utf-8")
    match = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.IGNORECASE | re.DOTALL)
    if not match:
        return path.stem.replace("-", " ").title()
    text = re.sub(r"<[^>]+>", "", match.group(1))
    return unescape(" ".join(text.split()))


def make_png(url: str, path: Path) -> None:
    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_M,
        box_size=18,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(image_factory=PilImage, fill_color="#173b5a", back_color="white")
    pil_img = img.get_image().convert("RGB")
    pil_img.save(path, optimize=True)


def make_svg(url: str, path: Path) -> None:
    factory = SvgPathImage
    img = qrcode.make(
        url,
        image_factory=factory,
        error_correction=ERROR_CORRECT_M,
        box_size=12,
        border=4,
    )
    with path.open("wb") as f:
        img.save(f)


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate Fenearte QR codes.")
    parser.add_argument(
        "--base-url",
        default="https://metisacademia.com.br/expo/fenearte/",
        help="Published base URL ending at /expo/fenearte/",
    )
    args = parser.parse_args()

    base_url = normalize_base_url(args.base_url)
    pages = sorted(ARTESAOS_DIR.glob("*.html"))
    if not pages:
        raise SystemExit(f"Nenhuma página encontrada em {ARTESAOS_DIR}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    rows = []
    for page in pages:
        slug = page.stem
        title = page_title(page)
        url = urljoin(base_url, f"artesaos/{slug}.html")
        png_rel = f"qrcodes/{slug}.png"
        svg_rel = f"qrcodes/{slug}.svg"
        make_png(url, ROOT / png_rel)
        make_svg(url, ROOT / svg_rel)
        rows.append({
            "slug": slug,
            "title": title,
            "url": url,
            "png": png_rel,
            "svg": svg_rel,
        })

    with (OUT_DIR / "links.csv").open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["slug", "title", "url", "png", "svg"])
        writer.writeheader()
        writer.writerows(rows)

    print(f"Gerados {len(rows)} QR codes em {OUT_DIR}")
    print(f"Base URL: {base_url}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
