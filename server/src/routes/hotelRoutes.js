const express = require('express');
const { searchHotels, getFeaturedHotels, getHotelById } = require('../controllers/hotelController');

const router = express.Router();

router.get('/search', searchHotels);
router.get('/featured', getFeaturedHotels);
router.get('/:id', getHotelById);

module.exports = router;
