import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building2, Globe, Search, ArrowRight, Star } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { StatusBadge } from '../components/common/StatusBadge';

export const NationalDirectoryPage: React.FC = () => {
  const { projects } = useProjects();
  const [selectedState, setSelectedState] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const states = [
    'All', 'Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu', 
    'Maharashtra', 'Delhi', 'Gujarat', 'Kerala', 'Punjab', 'Rajasthan'
  ];

  const filtered = projects.filter(p => {
    if (selectedState !== 'All' && p.state !== selectedState) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.institution.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="page-container space-y-6">
        
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>National Indian Project Directory</span>
          </div>
          <h1 className="text-3xl font-black text-dark tracking-tight">Indian Institutions & State Registry</h1>
          <p className="text-sm text-slate-500 mt-1">
            Discover student innovations categorized by Indian States, Universities, and Engineering Colleges.
          </p>
        </div>

        {/* State Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {states.map(st => (
            <button
              key={st}
              onClick={() => setSelectedState(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedState === st
                  ? 'bg-primary text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Projects by Institution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-surface-border p-6 shadow-subtle hover:border-primary/40 hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {p.city}, {p.state}
                  </span>
                  <StatusBadge status={p.status} size="sm" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-dark">
                    <Link to={`/projects/${p.id}`} className="hover:text-primary transition-colors">
                      {p.name}
                    </Link>
                  </h3>
                  <p className="text-xs font-medium text-primary mt-0.5 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-primary" />
                    {p.institution}
                  </p>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {p.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs mt-4">
                <div className="flex items-center gap-1 font-bold text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{p.rating || 4.2}</span>
                </div>
                <Link
                  to={`/projects/${p.id}`}
                  className="font-bold text-primary hover:text-primary-hover flex items-center gap-1"
                >
                  <span>Explore Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
