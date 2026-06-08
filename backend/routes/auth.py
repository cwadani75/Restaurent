from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import User
from database import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    if not name or not email or not password:
        return jsonify({'error': 'Name, email, and password are required'}), 400
        
    if User.query.filter_by(email=email).first() is not None:
        return jsonify({'error': 'Email is already registered'}), 400
        
    user = User(name=name, email=email)
    user.set_password(password)
    
    # If the email matches the admin address, grant admin role
    if email.lower() == 'admin@sowda.com':
        user.role = 'admin'
        
    db.session.add(user)
    db.session.commit()
    
    return jsonify({
        'message': 'Registration successful',
        'user': user.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
        
    user = User.query.filter_by(email=email).first()
    if user is None or not user.check_password(password):
        return jsonify({'error': 'Invalid email or password'}), 401

    if user.role == 'admin':
        return jsonify({'error': 'Admin users must sign in through the admin login page.'}), 403
        
    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        'access_token': access_token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/admin-login', methods=['POST'])
def admin_login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    
    print(f"[ADMIN LOGIN] Attempting login with email: {email}")
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
        
    user = User.query.filter_by(email=email).first()
    print(f"[ADMIN LOGIN] User found: {user is not None}")
    
    if user is None:
        print(f"[ADMIN LOGIN] No user with email {email}")
        return jsonify({'error': 'Invalid email or password'}), 401
    
    password_valid = user.check_password(password)
    print(f"[ADMIN LOGIN] Password valid: {password_valid}")
    
    if not password_valid:
        print(f"[ADMIN LOGIN] Password check failed for {email}")
        return jsonify({'error': 'Invalid email or password'}), 401

    print(f"[ADMIN LOGIN] User role: {user.role}")
    if user.role != 'admin':
        print(f"[ADMIN LOGIN] User {email} is not admin, role is {user.role}")
        return jsonify({'error': 'Admin access required. Use the user login page instead.'}), 403
    
    print(f"[ADMIN LOGIN] Creating token for admin user {email}")
    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        'access_token': access_token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))
    if user is None:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'user': user.to_dict()}), 200

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))
    if user is None:
        return jsonify({'error': 'User not found'}), 404
        
    data = request.get_json() or {}
    user.name = data.get('name', user.name)
    
    new_email = data.get('email')
    if new_email and new_email != user.email:
        if User.query.filter_by(email=new_email).first() is not None:
            return jsonify({'error': 'Email already in use'}), 400
        user.email = new_email
        
    password = data.get('password')
    if password:
        user.set_password(password)
        
    db.session.commit()
    return jsonify({
        'message': 'Profile updated successfully',
        'user': user.to_dict()
    }), 200
