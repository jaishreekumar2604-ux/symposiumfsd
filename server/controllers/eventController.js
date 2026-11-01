const mongoose = require('mongoose');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const mockStore = require('../utils/mockStore');

// @desc    Get all events with rich filtering & search
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const { department, category, search, availability } = req.query;

    if (mongoose.connection.readyState === 1) {
      const query = {};

      if (department && department !== 'All' && department !== 'All Departments') {
        query.$or = [
          { department: department },
          { department: 'All Departments' }
        ];
      }

      if (category && category !== 'All') {
        query.category = category;
      }

      if (availability === 'available') {
        query.availableSeats = { $gt: 0 };
      } else if (availability === 'filling-fast') {
        query.status = 'filling-fast';
      }

      if (search && search.trim() !== '') {
        const regex = new RegExp(search.trim(), 'i');
        query.$and = query.$and || [];
        query.$and.push({
          $or: [
            { title: regex },
            { description: regex },
            { clubName: regex },
            { tags: regex },
            { venue: regex },
          ],
        });
      }

      const events = await Event.find(query).sort({ date: 1, createdAt: -1 });

      return res.json({
        success: true,
        count: events.length,
        events,
      });
    } else {
      // In-memory fallback
      let filtered = [...mockStore.events];

      if (department && department !== 'All' && department !== 'All Departments') {
        filtered = filtered.filter(
          (e) => e.department === department || e.department === 'All Departments'
        );
      }

      if (category && category !== 'All') {
        filtered = filtered.filter((e) => e.category === category);
      }

      if (availability === 'available') {
        filtered = filtered.filter((e) => e.availableSeats > 0);
      } else if (availability === 'filling-fast') {
        filtered = filtered.filter((e) => e.status === 'filling-fast');
      }

      if (search && search.trim() !== '') {
        const s = search.trim().toLowerCase();
        filtered = filtered.filter(
          (e) =>
            e.title.toLowerCase().includes(s) ||
            e.description.toLowerCase().includes(s) ||
            e.clubName.toLowerCase().includes(s) ||
            (e.tags && e.tags.some((t) => t.toLowerCase().includes(s))) ||
            e.venue.toLowerCase().includes(s)
        );
      }

      return res.json({
        success: true,
        count: filtered.length,
        events: filtered,
      });
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve events',
      error: error.message,
    });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const event = await Event.findById(req.params.id).populate('createdBy', 'name email');
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }
      return res.json({ success: true, event });
    } else {
      const event = mockStore.events.find((e) => String(e._id) === String(req.params.id));
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }
      return res.json({ success: true, event });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event details',
      error: error.message,
    });
  }
};

// @desc    Create a new symposium or workshop event
// @route   POST /api/events
// @access  Private (Admin / Club Organizer)
const createEvent = async (req, res) => {
  try {
    const {
      title,
      clubName,
      category,
      department,
      description,
      date,
      time,
      venue,
      totalSeats,
      fee,
      tags,
      bannerGradient,
      organizerContact,
    } = req.body;

    if (!title || !clubName || !category || !department || !date || !totalSeats) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, clubName, category, department, date, and totalSeats',
      });
    }

    const tagArray = Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t) => t.trim()) : []);

    if (mongoose.connection.readyState === 1) {
      const event = new Event({
        title,
        clubName,
        category,
        department,
        description: description || 'Exciting college event. Register now to reserve your seat!',
        date,
        time: time || '09:30 AM - 04:00 PM',
        venue: venue || 'Campus Main Auditorium',
        totalSeats: Number(totalSeats),
        availableSeats: Number(totalSeats),
        fee: Number(fee) || 0,
        tags: tagArray,
        bannerGradient: bannerGradient || 'from-indigo-600 via-purple-600 to-pink-500',
        organizerContact: organizerContact || {
          name: req.user ? req.user.name : 'Jaishree K (Lead Organizer)',
          email: req.user ? req.user.email : 'jaishree@sympora.edu',
          phone: '+91 98765 43210',
        },
        createdBy: req.user ? req.user._id : null,
      });

      const savedEvent = await event.save();

      return res.status(201).json({
        success: true,
        message: 'Event published successfully!',
        event: savedEvent,
      });
    } else {
      const newEv = {
        _id: 'ev_' + Date.now(),
        title,
        clubName,
        category,
        department,
        description: description || 'Exciting college event. Register now to reserve your seat!',
        date,
        time: time || '09:30 AM - 04:00 PM',
        venue: venue || 'Campus Main Auditorium',
        totalSeats: Number(totalSeats),
        availableSeats: Number(totalSeats),
        registeredCount: 0,
        fee: Number(fee) || 0,
        tags: tagArray,
        bannerGradient: bannerGradient || 'from-indigo-600 via-purple-600 to-pink-500',
        organizerContact: organizerContact || {
          name: req.user ? req.user.name : 'Jaishree K (Lead Organizer)',
          email: req.user ? req.user.email : 'jaishree@sympora.edu',
          phone: '+91 98765 43210',
        },
        status: 'open',
        createdAt: new Date().toISOString(),
      };

      mockStore.events.unshift(newEv);

      return res.status(201).json({
        success: true,
        message: 'Event published successfully!',
        event: newEv,
      });
    }
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create event',
    });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private (Admin / Club Organizer)
