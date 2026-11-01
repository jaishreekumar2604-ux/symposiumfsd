const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const mockStore = require('../utils/mockStore');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'jaishree_fsd_symposium_super_secret_jwt_key_2026'
      );

      if (mongoose.connection.readyState === 1) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        const u = mockStore.users.find((user) => String(user._id) === String(decoded.id));
        if (u) {
          const { password, ...safeUser } = u;
          req.user = safeUser;
        }
      }

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
      return next();
    } catch (error) {
      console.error('Auth verification error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no authentication token provided' });
  }
};

const adminOrOrganizer = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'club_organizer')) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied: Requires Admin or Club Organizer privilege',
    });
  }
};

module.exports = { protect, adminOrOrganizer };
