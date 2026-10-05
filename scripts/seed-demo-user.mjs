import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { account, user } from '../lib/db/schema.js';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

async function hashPassword(password) {
  // Using a simple hash for demo purposes
  // In production, use bcrypt or similar
  return crypto.pbkdf2Sync(password, 'ethioshield-salt', 1000, 64, 'sha512').toString('hex');
}

async function seedDemoUser() {
  const client = neon(DATABASE_URL);
  const db = drizzle(client, { schema: { user, account } });

  const demoEmail = 'test@ethioshield.com';
  const demoPassword = 'password123';

  try {
    console.log('Checking if demo user already exists...');
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, demoEmail))
      .limit(1);

    if (existingUser.length > 0) {
      console.log('Demo user already exists');
      return;
    }

    console.log('Creating demo user...');
    const userId = crypto.randomUUID();
    const hashedPassword = await hashPassword(demoPassword);

    // Insert user
    await db.insert(user).values({
      id: userId,
      email: demoEmail,
      name: 'Demo User',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Insert account with password
    await db.insert(account).values({
      id: crypto.randomUUID(),
      userId: userId,
      providerId: 'credential',
      accountId: demoEmail,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('✓ Demo user created successfully');
    console.log(`Email: ${demoEmail}`);
    console.log(`Password: ${demoPassword}`);
  } catch (error) {
    console.error('Error seeding demo user:', error);
    process.exit(1);
  }
}

seedDemoUser().then(() => {
  console.log('Seed completed');
  process.exit(0);
});