const updateEvent = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }

      const updates = { ...req.body };
      if (updates.tags && typeof updates.tags === 'string') {
        updates.tags = updates.tags.split(',').map((t) => t.trim());
      }

      if (updates.totalSeats !== undefined) {
        const diff = Number(updates.totalSeats) - event.totalSeats;
        updates.availableSeats = Math.max(0, event.availableSeats + diff);
      }

      event = await Event.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
      });

      return res.json({ success: true, message: 'Event updated successfully!', event });
    } else {
      const idx = mockStore.events.findIndex((e) => String(e._id) === String(req.params.id));
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }
      mockStore.events[idx] = { ...mockStore.events[idx], ...req.body };
      return res.json({ success: true, message: 'Event updated successfully!', event: mockStore.events[idx] });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update event',
    });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Admin / Club Organizer)
const deleteEvent = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }

      await Registration.deleteMany({ event: req.params.id });
      await event.deleteOne();

      return res.json({
        success: true,
        message: 'Event and associated registrations deleted successfully',
      });
    } else {
      mockStore.events = mockStore.events.filter((e) => String(e._id) !== String(req.params.id));
      mockStore.registrations = mockStore.registrations.filter((r) => String(r.event) !== String(req.params.id));
      return res.json({
        success: true,
        message: 'Event and associated registrations deleted successfully',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete event',
    });
  }
};

// @desc    Get portal stats (total events, registrations, seat metrics)
// @route   GET /api/events/stats/summary
// @access  Public
const getEventStats = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const totalEvents = await Event.countDocuments();
      const totalRegistrations = await Registration.countDocuments({ status: 'confirmed' });
      
      const events = await Event.find({}, 'totalSeats availableSeats department category');
      const totalSeats = events.reduce((acc, curr) => acc + (curr.totalSeats || 0), 0);
      const bookedSeats = events.reduce((acc, curr) => acc + ((curr.totalSeats || 0) - (curr.availableSeats || 0)), 0);

      const deptBreakdown = {};
      events.forEach(e => {
        deptBreakdown[e.department] = (deptBreakdown[e.department] || 0) + 1;
      });

      return res.json({
        success: true,
        stats: {
          totalEvents,
          totalRegistrations,
          totalSeats,
          bookedSeats,
          seatsLeft: Math.max(0, totalSeats - bookedSeats),
          deptBreakdown,
        },
      });
    } else {
      const totalEvents = mockStore.events.length;
      const totalRegistrations = mockStore.registrations.length;
      const totalSeats = mockStore.events.reduce((acc, curr) => acc + (curr.totalSeats || 0), 0);
      const bookedSeats = mockStore.events.reduce((acc, curr) => acc + ((curr.totalSeats || 0) - (curr.availableSeats || 0)), 0);

      return res.json({
        success: true,
        stats: {
          totalEvents,
          totalRegistrations,
          totalSeats,
          bookedSeats,
          seatsLeft: Math.max(0, totalSeats - bookedSeats),
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to aggregate statistics',
    });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventStats,
};
