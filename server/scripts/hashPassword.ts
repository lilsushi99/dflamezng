/**
 * Utility: generate a bcrypt password hash to paste into phpMyAdmin.
 *
 * Admin credentials are validated ONLY against the `admins` database table
 * (see server/repositories/adminRepository.ts) - there is no default account
 * and no code path that accepts a hardcoded password. To set or change an
 * admin login, generate a hash here and write it directly to the database.
 *
 * Usage:
 *   npx tsx server/scripts/hashPassword.ts "YourChosenPassword"
 *
 * Then in phpMyAdmin, either create the first admin:
 *   INSERT INTO admins (username, password_hash, display_name)
 *   VALUES ('your_username', 'PASTE_HASH_HERE', 'Lead Curator');
 *
 * ...or rotate an existing admin's password:
 *   UPDATE admins SET password_hash = 'PASTE_HASH_HERE' WHERE username = 'your_username';
 */
import { hashPassword } from '../utils/password';

async function main() {
  const plainPassword = process.argv[2];

  if (!plainPassword) {
    console.error('\nUsage: npx tsx server/scripts/hashPassword.ts "YourChosenPassword"\n');
    process.exit(1);
  }

  if (plainPassword.length < 8) {
    console.warn('\n[Warning] That password is quite short. Consider 12+ characters for an admin account.\n');
  }

  const hash = await hashPassword(plainPassword);

  console.log('\nBcrypt hash generated. Paste this into the password_hash column in phpMyAdmin:\n');
  console.log(hash);
  console.log('');
}

main().catch((err) => {
  console.error('Failed to generate hash:', err);
  process.exit(1);
});
