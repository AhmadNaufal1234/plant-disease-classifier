from database import get_db, init_db

init_db()

conn = get_db()

# ==========================
# SEED: TANAMAN
# ==========================
tanaman_data = [
    {
        "nama": "Cabai",
        "nama_latin": "Capsicum annuum",
        "deskripsi": "Tanaman hortikultura yang buahnya banyak digunakan sebagai bumbu masakan pedas di Indonesia."
    },
    {
        "nama": "Tomat",
        "nama_latin": "Solanum lycopersicum",
        "deskripsi": "Tanaman hortikultura penghasil buah tomat yang banyak dibudidayakan sebagai bahan pangan dan bumbu masakan."
    },
]

tanaman_ids = {}

for t in tanaman_data:
    cursor = conn.execute(
        "INSERT INTO tanaman (nama, nama_latin, deskripsi) VALUES (?, ?, ?)",
        (t["nama"], t["nama_latin"], t["deskripsi"])
    )
    tanaman_ids[t["nama"]] = cursor.lastrowid

conn.commit()
print("Tanaman berhasil ditambahkan:", tanaman_ids)

# ==========================
# SEED: PENYAKIT
# ==========================
penyakit_data = [
    {
        "tanaman": "Cabai",
        "nama_penyakit": "Bacterial Spot",
        "gejala": "Muncul bercak kecil berwarna coklat kehitaman pada daun, biasanya dikelilingi halo kuning. Pada serangan berat, daun bisa rontok.",
        "penyebab": "Disebabkan oleh bakteri Xanthomonas campestris pv. vesicatoria yang menyebar melalui percikan air hujan, alat pertanian, atau benih yang terinfeksi.",
        "solusi": "Gunakan benih bebas penyakit, terapkan rotasi tanam, hindari penyiraman dari atas (overhead), dan semprotkan bakterisida berbahan tembaga jika diperlukan."
    },
    {
        "tanaman": "Tomat",
        "nama_penyakit": "Bacterial Spot",
        "gejala": "Bercak kecil berair pada daun yang berkembang menjadi bercak coklat gelap dengan tepi kuning, dapat juga menyerang batang dan buah.",
        "penyebab": "Disebabkan oleh bakteri Xanthomonas spp., menyebar lewat percikan air, angin, dan kontak antar tanaman yang terinfeksi.",
        "solusi": "Rotasi tanaman, gunakan mulsa untuk mengurangi percikan tanah ke daun, serta aplikasikan bakterisida tembaga secara berkala."
    },
    {
        "tanaman": "Tomat",
        "nama_penyakit": "Early Blight",
        "gejala": "Bercak coklat berbentuk cincin konsentris (seperti target) pada daun tua terlebih dahulu, kemudian menyebar ke daun muda.",
        "penyebab": "Disebabkan oleh jamur Alternaria solani, berkembang pesat pada kondisi lembap dan suhu hangat.",
        "solusi": "Buang dan musnahkan daun yang terinfeksi, jaga jarak tanam agar sirkulasi udara baik, gunakan fungisida berbahan aktif klorotalonil atau mankozeb."
    },
    {
        "tanaman": "Tomat",
        "nama_penyakit": "Late Blight",
        "gejala": "Bercak besar berwarna coklat kehitaman dengan tepi basah pada daun, dapat menyebar cepat ke seluruh tanaman dalam beberapa hari.",
        "penyebab": "Disebabkan oleh oomycete Phytophthora infestans, sangat aktif pada kondisi lembap dan suhu sejuk.",
        "solusi": "Segera pangkas dan musnahkan bagian tanaman yang terinfeksi, perbaiki drainase lahan, dan gunakan fungisida sistemik sesuai anjuran."
    },
    {
        "tanaman": "Tomat",
        "nama_penyakit": "Leaf Mold",
        "gejala": "Bercak kuning pucat di permukaan atas daun, sementara di permukaan bawah daun muncul lapisan jamur berwarna hijau zaitun hingga coklat.",
        "penyebab": "Disebabkan oleh jamur Passalora fulva (sebelumnya Fulvia fulva), berkembang pesat pada kelembapan tinggi terutama di rumah kaca/greenhouse.",
        "solusi": "Tingkatkan sirkulasi udara di sekitar tanaman, kurangi kelembapan berlebih, dan aplikasikan fungisida jika serangan meluas."
    },
]

for p in penyakit_data:
    tanaman_id = tanaman_ids[p["tanaman"]]
    conn.execute(
        """INSERT INTO penyakit (tanaman_id, nama_penyakit, gejala, penyebab, solusi)
           VALUES (?, ?, ?, ?, ?)""",
        (tanaman_id, p["nama_penyakit"], p["gejala"], p["penyebab"], p["solusi"])
    )

conn.commit()
conn.close()

print(f"Berhasil menambahkan {len(penyakit_data)} data penyakit!")