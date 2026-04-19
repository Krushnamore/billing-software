/**
 * models/Product.ts — Mongoose schema for inventory products
 * Each product is scoped to a vendor via userId (the VND-XXXXXX uniqueId)
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  userId:    string;   // vendor's uniqueId (VND-XXXXXX)
  name:      string;
  price:     number;
  quantity:  number;
  unit:      string;
  hsn:       string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    userId:   { type: String, required: true, index: true },
    name:     { type: String, required: true, trim: true },
    price:    { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    unit:     { type: String, default: 'pcs', trim: true },
    hsn:      { type: String, default: '', trim: true },
  },
  { timestamps: true },
);

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
