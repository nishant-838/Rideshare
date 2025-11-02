const express = require('express');
const router = express.Router();
const { createOffer, listOffers } = require('../controllers/offerController');
const { protect, admin } = require('../middlewares/auth');

router.get('/', listOffers);
router.post('/', protect, admin, createOffer);

module.exports = router;
