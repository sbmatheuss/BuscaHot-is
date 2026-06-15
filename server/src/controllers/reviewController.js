const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');

// @desc    Cria ou atualiza a avaliação do usuário para um hotel
// @route   POST /api/reviews
// @access  Private
const upsertReview = asyncHandler(async (req, res) => {
  const { hotelId, hotelName, rating, comment } = req.body;

  if (!hotelId || !hotelName || !rating || !comment) {
    res.status(400);
    throw new Error('hotelId, hotelName, rating e comment são obrigatórios');
  }

  if (rating < 1 || rating > 10) {
    res.status(400);
    throw new Error('A nota deve estar entre 1 e 10');
  }

  const review = await Review.findOneAndUpdate(
    { user: req.user._id, hotelId },
    { hotelName, rating: Number(rating), comment },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(201).json(review);
});

// @desc    Lista as avaliações de um hotel
// @route   GET /api/reviews/:hotelId
// @access  Public
const getHotelReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ hotelId: req.params.hotelId })
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .limit(50);

  const avg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  res.json({ reviews, average: avg ? Number(avg.toFixed(1)) : null, total: reviews.length });
});

// @desc    Deleta a própria avaliação
// @route   DELETE /api/reviews/:hotelId
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findOneAndDelete({
    user: req.user._id,
    hotelId: req.params.hotelId,
  });

  if (!review) {
    res.status(404);
    throw new Error('Avaliação não encontrada');
  }

  res.json({ message: 'Avaliação removida' });
});

module.exports = { upsertReview, getHotelReviews, deleteReview };
