const pool = require('../db');

const parseJsonIfNeeded = (value) => {
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { return value; }
  }
  return value;
};

/**
 * Nilai yang perlu disimpan sebagai JSON. `null` sengaja dikecualikan: di
 * JavaScript `typeof null === 'object'`, sehingga tanpa penjagaan ini setiap
 * null berubah jadi STRING 'null' dan MySQL menolaknya untuk kolom angka
 * (ER_TRUNCATED_WRONG_VALUE_FOR_FIELD) — atau lebih buruk, tersimpan sebagai
 * teks 'null' di kolom teks.
 */
const perluJson = (v) => v !== null && (Array.isArray(v) || typeof v === 'object');

const createCrud = (table, options = {}) => {
  const { orderBy = 'sort_order ASC, id ASC', listColumns = '*' } = options;

  const list = async (req, res) => {
    try {
      const where = [];
      const params = [];

      if (req.query.year) {
        where.push('year = ?');
        params.push(parseInt(req.query.year, 10));
      }

      const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
      const [rows] = await pool.query(
        `SELECT ${listColumns} FROM ${table} ${whereSql} ORDER BY ${orderBy}`,
        params
      );
      const data = rows.map((row) => {
        const parsed = { ...row };
        for (const key of Object.keys(row)) {
          parsed[key] = parseJsonIfNeeded(row[key]);
        }
        return parsed;
      });
      res.json(data);
    } catch (error) {
      console.error(`Failed to list ${table}:`, error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const create = async (req, res) => {
    try {
      const data = req.body;
      const allowed = options.allowedFields || Object.keys(data);
      const values = [];

      const fields = allowed.filter((f) => f !== 'id' && data[f] !== undefined);
      const placeholders = fields.map((f) => {
        const v = data[f];
        values.push(perluJson(v) ? JSON.stringify(v) : v);
        return '?';
      }).join(', ');

      if (fields.length === 0) {
        return res.status(400).json({ message: 'No valid fields to insert' });
      }

      const [result] = await pool.query(
        `INSERT INTO ${table} (${fields.join(', ')}) VALUES (${placeholders})`,
        values
      );
      res.status(201).json({ id: result.insertId, message: `${table} created successfully` });
    } catch (error) {
      console.error(`Failed to create ${table}:`, error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Duplicate entry' });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const update = async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;

      const [existing] = await pool.query(`SELECT id FROM ${table} WHERE id = ?`, [id]);
      if (existing.length === 0) {
        return res.status(404).json({ message: 'Not found' });
      }

      const allowed = options.allowedFields || Object.keys(data);
      const fields = [];
      const values = [];

      allowed.forEach((f) => {
        if (data[f] !== undefined) {
          const v = data[f];
          fields.push(`${f} = ?`);
          values.push(perluJson(v) ? JSON.stringify(v) : v);
        }
      });

      if (fields.length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
      }

      values.push(id);
      await pool.query(`UPDATE ${table} SET ${fields.join(', ')} WHERE id = ?`, values);
      res.json({ message: `${table} updated successfully` });
    } catch (error) {
      console.error(`Failed to update ${table}:`, error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Duplicate entry' });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const remove = async (req, res) => {
    try {
      const { id } = req.params;
      const [existing] = await pool.query(`SELECT id FROM ${table} WHERE id = ?`, [id]);
      if (existing.length === 0) {
        return res.status(404).json({ message: 'Not found' });
      }
      await pool.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
      res.json({ message: `${table} deleted successfully` });
    } catch (error) {
      console.error(`Failed to delete ${table}:`, error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  return { list, create, update, remove };
};

module.exports = createCrud;
