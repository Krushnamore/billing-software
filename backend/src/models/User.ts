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

export interface IUserProfile {
  name: string;
  shopName: string;
  gstNo: string;
  address: string;
  age: string;
  email: string;
  mobile: string;
}

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
  isUsed:       boolean;
  profileCompleted: boolean;
  profile:      IUserProfile | null;
  passwordHash?: string;
  createdAt:    Date;
  updatedAt:    Date;
}

const UserProfileSchema = new Schema<IUserProfile>(
  {
    name: { type: String, default: '', trim: true },
    shopName: { type: String, default: '', trim: true },
    gstNo: { type: String, default: '', trim: true, uppercase: true },
    address: { type: String, default: '', trim: true },
    age: { type: String, default: '' },
    email: { type: String, default: '', trim: true, lowercase: true },
    mobile: { type: String, default: '', trim: true },
  },
  { _id: false },
);

const UserSchema = new Schema<IUser>(
  {
    uniqueId:     { type: String, required: true, unique: true, uppercase: true, trim: true },
    name:         { type: String, default: '', trim: true },
    age:          { type: String, default: '' },
    email:        { type: String, default: '', lowercase: true, trim: true },
    mobile:       { type: String, default: '', trim: true },
    shopName:     { type: String, default: '', trim: true },
    gstNo:        { type: String, default: '', trim: true, uppercase: true },
    address:      { type: String, default: '', trim: true },
    city:         { type: String, default: '', trim: true },
    district:     { type: String, default: '', trim: true },
    state:        { type: String, default: '', trim: true },
    isUsed:       { type: Boolean, default: false },
    profileCompleted: { type: Boolean, default: false },
    profile:      { type: UserProfileSchema, default: null },
    passwordHash: { type: String },
  },
  { timestamps: true },
);

UserSchema.index(
  { email: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { email: { $gt: '' } },
    name: 'email_unique_sparse',
  },
);

UserSchema.index(
  { mobile: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { mobile: { $gt: '' } },
    name: 'mobile_unique_sparse',
  },
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
