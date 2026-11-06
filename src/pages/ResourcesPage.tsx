import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Github, Youtube, FileText, Database, BookOpen, 
  ExternalLink, Search, Star, Filter, Code2 
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { ResourceType } from '../types';

export const ResourcesPage: React.FC = () => {
  const { resources } = useProjects();
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const types = ['All', 'GitHub', 'YouTube', 'Dataset', 'Documentation', 'Tutorial'];

  const filtered = resources.filter(res => {
    if (selectedType !== 'All' && res.type !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        res.title.toLowerCase().includes(q) ||
        res.projectName.toLowerCase().includes(q) ||
        res.domain.toLowerCase().includes(q) ||
        res.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getIcon = (type: ResourceType) => {
    switch (type) {
      case 'GitHub': return <Github className="w-5 h-5 text-slate-800" />;
      case 'YouTube': return <Youtube className="w-5 h-5 text-red-600" />;
      case 'Dataset': return <Database className="w-5 h-5 text-blue-600" />;
      case 'Documentation': return <FileText className="w-5 h-5 text-purple-600" />;
      case 'Research Paper': return <BookOpen className="w-5 h-5 text-emerald-600" />;
      default: return <Code2 className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="page-container space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-dark tracking-tight">Open Resources & Datasets</h1>
          <p className="text-sm text-slate-500 mt-1">
            Curated GitHub repositories, training datasets, and technical documentation from verified Indian projects.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl border border-surface-border p-4 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {types.map(t => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  selectedType === t
                    ? 'bg-primary text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search datasets, repos, papers..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs outline-none focus:border-primary focus:bg-white"
            />
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(res => (
            <div
              key={res.id}
              className="bg-white rounded-2xl border border-surface-border p-6 shadow-subtle hover:border-primary/40 hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-100">
                    {getIcon(res.type)}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-primary border border-purple-100">
                    {res.domain}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-dark line-clamp-2 hover:text-primary transition-colors">
                    <a href={res.url} target="_blank" rel="noreferrer">
                      {res.title}
                    </a>
                  </h3>
                  <Link
                    to={`/projects/${res.projectId}`}
                    className="text-xs text-slate-400 hover:text-primary block mt-1"
                  >
                    Project: {res.projectName}
                  </Link>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {res.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs mt-4">
                <span className="text-slate-500 font-medium">By {res.author || 'Contributor'}</span>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 font-bold text-primary hover:text-primary-hover"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
