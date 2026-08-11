const pool = require('../db');

const getProfile = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM village_profiles WHERE id = 1 LIMIT 1');
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Village profile not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Failed to fetch village profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Kolom numerik: form admin mengirim '' saat dikosongkan, dan '' ditolak MySQL
// mode strict untuk DECIMAL/INT — jadi dinormalkan jadi NULL dulu.
const NUMERIC_FIELDS = new Set(['area_km2', 'altitude_m', 'rw_count', 'rt_count']);

const updateProfile = async (req, res) => {
  try {
    const allowed = ['name_id', 'description_id', 'history_id', 'image_url', 'address', 'phone', 'email',
      'vision_id', 'mission_id', 'area_km2', 'altitude_m', 'rw_count', 'rt_count',
      'boundary_north', 'boundary_south', 'boundary_east', 'boundary_west'];
    const data = req.body;
    const fields = [];
    const values = [];

    allowed.forEach((f) => {
      if (data[f] === undefined) return;
      let value = data[f];
      if (NUMERIC_FIELDS.has(f)) {
        value = value === '' || value === null ? null : Number(value);
        if (value !== null && Number.isNaN(value)) return;
      }
      fields.push(`${f} = ?`);
      values.push(value);
    });

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    await pool.query(
      `UPDATE village_profiles SET ${fields.join(', ')} WHERE id = 1`,
      values
    );
    res.json({ message: 'Village profile updated successfully' });
  } catch (error) {
    console.error('Failed to update village profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getProfile, updateProfile };
