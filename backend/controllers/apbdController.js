const pool = require('../db');
const createCrud = require('../lib/crudFactory');

const crud = createCrud('apbd_items', {
  allowedFields: ['year', 'type', 'category', 'amount', 'realisasi', 'sort_order'],
  orderBy: 'year DESC, sort_order ASC',
});

/**
 * `realisasi` boleh kosong (pos yang belum terserap). Form mengirim string kosong
 * saat dikosongkan, dan '' ditolak MySQL mode strict untuk kolom BIGINT — jadi
 * dinormalkan jadi NULL sebelum diteruskan ke factory CRUD.
 */
const normalkanRealisasi = (handler) => (req, res) => {
  if (req.body && Object.prototype.hasOwnProperty.call(req.body, 'realisasi')) {
    const v = req.body.realisasi;
    req.body.realisasi = v === '' || v === null || v === undefined ? null : Number(v);
    if (Number.isNaN(req.body.realisasi)) req.body.realisasi = null;
  }
  return handler(req, res);
};

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

module.exports = {
  ...crud,
  create: normalkanRealisasi(crud.create),
  update: normalkanRealisasi(crud.update),
  getSummary,
};
