from app.database.session import SessionLocal
from app.models.admin import Admin
from app.auth.password import hash_password

db = SessionLocal()

username = "admin"
password = "Admin@123"

existing = db.query(Admin).filter(Admin.username == username).first()

if existing:
    print("❌ Admin already exists.")
else:
    admin = Admin(
        full_name="Mahesh Yadav",
        username=username,
        mobile_number="9876543210",
        password_hash=hash_password(password),
        role="ADMIN",
        is_active=True,
    )

    db.add(admin)
    db.commit()

    print("✅ Admin created successfully!")
    print(f"Username: {username}")
    print(f"Password: {password}")

db.close()