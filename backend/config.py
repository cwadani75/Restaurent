import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "restaurant_management_secret_key_2026")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "restaurant_management_jwt_key_2026")
    
    # Use absolute path for SQLite database
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    INSTANCE_PATH = os.path.join(BASE_DIR, 'instance')
    os.makedirs(INSTANCE_PATH, exist_ok=True)
    DB_PATH = os.path.join(INSTANCE_PATH, 'restaurant.db')
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{DB_PATH}"
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT configuration
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=2)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
