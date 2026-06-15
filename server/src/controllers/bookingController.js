const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');

const MS_PER_DAY = 1000 * 60 * 60 * 24;

// @desc    Cria uma nova reserva para o usuário autenticado
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const {
    hotelId,
    hotelName,
    hotelAddress,
    hotelImage,
    checkIn,
    checkOut,
    guests,
    pricePerNight,
  } = req.body;

  if (!hotelId || !hotelName || !checkIn || !checkOut || !pricePerNight) {
    res.status(400);
    throw new Error('Dados da reserva incompletos');
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.round((checkOutDate - checkInDate) / MS_PER_DAY);

  if (!(nights > 0)) {
    res.status(400);
    throw new Error('A data de check-out deve ser posterior à data de check-in');
  }

  const booking = await Booking.create({
    user: req.user._id,
    hotelId: String(hotelId),
    hotelName,
    hotelAddress: hotelAddress || '',
    hotelImage: hotelImage || '',
    checkIn: checkInDate,
    checkOut: checkOutDate,
    guests: guests || 1,
    nights,
    pricePerNight,
    totalPrice: Math.round(pricePerNight * nights * 100) / 100,
  });

  res.status(201).json(booking);
});

// @desc    Lista as reservas do usuário autenticado
// @route   GET /api/bookings
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(bookings);
});

// @desc    Cancela uma reserva do usuário autenticado
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Reserva não encontrada');
  }

  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Você não tem permissão para cancelar esta reserva');
  }

  booking.status = 'cancelled';
  await booking.save();

  res.json(booking);
});

module.exports = { createBooking, getMyBookings, cancelBooking };
