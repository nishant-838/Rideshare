const express = require('express');
const router = express.Router();
const { createVehicle, listVehicles, getVehicle, updateVehicle } = require('../controllers/vehicleController');
const { protect, admin } = require('../middlewares/auth');

router.get('/', listVehicles);
router.get('/:id', getVehicle);
router.post('/', protect, admin, createVehicle);
router.put('/:id', protect, admin, updateVehicle);

module.exports = router;
