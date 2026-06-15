const express = require('express');
const { upsertReview, getHotelReviews, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, upsertReview);
router.get('/:hotelId', getHotelReviews);
router.delete('/:hotelId', protect, deleteReview);

module.exports = router;
