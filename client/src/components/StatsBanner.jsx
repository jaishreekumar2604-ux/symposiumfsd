import React from 'react';
import { Calendar, Users, Armchair, Sparkles, CheckCircle2 } from 'lucide-react';

const StatsBanner = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-8">
      
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl hover:border-indigo-500/40 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Published Events</span>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
          {stats?.totalEvents ?? '6'}
        </div>
        <p className="text-xs text-indigo-400 mt-1 font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span> Across 6 College Clubs
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl hover:border-purple-500/40 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total RSVPs</span>
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
          {stats?.totalRegistrations ?? '7'}
        </div>
        <p className="text-xs text-purple-400 mt-1 font-medium">
          Students Registered
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl hover:border-emerald-500/40 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Seats</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Armchair className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-['Space_Grotesk']">
          {stats?.seatsLeft ?? '403'}
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Out of {stats?.totalSeats ?? '410'} capacity
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl hover:border-pink-500/40 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Database Sync</span>
          <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div className="text-lg font-bold text-white flex items-center gap-2 mt-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          MongoDB Compass
        </div>
        <p className="text-[11px] text-slate-400 mt-1 font-mono">
          symposium_portal
        </p>
      </div>

    </div>
  );
};

export default StatsBanner;
