require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const Redis = require('redis');

const app = express();
const PORT = process.env.PORT || 3000;

// Redis client for token blacklist (if needed for logout)
const redisClient = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});
redisClient.connect().catch(console.error);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
});
app.use(limiter);

// Public routes (no auth required)
app.use('/api/auth', createProxyMiddleware({
  target: process.env.USER_SERVICE_URL,
  changeOrigin: true,
  proxyTimeout: 30000,
  timeout: 30000,
}));

// Protect all other API routes: verify JWT
const authenticateToken = (req, res, next) => {
  // Skip auth for OPTIONS requests (CORS preflight)
  if (req.method === 'OPTIONS') return next();

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      // Optional: check token blacklist in Redis for logout
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Protected routes
app.use('/api/users', authenticateToken, createProxyMiddleware({
  target: process.env.USER_SERVICE_URL,
  changeOrigin: true,
  proxyTimeout: 30000,
  timeout: 30000,
}));

app.use('/api/products', createProxyMiddleware({
  target: process.env.PRODUCT_SERVICE_URL,
  changeOrigin: true,
  proxyTimeout: 30000,
  timeout: 30000,
}));

app.use('/api/categories', createProxyMiddleware({
  target: process.env.PRODUCT_SERVICE_URL,
  changeOrigin: true,
  proxyTimeout: 30000,
  timeout: 30000,
}));

app.use('/api/cart', authenticateToken, createProxyMiddleware({
  target: process.env.CART_SERVICE_URL,
  changeOrigin: true,
  proxyTimeout: 30000,
  timeout: 30000,
}));

// Health check gateway
app.get('/health', async (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Gateway error:', err);
  res.status(500).json({ error: 'Gateway error' });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});