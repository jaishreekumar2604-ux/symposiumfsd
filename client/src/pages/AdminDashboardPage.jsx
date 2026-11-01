import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  PlusCircle,
  FileSpreadsheet,
  FileCode,
  Users,
  Trash2,
  Calendar,
  Sparkles,
  Download,
  X,
  CheckCircle,
  Eye,
  Edit3,
  AlertTriangle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  const { user, isAdmin, showToast } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Event Modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    clubName: 'ACM Student Chapter',
    category: 'Workshop',
    department: 'CSE',
    description: '',
    date: '',
    time: '09:30 AM - 04:00 PM',
    venue: '',
    totalSeats: 60,
    fee: 0,
    tags: '',
  });

  // Edit Event Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Attendee Roster Modal state
  const [rosterModalOpen, setRosterModalOpen] = useState(false);
  const [selectedEventRoster, setSelectedEventRoster] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  // Fetch events for dashboard
  const fetchEvents = async () => {
    try {
      const res = await api('/events');
      if (res.success) {
        setEvents(res.events);
      }
    } catch (err) {
      showToast('Failed to load events', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle Event Creation
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api('/events', {
        method: 'POST',
        body: newEvent,
      });
      if (res.success) {
        showToast('New event published successfully!', 'success');
        setCreateModalOpen(false);
        setNewEvent({
          title: '',
          clubName: 'ACM Student Chapter',
          category: 'Workshop',
          department: 'CSE',
          description: '',
          date: '',
          time: '09:30 AM - 04:00 PM',
          venue: '',
          totalSeats: 60,
          fee: 0,
          tags: '',
        });
        fetchEvents();
      }
    } catch (err) {
      showToast(err.message || 'Failed to create event', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (event) => {
    setEditingEvent({
      ...event,
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
      tags: Array.isArray(event.tags) ? event.tags.join(', ') : (event.tags || ''),
    });
    setEditModalOpen(true);
  };

  // Handle Event Update
  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    if (!editingEvent) return;
    setUpdating(true);
    try {
      const res = await api(`/events/${editingEvent._id}`, {
        method: 'PUT',
        body: editingEvent,
      });
      if (res.success) {
        showToast('Event updated successfully!', 'success');
        setEditModalOpen(false);
        setEditingEvent(null);
        fetchEvents();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update event', 'error');
    } finally {
      setUpdating(false);
    }
  };

  // Handle Event Deletion
  const handleDeleteEvent = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete event "${title}"? This will also remove all its attendee registrations.`)) {
      return;
    }

    try {
      const res = await api(`/events/${id}`, { method: 'DELETE' });
      if (res.success) {
        showToast('Event deleted successfully', 'info');
        setEvents(events.filter((e) => e._id !== id));
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete event', 'error');
    }
  };

  // Open Attendee Roster Modal
  const handleOpenRoster = async (event) => {
    setSelectedEventRoster(event);
    setRosterModalOpen(true);
    setLoadingAttendees(true);
    try {
      const res = await api(`/registrations/event/${event._id}`);
      if (res.success) {
        setAttendees(res.attendees);
      }
    } catch (err) {
      showToast('Failed to load attendees', 'error');
    } finally {
      setLoadingAttendees(false);
    }
  };

  // Export Attendees to CSV
  const handleExportCSV = async (eventId, eventTitle) => {
    try {
      const blob = await api(`/registrations/export/${eventId}?format=csv`, {
        isDownload: true,
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${eventTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}_Attendees.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast('CSV Attendee List downloaded successfully!', 'success');
    } catch (err) {
      showToast('Failed to export CSV', 'error');
    }
  };

  // Export Attendees to JSON
  const handleExportJSON = async (eventId, eventTitle) => {
    try {
      const blob = await api(`/registrations/export/${eventId}?format=json`, {
        isDownload: true,
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${eventTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}_Attendees.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast('JSON Attendee List downloaded successfully!', 'success');
    } catch (err) {
      showToast('Failed to export JSON', 'error');
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800">
          <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-white mb-2">Admin Access Required</h2>
          <p className="text-sm text-slate-400 mb-6">
            You must be logged in as an Administrator (e.g. <strong>Jaishree K</strong>) or Club Organizer to access this portal.
          </p>
          <Link
            to="/login"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm"
          >
            Sign in as Admin
          </Link>
        </div>
      </div>
    );
  }

  const totalCapacity = events.reduce((a, c) => a + (c.totalSeats || 0), 0);
  const totalBooked = events.reduce((a, c) => a + ((c.totalSeats || 0) - (c.availableSeats || 0)), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Banner & Profile */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 p-6 rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/20 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white font-['Space_Grotesk']">
                Symposium Admin Portal
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Lead Organizer Mode
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Administrator: <strong className="text-white">Jaishree K</strong> • View, Manage & Edit Events (Registration Disabled for Admins)
            </p>
          </div>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
        >
          <PlusCircle className="w-4 h-4" />
          Publish New Event
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Published Events</span>
          <div className="text-3xl font-extrabold text-white mt-1 font-['Space_Grotesk']">
            {events.length}
          </div>
          <span className="text-xs text-indigo-400">Active Across Clubs</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Registrations</span>
          <div className="text-3xl font-extrabold text-purple-400 mt-1 font-['Space_Grotesk']">
            {totalBooked}
          </div>
          <span className="text-xs text-purple-400">Confirmed Student RSVPs</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Seat Utilization</span>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1 font-['Space_Grotesk']">
            {totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0}%
          </div>
          <span className="text-xs text-slate-400">{totalBooked} / {totalCapacity} Seats Reserved</span>
        </div>
      </div>

      {/* Event Management Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
              Published Events & Management
            </h3>
            <p className="text-xs text-slate-400">
              View events, edit details, manage capacity, inspect rosters, and export data (CSV / JSON)
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <th className="py-4 px-6">Event & Club</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Department</th>
                <th className="py-4 px-4">Event Date</th>
                <th className="py-4 px-4">Seats Left / Total</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions (Edit, Roster, Export)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {events.map((ev) => {
                const percent = Math.min(
                  100,
                  Math.round(((ev.totalSeats - ev.availableSeats) / ev.totalSeats) * 100)
                );
                return (
                  <tr key={ev._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-medium">
                      <div className="font-bold text-white text-sm">{ev.title}</div>
                      <div className="text-slate-400 text-[11px]">{ev.clubName}</div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">
                        {ev.category}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-200">
                      {ev.department}
                    </td>

                    <td className="py-4 px-4 text-slate-400">
                      {new Date(ev.date).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-white">
                        {ev.availableSeats} / {ev.totalSeats}
                      </div>
                      <div className="w-24 bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {ev.availableSeats === 0 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Sold Out
                        </span>
                      ) : ev.availableSeats <= Math.ceil(ev.totalSeats * 0.2) ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Filling Fast
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Open
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      {/* Edit Event Button */}
                      <button
                        onClick={() => handleOpenEdit(ev)}
                        className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 font-semibold transition-colors inline-flex items-center gap-1"
                        title="Edit Event Details & Capacity"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>

                      {/* View Attendee Roster */}
                      <button
                        onClick={() => handleOpenRoster(ev)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/30 font-semibold transition-colors inline-flex items-center gap-1"
                        title="View Attendees Roster"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Attendees
                      </button>

                      {/* Export CSV */}
                      <button
                        onClick={() => handleExportCSV(ev._id, ev.title)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 font-semibold transition-colors inline-flex items-center gap-1"
                        title="Export Roster to CSV for Excel"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        CSV
                      </button>

                      {/* Export JSON */}
                      <button
                        onClick={() => handleExportJSON(ev._id, ev.title)}
                        className="px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 font-semibold transition-colors inline-flex items-center gap-1"
                        title="Export Roster to JSON"
                      >
                        <FileCode className="w-3.5 h-3.5" />
                        JSON
                      </button>

                      {/* Delete Event */}
                      <button
                        onClick={() => handleDeleteEvent(ev._id, ev.title)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors inline-flex items-center"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Event Modal */}
      {editModalOpen && editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            
            <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                  Admin Event Editor
                </span>
                <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                  Edit Event Details & Capacity
                </h2>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateEvent} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">
                    Organizing Club Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.clubName}
                    onChange={(e) => setEditingEvent({ ...editingEvent, clubName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">
                    Category *
                  </label>
                  <select
                    value={editingEvent.category}
                    onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Symposium">Symposium</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Paper Presentation">Paper Presentation</option>
                    <option value="Tech Seminar">Tech Seminar</option>
                    <option value="Coding Contest">Coding Contest</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">
                    Target Department *
                  </label>
                  <select
                    value={editingEvent.department}
                    onChange={(e) => setEditingEvent({ ...editingEvent, department: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="AI & DS">AI & DS</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Biotechnology">Biotechnology</option>
                    <option value="All Departments">All Departments</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">
                    Total Seat Capacity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingEvent.totalSeats}
                    onChange={(e) => setEditingEvent({ ...editingEvent, totalSeats: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">
                    Timings *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.time}
                    onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">
                    Venue / Hall *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.venue}
                    onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">
                    Registration Fee (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingEvent.fee}
                    onChange={(e) => setEditingEvent({ ...editingEvent, fee: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  Event Description & Agenda *
                </label>
                <textarea
                  required
                  rows="3"
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={editingEvent.tags}
                  onChange={(e) => setEditingEvent({ ...editingEvent, tags: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold transition-all shadow-lg flex items-center gap-2"
                >
                  {updating ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Attendee Roster Modal */}
      {rosterModalOpen && selectedEventRoster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl max-h-[85vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                  Attendee Management
                </span>
                <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                  {selectedEventRoster.title}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Organized by {selectedEventRoster.clubName} • {attendees.length} Registered Attendee{attendees.length === 1 ? '' : 's'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportCSV(selectedEventRoster._id, selectedEventRoster.title)}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </button>
                <button
                  onClick={() => handleExportJSON(selectedEventRoster._id, selectedEventRoster.title)}
                  className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <FileCode className="w-3.5 h-3.5" /> Export JSON
                </button>
                <button
                  onClick={() => setRosterModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Table Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {loadingAttendees ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-xs text-slate-400">Loading attendee roster...</p>
                </div>
              ) : attendees.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Users className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                  <p className="text-sm font-semibold text-white">No registrations yet</p>
                  <p className="text-xs text-slate-500 mt-1">
                    When students RSVP for this event, their details and ticket passes will appear here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold uppercase">
                        <th className="py-3 px-3">#</th>
                        <th className="py-3 px-4">Pass ID</th>
                        <th className="py-3 px-4">Student Name</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Department</th>
                        <th className="py-3 px-4">Roll No</th>
                        <th className="py-3 px-4">Phone</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {attendees.map((att, idx) => (
                        <tr key={att._id} className="hover:bg-slate-800/30">
                          <td className="py-3 px-3 font-mono text-slate-500">{idx + 1}</td>
                          <td className="py-3 px-4 font-mono font-bold text-indigo-400">
                            {att.registrationId}
                          </td>
                          <td className="py-3 px-4 font-bold text-white">{att.attendeeName}</td>
                          <td className="py-3 px-4 text-slate-400">{att.attendeeEmail}</td>
                          <td className="py-3 px-4">{att.attendeeDepartment}</td>
                          <td className="py-3 px-4 font-mono">{att.attendeeRollNo || 'N/A'}</td>
                          <td className="py-3 px-4">{att.attendeePhone || 'N/A'}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Confirmed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
              <span>Roster verified for admission desk check-in.</span>
              <button
                onClick={() => setRosterModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Publish New Event Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            
            <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                  Club Management
                </span>
                <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                  Publish New Symposium or Workshop
                </h2>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CYBERPULSE 2026: National Cybersecurity Workshop"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">
                    Organizing Club Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ACM Student Chapter"
                    value={newEvent.clubName}
                    onChange={(e) => setNewEvent({ ...newEvent, clubName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">
                    Category *
                  </label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Symposium">Symposium</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Paper Presentation">Paper Presentation</option>
                    <option value="Tech Seminar">Tech Seminar</option>
                    <option value="Coding Contest">Coding Contest</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">
                    Target Department *
                  </label>
                  <select
                    value={newEvent.department}
                    onChange={(e) => setNewEvent({ ...newEvent, department: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="AI & DS">AI & DS</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Biotechnology">Biotechnology</option>
                    <option value="All Departments">All Departments</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">
                    Total Seat Capacity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newEvent.totalSeats}
                    onChange={(e) => setNewEvent({ ...newEvent, totalSeats: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">
                    Timings *
                  </label>
                  <input
                    type="text"
                    required
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">
                    Venue / Hall *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS Lab 2, Main Campus"
                    value={newEvent.venue}
                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">
                    Registration Fee (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0 for Free"
                    value={newEvent.fee}
                    onChange={(e) => setNewEvent({ ...newEvent, fee: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  Event Description & Agenda *
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder="Detail the agenda, speakers, prerequisites, and what attendees will learn..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. AI, DeepLearning, Python, HandsOn"
                  value={newEvent.tags}
                  onChange={(e) => setNewEvent({ ...newEvent, tags: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
                >
                  {submitting ? 'Publishing...' : 'Publish Event'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;
