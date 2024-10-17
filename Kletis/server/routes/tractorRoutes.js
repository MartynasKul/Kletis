const express = require('express');
const router = express.Router();
const tractorController = require('../controllers/tractorsController');

// Tractor routes
router.get('/', tractorController.getAllTractors);
router.get('/:id', tractorController.getTractorById);
router.post('/', tractorController.createTractor);
router.put('/:id', tractorController.updateTractor);
router.delete('/:id', tractorController.deleteTractor);

module.exports = router;