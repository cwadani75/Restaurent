from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import Category, MenuItem
from database import db
from routes.decorators import admin_required

menu_bp = Blueprint('menu', __name__)

# CATEGORIES ROUTES
@menu_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([c.to_dict() for c in categories]), 200

@menu_bp.route('/categories', methods=['POST'])
@admin_required()
def create_category():
    data = request.get_json() or {}
    name = data.get('name')
    description = data.get('description')
    
    if not name:
        return jsonify({'error': 'Category name is required'}), 400
        
    if Category.query.filter_by(name=name).first() is not None:
        return jsonify({'error': 'Category already exists'}), 400
        
    category = Category(name=name, description=description)
    db.session.add(category)
    db.session.commit()
    return jsonify({
        'message': 'Category created successfully',
        'category': category.to_dict()
    }), 201

@menu_bp.route('/categories/<int:id>', methods=['PUT'])
@admin_required()
def update_category(id):
    category = db.session.get(Category, id)
    if category is None:
        return jsonify({'error': 'Category not found'}), 404
        
    data = request.get_json() or {}
    category.name = data.get('name', category.name)
    category.description = data.get('description', category.description)
    
    db.session.commit()
    return jsonify({
        'message': 'Category updated successfully',
        'category': category.to_dict()
    }), 200

@menu_bp.route('/categories/<int:id>', methods=['DELETE'])
@admin_required()
def delete_category(id):
    category = db.session.get(Category, id)
    if category is None:
        return jsonify({'error': 'Category not found'}), 404
        
    db.session.delete(category)
    db.session.commit()
    return jsonify({'message': 'Category deleted successfully'}), 200


# MENU ITEMS ROUTES
@menu_bp.route('/items', methods=['GET'])
def get_items():
    category_id = request.args.get('category_id', type=int)
    search_query = request.args.get('search', '')
    
    query = MenuItem.query
    
    if category_id:
        query = query.filter_by(category_id=category_id)
        
    if search_query:
        query = query.filter(
            MenuItem.name.ilike(f'%{search_query}%') | 
            MenuItem.description.ilike(f'%{search_query}%')
        )
        
    items = query.all()
    return jsonify([item.to_dict() for item in items]), 200

@menu_bp.route('/items/<int:id>', methods=['GET'])
def get_item(id):
    item = db.session.get(MenuItem, id)
    if item is None:
        return jsonify({'error': 'Menu item not found'}), 404
    return jsonify(item.to_dict()), 200

@menu_bp.route('/items', methods=['POST'])
@admin_required()
def create_item():
    data = request.get_json() or {}
    name = data.get('name')
    description = data.get('description')
    price = data.get('price')
    image_url = data.get('image_url')
    category_id = data.get('category_id')
    
    if not name or price is None or not category_id:
        return jsonify({'error': 'Name, price, and category_id are required'}), 400
        
    try:
        price = float(price)
    except ValueError:
        return jsonify({'error': 'Price must be a valid number'}), 400
        
    category = db.session.get(Category, int(category_id))
    if category is None:
        return jsonify({'error': 'Category not found'}), 404
        
    item = MenuItem(
        name=name,
        description=description,
        price=price,
        image_url=image_url,
        category_id=category_id,
        is_available=data.get('is_available', True)
    )
    db.session.add(item)
    db.session.commit()
    return jsonify({
        'message': 'Menu item created successfully',
        'item': item.to_dict()
    }), 201

@menu_bp.route('/items/<int:id>', methods=['PUT'])
@admin_required()
def update_item(id):
    item = db.session.get(MenuItem, id)
    if item is None:
        return jsonify({'error': 'Menu item not found'}), 404
        
    data = request.get_json() or {}
    item.name = data.get('name', item.name)
    item.description = data.get('description', item.description)
    item.image_url = data.get('image_url', item.image_url)
    
    price = data.get('price')
    if price is not None:
        try:
            item.price = float(price)
        except ValueError:
            return jsonify({'error': 'Price must be a valid number'}), 400
            
    category_id = data.get('category_id')
    if category_id is not None:
        category = db.session.get(Category, int(category_id))
        if category is None:
            return jsonify({'error': 'Category not found'}), 404
        item.category_id = category_id
        
    if 'is_available' in data:
        item.is_available = bool(data['is_available'])
        
    db.session.commit()
    return jsonify({
        'message': 'Menu item updated successfully',
        'item': item.to_dict()
    }), 200

@menu_bp.route('/items/<int:id>', methods=['DELETE'])
@admin_required()
def delete_item(id):
    item = db.session.get(MenuItem, id)
    if item is None:
        return jsonify({'error': 'Menu item not found'}), 404
        
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Menu item deleted successfully'}), 200
