import os
import cv2
import numpy as np
import pandas as pd

from pathlib import Path
from skimage.feature import graycomatrix, graycoprops

# ==========================
# PATH
# ==========================
BASE_DIR = Path(__file__).resolve().parent.parent
TRAIN_DIR = BASE_DIR / "dataset" / "training"
FEATURE_DIR = BASE_DIR / "features"

FEATURE_DIR.mkdir(exist_ok=True)

# ==========================
# FUNGSI HSV
# ==========================
def extract_hsv(image):
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    h_mean = np.mean(hsv[:, :, 0])
    s_mean = np.mean(hsv[:, :, 1])
    v_mean = np.mean(hsv[:, :, 2])

    return [h_mean, s_mean, v_mean]


# ==========================
# FUNGSI GLCM
# ==========================
def extract_glcm(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    glcm = graycomatrix(
        gray,
        distances=[1],
        angles=[0],
        levels=256,
        symmetric=True,
        normed=True
    )

    contrast = graycoprops(glcm, "contrast")[0, 0]
    correlation = graycoprops(glcm, "correlation")[0, 0]
    energy = graycoprops(glcm, "energy")[0, 0]
    homogeneity = graycoprops(glcm, "homogeneity")[0, 0]

    return [contrast, correlation, energy, homogeneity]


# ==========================
# EKSTRAKSI
# ==========================
rows = []

print("=" * 50)
print("EKSTRAKSI FITUR TRAINING")
print("=" * 50)

for plant in os.listdir(TRAIN_DIR):
    plant_path = TRAIN_DIR / plant

    for disease in os.listdir(plant_path):
        disease_path = plant_path / disease

        for file_name in os.listdir(disease_path):
            image_path = disease_path / file_name

            image = cv2.imread(str(image_path))

            if image is None:
                continue

            image = cv2.resize(image, (128, 128))

            hsv_feature = extract_hsv(image)
            glcm_feature = extract_glcm(image)

            feature_vector = (
                hsv_feature +
                glcm_feature +
                [plant, disease]
            )

            rows.append(feature_vector)

        print(f"✔ {plant}/{disease}")

# ==========================
# SIMPAN CSV
# ==========================
columns = [
    "h_mean",
    "s_mean",
    "v_mean",
    "contrast",
    "correlation",
    "energy",
    "homogeneity",
    "plant",
    "label"
]

df = pd.DataFrame(rows, columns=columns)

output_path = FEATURE_DIR / "train_features.csv"
df.to_csv(output_path, index=False)

print("=" * 50)
print("Jumlah Data :", len(df))
print("File Tersimpan :", output_path)
print("=" * 50)