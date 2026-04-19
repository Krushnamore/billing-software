/**
 * routes/bills.ts — Bills CRUD (MongoDB)
 *
 * GET  /api/bills          — list all bills (optional ?date=YYYY-MM-DD)
 * POST /api/bills          — save new bill
 * GET  /api/bills/stats    — today's counts and total sales
 * GET  /api/bills/export   — download bills as Excel (.xlsx)
 * GET  /api/bills/:id      — get single bill
 */

import { Router, Request, Response } from 'express';
import { Bill }    from '../models/Bill';
import { Product } from '../models/Product';
import { User }    from '../models/User';
import { requireAuth } from '../middleware/auth';
import type { IBillItem } from '../models/Bill';

const router = Router();
router.use(requireAuth);

/* GET /api/bills */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.uniqueId;
    const filter: Record<string, unknown> = { userId };

    if (req.query.date) {
      const d     = new Date(req.query.date as string);
      const start = new Date(d); start.setHours(0,  0,  0, 0);
      const end   = new Date(d); end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }

    const bills = await Bill.find(filter).sort({ billNo: -1 });
    res.json({ success: true, bills });
  } catch (err) {
    console.error('Get bills error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch bills.' });
  }
});

/* GET /api/bills/stats */
router.get('/stats', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.uniqueId;
    const today  = new Date();
    const start  = new Date(today); start.setHours(0,  0,  0, 0);
    const end    = new Date(today); end.setHours(23, 59, 59, 999);

    const [totalBills, todaysBills, totalProducts] = await Promise.all([
      Bill.countDocuments({ userId }),
      Bill.find({ userId, date: { $gte: start, $lte: end } }),
      Product.countDocuments({ userId }),
    ]);

    const todaysSales = todaysBills.reduce((sum, b) => sum + b.grandTotal, 0);

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalBills,
        todaysBills:  todaysBills.length,
        todaysSales,
      },
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch stats.' });
  }
});

