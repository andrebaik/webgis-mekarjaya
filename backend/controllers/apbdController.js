const pool = require('../db');
const createCrud = require('../lib/crudFactory');

const crud = createCrud('apbd_items', {
  allowedFields: ['year', 'type', 'category', 'title', 'amount', 'sort_order'],
  orderBy: 'year DESC, sort_order ASC',
});

const getSummary = async (req, res) => {
  try {
    const year = parseInt(req.query.year, 10) || new Date().getFullYear();
    const [rows] = await pool.query(
      `SELECT type, SUM(amount) as total FROM apbd_items WHERE year = ? GROUP BY type`,
      [year]
    );
    res.json(rows);
  } catch (error) {
    console.error('Failed to fetch APBD summary:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { ...crud, getSummary };
