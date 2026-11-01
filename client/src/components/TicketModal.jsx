import React, { useEffect } from 'react';
import { X, Printer, CheckCircle2, Calendar, MapPin, Clock, User, QrCode, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const TicketModal = ({ registration, onClose }) => {
  useEffect(() => {
    // Fire confetti celebration on ticket reveal!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899', '#10b981'],
      });
    } catch (e) {
      // Ignore if canvas-confetti is not loaded
    }
  }, []);

  if (!registration) return null;

  const event = registration.event || {};

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Registration Pass Confirmed
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Ticket Area */}
        <div id="printable-ticket" className="p-6 text-slate-100">
          
          {/* Ticket Header */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white relative overflow-hidden shadow-lg mb-6">
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/30 backdrop-blur-md">
                  Official Entry Pass
                </span>
                <h2 className="text-xl font-black mt-2 font-['Space_Grotesk'] leading-tight">
                  {event.title || 'College Event'}
                </h2>
                <p className="text-xs text-white/90 mt-1 flex items-center gap-1 font-medium">
                  <Sparkles className="w-3.5 h-3.5" /> Organized by {event.clubName}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-white/80 block">Pass ID</span>
                <span className="text-sm font-mono font-bold px-2.5 py-1 rounded bg-black/40 backdrop-blur-md inline-block mt-0.5">
                  {registration.registrationId}
                </span>
              </div>
            </div>
          </div>

          {/* Attendee Details Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800 mb-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Attendee Name</span>
              <p className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                {registration.attendeeName}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Department / Roll No</span>
              <p className="text-sm font-bold text-slate-200 mt-0.5">
                {registration.attendeeDepartment} • {registration.attendeeRollNo || 'Registered Student'}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Date & Timing</span>
              <p className="text-xs font-semibold text-slate-300 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                {event.date ? new Date(event.date).toLocaleDateString() : 'Upcoming'}
              </p>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3 text-purple-400" />
                {event.time}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Venue & Hall</span>
              <p className="text-xs font-semibold text-slate-300 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-pink-400" />
                {event.venue || 'Campus Auditorium'}
              </p>
            </div>
          </div>

          {/* Barcode & Verification Footer */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800/80">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Seat Reserved & Verified
              </span>
              <p className="text-[10px] text-slate-400">
                Show this digital or printed pass at the registration desk on arrival.
              </p>
              <p className="text-[9px] text-slate-500 font-mono">
                System: SYMPORA • Admin: Jaishree K
              </p>
            </div>

            <div className="w-16 h-16 rounded-xl bg-white p-1.5 flex items-center justify-center flex-shrink-0 shadow-md">
              <QrCode className="w-full h-full text-slate-950" />
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <Printer className="w-4 h-4" />
            Print / Save PDF
          </button>
        </div>

      </div>
    </div>
  );
};

export default TicketModal;
