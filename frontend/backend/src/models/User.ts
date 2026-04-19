/**
 * models/User.ts — Mongoose schema for Vendor accounts
 *
 * Uniqueness enforced at DB level:
 *   - email    (unique index)
 *   - mobile   (unique index)
 *   - gstNo    (sparse unique — unique only when non-empty)
 *   - uniqueId (unique index — VND-XXXXXX vendor login ID)
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  uniqueId:     string;
  name:         string;
  age:          string;
  email:        string;
  mobile:       string;
  shopName:     string;
  gstNo:        string;
  address:      string;
  city:         string;
  district:     string;
  state:        string;
  passwordHash: string;
  createdAt:    Date;
  updatedAt:    Date;
}

const UserSchema = new Schema<IUser>(
  {
    uniqueId:     { type: String, required: true, unique: true, uppercase: true, trim: true },
    name:         { type: String, required: true, trim: true },
    age:          { type: String, default: '' },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    mobile:       { type: String, required: true, unique: true, trim: true },
    shopName:     { type: String, required: true, trim: true },
    gstNo:        { type: String, default: '', trim: true, uppercase: true },
    address:      { type: String, default: '', trim: true },
    city:         { type: String, default: '', trim: true },
    district:     { type: String, default: '', trim: true },
    state:        { type: String, default: '', trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
);

// Sparse unique index — gstNo is unique only when it is a non-empty string
UserSchema.index(
  { gstNo: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { gstNo: { $gt: '' } },
    name: 'gstNo_unique_sparse',
  },
);

export const User = mongoose.model<IUser>('User', UserSchema);
