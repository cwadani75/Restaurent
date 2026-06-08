import uuid
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Order, OrderItem, MenuItem, Payment, User
from database import db
from routes.decorators import admin_required

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('', methods=['POST'])
@jwt_required()
def create_order():
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    
    items = data.get('items')  # List of {menu_item_id, quantity}
    delivery_address = data.get('delivery_address')
    phone = data.get('phone')
    payment_method = data.get('payment_method', 'card')  # 'card' or 'cash'
    order_type = data.get('order_type', 'delivery')  # 'delivery' or 'pickup'
    
    if not items:
        return jsonify({'error': 'No items in order'}), 400
        
    if not phone:
        return jsonify({'error': 'Phone number is required'}), 400
        
    if order_type == 'delivery' and not delivery_address:
        return jsonify({'error': 'Delivery address is required for home delivery'}), 400
        
    # Calculate totals
    total_amount = 0
    order_items_to_add = []
    
    for item_data in items:
        item_id = item_data.get('menu_item_id')
        quantity = item_data.get('quantity', 1)
        
        menu_item = db.session.get(MenuItem, item_id)
        if menu_item is None:
            return jsonify({'error': f'Menu item {item_id} not found'}), 404
            
        if not menu_item.is_available:
            return jsonify({'error': f'Item {menu_item.name} is currently out of stock'}), 400
            
        price = menu_item.price
        total_amount += price * quantity
        
        order_item = OrderItem(
            menu_item_id=item_id,
            quantity=quantity,
            price=price
        )
        order_items_to_add.append(order_item)
        
    # Create order
    order = Order(
        user_id=int(user_id),
        status='pending',
        total_amount=total_amount,
        delivery_address=delivery_address if order_type == 'delivery' else None,
        phone=phone,
        payment_method=payment_method,
        order_type=order_type
    )
    
    for order_item in order_items_to_add:
        order.items.append(order_item)
        
    db.session.add(order)
    db.session.flush()  # Flushes to db to generate order.id
    
    # Create Payment record
    payment_status = 'pending'
    transaction_id = None
    
    if payment_method == 'card':
        # Simulate payment gateway authorization
        payment_status = 'completed'
        transaction_id = f'txn_{uuid.uuid4().hex[:12].upper()}'
        order.status = 'paid'
    else:
        order.status = 'pending'
        
    payment = Payment(
        order_id=order.id,
        status=payment_status,
        amount=total_amount,
        payment_method=payment_method,
        transaction_id=transaction_id
    )
    db.session.add(payment)
    db.session.commit()
    
    # Simulated email notification console log
    print(f"SMTP NOTIFICATION: Sent Order Confirmation email to user #{user_id} for Order #{order.id}. Total Amount: ${total_amount:.2f}")
    
    return jsonify({
        'message': 'Order placed successfully',
        'order': order.to_dict()
    }), 201

@orders_bp.route('', methods=['GET'])
@jwt_required()
def get_orders():
    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))
    
    if user.role == 'admin':
        orders = Order.query.order_by(Order.created_at.desc()).all()
    else:
        orders = Order.query.filter_by(user_id=int(user_id)).order_by(Order.created_at.desc()).all()
        
    return jsonify([o.to_dict() for o in orders]), 200

@orders_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_order_details(id):
    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))
    order = db.session.get(Order, id)
    
    if order is None:
        return jsonify({'error': 'Order not found'}), 404
        
    if user.role != 'admin' and order.user_id != int(user_id):
        return jsonify({'error': 'Access denied'}), 403
        
    return jsonify(order.to_dict()), 200

@orders_bp.route('/<int:id>/status', methods=['PUT'])
@admin_required()
def update_order_status(id):
    order = db.session.get(Order, id)
    if order is None:
        return jsonify({'error': 'Order not found'}), 404
        
    data = request.get_json() or {}
    new_status = data.get('status')
    
    valid_statuses = ['pending', 'paid', 'cooking', 'out_for_delivery', 'completed', 'cancelled']
    if new_status not in valid_statuses:
        return jsonify({'error': f'Invalid status. Must be one of {valid_statuses}'}), 400
        
    order.status = new_status
    db.session.commit()
    
    print(f"SMTP NOTIFICATION: Sent Order Status Update email to user #{order.user_id}. Order #{order.id} is now {new_status}")
    
    return jsonify({
        'message': 'Order status updated successfully',
        'order': order.to_dict()
    }), 200
