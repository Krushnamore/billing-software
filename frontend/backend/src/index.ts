/**
 * index.ts — BillCraft Express Server (MongoDB Atlas)
 *
 * Dev:   npm run dev
 * Prod:  npm run build && npm start
 */

import 'dotenv/config';
import express     from 'express';
import cors        from 'cors';
import { connectDB } from './db';

import authRouter     from './routes/auth';
import productsRouter from './routes/products';
import billsRouter    from './routes/bills';

const app  = express();
const PORT = parseInt(process.env.PORT || '4000', 10);

/* ── Middleware ── */
app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

/* ── Routes ── */
app.use('/api/auth',     authRouter);
app.use('/api/products', productsRouter);
app.use('/api/bills',    billsRouter);

/* ── Health check ── */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* ── 404 catch-all ── */
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found.' });
});

/* ── Connect to MongoDB then start server ── */
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀  BillCraft API running → http://localhost:${PORT}`);
    console.log(`🌿  MongoDB: ${process.env.MONGODB_URI ? 'Atlas connected' : '⚠️  MONGODB_URI not set!'}`);
    console.log(`🔑  JWT: ${process.env.JWT_SECRET ? 'custom secret' : '⚠️  using default (set JWT_SECRET in .env!)'}\n`);
  });
});

export default app;
