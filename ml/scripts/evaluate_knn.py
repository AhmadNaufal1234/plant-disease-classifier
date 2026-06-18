import os
import cv2
import json
import joblib
import numpy as np

from pathlib import Path
from skimage.feature import graycomatrix, graycoprops

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix
)

# ==========================
# PATH
# ==========================
BASE_DIR = Path(__file__).resolve().parent.parent

TEST_DIR = (
    BASE_DIR
    / "dataset"
    / "testing"
)

MODEL_PATH = (
    BASE_DIR
    / "models"
    / "knn_model.pkl"
)

SCALER_PATH = (
    BASE_DIR
    / "models"
    / "scaler.pkl"
)

OUTPUT_PATH = (
    BASE_DIR
    / "models"
    / "evaluation_result.json"
)

# ==========================
# HSV FEATURE
# ==========================
def extract_hsv(image):
    hsv = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2HSV
    )

    return [
        np.mean(hsv[:, :, 0]),
        np.mean(hsv[:, :, 1]),
        np.mean(hsv[:, :, 2]),
    ]


# ==========================
# GLCM FEATURE
# ==========================
def extract_glcm(image):
    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    glcm = graycomatrix(
        gray,
        distances=[1],
        angles=[0],
        levels=256,
        symmetric=True,
        normed=True
    )

    return [
        graycoprops(glcm, "contrast")[0, 0],
        graycoprops(glcm, "correlation")[0, 0],
        graycoprops(glcm, "energy")[0, 0],
        graycoprops(glcm, "homogeneity")[0, 0],
    ]


# ==========================
# LOAD MODEL
# ==========================
print("=" * 50)
print("MEMUAT MODEL")
print("=" * 50)

model = joblib.load(
    MODEL_PATH
)

scaler = joblib.load(
    SCALER_PATH
)

# ==========================
# LOAD TEST DATA
# ==========================
X_test = []
y_true = []

for plant in os.listdir(TEST_DIR):

    plant_path = (
        TEST_DIR
        / plant
    )

    if not plant_path.is_dir():
        continue

    for disease in os.listdir(plant_path):

        disease_path = (
            plant_path
            / disease
        )

        if not disease_path.is_dir():
            continue

        for file_name in os.listdir(disease_path):

            image_path = (
                disease_path
                / file_name
            )

            image = cv2.imread(
                str(image_path)
            )

            if image is None:
                continue

            image = cv2.resize(
                image,
                (128, 128)
            )

            hsv = extract_hsv(image)
            glcm = extract_glcm(image)

            features = (
                hsv + glcm
            )

            X_test.append(features)

            y_true.append(
                f"{plant}_{disease}"
            )

print(
    f"Jumlah Data Testing : {len(X_test)}"
)

# ==========================
# NORMALISASI
# ==========================
X_test = scaler.transform(
    X_test
)

# ==========================
# PREDIKSI
# ==========================
y_pred = model.predict(
    X_test
)

# ==========================
# EVALUASI
# ==========================
accuracy = accuracy_score(
    y_true,
    y_pred
)

precision = precision_score(
    y_true,
    y_pred,
    average="weighted",
    zero_division=0
)

recall = recall_score(
    y_true,
    y_pred,
    average="weighted",
    zero_division=0
)

f1 = f1_score(
    y_true,
    y_pred,
    average="weighted",
    zero_division=0
)

cm = confusion_matrix(
    y_true,
    y_pred
)

# ==========================
# HASIL
# ==========================
print("=" * 50)
print("HASIL EVALUASI")
print("=" * 50)

print(
    f"Akurasi  : {accuracy:.4f}"
)

print(
    f"Precision: {precision:.4f}"
)

print(
    f"Recall   : {recall:.4f}"
)

print(
    f"F1 Score : {f1:.4f}"
)

# ==========================
# SIMPAN JSON
# ==========================
result = {
    "k_value": 3,
    "train_test_split": "80:20",
    "total_testing": len(X_test),
    "accuracy": round(float(accuracy), 4),
    "precision": round(float(precision), 4),
    "recall": round(float(recall), 4),
    "f1_score": round(float(f1), 4),
    "confusion_matrix": cm.tolist()
}

with open(
    OUTPUT_PATH,
    "w"
) as f:

    json.dump(
        result,
        f,
        indent=4
    )

print("=" * 50)
print("EVALUASI BERHASIL DISIMPAN")
print(
    f"Lokasi : {OUTPUT_PATH}"
)
print("=" * 50)