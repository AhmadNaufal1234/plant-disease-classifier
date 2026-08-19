from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
load_dotenv()

import cv2
import joblib
import numpy as np
import sys
import jwt
import datetime
import os

from pathlib import Path
from database import get_db, init_db

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

JWT_SECRET = os.environ.get("JWT_SECRET", "ganti-dengan-secret-random-kamu")

# ==========================
# PATH SETUP
# ==========================
BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent

sys.path.append(str(PROJECT_ROOT))
sys.path.append(str(PROJECT_ROOT / "ml" / "scripts"))

from ml.core.evaluation import run_evaluation
from extractor import extract_features  # fungsi ekstraksi yang SAMA dengan training

# ==========================
# INIT DATABASE (admin, tanaman, penyakit, dll)
# ==========================
init_db()

# ==========================
# LOAD MODEL
# ==========================
MODEL_PATH = PROJECT_ROOT / "ml" / "models" / "knn_model.pkl"
SCALER_PATH = PROJECT_ROOT / "ml" / "models" / "scaler.pkl"

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

# ==========================
# PREDICT
# ==========================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        if "image" not in request.files:
            return jsonify({"error": "image not found"}), 400

        file = request.files["image"]

        image_bytes = np.frombuffer(file.read(), np.uint8)
        image = cv2.imdecode(image_bytes, cv2.IMREAD_COLOR)

        if image is None:
            return jsonify({"error": "invalid image"}), 400

        # extract_features() sudah handle resize (160x160) + segmentasi daun
        # di dalamnya sendiri — TIDAK perlu resize manual di sini lagi
        features = np.array([extract_features(image)])

        features = scaler.transform(features)

        # Predict
        prediction = model.predict(features)[0]

        # Confidence
        probabilities = model.predict_proba(features)
        confidence = float(np.max(probabilities) * 100)

        # Split label
        parts = prediction.split("_", 1)
        plant = parts[0]
        disease = parts[1] if len(parts) > 1 else "unknown"

        # ==========================
        # SIMPAN KE RIWAYAT_DETEKSI
        # ==========================
        conn = get_db()
        conn.execute(
            """INSERT INTO riwayat_deteksi (gambar_url, tanaman_terdeteksi, penyakit_terdeteksi, confidence)
               VALUES (?, ?, ?, ?)""",
            ("", plant, disease, round(confidence, 2))
        )
        conn.commit()
        conn.close()

        return jsonify({
            "plant": plant,
            "disease": disease,
            "confidence": round(confidence, 2)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==========================
# HOME
# ==========================
@app.route("/")
def home():
    return jsonify({"message": "AgroScan AI API Running"})


# ==========================
# EVALUATE MODEL
# ==========================
@app.route("/evaluate", methods=["POST"])
def evaluate():
    try:
        data = request.get_json()
        k = int(data["k"])
        split = data["split"]

        csv_path = PROJECT_ROOT / "ml" / "features" / "train_features.csv"

        result = run_evaluation(csv_path=csv_path, k=k, split=split)

        # ==========================
        # SIMPAN KE EVALUASI_MODEL
        # ==========================
        conn = get_db()
        conn.execute(
            """INSERT INTO evaluasi_model (k_value, split, accuracy, precision_score, recall, f1_score)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (k, split, result.get("accuracy"), result.get("precision"), result.get("recall"), result.get("f1_score"))
        )
        conn.commit()
        conn.close()

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==========================
# ADMIN LOGIN
# ==========================
@app.route("/admin/login", methods=["POST"])
def admin_login():
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        conn = get_db()
        admin = conn.execute(
            "SELECT * FROM admins WHERE username = ?", (username,)
        ).fetchone()
        conn.close()

        if not admin or not bcrypt.check_password_hash(admin["password_hash"], password):
            return jsonify({"success": False, "message": "Username atau password salah"}), 401

        token = jwt.encode(
            {
                "id": admin["id"],
                "username": admin["username"],
                "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1),
            },
            JWT_SECRET,
            algorithm="HS256",
        )

        return jsonify({"success": True, "token": token})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ==========================
# ADMIN REGISTER (tambah admin baru)
# ==========================
@app.route("/admin/register", methods=["POST"])
def admin_register():
    try:
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")

        try:
            jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        except Exception:
            return jsonify({"success": False, "message": "Unauthorized"}), 401

        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"success": False, "message": "Username dan password wajib diisi"}), 400

        if len(password) < 6:
            return jsonify({"success": False, "message": "Password minimal 6 karakter"}), 400

        conn = get_db()
        existing = conn.execute(
            "SELECT id FROM admins WHERE username = ?", (username,)
        ).fetchone()

        if existing:
            conn.close()
            return jsonify({"success": False, "message": "Username sudah digunakan"}), 409

        password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

        conn.execute(
            "INSERT INTO admins (username, password_hash) VALUES (?, ?)",
            (username, password_hash)
        )
        conn.commit()
        conn.close()

        return jsonify({"success": True, "message": "Admin berhasil ditambahkan"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
# ==========================
# GET TANAMAN
# ==========================
@app.route("/tanaman", methods=["GET"])
def get_tanaman():
    conn = get_db()
    rows = conn.execute("SELECT * FROM tanaman ORDER BY nama").fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])


# ==========================
# GET PENYAKIT (opsional: filter by tanaman_id)
# ==========================
@app.route("/penyakit", methods=["GET"])
def get_penyakit():
    tanaman_id = request.args.get("tanaman_id")
    conn = get_db()

    if tanaman_id:
        rows = conn.execute(
            "SELECT * FROM penyakit WHERE tanaman_id = ? ORDER BY nama_penyakit",
            (tanaman_id,)
        ).fetchall()
    else:
        rows = conn.execute("SELECT * FROM penyakit ORDER BY nama_penyakit").fetchall()

    conn.close()
    return jsonify([dict(row) for row in rows])


# ==========================
# GET RIWAYAT DETEKSI
# ==========================
@app.route("/riwayat", methods=["GET"])
def get_riwayat():
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM riwayat_deteksi ORDER BY created_at DESC"
    ).fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])


# ==========================
# DELETE RIWAYAT (buat fitur hapus yang udah ada di halaman Riwayat)
# ==========================
@app.route("/riwayat/<int:riwayat_id>", methods=["DELETE"])
def delete_riwayat(riwayat_id):
    conn = get_db()
    conn.execute("DELETE FROM riwayat_deteksi WHERE id = ?", (riwayat_id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True})


# ==========================
# GET EVALUASI HISTORY (opsional, buat nampilin histori eksperimen di halaman ML)
# ==========================
@app.route("/evaluasi-history", methods=["GET"])
def get_evaluasi_history():
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM evaluasi_model ORDER BY created_at DESC LIMIT 20"
    ).fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])


# ==========================
# RUN
# ==========================
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)