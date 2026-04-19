require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const Redis = require('ioredis');

const app = express();
const PORT = process.env.PORT || 3003;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Redis client for caching
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Middleware
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
  validate: { xForwardedFor: false },
});
app.use('/api/', limiter);

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Helper: get or create cart for user
const getOrCreateCart = async (userId) => {
  const result = await pool.query(
    'SELECT id FROM cart_service.carts WHERE user_id = $1',
    [userId]
  );
  if (result.rows.length > 0) {
    return result.rows[0].id;
  }
  const insert = await pool.query(
    'INSERT INTO cart_service.carts (user_id) VALUES ($1) RETURNING id',
    [userId]
  );
  return insert.rows[0].id;
};

// GET /api/cart - get user's cart
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    const cacheKey = `cart:${req.user.userId}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({ cart: JSON.parse(cached) });
    }

    const cartId = await getOrCreateCart(req.user.userId);
    const result = await pool.query(
      `SELECT ci.id, ci.quantity, ci.product_id, p.name, p.price, p.image_url, p.inventory_count
       FROM cart_service.cart_items ci
       JOIN product_service.products p ON ci.product_id = p.id
       WHERE ci.cart_id = $1 AND p.is_active = true`,
      [cartId]
    );

    const cart = {
      items: result.rows,
      total: result.rows.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0),
    };

    await redis.setex(cacheKey, 300, JSON.stringify(cart)); // Cache for 5 minutes
    res.json({ cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/cart/items - add item to cart
app.post('/api/cart/items', authenticateToken, async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    if (!product_id || !quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Product ID and positive quantity required' });
    }

    // Verify product exists and is active
    const productResult = await pool.query(
      'SELECT id, inventory_count FROM product_service.products WHERE id = $1 AND is_active = true',
      [product_id]
    );
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const product = productResult.rows[0];
    if (product.inventory_count < quantity) {
      return res.status(400).json({ error: 'Insufficient inventory' });
    }

    const cartId = await getOrCreateCart(req.user.userId);

    // Upsert cart item
    const result = await pool.query(
      `INSERT INTO cart_service.cart_items (cart_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (cart_id, product_id) 
       DO UPDATE SET quantity = cart_service.cart_items.quantity + EXCLUDED.quantity,
                     updated_at = NOW()
       RETURNING id, quantity`,
      [cartId, product_id, quantity]
    );

    // Invalidate cart cache
    const cacheKey = `cart:${req.user.userId}`;
    await redis.del(cacheKey);

    res.status(201).json({
      message: 'Item added to cart',
      item: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/cart/items/:id - update cart item quantity
app.put('/api/cart/items/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Positive quantity required' });
    }

    const result = await pool.query(
      `UPDATE cart_service.cart_items ci
       SET quantity = $1, updated_at = NOW()
       FROM cart_service.carts c
       WHERE ci.id = $2 AND ci.cart_id = c.id AND c.user_id = $3
       RETURNING ci.id, ci.quantity`,
      [quantity, id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Invalidate cart cache
    const cacheKey = `cart:${req.user.userId}`;
    await redis.del(cacheKey);

    res.json({ item: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/cart/items/:id - remove item from cart
app.delete('/api/cart/items/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `DELETE FROM cart_service.cart_items ci
       USING cart_service.carts c
       WHERE ci.id = $1 AND ci.cart_id = c.id AND c.user_id = $2
       RETURNING ci.id`,
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Invalidate cart cache
    const cacheKey = `cart:${req.user.userId}`;
    await redis.del(cacheKey);

    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'cart-service' });
});

app.listen(PORT, () => {
  console.log(`Cart service running on http://localhost:${PORT}`);
});