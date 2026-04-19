-- Products seed data
INSERT INTO product_service.products (name, description, price, category_id, inventory_count, image_url) 
SELECT 'Wireless Bluetooth Earbuds', 'Premium wireless earbuds with noise cancellation and 24-hour battery life', 79.99, id, 100, 'https://images.unsplash.com/photo-1590658268037-6bb121e9b1eb?w=400' 
FROM product_service.categories WHERE name = 'Electronics';

INSERT INTO product_service.products (name, description, price, category_id, inventory_count, image_url) 
SELECT 'Smart Watch Pro', 'Advanced smartwatch with health tracking, GPS, and water resistance', 299.99, id, 50, 'https://images.unsplash.com/photo-1546868871-7041f2a39be3?w=400'
FROM product_service.categories WHERE name = 'Electronics';

INSERT INTO product_service.products (name, description, price, category_id, inventory_count, image_url) 
SELECT 'Portable Bluetooth Speaker', 'Powerful 360-degree sound with 20-hour playtime', 149.99, id, 75, 'https://images.unsplash.com/photo-1608043154559-6915a02f9cb8?w=400'
FROM product_service.categories WHERE name = 'Electronics';

INSERT INTO product_service.products (name, description, price, category_id, inventory_count, image_url) 
SELECT 'Wireless Charging Pad', 'Fast wireless charger compatible with all Qi devices', 39.99, id, 200, 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=400'
FROM product_service.categories WHERE name = 'Electronics';

INSERT INTO product_service.products (name, description, price, category_id, inventory_count, image_url) 
SELECT 'Premium Cotton T-Shirt', '100% organic cotton t-shirt, comfortable and sustainable', 29.99, id, 150, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17b0?w=400'
FROM product_service.categories WHERE name = 'Clothing';

INSERT INTO product_service.products (name, description, price, category_id, inventory_count, image_url) 
SELECT 'Classic Denim Jeans', 'Premium denim jeans with perfect fit', 89.99, id, 80, 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400'
FROM product_service.categories WHERE name = 'Clothing';

INSERT INTO product_service.products (name, description, price, category_id, inventory_count, image_url) 
SELECT 'Wool Blend Sweater', 'Warm and stylish wool blend sweater', 119.99, id, 60, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3109?w=400'
FROM product_service.categories WHERE name = 'Clothing';

INSERT INTO product_service.products (name, description, price, category_id, inventory_count, image_url) 
SELECT 'Indoor Plant Pot Set', 'Set of 3 ceramic plant pots with drainage', 49.99, id, 120, 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400'
FROM product_service.categories WHERE name = 'Home & Garden';

INSERT INTO product_service.products (name, description, price, category_id, inventory_count, image_url) 
SELECT 'LED Desk Lamp', 'Adjustable LED desk lamp with multiple brightness levels', 39.99, id, 90, 'https://images.unsplash.com/photo-1507473885765-e6ed057f2c9e?w=400'
FROM product_service.categories WHERE name = 'Home & Garden';

INSERT INTO product_service.products (name, description, price, category_id, inventory_count, image_url) 
SELECT 'Yoga Mat Premium', 'Extra thick non-slip yoga mat with carrying strap', 59.99, id, 70, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400'
FROM product_service.categories WHERE name = 'Sports';

INSERT INTO product_service.products (name, description, price, category_id, inventory_count, image_url) 
SELECT 'Resistance Bands Set', 'Set of 5 resistance bands with different strengths', 24.99, id, 200, 'https://images.unsplash.com/photo-1598289431512-b97b44799a7d?w=400'
FROM product_service.categories WHERE name = 'Sports';

INSERT INTO product_service.products (name, description, price, category_id, inventory_count, image_url) 
SELECT 'The Art of Programming', 'Comprehensive guide to software development', 49.99, id, 100, 'https://images.unsplash.com/photo-1544716278-ca5e3e4d2a11?w=400'
FROM product_service.categories WHERE name = 'Books';

INSERT INTO product_service.products (name, description, price, category_id, inventory_count, image_url) 
SELECT 'Modern Web Development', 'Complete guide to modern web technologies', 39.99, id, 80, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400'
FROM product_service.categories WHERE name = 'Books';