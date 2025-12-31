from __future__ import annotations

import random
from pathlib import Path
from typing import Tuple

from PIL import Image, ImageDraw, ImageFilter, ImageFont

# Retro palette
PALETTE = {
    "primary": "#00ff41",
    "secondary": "#ff006e",
    "bg": "#1a1a2e",
    "text": "#e0e0e0",
    "shadow": "#0c0c14",
}

FONT_CANDIDATES = [
    "C:/Windows/Fonts/Consola.ttf",
    "C:/Windows/Fonts/Consolab.ttf",
    "C:/Windows/Fonts/arial.ttf",
    "C:/Windows/Fonts/verdana.ttf",
    "/System/Library/Fonts/Menlo.ttc",
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
]

OUTPUT_DIR = Path("content/assets/images")


def get_font(size: int) -> ImageFont.FreeTypeFont:
    for fp in FONT_CANDIDATES:
        try:
            return ImageFont.truetype(fp, size=size)
        except OSError:
            continue
    return ImageFont.load_default()


def add_scanlines(img: Image.Image, opacity: int = 32, spacing: int = 3) -> None:
    draw = ImageDraw.Draw(img, mode="RGBA")
    w, h = img.size
    for y in range(0, h, spacing):
        draw.rectangle([0, y, w, y + 1], fill=(0, 0, 0, opacity))


def add_noise(img: Image.Image, intensity: int = 18) -> None:
    w, h = img.size
    px = img.load()
    for _ in range(int(w * h * 0.05)):
        x = random.randrange(w)
        y = random.randrange(h)
        delta = random.randint(-intensity, intensity)
        r, g, b = px[x, y]
        px[x, y] = (
            max(0, min(255, r + delta)),
            max(0, min(255, g + delta)),
            max(0, min(255, b + delta)),
        )


def gradient_bg(size: Tuple[int, int], top: Tuple[int, int, int], bottom: Tuple[int, int, int]) -> Image.Image:
    w, h = size
    img = Image.new("RGB", size, top)
    draw = ImageDraw.Draw(img)
    for y in range(h):
        t = y / max(1, h - 1)
        draw.line(
            [(0, y), (w, y)],
            fill=(
                int(top[0] * (1 - t) + bottom[0] * t),
                int(top[1] * (1 - t) + bottom[1] * t),
                int(top[2] * (1 - t) + bottom[2] * t),
            ),
        )
    return img


