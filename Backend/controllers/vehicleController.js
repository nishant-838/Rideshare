const Vehicle = require('../models/Vehicle');
const asyncHandler = require('express-async-handler');

exports.createVehicle = asyncHandler(async (req, res) => {
  const v = await Vehicle.create(req.body);
  res.status(201).json(v);
});

exports.updateVehicle = asyncHandler(async (req,res) => {
  const v = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(v);
});

exports.listVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find({}).lean();
  res.json(vehicles);
});

exports.getVehicle = asyncHandler(async (req,res) => {
  const v = await Vehicle.findById(req.params.id);
  if(!v){ res.status(404); throw new Error('Vehicle not found') }
  res.json(v);
});
