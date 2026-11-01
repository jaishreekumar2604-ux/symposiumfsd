import React from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';

const departments = [
  'All Departments',
  'CSE',
  'IT',
  'ECE',
  'AI & DS',
  'Mechanical',
  'Biotechnology',
];

const categories = [
  'All',
  'Workshop',
  'Symposium',
  'Hackathon',
  'Paper Presentation',
  'Tech Seminar',
];

const FilterBar = ({
  search,
  setSearch,
  department,
  setDepartment,
  category,
  setCategory,
  availability,
  setAvailability,
  totalResults,
}) => {
  const hasActiveFilters =
    search ||
    department !== 'All Departments' ||
    category !== 'All' ||
    availability !== 'all';

  const resetFilters = () => {
    setSearch('');
    setDepartment('All Departments');
    setCategory('All');
    setAvailability('all');
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 mb-8 shadow-xl space-y-4">
      
      {/* Search Input & Availability Toggle */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by symposium title, club name, tags (e.g., AI, ROS, Hackathon)..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Seat Availability Filter Select */}
        <div className="flex items-center gap-2">
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-slate-300 text-sm focus:outline-none focus:border-indigo-500 font-medium"
          >
            <option value="all">All Seat Statuses</option>
            <option value="available">Available Seats Only</option>
            <option value="filling-fast">Filling Fast (🔥)</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-semibold hover:bg-rose-500/20 transition-colors whitespace-nowrap"
            >
              <X className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Event Category:
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                category === cat
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25 scale-105'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Department Filter Tabs */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Department Filter:
        </label>
        <div className="flex flex-wrap gap-2">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartment(dept)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                department === dept
                  ? 'bg-slate-200 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Result Count Status */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
        <span>
          Showing <strong className="text-white">{totalResults}</strong> event{totalResults === 1 ? '' : 's'}
        </span>
        {hasActiveFilters && (
          <span className="text-amber-400 font-medium">Filtered search active</span>
        )}
      </div>

    </div>
  );
};

export default FilterBar;
