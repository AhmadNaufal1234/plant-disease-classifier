import pandas as pd
import joblib

from pathlib import Path

from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler

# ==========================
# PATH
# ==========================
BASE_DIR = Path(__file__).resolve().parent.parent

FEATURE_FILE = (
    BASE_DIR
    / "features"
    / "train_features.csv"
)

MODEL_DIR = (
    BASE_DIR
    / "models"
)

MODEL_DIR.mkdir(exist_ok=True)

# ==========================
# LOAD DATA
# ==========================
print("=" * 50)
print("MEMUAT DATA TRAINING")
print("=" * 50)

df = pd.read_csv(FEATURE_FILE)

X = df[
    [
        "h_mean",
        "s_mean",
        "v_mean",
        "contrast",
        "correlation",
        "energy",
        "homogeneity",
    ]
]

y = (
    df["plant"]
    + "_"
    + df["label"]
)

print(
    f"Jumlah Data : {len(df)}"
)

print(
    f"Jumlah Fitur : {X.shape[1]}"
)

# ==========================
# NORMALISASI
# ==========================
print("=" * 50)
print("NORMALISASI FITUR")
print("=" * 50)

scaler = StandardScaler()

X_scaled = scaler.fit_transform(X)

# ==========================
# TRAIN KNN
# ==========================
K_VALUE = 3

print("=" * 50)
print(
    f"MELATIH MODEL KNN (K={K_VALUE})"
)
print("=" * 50)

model = KNeighborsClassifier(
    n_neighbors=K_VALUE,
    metric="euclidean"
)

model.fit(
    X_scaled,
    y
)

# ==========================
# SIMPAN MODEL
# ==========================
model_path = (
    MODEL_DIR
    / "knn_model.pkl"
)

scaler_path = (
    MODEL_DIR
    / "scaler.pkl"
)

joblib.dump(
    model,
    model_path
)

joblib.dump(
    scaler,
    scaler_path
)

print("=" * 50)
print("MODEL BERHASIL DISIMPAN")
print(
    f"Model  : {model_path}"
)
print(
    f"Scaler : {scaler_path}"
)
print("=" * 50)