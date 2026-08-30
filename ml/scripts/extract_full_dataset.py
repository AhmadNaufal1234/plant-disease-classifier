import os
import sys
import cv2
import pandas as pd

from pathlib import Path

# ==========================
# PATH
# ==========================
BASE_DIR = Path(__file__).resolve().parent.parent
DATASET_DIR = BASE_DIR / "dataset"
FEATURE_DIR = BASE_DIR / "features"

FEATURE_DIR.mkdir(exist_ok=True)

# Import fungsi ekstraksi yang SAMA dipakai training, predict & evaluasi
from extractor import extract_features, FEATURE_COLUMNS

# Folder yang digabung jadi satu dataset lengkap.
# "raw" SENGAJA tidak dimasukkan karena isinya duplikat dari training+testing
# (kalau ikut diproses, data akan dobel dan bikin evaluasi bias).
SOURCE_FOLDERS = ["training", "testing"]

# ==========================
# EKSTRAKSI
# ==========================
rows = []
seen_files = set()  # untuk deteksi duplikat filename dalam plant+disease yang sama
duplicate_count = 0

print("=" * 50)
print("EKSTRAKSI FITUR DATASET LENGKAP (training + testing)")
print("=" * 50)

for source in SOURCE_FOLDERS:
    source_path = DATASET_DIR / source

    if not source_path.exists():
        print(f"⚠ Folder '{source}' tidak ditemukan, dilewati.")
        continue

    for plant in os.listdir(source_path):
        plant_path = source_path / plant

        if not plant_path.is_dir():
            continue

        for disease in os.listdir(plant_path):
            disease_path = plant_path / disease

            if not disease_path.is_dir():
                continue

            count_this_class = 0

            for file_name in os.listdir(disease_path):
                image_path = disease_path / file_name

                # Kunci unik untuk deteksi duplikat lintas folder (training vs testing)
                dedupe_key = (plant, disease, file_name)
                if dedupe_key in seen_files:
                    duplicate_count += 1
                    continue
                seen_files.add(dedupe_key)

                image = cv2.imread(str(image_path))

                if image is None:
                    continue

                # extract_features() sudah handle resize + segmentasi di dalamnya
                feature_vector = extract_features(image)

                row = feature_vector + [plant, disease]
                rows.append(row)
                count_this_class += 1

            print(f"✔ [{source}] {plant}/{disease} → {count_this_class} gambar")

# ==========================
# SIMPAN CSV
# ==========================
columns = FEATURE_COLUMNS + ["plant", "label"]

df = pd.DataFrame(rows, columns=columns)

# Menimpa train_features.csv yang lama — file inilah yang dibaca run_evaluation()
output_path = FEATURE_DIR / "train_features.csv"
df.to_csv(output_path, index=False)

print("=" * 50)
print("Jumlah Data Total   :", len(df))
print("Jumlah Duplikat     :", duplicate_count, "(dilewati)")
print("Jumlah Fitur        :", len(FEATURE_COLUMNS))
print("File Tersimpan      :", output_path)
print("=" * 50)