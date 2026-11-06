import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Search, ArrowRight, Star, ExternalLink, Archive, Database, GitFork } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { SimilarityBar } from '../components/common/SimilarityBar';
import { calculateSimilarity } from '../utils/analysisEngine';

export const SimilarProjectsPage: React.FC = () => {
  const { projects } = useProjects();
  const [selectedBaseProject, setSelectedBaseProject] = useState(projects[0]?.id || 'proj-1');
  const [searchFilter, setSearchFilter] = useState('');

  const baseProject = projects.find(p => p.id === selectedBaseProject) || projects[0];

  // Compute similarity of all other projects relative to baseProject
  const rankedSimilar = useMemo(() => {
    if (!baseProject) return [];
    let list = projects.filter(p => p.id !== baseProject.id);

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.domain.toLowerCase().includes(q) || p.technologies.some(t => t.toLowerCase().includes(q)));
    }

    return list
      .map(p => ({
        ...p,
        similarity: calculateSimilarity(baseProject, p)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 35); // Top 35 most relevant matches for responsive UI
  }, [baseProject, projects, searchFilter]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="page-container space-y-6">
        
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-primary text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Dataset Matching Engine (Jaccard + Tech + Feature Overlap)</span>
          </div>
          <h1 className="text-3xl font-black text-dark tracking-tight">Similar Projects</h1>
          <p className="text-sm text-slate-500 mt-1">
            Comparing against: <span className="font-semibold text-primary">"{baseProject?.name}"</span> ({baseProject?.domain} - {baseProject?.source})
          </p>
        </div>

        {/* Project Selector Bar */}
        <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto flex-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
              Base Project:
            </span>
            <select
              value={selectedBaseProject}
              onChange={(e) => setSelectedBaseProject(e.target.value)}
              className="w-full sm:w-96 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-dark outline-none focus:border-primary"
            >
              {projects.slice(0, 100).map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.domain} • {p.source})
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              placeholder="Filter similar results..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Similar Projects Table */}
        <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pl-2">Project</th>
                  <th className="pb-3">Dataset Source</th>
                  <th className="pb-3 w-64">Similarity Match</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">Stars</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {rankedSimilar.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-100">
                          <img
                            src={item.images?.[0] || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=120&q=80'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <Link
                            to={`/projects/${item.id}`}
                            className="font-bold text-dark hover:text-primary text-sm block"
                          >
                            {item.name}
                          </Link>
                          <span className="text-slate-400 text-[11px] line-clamp-1">
                            {item.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border">
                        {item.source}
                      </span>
                    </td>

                    <td className="py-4 pr-6">
                      <SimilarityBar percentage={item.similarity} />
                    </td>

                    <td className="py-4">
                      <StatusBadge status={item.status} size="sm" />
                    </td>

                    <td className="py-4 text-right pr-2 font-bold text-slate-700">
                      <div className="flex items-center justify-end gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                        <span>{item.stars > 1000 ? `${(item.stars / 1000).toFixed(1)}k` : item.stars}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
