const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      required: true,
      index: true,
    },
    // Supporting both ticketId and registrationId to ensure legacy indexes never receive null
    ticketId: {
      type: String,
      default: function () {
        return this.registrationId;
      },
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    attendeeName: {
      type: String,
      required: true,
    },
    attendeeEmail: {
      type: String,
      required: true,
    },
    attendeeDepartment: {
      type: String,
      default: 'General',
    },
    attendeeRollNo: {
      type: String,
      default: '',
    },
    attendeeCollege: {
      type: String,
      default: '',
    },
    attendeePhone: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'attended'],
      default: 'confirmed',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure a student cannot register for the SAME event multiple times simultaneously,
// while allowing a student to register for as many different events / symposiums as they wish!
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