/* GET /api/bills/export — Excel download with 3 sheets */
router.get('/export', async (req: Request, res: Response): Promise<void> => {
  try {
    // Dynamically import xlsx so the server boots even if not installed
    let XLSX: typeof import('xlsx');
    try {
      XLSX = await import('xlsx');
    } catch {
      res.status(501).json({
        success: false,
        error: 'Excel export requires the xlsx package. Run: npm install xlsx',
      });
      return;
    }

    const userId   = req.user!.uniqueId;
    const [user, products, bills] = await Promise.all([
      User.findOne({ uniqueId: userId }),
      Product.find({ userId }).sort({ name: 1 }),
      Bill.find({ userId }).sort({ billNo: 1 }),
    ]);

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found.' });
      return;
    }

    const wb = XLSX.utils.book_new();

    const headerStyle = () => ({
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '1E3A5F' } },
    });

    const autoWidth = (ws: import('xlsx').WorkSheet, rows: Record<string, unknown>[]) => {
      if (!rows.length) return;
      ws['!cols'] = Object.keys(rows[0]).map(k => ({
        wch: Math.max(k.length, ...rows.map(r => String(r[k] ?? '').length)) + 2,
      }));
    };

    /* ── Sheet 1: My Profile ── */
    const profileRows = [{
      'Vendor ID':    user.uniqueId,
      'Full Name':    user.name,
      'Age':          user.age,
      'Email':        user.email,
      'Mobile':       user.mobile,
      'Shop Name':    user.shopName,
      'GST No':       user.gstNo || '-',
      'Address':      user.address,
      'City':         user.city,
      'District':     user.district,
      'State':        user.state,
      'Member Since': new Date(user.createdAt).toLocaleDateString('en-IN'),
    }];
    const wsProfile = XLSX.utils.json_to_sheet(profileRows);
    autoWidth(wsProfile, profileRows as Record<string,unknown>[]);
    XLSX.utils.book_append_sheet(wb, wsProfile, 'My Profile');

    /* ── Sheet 2: My Inventory ── */
    const inventoryRows = products.map((p, i) => ({
      'Sr No':        i + 1,
      'Product Name': p.name,
      'HSN Code':     p.hsn || '-',
      'Price (Rs.)':  p.price,
      'Quantity':     p.quantity,
      'Unit':         p.unit,
      'Added On':     new Date(p.createdAt).toLocaleDateString('en-IN'),
    }));
    const wsInv = inventoryRows.length > 0
      ? XLSX.utils.json_to_sheet(inventoryRows)
      : XLSX.utils.aoa_to_sheet([['No products found']]);
    if (inventoryRows.length) autoWidth(wsInv, inventoryRows as Record<string,unknown>[]);
    XLSX.utils.book_append_sheet(wb, wsInv, 'My Inventory');

    /* ── Sheet 3: Bills Export ── */
    const billRows: Record<string, string | number>[] = [];
    for (const bill of bills) {
      for (const item of bill.items) {
        billRows.push({
          'Bill No':           bill.billNo,
          'Date':              new Date(bill.date).toLocaleDateString('en-IN'),
          'Customer Name':     bill.customerName    || '-',
          'Customer Phone':    bill.customerPhone   || '-',
          'Customer Address':  bill.customerAddress || '-',
          'Product Name':      item.name,
          'HSN Code':          item.hsn   || '-',
          'Quantity':          item.quantity,
          'Unit':              item.unit,
          'Rate (Rs.)':        item.rate,
          'Amount (Rs.)':      item.amount,
          'Sub Total (Rs.)':   bill.subTotal,
          'CGST %':            bill.cgstPercent,
          'CGST Amount':       bill.cgstAmount,
          'SGST %':            bill.sgstPercent,
          'SGST Amount':       bill.sgstAmount,
          'Grand Total (Rs.)': bill.grandTotal,
          'Shop Name':         user.shopName || '-',
          'GST No':            user.gstNo    || '-',
        });
      }
    }
    const wsBills = billRows.length > 0
      ? XLSX.utils.json_to_sheet(billRows)
      : XLSX.utils.aoa_to_sheet([['No bills found']]);
    if (billRows.length) autoWidth(wsBills, billRows as Record<string,unknown>[]);
    XLSX.utils.book_append_sheet(wb, wsBills, 'Bills Export');

    const buffer   = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
    const shopSlug = (user.shopName || 'export').replace(/\s+/g, '_');
    const filename = `BillCraft_${shopSlug}_${new Date().toISOString().split('T')[0]}.xlsx`;

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({ success: false, error: 'Failed to generate export.' });
  }
});

/* GET /api/bills/:id */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const bill = await Bill.findOne({ _id: req.params.id, userId: req.user!.uniqueId });
    if (!bill) {
      res.status(404).json({ success: false, error: 'Bill not found.' });
      return;
    }
    res.json({ success: true, bill });
  } catch (err) {
    console.error('Get bill error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch bill.' });
  }
});

/* POST /api/bills */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      customerName, customerPhone, customerAddress,
      cgstPercent, sgstPercent, items,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, error: 'Bill must contain at least one item.' });
      return;
    }

    const userId = req.user!.uniqueId;

    // Get next sequential bill number for this user
    const lastBill = await Bill.findOne({ userId }).sort({ billNo: -1 });
    const billNo   = (lastBill?.billNo ?? 0) + 1;

    const sub   = (items as IBillItem[]).reduce((s, i) => s + i.amount, 0);
    const cgst  = sub * (parseFloat(cgstPercent) || 0) / 100;
    const sgst  = sub * (parseFloat(sgstPercent) || 0) / 100;

    const bill = new Bill({
      userId,
      billNo,
      date:            new Date(),
      items:           items as IBillItem[],
      subTotal:        sub,
      cgstPercent:     parseFloat(cgstPercent) || 0,
      sgstPercent:     parseFloat(sgstPercent) || 0,
      cgstAmount:      cgst,
      sgstAmount:      sgst,
      grandTotal:      sub + cgst + sgst,
      customerName:    customerName    || '',
      customerPhone:   customerPhone   || '',
      customerAddress: customerAddress || '',
    });

    await bill.save();
    res.status(201).json({ success: true, bill });
  } catch (err) {
    console.error('Save bill error:', err);
    res.status(500).json({ success: false, error: 'Failed to save bill.' });
  }
});

export default router;
