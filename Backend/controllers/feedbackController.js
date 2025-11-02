const Feedback = require('../models/Feedback');
const asyncHandler = require('express-async-handler');

exports.createFeedback = asyncHandler(async (req,res) => {
  const f = await Feedback.create({ user: req.user._id, ...req.body });
  res.status(201).json(f);
});

exports.listFeedback = asyncHandler(async (req,res) => {
  const all = await Feedback.find().populate('user').populate('vehicle');
  res.json(all);
});
