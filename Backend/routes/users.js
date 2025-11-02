// routes/users.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/auth');
const { getProfile, updateProfile, listUsers, deleteUser } = require('../controllers/userController');

// User self profile routes
router.get('/me', protect, getProfile);
router.put('/me', protect, updateProfile);

// Admin user management
router.get('/', protect, admin, listUsers);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
