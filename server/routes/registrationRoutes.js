const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
  getAttendeesByEvent,
  exportAttendees,
} = require('../controllers/registrationController');
const { protect, adminOrOrganizer } = require('../middleware/authMiddleware');

router.post('/:eventId', protect, registerForEvent);
router.get('/my', protect, getMyRegistrations);
router.delete('/:id', protect, cancelRegistration);
router.get('/event/:eventId', protect, adminOrOrganizer, getAttendeesByEvent);
router.get('/export/:eventId', protect, adminOrOrganizer, exportAttendees);

module.exports = router;
