import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Ticket,
  ShieldCheck,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  User,
  Zap,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAdmin, logout, quickDemoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Creator Badge */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white font-['Space_Grotesk']">
                  SYMP<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">ORA</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                Project by <span className="text-indigo-300 font-semibold">Jaishree K</span>
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                isActive('/')
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Explore Events
            </Link>

            {/* Students see My Registrations; Admins only view and manage */}
            {user && !isAdmin && (
              <Link
                to="/my-registrations"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  isActive('/my-registrations')
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Ticket className="w-4 h-4" />
                My Registrations
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  isActive('/admin')
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'text-purple-300 hover:text-white hover:bg-purple-950/40 border border-purple-500/30'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                Admin Dashboard (Manage & Edit)
              </Link>
            )}
          </div>

          {/* User Controls & Fast Demo Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <div className="flex items-center gap-2">
                {/* Quick 1-click test buttons */}
                <button
                  onClick={() => quickDemoLogin('admin')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30 hover:bg-purple-500/20 transition-colors"
                  title="Quickly login as Lead Admin (Jaishree K) - View & Edit only"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Demo Admin
                </button>

                <button
                  onClick={() => quickDemoLogin('student')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
                  title="Quickly login as Student (RSVP to multiple events)"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Demo Student
                </button>

                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25 hover:from-indigo-600 hover:to-purple-700 transition-all hover:scale-105"
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                    {user.name ? user.name.slice(0, 2) : 'JK'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white leading-tight">
                      {user.name}
                    </p>
                    <span className="text-[10px] font-semibold text-indigo-400 capitalize">
                      {user.role === 'admin' ? 'Lead Admin (Manage Only)' : 'Student'}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 transition-colors ml-1"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {!user && (
              <button
                onClick={() => quickDemoLogin('admin')}
                className="px-2.5 py-1 text-xs font-semibold rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/30"
              >
                Admin
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-900/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-200 hover:bg-slate-800"
          >
            Explore Events
          </Link>
          {user && !isAdmin && (
            <Link
              to="/my-registrations"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-200 hover:bg-slate-800"
            >
              My Registrations
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-purple-300 hover:bg-slate-800"
            >
              Admin Dashboard (Manage & Edit)
            </Link>
          )}

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {!user ? (
              <>
                <button
                  onClick={() => {
                    quickDemoLogin('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 rounded-lg text-sm font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40"
                >
                  👑 Fast Login as Admin (Jaishree K)
                </button>
                <button
                  onClick={() => {
                    quickDemoLogin('student');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 rounded-lg text-sm font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                >
                  🎓 Fast Login as Student (Multi-RSVP)
                </button>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-lg text-sm font-semibold bg-slate-800 text-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white"
                >
                  Register Account
                </Link>
              </>
            ) : (
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-sm font-bold text-white">{user.name}</p>
                  <p className="text-xs text-indigo-400 capitalize">
                    {user.role === 'admin' ? 'Lead Admin (Manage Only)' : 'Student'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
