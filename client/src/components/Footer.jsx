import React from 'react';
import { Heart, Sparkles, Database, Layers, ShieldCheck, Github, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-white font-['Space_Grotesk']">
                SYMP<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">ORA</span>
              </span>
            </div>
            
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              A comprehensive MERN stack College Symposium & Workshop Registration Portal. Empowers collegiate clubs to publish events, track live seat availability with zero-collision locking, and enables 1-click RSVP and attendee roster exports.
            </p>

            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 max-w-md">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                Project Attribution
              </div>
              <p className="text-xs text-slate-300">
                Created & Designed by <span className="font-bold text-white underline decoration-indigo-500 underline-offset-2">Jaishree K</span> for Full Stack Web Development.
              </p>
            </div>
          </div>

          {/* Quick Features */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Key Modules</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                Event Discovery & Department Filters
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                Single-Click Instant RSVP & Digital Passes
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Real-Time Seat Tracking & Capacity Locks
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                Admin Roster Export (CSV & JSON)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                MongoDB Compass Database Sync
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">MERN Stack Architecture</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-semibold text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Database className="w-3 h-3" /> MongoDB Compass
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-semibold text-amber-400 border border-amber-500/20">
                Express.js
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
                React 18 + Vite
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-semibold text-green-400 border border-green-500/20">
                Node.js
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-semibold text-sky-400 border border-sky-500/20">
                Tailwind CSS
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-semibold text-violet-400 border border-violet-500/20">
                JWT Auth
              </span>
            </div>
            <p className="text-[11px] text-slate-500 pt-2">
              Single Localhost Deployment Port: <span className="font-mono text-indigo-400">http://localhost:5000</span>
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} SYMPORA Portal. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-slate-400">
            Handcrafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> by <span className="text-indigo-400 font-bold">Jaishree K</span>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
