/**
 * routes/auth.ts — Authentication endpoints (MongoDB Atlas)
 *
 * POST /api/auth/register  — register new vendor
 * POST /api/auth/login     — login with uniqueId + password
 * GET  /api/auth/me        — get current user profile
 * PUT  /api/auth/profile   — update profile
 */

import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { signToken, requireAuth } from '../middleware/auth';

const router = Router();

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
router.post('/register', (_req: Request, res: Response): void => {
  res.status(410).json({
    success: false,
    error: 'Self-registration is disabled. Contact admin to get a Unique ID.',
  });
});

/* ──────────────────────────────────────────
   POST /api/auth/login
   Body: { uniqueId, password }
   ────────────────────────────────────────── */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const uniqueIdInput = (req.body.uniqueId || req.body.unique_id || '').toString().toUpperCase().trim();

    if (!uniqueIdInput) {
      res.status(400).json({ success: false, error: 'Please enter your Vendor ID.' });
      return;
    }

    const user = await User.findOne({ uniqueId: uniqueIdInput });

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid ID',
      });
      return;
    }

    const token = signToken({ uniqueId: user.uniqueId, email: user.email || undefined });
    const requiresProfileSetup = !user.isUsed || !user.profileCompleted;

    res.json({
      success: true,
      token,
      requiresProfileSetup,
      user: sanitize(user),
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Server error during login. Please try again.' });
  }
});

router.post('/setup-profile', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({ uniqueId: req.user!.uniqueId });
    if (!user) {
      res.status(404).json({ success: false, error: 'User account not found.' });
      return;
    }

    if (user.isUsed && user.profileCompleted) {
      res.status(400).json({ success: false, error: 'Profile has already been setup for this ID.' });
      return;
    }

    const { name, shopName, gstNo, address, age, email, mobile, city, district, state } = req.body;
    if (!name || !shopName || !gstNo || !address || !age || !email || !mobile) {
      res.status(400).json({ success: false, error: 'Please fill all required fields.' });
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

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedMobile = mobile.trim();
    const normalizedGstNo = gstNo.toUpperCase().trim();

    const emailExists = await User.findOne({ email: normalizedEmail, uniqueId: { $ne: user.uniqueId } });
    if (emailExists) {
      res.status(409).json({ success: false, error: 'This email address is already registered.' });
      return;
    }

    const mobileExists = await User.findOne({ mobile: normalizedMobile, uniqueId: { $ne: user.uniqueId } });
    if (mobileExists) {
      res.status(409).json({ success: false, error: 'This mobile number is already registered.' });
      return;
    }

    const gstExists = await User.findOne({ gstNo: normalizedGstNo, uniqueId: { $ne: user.uniqueId } });
    if (gstExists) {
      res.status(409).json({ success: false, error: 'This GST number is already registered with another account.' });
      return;
    }

    user.name = name.toString().trim();
    user.shopName = shopName.toString().trim();
    user.gstNo = normalizedGstNo;
    user.address = address.toString().trim();
    user.age = age.toString().trim();
    user.email = normalizedEmail;
    user.mobile = normalizedMobile;
    user.city = (city || '').toString().trim();
    user.district = (district || '').toString().trim();
    user.state = (state || '').toString().trim();
    user.isUsed = true;
    user.profileCompleted = true;
    user.profile = {
      name: user.name,
      shopName: user.shopName,
      gstNo: user.gstNo,
      address: user.address,
      age: user.age,
      email: user.email,
      mobile: user.mobile,
    };

    await user.save();
    res.json({ success: true, message: 'Profile setup complete.', user: sanitize(user) });
  } catch (err) {
    const dupError = getDuplicateFieldError(err);
    if (dupError) {
      res.status(409).json({ success: false, error: dupError });
      return;
    }
    console.error('Setup profile error:', err);
    res.status(500).json({ success: false, error: 'Server error while setting up profile.' });
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

    if (!user.profileCompleted) {
      res.status(400).json({ success: false, error: 'Complete profile setup first.' });
      return;
    }

    const { uniqueId: _uid, passwordHash: _pw, createdAt: _ca, _id: _id2, isUsed: _iu, profileCompleted: _pc, profile: _profile, ...allowed } = req.body;

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
      const exists = await User.findOne({ mobile: allowed.mobile.trim(), uniqueId: { $ne: user.uniqueId } });
      if (exists) {
        res.status(409).json({ success: false, error: 'This mobile number is already used by another account.' });
        return;
      }
      allowed.mobile = allowed.mobile.trim();
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
    user.profile = {
      name: user.name,
      shopName: user.shopName,
      gstNo: user.gstNo,
      address: user.address,
      age: user.age,
      email: user.email,
      mobile: user.mobile,
    };
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
