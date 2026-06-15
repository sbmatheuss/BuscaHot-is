const express = require('express');
const { createBooking, getMyBookings, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, createBooking).get(protect, getMyBookings);
router.delete('/:id', protect, cancelBooking);

module.exports = router;
