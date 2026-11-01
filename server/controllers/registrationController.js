const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const User = require('../models/User');
const mockStore = require('../utils/mockStore');

const generateRegId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SYM-${new Date().getFullYear()}-${code}`;
};

// @desc    Register (RSVP) for an event with real-time seat decrement
// @route   POST /api/registrations/:eventId
// @access  Private
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    // Admin Restriction: Admins can only view and make changes, NOT register
    if (req.user && req.user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Administrators have management privileges only and cannot register for events. Please sign in with a student account to RSVP.',
      });
    }

    if (mongoose.connection.readyState === 1) {
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }

      if (event.availableSeats <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Sorry! All seats for this event are fully booked.',
        });
      }

      // Single user CAN register for multiple symposiums, but not duplicate the same symposium
      const existing = await Registration.findOne({
        user: userId,
        event: eventId,
        status: 'confirmed',
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'You have already registered for this event! Check your passes in "My Registrations".',
          registration: existing,
        });
      }

      const user = await User.findById(userId);

      const updatedEvent = await Event.findOneAndUpdate(
        { _id: eventId, availableSeats: { $gt: 0 } },
        {
          $inc: { availableSeats: -1, registeredCount: 1 },
        },
        { new: true }
      );

      if (!updatedEvent) {
        return res.status(400).json({
          success: false,
          message: 'Seat booking collision: All seats just got filled!',
        });
      }

      if (updatedEvent.availableSeats === 0) {
        updatedEvent.status = 'sold-out';
      } else if (updatedEvent.availableSeats <= Math.ceil(updatedEvent.totalSeats * 0.2)) {
        updatedEvent.status = 'filling-fast';
      }
      await updatedEvent.save();

      const regId = generateRegId();
      const registration = await Registration.create({
        registrationId: regId,
        ticketId: regId, // Set both to prevent any legacy null index errors
        user: userId,
        event: eventId,
        attendeeName: user.name,
        attendeeEmail: user.email,
        attendeeDepartment: user.department || 'General',
        attendeeRollNo: user.rollNumber || 'N/A',
        attendeeCollege: user.college || 'Engineering College',
        attendeePhone: user.phone || 'N/A',
        status: 'confirmed',
      });

      const populatedReg = await Registration.findById(registration._id).populate('event');

      return res.status(201).json({
        success: true,
        message: 'RSVP Successful! Seat reserved.',
        registration: populatedReg,
        availableSeats: updatedEvent.availableSeats,
      });
    } else {
      // In-memory fallback
      const ev = mockStore.events.find((e) => String(e._id) === String(eventId));
      if (!ev) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }

      if (ev.availableSeats <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Sorry! All seats for this event are fully booked.',
        });
      }

      const existing = mockStore.registrations.find(
        (r) => String(r.user) === String(userId) && String(r.event?._id || r.event) === String(eventId)
      );

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'You have already registered for this event! Check your passes in "My Registrations".',
          registration: existing,
        });
      }

      // Decrement seats
      ev.availableSeats = Math.max(0, ev.availableSeats - 1);
      ev.registeredCount = (ev.registeredCount || 0) + 1;
      if (ev.availableSeats === 0) {
        ev.status = 'sold-out';
      } else if (ev.availableSeats <= Math.ceil(ev.totalSeats * 0.2)) {
        ev.status = 'filling-fast';
      }

      const user = mockStore.users.find((u) => String(u._id) === String(userId)) || req.user;
      const regId = generateRegId();
      const newReg = {
        _id: 'reg_' + Date.now(),
        registrationId: regId,
        ticketId: regId,
        user: userId,
        event: ev,
        attendeeName: user.name,
        attendeeEmail: user.email,
        attendeeDepartment: user.department || 'General',
        attendeeRollNo: user.rollNumber || 'N/A',
        attendeeCollege: user.college || 'Engineering College',
        attendeePhone: user.phone || 'N/A',
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      mockStore.registrations.push(newReg);

      return res.status(201).json({
        success: true,
        message: 'RSVP Successful! Seat reserved.',
        registration: newReg,
        availableSeats: ev.availableSeats,
      });
    }
  } catch (error) {
    console.error('Error during RSVP:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to complete registration',
    });
  }
};

// @desc    Get all registrations of the current logged-in user
// @route   GET /api/registrations/my
// @access  Private
const getMyRegistrations = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const registrations = await Registration.find({
        user: req.user._id,
        status: 'confirmed',
      })
        .populate('event')
        .sort({ createdAt: -1 });

      return res.json({
        success: true,
        count: registrations.length,
        registrations,
      });
    } else {
      const myRegs = mockStore.registrations
        .filter((r) => String(r.user) === String(req.user._id))
        .map((r) => {
          if (typeof r.event === 'string') {
            const ev = mockStore.events.find((e) => String(e._id) === String(r.event));
            return { ...r, event: ev };
          }
          return r;
        });

      return res.json({
        success: true,
        count: myRegs.length,
        registrations: myRegs,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your registrations',
    });
  }
};

// @desc    Cancel RSVP & restore seat availability
// @route   DELETE /api/registrations/:id
// @access  Private
const cancelRegistration = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const registration = await Registration.findById(req.params.id);
      if (!registration) {
        return res.status(404).json({ success: false, message: 'Registration not found' });
      }

      if (
        registration.user.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to cancel this registration',
        });
      }

      const eventId = registration.event;
      await registration.deleteOne();

      const event = await Event.findById(eventId);
      if (event) {
        event.availableSeats = Math.min(event.totalSeats, event.availableSeats + 1);
        event.registeredCount = Math.max(0, event.registeredCount - 1);
        if (event.availableSeats > 0 && event.status === 'sold-out') {
          event.status = 'open';
        }
        await event.save();
      }

      return res.json({
        success: true,
        message: 'RSVP cancelled successfully. Your seat has been released.',
      });
    } else {
      const idx = mockStore.registrations.findIndex((r) => String(r._id) === String(req.params.id));
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Registration not found' });
      }

      const reg = mockStore.registrations[idx];
      const evId = reg.event?._id || reg.event;
      mockStore.registrations.splice(idx, 1);

      const ev = mockStore.events.find((e) => String(e._id) === String(evId));
      if (ev) {
        ev.availableSeats = Math.min(ev.totalSeats, ev.availableSeats + 1);
        ev.registeredCount = Math.max(0, ev.registeredCount - 1);
        if (ev.availableSeats > 0 && ev.status === 'sold-out') {
          ev.status = 'open';
        }
      }

      return res.json({
        success: true,
        message: 'RSVP cancelled successfully. Your seat has been released.',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel registration',
    });
  }
};

// @desc    Get attendee list for an event (Admin / Club Organizer)
// @route   GET /api/registrations/event/:eventId
// @access  Private (Admin / Club Organizer)
const getAttendeesByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (mongoose.connection.readyState === 1) {
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }

      const attendees = await Registration.find({ event: eventId, status: 'confirmed' })
        .populate('user', 'name email department rollNumber phone')
        .sort({ createdAt: 1 });

      return res.json({
        success: true,
        event: {
          _id: event._id,
          title: event.title,
          clubName: event.clubName,
          totalSeats: event.totalSeats,
          availableSeats: event.availableSeats,
          registeredCount: event.registeredCount,
        },
        count: attendees.length,
        attendees,
      });
    } else {
      const event = mockStore.events.find((e) => String(e._id) === String(eventId));
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }

      const attendees = mockStore.registrations.filter(
        (r) => String(r.event?._id || r.event) === String(eventId)
      );

      return res.json({
        success: true,
        event: {
          _id: event._id,
          title: event.title,
          clubName: event.clubName,
          totalSeats: event.totalSeats,
          availableSeats: event.availableSeats,
          registeredCount: event.registeredCount,
        },
        count: attendees.length,
        attendees,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendee list',
    });
  }
};

// @desc    Export attendee list in CSV or JSON format
// @route   GET /api/registrations/export/:eventId
// @access  Private (Admin / Club Organizer)
const exportAttendees = async (req, res) => {
  try {
    const { eventId } = req.params;
    const format = req.query.format || 'csv';

    let eventTitle = 'Event';
    let attendees = [];

    if (mongoose.connection.readyState === 1) {
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }
      eventTitle = event.title;
      attendees = await Registration.find({ event: eventId, status: 'confirmed' })
        .populate('user', 'name email department college rollNumber phone')
        .sort({ createdAt: 1 });
    } else {
      const ev = mockStore.events.find((e) => String(e._id) === String(eventId));
      if (!ev) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }
      eventTitle = ev.title;
      attendees = mockStore.registrations.filter(
        (r) => String(r.event?._id || r.event) === String(eventId)
      );
    }

    const sanitizedTitle = eventTitle.replace(/[^a-zA-Z0-9_-]/g, '_');

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${sanitizedTitle}_attendees.json"`
      );
      return res.status(200).json({
        event: {
          title: eventTitle,
          totalAttendees: attendees.length,
          exportedAt: new Date().toISOString(),
          leadOrganizer: 'Jaishree K',
        },
        attendees: attendees.map((att, idx) => ({
          slNo: idx + 1,
          registrationId: att.registrationId,
          ticketId: att.ticketId || att.registrationId,
          name: att.attendeeName,
          email: att.attendeeEmail,
          department: att.attendeeDepartment,
          rollNumber: att.attendeeRollNo,
          college: att.attendeeCollege,
          phone: att.attendeePhone,
          registeredAt: att.createdAt,
          status: att.status,
        })),
      });
    }

    // Default to CSV
    let csvContent = 'Sl No,Registration ID,Ticket ID,Student Name,Email,Department,Roll Number,College,Phone,Registered At,Status\n';

    attendees.forEach((att, idx) => {
      const escape = (val) => `"${String(val || '').replace(/"/g, '""')}"`;
      csvContent += [
        idx + 1,
        escape(att.registrationId),
        escape(att.ticketId || att.registrationId),
        escape(att.attendeeName),
        escape(att.attendeeEmail),
        escape(att.attendeeDepartment),
        escape(att.attendeeRollNo),
        escape(att.attendeeCollege),
        escape(att.attendeePhone),
        escape(new Date(att.createdAt).toLocaleString()),
        escape(att.status),
      ].join(',') + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${sanitizedTitle}_attendees.csv"`
    );
    return res.status(200).send(csvContent);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export attendee list',
    });
  }
};

module.exports = {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
  getAttendeesByEvent,
  exportAttendees,
};
