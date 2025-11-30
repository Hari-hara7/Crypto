const express = require('express');
const { register, login } = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

// Apply stricter rate limits to sensitive endpoints
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 register requests per windowMs
  message: 'Too many accounts created from this IP, please try again after 15 minutes'
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per windowMs
  message: 'Too many login attempts from this IP, please try again after 15 minutes'
});

const router = express.Router();

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);

module.exports = router;
