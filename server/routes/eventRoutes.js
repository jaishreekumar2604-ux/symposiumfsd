const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventStats,
} = require('../controllers/eventController');
const { protect, adminOrOrganizer } = require('../middleware/authMiddleware');

router.get('/', getEvents);
router.get('/stats/summary', getEventStats);
router.get('/:id', getEventById);
router.post('/', protect, adminOrOrganizer, createEvent);
router.put('/:id', protect, adminOrOrganizer, updateEvent);
router.delete('/:id', protect, adminOrOrganizer, deleteEvent);

module.exports = router;
