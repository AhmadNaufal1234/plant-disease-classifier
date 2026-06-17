from flask import Flask, request, jsonify
from flask_cors import CORS

import cv2
import joblib
import numpy as np

from pathlib import Path
from skimage.feature import graycomatrix, graycoprops

app = Flask(__name__)
CORS(app)

# ==========================
# LOAD MODEL
# ==========================
BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = (
    BASE_DIR.parent
    / "ml"
    / "models"
    / "knn_model.pkl"
)

model = joblib.load(MODEL_PATH)

# ==========================
# HSV FEATURE
# ==========================
def extract_hsv(image):
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    h_mean = np.mean(hsv[:, :, 0])
    s_mean = np.mean(hsv[:, :, 1])
    v_mean = np.mean(hsv[:, :, 2])

    return [h_mean, s_mean, v_mean]


# ==========================
# GLCM FEATURE
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

    return [
        contrast,
        correlation,
        energy,
        homogeneity
    ]


# ==========================
# PREDICT
# ==========================
@app.route("/predict", methods=["POST"])
def predict():

    try:

        if "image" not in request.files:
            return jsonify({
                "error": "image not found"
            }), 400

        file = request.files["image"]

        image_bytes = np.frombuffer(
            file.read(),
            np.uint8
        )

        image = cv2.imdecode(
            image_bytes,
            cv2.IMREAD_COLOR
        )

        if image is None:
            return jsonify({
                "error": "invalid image"
            }), 400

        image = cv2.resize(
            image,
            (128, 128)
        )

        # Extract Feature
        hsv = extract_hsv(image)
        glcm = extract_glcm(image)

        features = np.array(
            [hsv + glcm]
        )

        # Predict
        prediction = model.predict(features)[0]

        # Confidence
        probabilities = model.predict_proba(features)

        confidence = float(
            np.max(probabilities) * 100
        )

        # Split label
        parts = prediction.split("_", 1)

        plant = parts[0]

        disease = (
            parts[1]
            if len(parts) > 1
            else "unknown"
        )

        return jsonify({
            "plant": plant,
            "disease": disease,
            "confidence": round(confidence, 2)
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# ==========================
# HOME
# ==========================
@app.route("/")
def home():

    return jsonify({
        "message": "AgroScan AI API Running"
    })


# ==========================
# RUN
# ==========================
if __name__ == "__main__":
    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )