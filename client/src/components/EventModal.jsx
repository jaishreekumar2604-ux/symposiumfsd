import React from 'react';
import { X, Calendar, Clock, MapPin, Users, Phone, Mail, Sparkles, CheckCircle2, Edit3, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EventModal = ({ event, onClose, onRegister, onEdit, isRegistered, loadingAction }) => {
  const { isAdmin } = useAuth();
  if (!event) return null;

  const isSoldOut = event.availableSeats === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        
        {/* Banner */}
        <div className={`p-6 bg-gradient-to-r ${event.bannerGradient || 'from-indigo-600 via-purple-600 to-pink-500'} text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/40 backdrop-blur-md">
              {event.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md">
              {event.department}
            </span>
            {isAdmin && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-900/90 text-purple-200 border border-purple-300/40 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Admin View
              </span>
            )}
          </div>

          <h2 className="text-2xl font-black font-['Space_Grotesk'] leading-tight">
            {event.title}
          </h2>
          <p className="text-xs text-white/90 mt-1 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Organized by {event.clubName}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 flex-1">
          {/* Key Quick Facts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-indigo-400 flex-shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Date</span>
                <span className="text-xs font-bold text-white">
                  {new Date(event.date).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Timings</span>
                <span className="text-xs font-bold text-white">{event.time}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-pink-400 flex-shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Venue</span>
                <span className="text-xs font-bold text-white truncate max-w-[120px] block">
                  {event.venue}
                </span>
              </div>
            </div>
          </div>

          {/* About / Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Event Overview & Agenda
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
              {event.description}
            </p>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Topics & Highlights
              </h4>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 text-indigo-300 border border-indigo-500/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Organizer Contact */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Club Coordinator & Contact
            </h4>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-bold text-white text-sm">
                  {event.organizerContact?.name || 'Jaishree K (Faculty Head)'}
                </p>
                <p className="text-slate-400 text-[11px]">Symposium Convener</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${event.organizerContact?.email || 'jaishree@sympora.edu'}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {event.organizerContact?.email || 'jaishree@sympora.edu'}
                </a>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300">
                  <Phone className="w-3.5 h-3.5" />
                  {event.organizerContact?.phone || '+91 98765 43210'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">Registration Fee</span>
            <span className="text-base font-extrabold text-white">
              {event.fee === 0 ? 'FREE REGISTRATION' : `₹${event.fee}`}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">
              Available Seats: <strong className="text-emerald-400">{event.availableSeats}</strong> / {event.totalSeats}
            </span>

            {/* Admin Privilege: View and Edit ONLY; Registrations disabled */}
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-950/60 border border-purple-500/30 text-purple-300">
                  Admin View (No Registration)
                </span>
                {onEdit && (
                  <button
                    onClick={() => {
                      onClose();
                      onEdit(event);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit Event
                  </button>
                )}
              </div>
            ) : isRegistered ? (
              <span className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Already Reserved
              </span>
            ) : isSoldOut ? (
              <button
                disabled
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-500 text-xs font-bold cursor-not-allowed"
              >
                Sold Out
              </button>
            ) : (
              <button
                onClick={() => onRegister(event._id)}
                disabled={loadingAction === event._id}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2"
              >
                {loadingAction === event._id ? 'Securing Seat...' : '⚡ Confirm 1-Click RSVP'}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default EventModal;
