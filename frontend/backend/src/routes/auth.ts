/**
 * routes/auth.ts — Authentication endpoints (MongoDB Atlas)
 *
 * POST /api/auth/register  — register new vendor
 * POST /api/auth/login     — login with uniqueId + password
 * GET  /api/auth/me        — get current user profile
 * PUT  /api/auth/profile   — update profile
 */

import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { signToken, requireAuth } from '../middleware/auth';

const router = Router();

/* ── Generate unique VND-XXXXXX vendor ID ── */
async function generateUniqueVendorId(): Promise<string> {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id: string;
  let exists: boolean;
  do {
    id = 'VND-';
    for (let i = 0; i < 6; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    exists = !!(await User.findOne({ uniqueId: id }));
  } while (exists);
  return id;
}

/* ── Strip passwordHash before sending to client ── */
function sanitize(user: InstanceType<typeof User>) {
  const obj = user.toObject();
  const { passwordHash: _, ...safe } = obj;
  return safe;
}

/* ── Friendly error message for MongoDB duplicate key errors ── */
function getDuplicateFieldError(err: unknown): string | null {
  if (
    typeof err === 'object' && err !== null &&
    'code' in err && (err as { code: number }).code === 11000
  ) {
    const keyPattern = (err as { keyPattern?: Record<string, number> }).keyPattern || {};
    if (keyPattern.email)    return 'This email address is already registered.';
    if (keyPattern.mobile)   return 'This mobile number is already registered.';
    if (keyPattern.gstNo)    return 'This GST number is already registered with another account.';
    if (keyPattern.uniqueId) return 'Vendor ID collision — please try registering again.';
    return 'A duplicate entry was found. Please check your details.';
  }
  return null;
}

/* ──────────────────────────────────────────
   POST /api/auth/register
   Body: { name, age, email, mobile, shopName, gstNo, address, city, district, state, password }
   ────────────────────────────────────────── */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name, age, email, mobile, shopName,
      gstNo, address, city, district, state, password,
    } = req.body;

    /* ── Field validation ── */
    if (!name || !email || !mobile || !shopName || !password) {
      res.status(400).json({ success: false, error: 'Please fill all required fields (Name, Email, Mobile, Shop Name, Password).' });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      res.status(400).json({ success: false, error: 'Mobile number must be exactly 10 digits.' });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
      return;
    }
    if (gstNo && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstNo.toUpperCase())) {
      res.status(400).json({ success: false, error: 'GST number format is invalid (e.g. 22AAAAA0000A1Z5).' });
      return;
    }

    /* ── Explicit uniqueness checks with clear messages ── */
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      res.status(409).json({ success: false, error: 'This email address is already registered. Please use a different email.' });
      return;
    }

    const mobileExists = await User.findOne({ mobile });
    if (mobileExists) {
      res.status(409).json({ success: false, error: 'This mobile number is already registered. Please use a different number.' });
      return;
    }

    if (gstNo && gstNo.trim() !== '') {
      const gstExists = await User.findOne({ gstNo: gstNo.toUpperCase() });
      if (gstExists) {
        res.status(409).json({ success: false, error: 'This GST number is already registered with another account.' });
        return;
      }
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const uniqueId     = await generateUniqueVendorId();

    const newUser = new User({
      uniqueId,
      name:     name.trim(),
      age:      age || '',
      email:    email.toLowerCase().trim(),
      mobile:   mobile.trim(),
      shopName: shopName.trim(),
      gstNo:    gstNo ? gstNo.toUpperCase().trim() : '',
      address:  address || '',
      city:     city    || '',
      district: district || '',
      state:    state   || '',
      passwordHash,
    });

    await newUser.save();

    res.status(201).json({
      success:  true,
      uniqueId,
      message: 'Registration successful! Save your Vendor ID — you will need it to login.',
    });
  } catch (err) {
    const dupError = getDuplicateFieldError(err);
    if (dupError) {
      res.status(409).json({ success: false, error: dupError });
      return;
    }
    console.error('Register error:', err);
    res.status(500).json({ success: false, error: 'Server error during registration. Please try again.' });
  }
});

/* ──────────────────────────────────────────
   POST /api/auth/login
   Body: { uniqueId, password }
   ────────────────────────────────────────── */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { uniqueId, password } = req.body;

    if (!uniqueId || !password) {
      res.status(400).json({ success: false, error: 'Please enter both your Vendor ID and password.' });
      return;
    }

    const user = await User.findOne({ uniqueId: uniqueId.toString().toUpperCase().trim() });

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid Vendor ID. No account found with this ID. Please check and try again.',
      });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      res.status(401).json({
        success: false,
        error: 'Incorrect password. Please try again.',
      });
      return;
    }

    const token = signToken({ uniqueId: user.uniqueId, email: user.email });

    res.json({
      success: true,
      token,
      user: sanitize(user),
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Server error during login. Please try again.' });
  }
});

/* ──────────────────────────────────────────
   GET /api/auth/me — get current user profile
   ────────────────────────────────────────── */
router.get('/me', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({ uniqueId: req.user!.uniqueId });
    if (!user) {
      res.status(404).json({ success: false, error: 'User account not found.' });
      return;
    }
    res.json({ success: true, user: sanitize(user) });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
});

/* ──────────────────────────────────────────
   PUT /api/auth/profile — update profile fields
   Body: any subset of user fields + optional new password
   ────────────────────────────────────────── */
router.put('/profile', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({ uniqueId: req.user!.uniqueId });
    if (!user) {
      res.status(404).json({ success: false, error: 'User account not found.' });
      return;
    }

    const { uniqueId: _uid, passwordHash: _pw, createdAt: _ca, _id: _id2, password, ...allowed } = req.body;

    /* ── If changing password ── */
    if (password) {
      if (password.length < 6) {
        res.status(400).json({ success: false, error: 'New password must be at least 6 characters.' });
        return;
      }
      user.passwordHash = await bcrypt.hash(password, 12);
    }

    /* ── Check uniqueness for changed fields ── */
    if (allowed.email && allowed.email !== user.email) {
      const exists = await User.findOne({ email: allowed.email.toLowerCase(), uniqueId: { $ne: user.uniqueId } });
      if (exists) {
        res.status(409).json({ success: false, error: 'This email is already used by another account.' });
        return;
      }
      allowed.email = allowed.email.toLowerCase().trim();
    }

    if (allowed.mobile && allowed.mobile !== user.mobile) {
      const exists = await User.findOne({ mobile: allowed.mobile, uniqueId: { $ne: user.uniqueId } });
      if (exists) {
        res.status(409).json({ success: false, error: 'This mobile number is already used by another account.' });
        return;
      }
    }

    if (allowed.gstNo && allowed.gstNo.trim() !== '' && allowed.gstNo !== user.gstNo) {
      const exists = await User.findOne({ gstNo: allowed.gstNo.toUpperCase(), uniqueId: { $ne: user.uniqueId } });
      if (exists) {
        res.status(409).json({ success: false, error: 'This GST number is already registered with another account.' });
        return;
      }
      allowed.gstNo = allowed.gstNo.toUpperCase().trim();
    }

    Object.assign(user, allowed);
    await user.save();

    res.json({ success: true, user: sanitize(user) });
  } catch (err) {
    const dupError = getDuplicateFieldError(err);
    if (dupError) {
      res.status(409).json({ success: false, error: dupError });
      return;
    }
    console.error('Profile update error:', err);
    res.status(500).json({ success: false, error: 'Server error. Please try again.' });
  }
});

export default router;
