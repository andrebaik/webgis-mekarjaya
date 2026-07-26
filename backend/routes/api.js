const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const authenticateToken = require('../middleware/auth');

// Public routes
router.get('/locations', locationController.getAllLocations);
router.get('/locations/:slug', locationController.getLocationBySlug);
router.get('/categories', locationController.getAllCategories);
router.get('/categories/:slug/locations', locationController.getLocationsByCategory);

// Admin routes (require authentication)
router.post('/admin/locations', authenticateToken, locationController.createLocation);
router.put('/admin/locations/:id', authenticateToken, locationController.updateLocation);
router.delete('/admin/locations/:id', authenticateToken, locationController.deleteLocation);

module.exports = router;
