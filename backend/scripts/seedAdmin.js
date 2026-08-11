const bcrypt = require('bcryptjs');
require('dotenv').config();
const pool = require('../db');

async function seedAdmin() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(password, 10);

  const [rows] = await pool.query('SELECT id FROM admins WHERE username = ?', [username]);
  if (rows.length > 0) {
    await pool.query('UPDATE admins SET password_hash = ? WHERE username = ?', [passwordHash, username]);
    console.log(`Admin '${username}' updated.`);
  } else {
    await pool.query('INSERT INTO admins (username, password_hash) VALUES (?, ?)', [username, passwordHash]);
    console.log(`Admin '${username}' created.`);
  }

  console.log('DEFAULT PASSWORD (change in production):', password);
  await pool.end();
}

seedAdmin().catch((err) => {
  console.error('Failed to seed admin:', err);
  process.exit(1);
});
