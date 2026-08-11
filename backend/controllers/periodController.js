const pool = require('../db');
const createCrud = require('../lib/crudFactory');

const crud = createCrud('village_periods', {
  allowedFields: ['name', 'year_start', 'year_end', 'photo_url', 'description_id', 'sort_order'],
  orderBy: 'sort_order ASC, id ASC',
});

const getAllPeriodsWithPrograms = async (req, res) => {
  try {
    const [periods] = await pool.query(
      'SELECT * FROM village_periods ORDER BY sort_order ASC, id ASC'
    );
    const [programs] = await pool.query(
      'SELECT * FROM period_programs ORDER BY sort_order ASC, id ASC'
    );

    const result = periods.map((period) => ({
      ...period,
      programs: programs.filter((p) => p.period_id === period.id),
    }));
    res.json(result);
  } catch (error) {
    console.error('Failed to fetch periods with programs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const listPrograms = async (req, res) => {
  try {
    const { periodId } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM period_programs WHERE period_id = ? ORDER BY sort_order ASC, id ASC',
      [periodId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Failed to fetch programs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createProgram = async (req, res) => {
  try {
    const { periodId } = req.params;
    const { title_id, description_id, year, status, sort_order } = req.body;
    const [result] = await pool.query(
      `INSERT INTO period_programs (period_id, title_id, description_id, year, status, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [periodId, title_id, description_id || null, year || null, status || 'selesai', sort_order || 0]
    );
    res.status(201).json({ id: result.insertId, message: 'Program created successfully' });
  } catch (error) {
    console.error('Failed to create program:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const { title_id, description_id, year, status, sort_order } = req.body;
    const fields = [];
    const values = [];

    if (title_id !== undefined) { fields.push('title_id = ?'); values.push(title_id); }
    if (description_id !== undefined) { fields.push('description_id = ?'); values.push(description_id); }
    if (year !== undefined) { fields.push('year = ?'); values.push(year); }
    if (status !== undefined) { fields.push('status = ?'); values.push(status); }
    if (sort_order !== undefined) { fields.push('sort_order = ?'); values.push(sort_order); }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    values.push(id);
    await pool.query(`UPDATE period_programs SET ${fields.join(', ')} WHERE id = ?`, values);
    res.json({ message: 'Program updated successfully' });
  } catch (error) {
    console.error('Failed to update program:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM period_programs WHERE id = ?', [id]);
    res.json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Failed to delete program:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  ...crud,
  getAllPeriodsWithPrograms,
  listPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
};
