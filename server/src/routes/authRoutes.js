const express = require('express');
const passport = require('../config/passport');
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
  googleAuth,
  googleCallback,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

const googleConfigured = (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(503).json({ message: 'Login com Google não configurado neste servidor.' });
  }
  next();
};

router.get(
  '/google',
  googleConfigured,
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
  '/google/callback',
  googleConfigured,
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login?error=google`, session: false }),
  googleCallback
);

module.exports = router;
