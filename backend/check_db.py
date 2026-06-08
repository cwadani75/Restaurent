#!/usr/bin/env python3
import os
import sys
from config import Config
from database import db
from flask import Flask
from models import User

# Create a simple Flask app context
app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

with app.app_context():
    print("\n=== Database Check ===")
    print(f"Database path: {Config.DB_PATH}")
    print(f"Database exists: {os.path.exists(Config.DB_PATH)}")
    
    try:
        # Check all users
        users = User.query.all()
        print(f"\nTotal users in database: {len(users)}")
        
        if users:
            print("\nUsers:")
            for user in users:
                print(f"  - ID: {user.id}, Email: {user.email}, Role: {user.role}, Name: {user.name}")
        else:
            print("No users found in database!")
        
        # Check specifically for admin
        admin = User.query.filter_by(email="admin@sowda.com").first()
        if admin:
            print(f"\n✓ Admin user found!")
            print(f"  Email: {admin.email}")
            print(f"  Role: {admin.role}")
            print(f"  Name: {admin.name}")
            print(f"  Password hash exists: {bool(admin.password_hash)}")
            
            # Test password
            test_password = "SowdaDash123!"
            is_valid = admin.check_password(test_password)
            print(f"  Password check result: {is_valid}")
        else:
            print("\n✗ Admin user NOT found!")
            
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