def make_favicon(size: int, path: Path) -> None:
    img = Image.new("RGB", (size, size), PALETTE["bg"])
    draw = ImageDraw.Draw(img)

    unit = size // 4
    pad = max(1, size // 16)
    body = [pad, pad, size - pad - 1, size - pad - 1]
    draw.rounded_rectangle(body, radius=max(1, unit // 2), fill=PALETTE["shadow"])

    cx, cy = size // 2 - unit // 2, size // 2
    draw.rectangle([cx - pad, cy - unit // 2, cx + unit // 2, cy + unit // 2], fill=PALETTE["primary"])
    draw.rectangle([cx - unit // 2, cy - pad, cx + unit // 2, cy + pad], fill=PALETTE["primary"])

    btn_r = max(1, unit // 3)
    draw.ellipse([size - pad - unit, cy - btn_r, size - pad - unit + 2 * btn_r, cy + btn_r], fill=PALETTE["secondary"])
    draw.ellipse([size - pad - unit // 2, cy + unit // 3, size - pad - unit // 2 + 2 * btn_r, cy + unit // 3 + 2 * btn_r], fill=PALETTE["primary"])

    img.save(path, format="PNG")


def make_logo(size: int, path: Path) -> None:
    bg_top = (26, 26, 46)
    bg_bottom = (10, 10, 20)
    img = gradient_bg((size, size), bg_top, bg_bottom)
    draw = ImageDraw.Draw(img)

    margin = size // 14
    draw.rounded_rectangle(
        [margin, margin, size - margin, size - margin],
        radius=size // 10,
        outline=PALETTE["secondary"],
        width=size // 40,
    )

    cx, cy = size // 2, int(size * 0.55)
    body_w, body_h = int(size * 0.55), int(size * 0.28)
    body = [cx - body_w // 2, cy - body_h // 2, cx + body_w // 2, cy + body_h // 2]
    draw.rounded_rectangle(body, radius=body_h // 3, fill=PALETTE["bg"], outline=PALETTE["primary"], width=size // 80)

    d = size // 14
    draw.rectangle([cx - body_w // 3 - d // 2, cy - int(d * 1.2), cx - body_w // 3 + d // 2, cy + int(d * 1.2)], fill=PALETTE["primary"])
    draw.rectangle([cx - body_w // 3 - d, cy - d // 2, cx - body_w // 3 + d, cy + d // 2], fill=PALETTE["primary"])

    btn_r = size // 32
    btn_y = cy - btn_r
    draw.ellipse([cx + body_w // 4 - btn_r, btn_y, cx + body_w // 4 + btn_r, btn_y + 2 * btn_r], fill=PALETTE["secondary"])
    draw.ellipse([cx + body_w // 4 + btn_r * 2, btn_y + int(btn_r * 1.2), cx + body_w // 4 + btn_r * 4, btn_y + int(btn_r * 3.2)], fill=PALETTE["primary"])

    font = get_font(size // 6)
    title = "420360"
    tw, th = draw.textbbox((0, 0), title, font=font)[2:]
    draw.text(
        (cx - tw // 2, size // 6 - th // 2),
        title,
        fill=PALETTE["text"],
        font=font,
        stroke_width=size // 90,
        stroke_fill=PALETTE["shadow"],
    )

    add_scanlines(img, opacity=26)
    add_noise(img, intensity=14)
    img.save(path, format="PNG")


def make_apple_icon(path: Path) -> None:
    size = 180
    img = gradient_bg((size, size), (20, 20, 40), (12, 12, 24))
    draw = ImageDraw.Draw(img)
    ring_margin = size // 10
    draw.ellipse([ring_margin, ring_margin, size - ring_margin, size - ring_margin], outline=PALETTE["primary"], width=size // 36)

    g = size // 6
    center = size // 2
    draw.rectangle([center - g, center - g // 2, center + g, center + g // 2], fill=PALETTE["shadow"], outline=PALETTE["secondary"], width=size // 60)
    draw.rectangle([center - g // 2, center - g, center + g // 2, center + g], fill=PALETTE["primary"])

    add_scanlines(img, opacity=30)
    img.save(path, format="PNG")


def make_social(path: Path) -> None:
    w, h = 1200, 630
    img = gradient_bg((w, h), (14, 14, 30), (10, 10, 20))
    draw = ImageDraw.Draw(img)

    for i in range(8):
        y = int(h * 0.18) + i * 8
        draw.line([(0, y), (w, y)], fill=PALETTE["primary"], width=2)
    for i in range(8):
        y = int(h * 0.62) + i * 8
        draw.line([(0, y), (w, y)], fill=PALETTE["secondary"], width=2)

    title_font = get_font(110)
    subtitle_font = get_font(42)
    tag_font = get_font(28)

    title = "420360 Retro"
    subtitle = "Gaming & Pixel Art"
    tagline = "Level up your reading with CRT glow, scanlines, and mini-quests"

    tw, th = draw.textbbox((0, 0), title, font=title_font)[2:]
    sx = int(w * 0.08)
    sy = int(h * 0.28)
    draw.rounded_rectangle([sx - 22, sy - 18, sx + tw + 32, sy + th + 18], radius=20, fill=PALETTE["shadow"], outline=PALETTE["secondary"], width=4)
    draw.text((sx, sy), title, font=title_font, fill=PALETTE["primary"], stroke_width=3, stroke_fill=PALETTE["shadow"])

    sw, sh = draw.textbbox((0, 0), subtitle, font=subtitle_font)[2:]
    sy2 = sy + th + 40
    draw.text((sx, sy2), subtitle, font=subtitle_font, fill=PALETTE["text"], stroke_width=2, stroke_fill=PALETTE["shadow"])

    draw.text((sx, sy2 + sh + 22), tagline, font=tag_font, fill=PALETTE["text"], stroke_width=1, stroke_fill=PALETTE["shadow"])

    cell = 20
    for y in range(0, h, cell * 2):
        for x in range(0, w, cell * 2):
            if (x // cell + y // cell) % 2 == 0:
                draw.rectangle([x, y, x + cell, y + cell], outline=PALETTE["primary"], width=1)

    add_scanlines(img, opacity=30, spacing=4)
    add_noise(img, intensity=12)
    img = img.filter(ImageFilter.UnsharpMask(radius=2, percent=150))
    img.save(path, format="PNG")


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    make_favicon(16, OUTPUT_DIR / "favicon-16x16.png")
    make_favicon(32, OUTPUT_DIR / "favicon-32x32.png")
    make_apple_icon(OUTPUT_DIR / "apple-touch-icon.png")
    make_logo(512, OUTPUT_DIR / "logo.png")
    make_social(OUTPUT_DIR / "social-share.png")


if __name__ == "__main__":
    main()
    print("generated seo images")
