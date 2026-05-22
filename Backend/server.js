import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Route imports
import authRoutes from './src/routes/authRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import cartRoutes from './src/routes/cartRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import wishlistRoutes from './src/routes/wishlistRoutes.js';

// Service imports
import actionListenerService from './src/services/actionListenerService.js';

// Middleware imports
import { errorHandler, notFound } from './src/middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Global Middleware ─────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });
}

// ─── Root Route ────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    name: 'ShopVibe API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health:   'GET  /api/health',
      auth:     'POST /api/auth/register  |  GET /api/auth/profile',
      products: 'GET  /api/products  |  GET /api/products/:id  |  GET /api/products/categories',
      cart:     'GET  /api/cart  |  POST /api/cart  |  DELETE /api/cart/:itemId',
      orders:   'POST /api/orders  |  GET /api/orders',
      wishlist: 'GET  /api/wishlist  |  POST /api/wishlist',
    },
  });
});

// Silence browser favicon 404
app.get('/favicon.ico', (_req, res) => res.status(204).end());

// Handle chrome-devtools workspace discovery (silence 404s and assist devtools integration)
app.get('/.well-known/appspecific/com.chrome.devtools.json', (_req, res) => {
  res.json({
    workspace: {
      root: process.cwd().replace(/\\/g, '/'),
      uuid: 'shopvibe-backend-workspace'
    }
  });
});

// ─── Health Check ──────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'ShopVibe API is running ✅',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);

// ─── Error Handling ────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 ShopVibe Backend running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}\n`);
  
  // Start the background Firebase listener
  actionListenerService.start();
});

export default app;
