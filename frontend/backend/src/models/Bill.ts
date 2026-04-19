/**
 * models/Bill.ts — Mongoose schema for saved invoices
 * Each bill is scoped to a vendor via userId (the VND-XXXXXX uniqueId)
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IBillItem {
  productId: string;
  name:      string;
  quantity:  number;
  rate:      number;
  amount:    number;
  unit:      string;
  hsn:       string;
}

export interface IBill extends Document {
  userId:          string;
  billNo:          number;
  date:            Date;
  items:           IBillItem[];
  subTotal:        number;
  cgstPercent:     number;
  sgstPercent:     number;
  cgstAmount:      number;
  sgstAmount:      number;
  grandTotal:      number;
  customerName:    string;
  customerPhone:   string;
  customerAddress: string;
  createdAt:       Date;
  updatedAt:       Date;
}

const BillItemSchema = new Schema<IBillItem>(
  {
    productId: { type: String, required: true },
    name:      { type: String, required: true },
    quantity:  { type: Number, required: true, min: 1 },
    rate:      { type: Number, required: true, min: 0 },
    amount:    { type: Number, required: true, min: 0 },
    unit:      { type: String, default: 'pcs' },
    hsn:       { type: String, default: '' },
  },
  { _id: false },   // no separate _id for sub-documents
);

const BillSchema = new Schema<IBill>(
  {
    userId:          { type: String, required: true, index: true },
    billNo:          { type: Number, required: true },
    date:            { type: Date,   default: Date.now },
    items:           { type: [BillItemSchema], required: true },
    subTotal:        { type: Number, required: true, min: 0 },
    cgstPercent:     { type: Number, default: 0, min: 0 },
    sgstPercent:     { type: Number, default: 0, min: 0 },
    cgstAmount:      { type: Number, default: 0, min: 0 },
    sgstAmount:      { type: Number, default: 0, min: 0 },
    grandTotal:      { type: Number, required: true, min: 0 },
    customerName:    { type: String, default: '' },
    customerPhone:   { type: String, default: '' },
    customerAddress: { type: String, default: '' },
  },
  { timestamps: true },
);

// Compound index: each vendor's bill numbers are sequential and unique
BillSchema.index({ userId: 1, billNo: 1 }, { unique: true });

export const Bill = mongoose.model<IBill>('Bill', BillSchema);
