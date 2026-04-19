/**
 * routes/products.ts — Product/Inventory CRUD (MongoDB)
 *
 * GET    /api/products       — list all products for authenticated user
 * POST   /api/products       — add new product
 * PUT    /api/products/:id   — update product
 * DELETE /api/products/:id   — delete product
 */

import { Router, Request, Response } from 'express';
import { Product } from '../models/Product';
import { requireAuth } from '../middleware/auth';

const router = Router();
router.use(requireAuth);

/* GET /api/products */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({ userId: req.user!.uniqueId }).sort({ createdAt: -1 });
    const transformed = products.map(p => ({
      id: p._id?.toString(),
      userId: p.userId,
      name: p.name,
      price: p.price,
      quantity: p.quantity,
      unit: p.unit,
      hsn: p.hsn,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
    res.json({ success: true, products: transformed });
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch products.' });
  }
});

/* POST /api/products */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, price, quantity, unit, hsn } = req.body;

    if (!name || price === undefined || quantity === undefined) {
      res.status(400).json({ success: false, error: 'Name, price, and quantity are required.' });
      return;
    }

    const parsedPrice = parseFloat(price);
    const parsedQty   = parseInt(quantity);

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      res.status(400).json({ success: false, error: 'Price must be a valid non-negative number.' });
      return;
    }
    if (isNaN(parsedQty) || parsedQty < 0) {
      res.status(400).json({ success: false, error: 'Quantity must be a valid non-negative number.' });
      return;
    }

    const product = new Product({
      userId:   req.user!.uniqueId,
      name:     name.trim(),
      price:    parsedPrice,
      quantity: parsedQty,
      unit:     unit || 'pcs',
      hsn:      hsn  || '',
    });

    await product.save();
    const transformed = {
      id: product._id?.toString(),
      userId: product.userId,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      unit: product.unit,
      hsn: product.hsn,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
    res.status(201).json({ success: true, product: transformed });
  } catch (err) {
    console.error('Add product error:', err);
    res.status(500).json({ success: false, error: 'Failed to add product.' });
  }
});

/* PUT /api/products/:id */
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { _id, userId, createdAt, ...allowed } = req.body;

    if (allowed.price    !== undefined) allowed.price    = parseFloat(allowed.price);
    if (allowed.quantity !== undefined) allowed.quantity = parseInt(allowed.quantity);

    const product = await Product.findOneAndUpdate(
      { _id: id, userId: req.user!.uniqueId },
      { ...allowed, updatedAt: new Date() },
      { new: true, runValidators: true },
    );

    if (!product) {
      res.status(404).json({ success: false, error: 'Product not found.' });
      return;
    }

    const transformed = {
      id: product._id?.toString(),
      userId: product.userId,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      unit: product.unit,
      hsn: product.hsn,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
    res.json({ success: true, product: transformed });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ success: false, error: 'Failed to update product.' });
  }
});

/* DELETE /api/products/:id */
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Product.findOneAndDelete({
      _id: req.params.id,
      userId: req.user!.uniqueId,
    });

    if (!deleted) {
      res.status(404).json({ success: false, error: 'Product not found.' });
      return;
    }

    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ success: false, error: 'Failed to delete product.' });
  }
});

export default router;
