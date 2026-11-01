import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import TicketModal from '../components/TicketModal';
import { Ticket, Calendar, Clock, MapPin, Trash2, ExternalLink, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyRegistrationsPage = () => {
  const { user, showToast } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [activeTicket, setActiveTicket] = useState(null);

  const fetchRegistrations = async () => {
    if (!user) return;
    try {
      const res = await api('/registrations/my');
      if (res.success) {
        setRegistrations(res.registrations);
      }
    } catch (err) {
      showToast('Failed to load your event registrations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [user]);

  const handleCancel = async (id, eventTitle) => {
    if (!window.confirm(`Are you sure you want to cancel your registration for "${eventTitle}"? Your seat will be released for other students.`)) {
      return;
    }

    setCancellingId(id);
    try {
      const res = await api(`/registrations/${id}`, { method: 'DELETE' });
      if (res.success) {
        showToast('Registration cancelled. Your seat has been released.', 'info');
        setRegistrations(registrations.filter((r) => r._id !== id));
      }
    } catch (err) {
      showToast(err.message || 'Failed to cancel registration', 'error');
    } finally {
      setCancellingId(null);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800">
          <Ticket className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-white mb-2">Sign In to View Your Passes</h2>
          <p className="text-sm text-slate-400 mb-6">
            You need to be signed in to access your registered workshop tickets and symposium passes.
          </p>
          <Link
            to="/login"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Ticket className="w-4 h-4" /> Attendee Portal
          </div>
          <h1 className="text-3xl font-black text-white font-['Space_Grotesk']">
            My Registered Events & Passes
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Student: <strong className="text-white">{user.name}</strong> ({user.email})
          </p>
        </div>

        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300"
        >
          <ArrowLeft className="w-4 h-4" /> Explore More Events
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-slate-400">Loading your passes...</p>
        </div>
      ) : registrations.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800 p-8 max-w-xl mx-auto">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white mb-2">No Registrations Yet</h3>
          <p className="text-sm text-slate-400 mb-6">
            You haven't RSVP'd for any upcoming symposiums or workshops yet. Explore available events and reserve your seat in 1 click!
          </p>
          <Link
            to="/"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 inline-block"
          >
            Explore Upcoming Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registrations.map((reg) => {
            const ev = reg.event || {};
            return (
              <div
                key={reg._id}
                className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {ev.category || 'Event'}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {reg.registrationId}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">
                    {ev.title || 'Event Name'}
                  </h3>
                  <p className="text-xs text-indigo-400 font-medium mb-4">
                    Organized by {ev.clubName || 'College Club'}
                  </p>

                  <div className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      <span>{ev.date ? new Date(ev.date).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      <span>{ev.time || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-pink-400" />
                      <span className="truncate">{ev.venue || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => setActiveTicket(reg)}
                    className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Ticket className="w-3.5 h-3.5" /> View Pass
                  </button>

                  <button
                    onClick={() => handleCancel(reg._id, ev.title)}
                    disabled={cancellingId === reg._id}
                    className="py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors flex items-center justify-center"
                    title="Cancel RSVP"
                  >
                    {cancellingId === reg._id ? (
                      <span className="w-3.5 h-3.5 border-2 border-rose-300 border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ticket Pass Modal */}
      {activeTicket && (
        <TicketModal
          registration={activeTicket}
          onClose={() => setActiveTicket(null)}
        />
      )}

    </div>
  );
};

export default MyRegistrationsPage;
