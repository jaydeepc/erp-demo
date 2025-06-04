const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get authenticated user info
router.get('/me', auth, (req, res) => {
  res.json({
    _id: req.user._id,
    username: req.user.username,
    fullName: req.user.fullName,
    email: req.user.email,
    role: req.user.role,
    createdAt: req.user.createdAt,
    updatedAt: req.user.updatedAt
  });
});

module.exports = router;
