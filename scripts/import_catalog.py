#!/usr/bin/env python3
import json
import re
import shutil
import sys
import unicodedata
import zipfile
from collections import OrderedDict, defaultdict
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = Path(
    sys.argv[1] if len(sys.argv) > 1 else ROOT / "ziyuan"
).resolve()
EXCEL_PATH = SOURCE_DIR / "产品三级分类表 (2)(1).xlsx"
ALIASES_PATH = ROOT / "resources" / "catalog-aliases.json"
GENERATED_DIR = ROOT / "src" / "data" / "generated"
IMAGE_OUT_DIR = ROOT / "public" / "catalog-images"
CATALOG_OUT = GENERATED_DIR / "catalog.generated.json"
REPORT_OUT = GENERATED_DIR / "import-report.generated.json"

NS = {"a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}


def load_aliases():
    if not ALIASES_PATH.exists():
        return {"categoryFolders": {}, "imageNames": {}}
    with ALIASES_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)


def slugify(value, fallback):
    value = (value or "").strip()
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii")
    source = ascii_value or fallback
    source = source.lower()
    source = source.replace("&", " and ")
    source = re.sub(r"[^a-z0-9]+", "-", source)
    source = re.sub(r"-+", "-", source).strip("-")
    return source or fallback


def normalize_text(value):
    value = (value or "").strip()
    value = unicodedata.normalize("NFKC", value)
    value = re.sub(r"\s+", "", value)
    value = value.replace("（", "(").replace("）", ")")
    value = re.sub(r"[()（）/\\,，、:：;；._\-]", "", value)
    return value.lower()


def normalize_model(value):
    value = (value or "").strip()
    if not value or value == "无":
        return ""
    return re.sub(r"\s+", "", value).upper()


def parse_xlsx_sheet(path):
    with zipfile.ZipFile(path) as z:
        shared = []
        shared_root = ET.fromstring(z.read("xl/sharedStrings.xml"))
        for si in shared_root.findall("a:si", NS):
            shared.append("".join(t.text or "" for t in si.iterfind(".//a:t", NS)))

        sheet = ET.fromstring(z.read("xl/worksheets/sheet1.xml"))
        parsed_rows = []
        for row in sheet.findall(".//a:sheetData/a:row", NS):
            values = {}
            for cell in row.findall("a:c", NS):
                ref = cell.attrib.get("r", "")
                match = re.match(r"[A-Z]+", ref)
                if not match:
                    continue
                column = match.group(0)
                cell_type = cell.attrib.get("t")
                node_value = cell.find("a:v", NS)
                inline_value = cell.find("a:is", NS)

                value = ""
                if cell_type == "s" and node_value is not None:
                    value = shared[int(node_value.text)]
                elif cell_type == "inlineStr" and inline_value is not None:
                    value = "".join(t.text or "" for t in inline_value.iterfind(".//a:t", NS))
                elif node_value is not None:
                    value = node_value.text or ""

                values[column] = value.strip()
            if values:
                parsed_rows.append({"row": int(row.attrib["r"]), "values": values})
    return parsed_rows


def list_images(source_dir, aliases):
    image_roots = [
        source_dir / "三级分类图片（2）",
        source_dir / "三级类目图片",
    ]
    image_index = defaultdict(list)
    all_images = []

    for root in image_roots:
        if root.exists():
            for folder in root.iterdir():
                if folder.is_dir() and not folder.name.startswith("._"):
                    collect_folder_images(folder, image_index, all_images)

    handle_folder = source_dir / "8.拉手解决方案"
    if handle_folder.exists():
        collect_folder_images(handle_folder, image_index, all_images, forced_category="拉手解决方案")

    category_aliases = aliases.get("categoryFolders", {})
    for category_name, folder_name in category_aliases.items():
        candidate = (source_dir / "三级类目图片" / folder_name).resolve()
        if not candidate.exists():
            candidate = (source_dir / "三级分类图片（2）" / folder_name).resolve()
        if candidate.exists() and candidate.is_dir():
            collect_folder_images(candidate, image_index, all_images, forced_category=category_name)

    return image_index, all_images


def collect_folder_images(folder, image_index, all_images, forced_category=None):
    category_name = forced_category or re.sub(r"^\d+\.", "", folder.name).strip()
    for path in folder.iterdir():
        if not path.is_file() or path.name.startswith("._"):
            continue
        if path.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp"}:
            continue
        name, model = split_image_name(path.stem)
        record = {
            "categoryName": category_name,
            "name": name,
            "model": normalize_model(model),
            "originalFileName": path.name,
            "sourcePath": path,
            "used": False,
        }
        all_images.append(record)
        for key in image_keys(category_name, name, record["model"]):
            image_index[key].append(record)


