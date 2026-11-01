import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Ticket,
  Edit3,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EventCard = ({
  event,
  onRegister,
  onViewDetails,
  onViewTicket,
  onEditEvent,
  isRegistered,
  loadingAction,
}) => {
  const { isAdmin } = useAuth();

  const percentBooked = Math.min(
    100,
    Math.round(((event.totalSeats - event.availableSeats) / event.totalSeats) * 100)
  );

  const isSoldOut = event.availableSeats === 0;
  const isFillingFast = !isSoldOut && event.availableSeats <= Math.ceil(event.totalSeats * 0.2);

  const getStatusBadge = () => {
    if (isSoldOut) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
          Sold Out
        </span>
      );
    }
    if (isFillingFast) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
          🔥 Filling Fast
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
        Seats Available
      </span>
    );
  };

  return (
    <div className="flex flex-col rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl hover:shadow-2xl hover:border-slate-700 transition-all duration-300 group">
      
      {/* Top Banner Gradient & Badges */}
      <div className={`h-28 bg-gradient-to-r ${event.bannerGradient || 'from-indigo-600 via-purple-600 to-pink-500'} p-4 flex flex-col justify-between relative overflow-hidden`}>
        {/* Decorative blur blob */}
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

        <div className="flex items-center justify-between z-10">
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-black/40 text-white backdrop-blur-md border border-white/20">
            {event.category}
          </span>
          <div className="flex items-center gap-1.5">
            {isAdmin && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-900/80 text-purple-200 border border-purple-400/40 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Admin
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-white/20 text-white backdrop-blur-md border border-white/30">
              {event.department}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between z-10">
          <span className="text-xs font-semibold text-white/90 drop-shadow-sm flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            {event.clubName}
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-black/50 text-white backdrop-blur-md">
            {event.fee === 0 ? 'FREE' : `₹${event.fee}`}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2">
              {event.title}
            </h3>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {event.description}
          </p>

          {/* Event Metadata (Date, Time, Venue) */}
          <div className="space-y-2 mb-4 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span>
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>{event.time}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <MapPin className="w-4 h-4 text-pink-400 flex-shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Seat Tracking Progress & Status */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">Seat Availability:</span>
            <span className="font-bold text-white">
              <span className={isSoldOut ? 'text-rose-400' : isFillingFast ? 'text-amber-400' : 'text-emerald-400'}>
                {event.availableSeats}
              </span>{' '}
              / {event.totalSeats} Left
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-3">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isSoldOut
                  ? 'bg-rose-500'
                  : isFillingFast
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-emerald-500 to-indigo-500'
              }`}
              style={{ width: `${percentBooked}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between mb-4">
            {getStatusBadge()}
            <span className="text-[11px] text-slate-500 font-medium">
              {percentBooked}% Booked
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => onViewDetails(event)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              Details
            </button>

            {/* Admin View Mode: Admin only views & modifies; CANNOT register */}
            {isAdmin ? (
              <button
                onClick={() => onEditEvent ? onEditEvent(event) : onViewDetails(event)}
                className="flex-[1.4] py-2.5 px-3 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                title="Admin Privileges: View & Edit details"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Event
              </button>
            ) : isRegistered ? (
              <button
                onClick={() => onViewTicket(event)}
                className="flex-[1.4] py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5"
              >
                <Ticket className="w-4 h-4" />
                View Pass
              </button>
            ) : isSoldOut ? (
              <button
                disabled
                className="flex-[1.4] py-2.5 px-3 rounded-xl bg-slate-800 text-slate-500 text-xs font-bold cursor-not-allowed flex items-center justify-center gap-1"
              >
                Fully Booked
              </button>
            ) : (
              <button
                onClick={() => onRegister(event._id)}
                disabled={loadingAction === event._id}
                className="flex-[1.4] py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/25 flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
              >
                {loadingAction === event._id ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>⚡ 1-Click RSVP</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default EventCard;
