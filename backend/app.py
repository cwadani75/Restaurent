import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import Config
from database import db
from models import User, Category, MenuItem, Order, Reservation  # Import models for db.create_all()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Configure CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    
    # Initialize Database & JWT
    db.init_app(app)
    jwt = JWTManager(app)
    
    # Register Blueprints
    from routes.auth import auth_bp
    from routes.menu import menu_bp
    from routes.orders import orders_bp
    from routes.reservations import reservations_bp
    from routes.admin import admin_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(menu_bp, url_prefix='/api/menu')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    app.register_blueprint(reservations_bp, url_prefix='/api/reservations')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    
    @app.route('/')
    def index():
        return jsonify({
            'message': 'Welcome to L\'Étoile Dorée Restaurant API',
            'status': 'healthy'
        })
        
    # JWT error handlers
    @jwt.unauthorized_loader
    def unauthorized_response(callback):
        return jsonify({'error': 'Missing Authorization Header'}), 401
        
    @jwt.invalid_token_loader
    def invalid_token_response(callback):
        return jsonify({'error': 'Invalid token'}), 401
        
    @jwt.expired_token_loader
    def expired_token_response(jwt_header, jwt_payload):
        return jsonify({'error': 'Token has expired'}), 401

    # Database Initialization & Seeding
    with app.app_context():
        db.create_all()
        # Seed initial data if database is empty
        seed_database()
        
    return app

def seed_database():
    print("Checking database seed...")

    admin = User.query.filter_by(email="admin@sowda.com").first()
    if admin is None:
        print("Creating admin user...")
        admin = User(name="Sowda Admin", email="admin@sowda.com", role="admin")
        admin.set_password("SowdaDash123!")
        db.session.add(admin)

    customer = User.query.filter_by(email="customer@gmail.com").first()
    if customer is None:
        print("Creating customer user...")
        customer = User(name="John Doe", email="customer@gmail.com", role="customer")
        customer.set_password("customer123")
        db.session.add(customer)

    # Only add categories and menu items if they do not already exist
    if Category.query.first() is not None:
        db.session.commit()
        return

    print("Seeding categories and menu items...")
    starters = Category(name="Starters", description="Elegant appetizers to begin your culinary journey")
    mains = Category(name="Main Course", description="Exquisite main dishes prepared by our master chefs")
    desserts = Category(name="Desserts", description="Delectable sweet creations")
    drinks = Category(name="Beverages", description="Premium wines, cocktails, and non-alcoholic drinks")
    
    db.session.add_all([starters, mains, desserts, drinks])
    db.session.flush()  # Flushes to get IDs
    
    # 3. Create Menu Items
    items = [
        # Starters
        MenuItem(
            name="Lobster Bisque",
            description="Classic rich French soup made from lobster stock, finished with fresh cream and cognac.",
            price=24.0,
            image_url="https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop",
            category_id=starters.id
        ),
        MenuItem(
            name="Pan-Seared Foie Gras",
            description="Premium fattened duck liver served on toasted brioche with a balsamic fig glaze.",
            price=29.0,
            image_url="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop",
            category_id=starters.id
        ),
        MenuItem(
            name="Truffle Beef Carpaccio",
            description="Thinly sliced raw Wagyu beef tenderloin with truffle oil, capers, arugula, and shaved Parmigiano-Reggiano.",
            price=26.0,
            image_url="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop", # pizza/placeholder
            category_id=starters.id
        ),
        
        # Mains
        MenuItem(
            name="Wagyu Ribeye Steak",
            description="A5 Japanese Wagyu ribeye (10oz) grilled to perfection, served with truffle mashed potatoes and red wine reduction.",
            price=95.0,
            image_url="https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop",
            category_id=mains.id
        ),
        MenuItem(
            name="Pan-Roasted Chilean Sea Bass",
            description="Served over a bed of baby bok choy and wild mushrooms, drizzled with a ginger-soy reduction.",
            price=54.0,
            image_url="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop",
            category_id=mains.id
        ),
        MenuItem(
            name="Truffle Wild Mushroom Risotto",
            description="Creamy Arborio rice slow-cooked with wild chanterelles, porcini, fresh herbs, and shaving of black summer truffles.",
            price=38.0,
            image_url="https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=500&auto=format&fit=crop",
            category_id=mains.id
        ),
        
        # Desserts
        MenuItem(
            name="Classic Crème Brûlée",
            description="Creamy vanilla bean custard topped with a layer of hardened caramelized sugar, topped with fresh berries.",
            price=14.0,
            image_url="https://images.unsplash.com/photo-1516685018646-549198525c1b?w=500&auto=format&fit=crop",
            category_id=desserts.id
        ),
        MenuItem(
            name="Molten Chocolate Lava Cake",
            description="Rich dark chocolate cake with a liquid center, served with house-made Madagascar vanilla bean gelato.",
            price=16.0,
            image_url="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop",
            category_id=desserts.id
        ),
        
        # Drinks
        MenuItem(
            name="Château Margaux 2015",
            description="Premium Bordeaux red wine with notes of black currant, violets, and sweet spices. Glass pour.",
            price=45.0,
            image_url="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&auto=format&fit=crop",
            category_id=drinks.id
        ),
        MenuItem(
            name="Smoked Rosemary Old Fashioned",
            description="Kentucky bourbon, aromatic bitters, orange peel, and maple syrup smoked with fresh rosemary.",
            price=18.0,
            image_url="https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=500&auto=format&fit=crop",
            category_id=drinks.id
        )
    ]
    db.session.add_all(items)
    db.session.commit()
    print("Database seeding completed.")

app = create_app()

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
