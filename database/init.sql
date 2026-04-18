-- Cresction E-commerce Database Initialization

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Shared schemas for microservices
-- Note: Each service could have its own database, but we'll use schemas for simplicity

-- User Service Schema
CREATE SCHEMA IF NOT EXISTS user_service;

CREATE TABLE user_service.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX idx_user_service_users_email ON user_service.users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_service_users_created_at ON user_service.users(created_at);

-- Product Service Schema
CREATE SCHEMA IF NOT EXISTS product_service;

CREATE TABLE product_service.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE product_service.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    category_id UUID REFERENCES product_service.categories(id),
    inventory_count INTEGER DEFAULT 0 CHECK (inventory_count >= 0),
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_product_service_products_category ON product_service.products(category_id) WHERE is_active = true;
CREATE INDEX idx_product_service_products_price ON product_service.products(price) WHERE is_active = true;
CREATE INDEX idx_product_service_products_name ON product_service.products USING gin(to_tsvector('english', name));

-- Cart Service Schema
CREATE SCHEMA IF NOT EXISTS cart_service;

CREATE TABLE cart_service.carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_service.users(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE cart_service.cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID REFERENCES cart_service.carts(id) ON DELETE CASCADE,
    product_id UUID REFERENCES product_service.products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(cart_id, product_id)
);

CREATE INDEX idx_cart_service_carts_user ON cart_service.carts(user_id);
CREATE INDEX idx_cart_service_cart_items_cart ON cart_service.cart_items(cart_id);
CREATE INDEX idx_cart_service_cart_items_product ON cart_service.cart_items(product_id);

-- Order Service Schema (could be separate, but included for completeness)
CREATE SCHEMA IF NOT EXISTS order_service;

CREATE TABLE order_service.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_service.users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    shipping_address TEXT,
    payment_method VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_service_orders_user ON order_service.orders(user_id);
CREATE INDEX idx_order_service_orders_status ON order_service.orders(status);
