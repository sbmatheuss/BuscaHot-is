const asyncHandler = require('express-async-handler');
const hotelApiService = require('../services/hotelApiService');
const { matchesFilters } = require('../utils/facilityMatcher');
const { getDefaultDates } = require('../utils/dateUtils');

const parseBool = (value) => value === 'true' || value === '1' || value === true;

// @desc    Busca hotéis por destino, com filtros de comodidades e preço
// @route   GET /api/hotels/search
// @access  Public
const searchHotels = asyncHandler(async (req, res) => {
  const {
    destination,
    checkIn,
    checkOut,
    adults,
    maxPrice,
    pool,
    parking,
    ac,
    wifi,
    breakfast,
    sortBy,
    page,
    limit,
  } = req.query;

  const defaults = getDefaultDates();

  let hotels = await hotelApiService.searchHotels({
    destination,
    checkIn: checkIn || defaults.checkIn,
    checkOut: checkOut || defaults.checkOut,
    adults: adults ? Number(adults) : 1,
    sortBy: sortBy === 'rating' ? 'rating' : 'price',
  });

  const activeFilters = {
    pool: parseBool(pool),
    parking: parseBool(parking),
    ac: parseBool(ac),
    wifi: parseBool(wifi),
    breakfast: parseBool(breakfast),
  };

  if (Object.values(activeFilters).some(Boolean)) {
    hotels = hotels.filter((hotel) => matchesFilters(hotel.facilities, activeFilters));
  }

  if (maxPrice) {
    const max = Number(maxPrice);
    hotels = hotels.filter((hotel) => hotel.price == null || hotel.price <= max);
  }

  const pageNumber = Math.max(1, Number(page) || 1);
  const pageSize = Math.min(24, Math.max(1, Number(limit) || 12));
  const total = hotels.length;
  const start = (pageNumber - 1) * pageSize;
  const paginated = hotels.slice(start, start + pageSize);

  res.json({
    results: paginated,
    page: pageNumber,
    pages: Math.max(1, Math.ceil(total / pageSize)),
    total,
  });
});

// @desc    Retorna hotéis recomendados/melhor avaliados para a home
// @route   GET /api/hotels/featured
// @access  Public
const getFeaturedHotels = asyncHandler(async (req, res) => {
  const defaults = getDefaultDates();

  const hotels = await hotelApiService.getFeaturedHotels({
    checkIn: req.query.checkIn || defaults.checkIn,
    checkOut: req.query.checkOut || defaults.checkOut,
  });

  res.json({ results: hotels });
});

// @desc    Retorna os detalhes de um hotel
// @route   GET /api/hotels/:id
// @access  Public
const getHotelById = asyncHandler(async (req, res) => {
  const defaults = getDefaultDates();

  const hotel = await hotelApiService.getHotelById(req.params.id, {
    checkIn: req.query.checkIn || defaults.checkIn,
    checkOut: req.query.checkOut || defaults.checkOut,
  });

  if (!hotel) {
    res.status(404);
    throw new Error('Hotel não encontrado');
  }

  res.json(hotel);
});

module.exports = { searchHotels, getFeaturedHotels, getHotelById };