def split_image_name(stem):
    stem = stem.strip()
    if "-" not in stem:
        return stem, ""
    name, model = stem.rsplit("-", 1)
    return name.strip(), model.strip()


def image_keys(category_name, item_name, model):
    normalized_category = normalize_text(category_name)
    normalized_name = normalize_text(item_name)
    keys = [
        (normalized_category, normalized_name, model),
        (normalized_category, normalized_name, ""),
    ]
    return keys


def find_image(row, image_index, aliases):
    category = row["categoryName"]
    name = row["itemName"]
    model = normalize_model(row["model"])
    candidates = [(name, model), (name, "")]

    for alias in aliases.get("imageNames", {}).get(name, []):
        candidates.append((alias, model))
        candidates.append((alias, ""))

    for candidate_name, candidate_model in candidates:
        key = (normalize_text(category), normalize_text(candidate_name), candidate_model)
        matches = [item for item in image_index.get(key, []) if not item["used"]]
        if matches:
            return matches[0], "exact" if candidate_name == name else "alias"

    return None, "missing"


def make_category_node(slug, name, name_en, depth):
    return {
        "slug": slug,
        "name": name,
        "nameEn": name_en,
        "description": f"{name}产品分类与资料入口",
        "overview": f"按{name}的二级、三级类目组织图片、型号和基础资料。",
        "depth": depth,
        "children": [],
    }


def infer_visual(category_en, name_en, name_cn):
    source = f"{category_en} {name_en} {name_cn}".lower()
    if "hinge" in source or "铰链" in source or "合页" in source:
        return "hinge"
    if "slide" in source or "滑轨" in source or "抽" in source:
        return "slide"
    if "handle" in source or "knob" in source or "拉手" in source or "粒拉" in source:
        return "handle"
    if "lock" in source or "锁" in source:
        return "lock"
    if "support" in source or "stay" in source or "支撑" in source:
        return "support"
    return "handle"


def infer_material(name):
    for keyword in ["铝合金", "锌合金", "不锈钢", "塑料", "塑胶", "铁", "铜", "玻璃", "木质"]:
        if keyword in name:
            return keyword
    return "未指定"


def copy_image(image, product_slug, category_slug):
    if not image:
        return ""
    target_dir = IMAGE_OUT_DIR / category_slug
    target_dir.mkdir(parents=True, exist_ok=True)
    target_name = f"{product_slug}{image['sourcePath'].suffix.lower()}"
    target = target_dir / target_name
    shutil.copyfile(image["sourcePath"], target)
    for apple_double in target_dir.glob("._*"):
        apple_double.unlink()
    return f"/catalog-images/{category_slug}/{target_name}"


def remove_apple_double_files(path):
    if not path.exists():
        return
    for apple_double in path.rglob("._*"):
        if apple_double.is_file():
            apple_double.unlink()


