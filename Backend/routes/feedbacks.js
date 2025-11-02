const express = require('express');
const router = express.Router();
const { createFeedback, listFeedback } = require('../controllers/feedbackController');
const { protect, admin } = require('../middlewares/auth');

router.post('/', protect, createFeedback);
router.get('/', protect, admin, listFeedback);

module.exports = router;
