import 'dotenv/config';
import { connectDB } from '../db';
import { User } from '../models/User';

const idsToSeed = [
  'UID-001',
  'UID-002',
  'UID-003',
];

async function seed(): Promise<void> {
  await connectDB();

  let added = 0;
  let skipped = 0;

  for (const rawId of idsToSeed) {
    const uniqueId = rawId.toUpperCase().trim();
    if (!uniqueId) continue;

    const exists = await User.findOne({ uniqueId });
    if (exists) {
      skipped++;
      console.log(`Skipped (already exists): ${uniqueId}`);
      continue;
    }

    await User.create({
      uniqueId,
      email: `${uniqueId.toLowerCase()}@seed.local`,
      mobile: `90000${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
      isUsed: false,
      profileCompleted: false,
      profile: null,
    });

    added++;
    console.log(`Added: ${uniqueId}`);
  }

  console.log(`Done. Added: ${added}, Skipped: ${skipped}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Failed to seed unique IDs:', err);
  process.exit(1);
});
