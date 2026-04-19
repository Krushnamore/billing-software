/**
 * db.ts — MongoDB Atlas connection via Mongoose
 *
 * Reads MONGODB_URI from .env and connects once on startup.
 * All models are in ./models/
 */

import mongoose from 'mongoose';

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('\n❌  MONGODB_URI is missing in your .env file!');
    console.error('    Copy .env.example → .env and fill in your Atlas connection string.\n');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅  Connected to MongoDB Atlas');
  } catch (err) {
    console.error('❌  MongoDB connection failed:', (err as Error).message);
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️   MongoDB disconnected. Reconnecting...');
  });
  mongoose.connection.on('reconnected', () => {
    console.log('✅  MongoDB reconnected');
  });
}
