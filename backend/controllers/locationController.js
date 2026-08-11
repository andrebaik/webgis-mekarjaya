const pool = require('../db');

// MySQL mengembalikan BOOLEAN sebagai TINYINT 0/1. Kalau angka itu diteruskan
// apa adanya, React merender `{featured && <Badge/>}` menjadi teks "0" pada baris
// yang tidak unggulan — dan tipe `featured: boolean` di frontend jadi berbohong.
const toBool = (v) => Boolean(v);

const parseCoordsIfNeeded = (data) => {
  if (typeof data === 'string') {
    try { return JSON.parse(data); } catch { return data; }
  }
  return data;
};

const getAllLocations = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, slug, category_id, name_id, description_id, coordinates, images, featured, created_at FROM locations ORDER BY created_at DESC'
    );
    const locations = rows.map(row => ({
      ...row,
      coordinates: parseCoordsIfNeeded(row.coordinates),
      images: row.images ? parseCoordsIfNeeded(row.images) : [],
      featured: toBool(row.featured)
    }));
    res.json(locations);
  } catch (error) {
    console.error('Failed to fetch locations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getLocationBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await pool.query(
      `SELECT l.*, c.slug as category_slug, c.name_id as category_name_id
       FROM locations l
       JOIN categories c ON l.category_id = c.id
       WHERE l.slug = ?`,
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const location = {
      ...rows[0],
      coordinates: parseCoordsIfNeeded(rows[0].coordinates),
      images: rows[0].images ? parseCoordsIfNeeded(rows[0].images) : [],
      featured: toBool(rows[0].featured)
    };

    res.json(location);
  } catch (error) {
    console.error(`Failed to fetch location with slug ${req.params.slug}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, slug, name_id, icon FROM categories ORDER BY name_id ASC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getLocationsByCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const [category] = await pool.query(
      'SELECT id, name_id FROM categories WHERE slug = ?',
      [slug]
    );

    if (category.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const [locations] = await pool.query(
      `SELECT id, slug, category_id, name_id, description_id, coordinates, images, featured, created_at
       FROM locations WHERE category_id = ?
       ORDER BY created_at DESC`,
      [category[0].id]
    );

    const response = {
      category: category[0],
      locations: locations.map(loc => ({
        ...loc,
        coordinates: parseCoordsIfNeeded(loc.coordinates),
        images: loc.images ? parseCoordsIfNeeded(loc.images) : [],
        featured: toBool(loc.featured)
      }))
    };

    res.json(response);
  } catch (error) {
    console.error(`Failed to fetch locations for category ${req.params.slug}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createLocation = async (req, res) => {
  try {
    const { slug, category_id, name_id, description_id, coordinates, images, featured } = req.body;

    if (!slug || !category_id || !name_id || !coordinates) {
      return res.status(400).json({ message: 'Missing required fields: slug, category_id, name_id, coordinates' });
    }

    const [result] = await pool.query(
      `INSERT INTO locations (slug, category_id, name_id, description_id, coordinates, images, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [slug, category_id, name_id, description_id || null, JSON.stringify(coordinates), images ? JSON.stringify(images) : null, featured || false]
    );

    res.status(201).json({ id: result.insertId, slug, message: 'Location created successfully' });
  } catch (error) {
    console.error('Failed to create location:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'A location with this slug already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { slug, category_id, name_id, description_id, coordinates, images, featured } = req.body;

    const [existing] = await pool.query('SELECT id FROM locations WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const fields = [];
    const values = [];

    if (slug !== undefined) { fields.push('slug = ?'); values.push(slug); }
    if (category_id !== undefined) { fields.push('category_id = ?'); values.push(category_id); }
    if (name_id !== undefined) { fields.push('name_id = ?'); values.push(name_id); }
    if (description_id !== undefined) { fields.push('description_id = ?'); values.push(description_id); }
    if (coordinates !== undefined) { fields.push('coordinates = ?'); values.push(JSON.stringify(coordinates)); }
    if (images !== undefined) { fields.push('images = ?'); values.push(JSON.stringify(images)); }
    if (featured !== undefined) { fields.push('featured = ?'); values.push(featured); }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    values.push(id);
    await pool.query(`UPDATE locations SET ${fields.join(', ')} WHERE id = ?`, values);

    res.json({ message: 'Location updated successfully' });
  } catch (error) {
    console.error(`Failed to update location ${req.params.id}:`, error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'A location with this slug already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id FROM locations WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Location not found' });
    }

    await pool.query('DELETE FROM locations WHERE id = ?', [id]);
    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error(`Failed to delete location ${req.params.id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { slug, name_id, icon } = req.body;
    if (!slug || !name_id) {
      return res.status(400).json({ message: 'Missing required fields: slug, name_id' });
    }
    const [result] = await pool.query(
      'INSERT INTO categories (slug, name_id, icon) VALUES (?, ?, ?)',
      [slug, name_id, icon || null]
    );
    res.status(201).json({ id: result.insertId, slug, message: 'Category created successfully' });
  } catch (error) {
    console.error('Failed to create category:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'A category with this slug already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { slug, name_id, icon } = req.body;
    const fields = [];
    const values = [];
    if (slug !== undefined) { fields.push('slug = ?'); values.push(slug); }
    if (name_id !== undefined) { fields.push('name_id = ?'); values.push(name_id); }
    if (icon !== undefined) { fields.push('icon = ?'); values.push(icon); }
    if (fields.length === 0) return res.status(400).json({ message: 'No fields to update' });
    values.push(id);
    await pool.query(`UPDATE categories SET ${fields.join(', ')} WHERE id = ?`, values);
    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error(`Failed to update category ${req.params.id}:`, error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'A category with this slug already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(`Failed to delete category ${req.params.id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAllLocations, getLocationBySlug, getAllCategories, getLocationsByCategory, createLocation, updateLocation, deleteLocation, createCategory, updateCategory, deleteCategory };
