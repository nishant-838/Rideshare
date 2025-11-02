// utils/priceCalculator.js
/**
 * Calculate price based on hourly rate and duration (in hours, decimal allowed).
 * Apply percent discount if provided (0-100)
 */
function calculatePrice(hourlyRate, startTime, endTime, discountPercent = 0) {
  const ms = new Date(endTime) - new Date(startTime);
  const hours = ms / (1000 * 60 * 60);
  // round up to nearest 15 minutes or choose business logic. We'll bill per full hour (ceil)
  const billedHours = Math.ceil(hours);
  let price = billedHours * hourlyRate;
  if (discountPercent && discountPercent > 0) {
    price = price * (1 - discountPercent / 100);
  }
  return { price, billedHours };
}

module.exports = { calculatePrice };
