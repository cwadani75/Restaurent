from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from models import User
from database import db

def admin_required():
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = db.session.get(User, int(user_id))
            if user is None or user.role != 'admin':
                return jsonify({'error': 'Admin privileges required'}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator
