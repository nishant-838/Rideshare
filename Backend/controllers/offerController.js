const Offer = require('../models/Offer');
const asyncHandler = require('express-async-handler');

exports.createOffer = asyncHandler(async (req,res) => {
  const offer = await Offer.create(req.body);
  res.status(201).json(offer);
});

exports.listOffers = asyncHandler(async (req,res) => {
  const offers = await Offer.find({ active: true, validFrom: { $lte: new Date() }, validTo: { $gte: new Date() } });
  res.json(offers);
});
