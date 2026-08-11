const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const authController = require('../controllers/authController');
const villageController = require('../controllers/villageController');
const apbdController = require('../controllers/apbdController');
const periodController = require('../controllers/periodController');
const hamletController = require('../controllers/hamletController');
const authenticateToken = require('../middleware/auth');

// Auth
router.post('/auth/login', authController.login);

// Public routes
router.get('/locations', locationController.getAllLocations);
router.get('/locations/:slug', locationController.getLocationBySlug);
router.get('/categories', locationController.getAllCategories);
router.get('/categories/:slug/locations', locationController.getLocationsByCategory);
router.get('/profile', villageController.getProfile);
router.get('/hamlets', hamletController.list);
router.get('/apbd', apbdController.list);
router.get('/apbd/summary', apbdController.getSummary);
router.get('/periods', periodController.getAllPeriodsWithPrograms);

// Admin: locations & categories
router.post('/admin/locations', authenticateToken, locationController.createLocation);
router.put('/admin/locations/:id', authenticateToken, locationController.updateLocation);
router.delete('/admin/locations/:id', authenticateToken, locationController.deleteLocation);
router.post('/admin/categories', authenticateToken, locationController.createCategory);
router.put('/admin/categories/:id', authenticateToken, locationController.updateCategory);
router.delete('/admin/categories/:id', authenticateToken, locationController.deleteCategory);

// Admin: village profile
router.put('/admin/profile', authenticateToken, villageController.updateProfile);

// Admin: hamlets (rekap penduduk per dusun)
router.post('/admin/hamlets', authenticateToken, hamletController.create);
router.put('/admin/hamlets/:id', authenticateToken, hamletController.update);
router.delete('/admin/hamlets/:id', authenticateToken, hamletController.remove);

// Admin: apbd
router.post('/admin/apbd', authenticateToken, apbdController.create);
router.put('/admin/apbd/:id', authenticateToken, apbdController.update);
router.delete('/admin/apbd/:id', authenticateToken, apbdController.remove);

// Admin: periods
router.post('/admin/periods', authenticateToken, periodController.create);
router.put('/admin/periods/:id', authenticateToken, periodController.update);
router.delete('/admin/periods/:id', authenticateToken, periodController.remove);

// Admin: period programs
router.post('/admin/periods/:periodId/programs', authenticateToken, periodController.createProgram);
router.put('/admin/programs/:id', authenticateToken, periodController.updateProgram);
router.delete('/admin/programs/:id', authenticateToken, periodController.deleteProgram);
router.get('/admin/periods/:periodId/programs', authenticateToken, periodController.listPrograms);

module.exports = router;