def build_catalog(rows, image_index, all_images, aliases):
    categories = []
    category_map = OrderedDict()
    products = []
    report = {
        "sourceExcel": str(EXCEL_PATH.relative_to(ROOT)),
        "sourceImages": str(SOURCE_DIR.relative_to(ROOT)),
        "totalRows": 0,
        "products": 0,
        "matchedImages": 0,
        "aliasMatches": 0,
        "missingImages": [],
        "unusedImages": [],
        "duplicateSlugs": [],
        "slashRows": [],
    }
    slug_counts = defaultdict(int)

    if IMAGE_OUT_DIR.exists():
        shutil.rmtree(IMAGE_OUT_DIR, ignore_errors=True)
    IMAGE_OUT_DIR.mkdir(parents=True, exist_ok=True)

    for raw in rows[1:]:
        values = raw["values"]
        level1_en = values.get("C", "")
        level1_cn = values.get("D", "")
        level2_en = values.get("E", "")
        level2_cn = values.get("F", "")
        level3_en = values.get("G", "")
        level3_cn = values.get("H", "")
        model = values.get("I", "")
        note = values.get("K", "")

        if not level1_en or not level1_cn or not level2_en or not level2_cn:
            continue

        report["totalRows"] += 1
        level1_slug = slugify(level1_en, f"category-{len(categories) + 1}")
        level2_slug = slugify(level2_en, f"{level1_slug}-group")

        if level1_slug not in category_map:
            node = make_category_node(level1_slug, level1_cn, level1_en, 1)
            category_map[level1_slug] = {"node": node, "children": OrderedDict()}
            categories.append(node)

        category_record = category_map[level1_slug]
        if level2_slug not in category_record["children"]:
            node = make_category_node(level2_slug, level2_cn, level2_en, 2)
            category_record["children"][level2_slug] = {"node": node, "children": OrderedDict()}
            category_record["node"]["children"].append(node)

        second_record = category_record["children"][level2_slug]

        is_slash_row = level3_en == "/" or level3_cn == "/"
        item_name = level2_cn if is_slash_row else level3_cn
        item_name_en = level2_en if is_slash_row else level3_en
        path = [level1_slug, level2_slug]

        if is_slash_row:
            report["slashRows"].append({
                "row": raw["row"],
                "category": level1_cn,
                "item": item_name,
            })
        else:
            level3_slug = slugify(level3_en, f"{level2_slug}-{len(second_record['children']) + 1}")
            if level3_slug not in second_record["children"]:
                node = make_category_node(level3_slug, level3_cn, level3_en, 3)
                second_record["children"][level3_slug] = node
                second_record["node"]["children"].append(node)
            path.append(level3_slug)

        base_slug_source = normalize_model(model) or item_name_en or item_name
        base_slug = slugify(base_slug_source, f"item-{raw['row']}")
        slug_counts[base_slug] += 1
        product_slug = base_slug if slug_counts[base_slug] == 1 else f"{base_slug}-{slug_counts[base_slug]}"
        if slug_counts[base_slug] > 1:
            report["duplicateSlugs"].append(product_slug)

        row_record = {
            "categoryName": level1_cn,
            "itemName": item_name,
            "model": model,
        }
        matched_image, match_type = find_image(row_record, image_index, aliases)
        if matched_image:
            matched_image["used"] = True
            report["matchedImages"] += 1
            if match_type == "alias":
                report["aliasMatches"] += 1
        else:
            report["missingImages"].append({
                "row": raw["row"],
                "category": level1_cn,
                "name": item_name,
                "model": model,
            })

        image_url = copy_image(matched_image, product_slug, level1_slug)
        material = infer_material(item_name)
        clean_model = "" if model == "无" else model

        products.append({
            "slug": product_slug,
            "model": clean_model,
            "sku": clean_model,
            "name": item_name,
            "nameEn": item_name_en,
            "summary": f"{level1_cn} / {level2_cn} / {item_name}",
            "visual": infer_visual(level1_en, item_name_en, item_name),
            "image": image_url,
            "imageSource": matched_image["originalFileName"] if matched_image else "",
            "series": clean_model.split(".")[0] + " Series" if "." in clean_model else "未指定",
            "material": material,
            "finish": "未指定",
            "color": "未指定",
            "installation": "未指定",
            "length": None,
            "holeSpacing": None,
            "weight": None,
            "surface": "未指定",
            "path": path,
            "features": [level1_cn, level2_cn],
            "downloads": ["图片资料"] if image_url else [],
            "applications": [level1_cn],
            "source": {
                "row": raw["row"],
                "engineer": values.get("B", ""),
                "note": note,
                "isSecondLevelItem": is_slash_row,
            },
        })

    for image in all_images:
        if not image["used"]:
            report["unusedImages"].append({
                "category": image["categoryName"],
                "name": image["name"],
                "model": image["model"],
                "file": image["originalFileName"],
            })

    report["products"] = len(products)
    return {"categories": categories, "products": products}, report


def main():
    if not EXCEL_PATH.exists():
        raise SystemExit(f"Excel not found: {EXCEL_PATH}")

    aliases = load_aliases()
    rows = parse_xlsx_sheet(EXCEL_PATH)
    image_index, all_images = list_images(SOURCE_DIR, aliases)
    catalog, report = build_catalog(rows, image_index, all_images, aliases)
    remove_apple_double_files(IMAGE_OUT_DIR)

    GENERATED_DIR.mkdir(parents=True, exist_ok=True)
    with CATALOG_OUT.open("w", encoding="utf-8") as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)
        f.write("\n")
    with REPORT_OUT.open("w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"Imported {report['products']} catalog items")
    print(f"Matched images: {report['matchedImages']}")
    print(f"Missing images: {len(report['missingImages'])}")
    print(f"Unused images: {len(report['unusedImages'])}")
    print(f"Wrote {CATALOG_OUT.relative_to(ROOT)}")
    print(f"Wrote {REPORT_OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
