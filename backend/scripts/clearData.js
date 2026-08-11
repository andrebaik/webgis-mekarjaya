const pool = require('../db');

async function clearData() {
  try {
    console.log('Clearing mock data from database...');
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    await pool.query('TRUNCATE TABLE locations');
    await pool.query('TRUNCATE TABLE apbd_items');
    await pool.query('TRUNCATE TABLE demographics');
    await pool.query('TRUNCATE TABLE period_programs');
    await pool.query('TRUNCATE TABLE village_periods');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✅ Mock data (locations, apbd, demographics, village periods) cleared successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error clearing data:', err);
    process.exit(1);
  }
}

clearData();
