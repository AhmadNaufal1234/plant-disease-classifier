from flask_bcrypt import Bcrypt
from database import get_db, init_db

bcrypt = Bcrypt()

init_db()

username = "admin"
password = "passwordkamu123"  # ganti sesuai keinginan

hashed = bcrypt.generate_password_hash(password).decode("utf-8")

conn = get_db()
try:
    conn.execute("INSERT INTO admins (username, password_hash) VALUES (?, ?)", (username, hashed))
    conn.commit()
    print("Admin berhasil dibuat!")
except Exception as e:
    print("Gagal:", e)
finally:
    conn.close()