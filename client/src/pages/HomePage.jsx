import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import FilterBar from '../components/FilterBar';
import StatsBanner from '../components/StatsBanner';
import EventModal from '../components/EventModal';
import TicketModal from '../components/TicketModal';
import { Sparkles, Calendar, Zap, ShieldCheck, ChevronRight, X, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { user, isAdmin, showToast } = useAuth();
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All Departments');
  const [category, setCategory] = useState('All');
  const [availability, setAvailability] = useState('all');

  // Registered Event IDs of current user
  const [myRegistrations, setMyRegistrations] = useState([]);

  // Active Modals
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTicket, setActiveTicket] = useState(null);

  // Admin Direct Edit Modal
  const [editingEvent, setEditingEvent] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Fetch Events
  const fetchEvents = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (department !== 'All Departments') queryParams.append('department', department);
      if (category !== 'All') queryParams.append('category', category);
      if (availability !== 'all') queryParams.append('availability', availability);

      const res = await api(`/events?${queryParams.toString()}`);
      if (res.success) {
        setEvents(res.events);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Portal Stats
  const fetchStats = async () => {
    try {
      const res = await api('/events/stats/summary');
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  // Fetch user's registered events
  const fetchMyRegistrations = async () => {
    if (!user || user.role === 'admin') {
      setMyRegistrations([]);
      return;
    }
    try {
      const res = await api('/registrations/my');
      if (res.success) {
        setMyRegistrations(res.registrations);
      }
    } catch (err) {
      console.error('Error fetching my registrations:', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [search, department, category, availability]);

  useEffect(() => {
    fetchStats();
    fetchMyRegistrations();
  }, [user]);

  // Handle 1-Click RSVP for students
  const handleRegister = async (eventId) => {
    if (!user) {
      showToast('Please sign in as a student to RSVP for symposiums!', 'warning');
      return;
    }

    if (user.role === 'admin') {
      showToast('Administrators have management-only access and cannot register for events. Please use a student account to RSVP.', 'warning');
      return;
    }

    setLoadingAction(eventId);
    try {
      const res = await api(`/registrations/${eventId}`, { method: 'POST' });
      if (res.success) {
        showToast('🎉 RSVP Successful! Your seat is reserved.', 'success');
        setActiveTicket(res.registration);
        // Refresh event data & registrations
        fetchEvents();
        fetchStats();
        fetchMyRegistrations();
      }
    } catch (err) {
      showToast(err.message || 'Failed to complete registration', 'error');
    } finally {
      setLoadingAction(null);
    }
  };

  // Open Edit Modal for Admin
  const handleOpenEdit = (event) => {
    setEditingEvent({
      ...event,
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
      tags: Array.isArray(event.tags) ? event.tags.join(', ') : (event.tags || ''),
    });
  };

  // Save changes from Admin Edit Modal
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
        setEditingEvent(null);
        fetchEvents();
        fetchStats();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update event', 'error');
    } finally {
      setUpdating(false);
    }
  };

  // Check if current user is registered for an event
  const isUserRegistered = (eventId) => {
    return myRegistrations.some(
      (reg) => (reg.event?._id || reg.event) === eventId
    );
  };

  // Find user's ticket for an event
  const getTicketForEvent = (event) => {
    const reg = myRegistrations.find(
      (r) => (r.event?._id || r.event) === event._id
    );
    if (reg) {
      setActiveTicket({ ...reg, event });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-indigo-950/60 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-12 mb-10 shadow-2xl">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            College Club Symposium & Workshop Hub
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight font-['Space_Grotesk'] mb-4">
            Publish, Discover & Reserve Seats with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Single-Click RSVP
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">
            Welcome to the centralized event management portal for campus clubs. Students can register for multiple symposiums and workshops, track real-time seat availability, and download verified digital passes.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#explore-events"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 hover:scale-105"
            >
              <Zap className="w-4 h-4" />
              Explore All Events
            </a>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-900/80 px-4 py-3 rounded-xl border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Project Author: <strong className="text-white">Jaishree K</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Live System Stats */}
      <StatsBanner stats={stats} />

      {/* Filter and Search Section */}
      <div id="explore-events">
        <FilterBar
          search={search}
          setSearch={setSearch}
          department={department}
          setDepartment={setDepartment}
          category={category}
          setCategory={setCategory}
          availability={availability}
          setAvailability={setAvailability}
          totalResults={events.length}
        />
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-semibold text-slate-400">Fetching symposiums & workshops from database...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Events Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-5">
            No events match your current filter selection. Try resetting filters or clearing the search keyword.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setDepartment('All Departments');
              setCategory('All');
              setAvailability('all');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onRegister={handleRegister}
              onViewDetails={(ev) => setSelectedEvent(ev)}
              onViewTicket={(ev) => getTicketForEvent(ev)}
              onEditEvent={(ev) => handleOpenEdit(ev)}
              isRegistered={isUserRegistered(event._id)}
              loadingAction={loadingAction}
            />
          ))}
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onRegister={handleRegister}
          onEdit={(ev) => handleOpenEdit(ev)}
          isRegistered={isUserRegistered(selectedEvent._id)}
          loadingAction={loadingAction}
        />
      )}

      {/* Ticket Pass Modal */}
      {activeTicket && (
        <TicketModal
          registration={activeTicket}
          onClose={() => setActiveTicket(null)}
        />
      )}

      {/* Admin Direct Edit Modal from Home */}
      {editingEvent && (
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
                onClick={() => setEditingEvent(null)}
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
                  onClick={() => setEditingEvent(null)}
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

    </div>
  );
};

export default HomePage;
