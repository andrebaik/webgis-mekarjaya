const pool = require('../db');
const createCrud = require('../lib/crudFactory');

const crud = createCrud('village_hamlets', {
  allowedFields: ['year', 'month', 'name', 'rw', 'rt_count', 'kk_count', 'male', 'female',
    'ktp_required', 'ktp_done', 'ktp_pending', 'sort_order'],
  orderBy: 'year DESC, month DESC, rw ASC',
});

// Laporan penduduk bersifat bulanan, jadi "terbaru" ditentukan oleh pasangan
// (year, month) — bukan year saja seperti tabel demographics.
const getLatestPeriod = async () => {
  const [rows] = await pool.query(
    'SELECT year, month FROM village_hamlets ORDER BY year DESC, month DESC LIMIT 1'
  );
  return rows[0] || null;
};

/**
 * GET /api/hamlets — default mengembalikan periode terbaru saja supaya frontend
 * tidak perlu menyaring campuran beberapa bulan. `?year=&month=` untuk periode tertentu,
 * `?all=1` untuk seluruh riwayat.
 */
const list = async (req, res) => {
  try {
    if (req.query.all) {
      const [rows] = await pool.query(
        'SELECT * FROM village_hamlets ORDER BY year DESC, month DESC, rw ASC'
      );
      return res.json(rows);
    }

    let year = req.query.year ? parseInt(req.query.year, 10) : null;
    let month = req.query.month ? parseInt(req.query.month, 10) : null;

    if (!year || !month) {
      const latest = await getLatestPeriod();
      if (!latest) return res.json([]);
      year = year || latest.year;
      month = month || latest.month;
    }

    const [rows] = await pool.query(
      'SELECT * FROM village_hamlets WHERE year = ? AND month = ? ORDER BY rw ASC',
      [year, month]
    );
    res.json(rows);
  } catch (error) {
    console.error('Failed to list village_hamlets:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { ...crud, list };
