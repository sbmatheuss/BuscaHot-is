const express = require('express');
const {
  registerUser,
  loginUser,
  getMe,
  googleAuthStub,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

// Stub preparado para futura integração com login Google (OAuth2)
router.get('/google', googleAuthStub);
router.get('/google/callback', googleAuthStub);

module.exports = router;
