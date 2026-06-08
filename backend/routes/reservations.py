from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Reservation, User
from database import db
from routes.decorators import admin_required

reservations_bp = Blueprint('reservations', __name__)

@reservations_bp.route('', methods=['POST'])
@jwt_required(optional=True)
def create_reservation():
    current_user_id = get_jwt_identity()
    data = request.get_json() or {}
    
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    date_str = data.get('date')  # 'YYYY-MM-DD'
    time = data.get('time')      # '18:00'
    party_size = data.get('party_size')
    special_requests = data.get('special_requests')
    
    if not name or not email or not phone or not date_str or not time or not party_size:
        return jsonify({'error': 'Name, email, phone, date, time, and party size are required'}), 400
        
    try:
        date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Invalid date format. Please use YYYY-MM-DD'}), 400
        
    try:
        party_size = int(party_size)
        if party_size <= 0:
            raise ValueError()
    except ValueError:
        return jsonify({'error': 'Party size must be a positive number'}), 400
        
    reservation = Reservation(
        user_id=int(current_user_id) if current_user_id else None,
        name=name,
        email=email,
        phone=phone,
        date=date_obj,
        time=time,
        party_size=party_size,
        status='pending',
        special_requests=special_requests
    )
    
    db.session.add(reservation)
    db.session.commit()
    
    print(f"SMTP NOTIFICATION: Sent Reservation Confirmation Request to {email} for {party_size} guests on {date_str} at {time}.")
    
    return jsonify({
        'message': 'Reservation request submitted successfully',
        'reservation': reservation.to_dict()
    }), 201

@reservations_bp.route('', methods=['GET'])
@jwt_required()
def get_reservations():
    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))
    
    if user.role == 'admin':
        reservations = Reservation.query.order_by(Reservation.date.desc(), Reservation.time.desc()).all()
    else:
        reservations = Reservation.query.filter_by(user_id=int(user_id)).order_by(Reservation.date.desc()).all()
        
    return jsonify([r.to_dict() for r in reservations]), 200

@reservations_bp.route('/<int:id>/status', methods=['PUT'])
@admin_required()
def update_reservation_status(id):
    reservation = db.session.get(Reservation, id)
    if reservation is None:
        return jsonify({'error': 'Reservation not found'}), 404
        
    data = request.get_json() or {}
    new_status = data.get('status')
    
    valid_statuses = ['pending', 'confirmed', 'cancelled']
    if new_status not in valid_statuses:
        return jsonify({'error': f'Invalid status. Must be one of {valid_statuses}'}), 400
        
    reservation.status = new_status
    db.session.commit()
    
    print(f"SMTP NOTIFICATION: Sent Reservation Update to {reservation.email}. Status: {new_status}")
    
    return jsonify({
        'message': 'Reservation status updated successfully',
        'reservation': reservation.to_dict()
    }), 200
