import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "app.db")  # 1 file db buat semua tabel

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()

    # Tabel 1: admin
    conn.execute("""
        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Tabel 2: tanaman
    conn.execute("""
        CREATE TABLE IF NOT EXISTS tanaman (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nama TEXT NOT NULL,
            nama_latin TEXT,
            deskripsi TEXT,
            gambar_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Tabel 3: penyakit
    conn.execute("""
        CREATE TABLE IF NOT EXISTS penyakit (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tanaman_id INTEGER NOT NULL,
            nama_penyakit TEXT NOT NULL,
            gejala TEXT,
            penyebab TEXT,
            solusi TEXT,
            gambar_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (tanaman_id) REFERENCES tanaman(id)
        )
    """)

    # Tabel 4: riwayat_deteksi
    conn.execute("""
        CREATE TABLE IF NOT EXISTS riwayat_deteksi (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            gambar_url TEXT NOT NULL,
            tanaman_terdeteksi TEXT NOT NULL,
            penyakit_terdeteksi TEXT NOT NULL,
            confidence REAL NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Tabel 5: evaluasi_model
    conn.execute("""
        CREATE TABLE IF NOT EXISTS evaluasi_model (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            k_value INTEGER NOT NULL,
            split TEXT NOT NULL,
            accuracy REAL,
            precision_score REAL,
            recall REAL,
            f1_score REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    conn.close()