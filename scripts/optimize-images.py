#!/usr/bin/env python3
"""
Пакетная оптимизация фото для сайта: ресайз + конвертация в WebP.

Главное правило: сначала уменьшаем разрешение (это даёт основной выигрыш в весе),
потом жмём качеством. Пропорции сохраняются, мелкие фото НЕ увеличиваются.

Требуется Pillow:  pip install pillow

Примеры:
  # одну папку -> WebP шириной до 1800px рядом, в подпапку ./optimized
  python scripts/optimize-images.py "C:/photos/mercedes"

  # своя ширина/качество и своя папка вывода
  python scripts/optimize-images.py input_dir --out public/images/cars --width 1800 --quality 80

  # один файл
  python scripts/optimize-images.py "C:/photos/DSC_0001.jpg" --out public/images/cars
"""

import argparse
import re
import sys
import unicodedata
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Нужен Pillow:  pip install pillow")

# Что считаем картинкой на входе
SRC_EXT = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff", ".tif"}

# Транслитерация кириллицы -> латиница для URL-безопасных имён
CYR = {
    "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "e",
    "ж": "zh", "з": "z", "и": "i", "й": "y", "к": "k", "л": "l", "м": "m",
    "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u",
    "ф": "f", "х": "h", "ц": "c", "ч": "ch", "ш": "sh", "щ": "sch", "ъ": "",
    "ы": "y", "ь": "", "э": "e", "ю": "yu", "я": "ya",
}


def slugify(name: str) -> str:
    """URL-безопасное имя файла: латиница, нижний регистр, дефисы."""
    name = name.lower()
    name = "".join(CYR.get(ch, ch) for ch in name)
    # убрать диакритику у прочих символов
    name = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    name = re.sub(r"[^a-z0-9]+", "-", name).strip("-")
    return name or "image"


def optimize(src: Path, dst: Path, width: int, quality: int) -> tuple[int, int]:
    """Ресайз + сохранение в WebP. Возвращает (вес_до, вес_после) в байтах."""
    before = src.stat().st_size
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)  # чиним поворот с телефона/камеры
        if im.mode in ("P", "LA"):
            im = im.convert("RGBA")
        elif im.mode not in ("RGB", "RGBA"):
            im = im.convert("RGB")
        # thumbnail не увеличивает мелкие и держит пропорции
        im.thumbnail((width, width * 4), Image.LANCZOS)
        dst.parent.mkdir(parents=True, exist_ok=True)
        im.save(dst, "WEBP", quality=quality, method=6)
    return before, dst.stat().st_size


def human(n: int) -> str:
    for unit in ("Б", "КБ", "МБ"):
        if n < 1024:
            return f"{n:.0f} {unit}"
        n /= 1024
    return f"{n:.1f} ГБ"


def main() -> None:
    ap = argparse.ArgumentParser(description="Ресайз + WebP для веба")
    ap.add_argument("input", help="файл или папка с исходными фото")
    ap.add_argument("--out", default=None,
                    help="папка вывода (по умолчанию <input>/optimized)")
    ap.add_argument("--width", type=int, default=1800,
                    help="макс. ширина/сторона, px (по умолчанию 1800)")
    ap.add_argument("--quality", type=int, default=80,
                    help="качество WebP 0-100 (по умолчанию 80)")
    ap.add_argument("--recursive", action="store_true",
                    help="обходить подпапки")
    ap.add_argument("--keep-names", action="store_true",
                    help="не транслитерировать имена (оставить как есть)")
    args = ap.parse_args()

    src_path = Path(args.input)
    if not src_path.exists():
        sys.exit(f"Не найдено: {src_path}")

    if src_path.is_file():
        files = [src_path]
        base = src_path.parent
    else:
        globber = src_path.rglob if args.recursive else src_path.glob
        files = sorted(p for p in globber("*") if p.suffix.lower() in SRC_EXT)
        base = src_path

    if not files:
        sys.exit("Картинок не найдено.")

    out_dir = Path(args.out) if args.out else base / "optimized"

    total_before = total_after = 0
    for i, f in enumerate(files, 1):
        stem = f.stem if args.keep_names else slugify(f.stem)
        dst = out_dir / f"{stem}.webp"
        # не затираем одноимённые
        n = 2
        while dst.exists() and dst.resolve() != f.resolve():
            dst = out_dir / f"{stem}-{n}.webp"
            n += 1
        try:
            before, after = optimize(f, dst, args.width, args.quality)
        except Exception as e:  # noqa: BLE001
            print(f"[{i}/{len(files)}] ПРОПУСК {f.name}: {e}")
            continue
        total_before += before
        total_after += after
        pct = (1 - after / before) * 100 if before else 0
        print(f"[{i}/{len(files)}] {f.name} -> {dst.name}  "
              f"{human(before)} -> {human(after)}  (-{pct:.0f}%)")

    if total_before:
        pct = (1 - total_after / total_before) * 100
        print(f"\nИтого: {human(total_before)} -> {human(total_after)}  "
              f"(-{pct:.0f}%)  файлов: {len(files)}")
        print(f"Готово в: {out_dir}")


if __name__ == "__main__":
    main()
