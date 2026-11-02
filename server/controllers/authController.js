const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const mockStore = require('../utils/mockStore');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'jaishree_fsd_symposium_super_secret_jwt_key_2026',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, department, college, rollNumber, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    const emailLower = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: emailLower });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists',
        });
      }

      const user = await User.create({
        name,
        email: emailLower,
        password,
        role: role || 'student',
        department: department || 'Computer Science and Engineering',
        college: college || 'College of Engineering & Technology',
        rollNumber: rollNumber || '',
        phone: phone || '',
      });

      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully!',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          college: user.college,
          rollNumber: user.rollNumber,
          phone: user.phone,
        },
      });
    } else {
      // In-memory fallback
      const exists = mockStore.users.find((u) => u.email === emailLower);
      if (exists) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = {
        _id: 'usr_' + Date.now(),
        name,
        email: emailLower,
        password: hashedPassword,
        role: role || 'student',
        department: department || 'Computer Science and Engineering',
        college: college || 'College of Engineering & Technology',
        rollNumber: rollNumber || '',
        phone: phone || '',
        createdAt: new Date().toISOString(),
      };

      mockStore.users.push(newUser);
      const token = generateToken(newUser._id);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully!',
        token,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          department: newUser.department,
          college: newUser.college,
          rollNumber: newUser.rollNumber,
          phone: newUser.phone,
        },
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const emailLower = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      let user = await User.findOne({ email: emailLower }).select('+password');

      // Auto-provision default demo accounts on-the-fly if they do not exist yet in MongoDB Atlas
      if (!user && (emailLower === 'jaishree@sympora.edu' || emailLower === 'rahul@student.edu')) {
        const isDefaultAdmin = emailLower === 'jaishree@sympora.edu';
        user = await User.create({
          name: isDefaultAdmin ? 'Jaishree K' : 'Rahul Sharma',
          email: emailLower,
          password: isDefaultAdmin ? 'Admin@123' : 'User@123',
          role: isDefaultAdmin ? 'admin' : 'student',
          department: 'Computer Science and Engineering',
          college: 'College of Engineering & Technology',
          rollNumber: isDefaultAdmin ? '26CSE001' : '26CSE045',
          phone: isDefaultAdmin ? '+91 98765 43210' : '+91 98111 22334',
        });
        user = await User.findById(user._id).select('+password');
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials: User not found. Please click Register to create a new account.',
        });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials: Incorrect password',
        });
      }

      const token = generateToken(user._id);

      return res.json({
        success: true,
        message: 'Logged in successfully!',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          college: user.college,
          rollNumber: user.rollNumber,
          phone: user.phone,
        },
      });
    } else {
      // In-memory fallback
      const user = mockStore.users.find((u) => u.email === emailLower);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials: User not found',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials: Incorrect password',
        });
      }

      const token = generateToken(user._id);

      return res.json({
        success: true,
        message: 'Logged in successfully!',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          college: user.college,
          rollNumber: user.rollNumber,
          phone: user.phone,
        },
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user._id);
      return res.json({ success: true, user });
    } else {
      const u = mockStore.users.find((user) => String(user._id) === String(req.user._id));
      const { password, ...safe } = u || req.user;
      return res.json({ success: true, user: safe });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
