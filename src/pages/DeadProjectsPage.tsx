import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Skull, AlertTriangle, Lightbulb, ArrowRight, Star, ShieldAlert, BarChart2, BookOpen, Archive, CheckCircle2, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { StatusBadge } from '../components/common/StatusBadge';

export const DeadProjectsPage: React.FC = () => {
  const { projects } = useProjects();
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Real data filter: Abandoned, Paused, Incomplete, or has verified failure reasons
  const deadProjects = useMemo(() => {
    return projects.filter(p =>
      p.status === 'Abandoned' ||
      p.status === 'Incomplete' ||
      p.status === 'Paused' ||
      p.maintenanceSignals?.isArchived ||
      p.maintenanceSignals?.activityStatus === 'potentially_inactive' ||
      (p.failureReasons && p.failureReasons.length > 0)
    );
  }, [projects]);

  const filtered = useMemo(() => {
    if (selectedCategoryFilter === 'All') return deadProjects;
    if (selectedCategoryFilter === 'Verified Post-Mortems') {
      return deadProjects.filter(p => p.verifiedFailureDetails && p.failureReasons && p.failureReasons.length > 0);
    }
    if (selectedCategoryFilter === 'Zenodo Archived Repositories') {
      return deadProjects.filter(p => p.source.includes('Zenodo'));
    }
    if (selectedCategoryFilter === 'Potentially Inactive (Maintenance Signals)') {
      return deadProjects.filter(p => p.maintenanceSignals?.activityStatus === 'potentially_inactive');
    }
    // Filter by failure reason factor if present
    return deadProjects.filter(p => p.failureReasons?.some(f => f.factor.toLowerCase().includes(selectedCategoryFilter.toLowerCase())));
  }, [deadProjects, selectedCategoryFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  // Real Dynamic Statistics (NO fake numbers)
  const stats = useMemo(() => {
    const verifiedFailures = deadProjects.filter(p => p.verifiedFailureDetails && p.failureReasons && p.failureReasons.length > 0).length;
    const archivedRepos = deadProjects.filter(p => p.maintenanceSignals?.isArchived || p.status === 'Abandoned').length;
    const potentiallyInactive = deadProjects.filter(p => p.maintenanceSignals?.activityStatus === 'potentially_inactive' || p.status === 'Paused').length;
    const incomplete = deadProjects.filter(p => p.status === 'Incomplete').length;

    return {
      total: deadProjects.length,
      archivedRepos,
      verifiedFailures,
      potentiallyInactive,
      incomplete
    };
  }, [deadProjects]);

  const filterCategories = [
    'All',
    'Verified Post-Mortems',
    'Zenodo Archived Repositories',
    'Potentially Inactive (Maintenance Signals)',
    'Hardware',
    'Technical complexity',
    'Time',
    'Budget',
    'Team'
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 w-full">
      <div className="page-container space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold mb-2">
              <Skull className="w-3.5 h-3.5" />
              <span>National Post-Mortem & Archived Repository Directory</span>
            </div>
            <h1 className="text-3xl font-black text-dark tracking-tight">Dead & Inactive Projects</h1>
            <p className="text-sm text-slate-500 mt-1">
              Analyze archived repositories from empirical datasets (ESEM 2018) and verified post-mortems before you build.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter Category:</span>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => { setSelectedCategoryFilter(e.target.value); setCurrentPage(1); }}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-dark outline-none focus:border-primary shadow-2xs"
            >
              {filterCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Real Dynamic Stats Row (NO invented numbers) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-subtle">
            <p className="text-xs font-semibold text-slate-400">Total Tracked Inactive</p>
            <p className="text-2xl font-black text-dark mt-1">{stats.total.toLocaleString()}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-subtle">
            <p className="text-xs font-semibold text-rose-500">Archived Repositories (Zenodo)</p>
            <p className="text-2xl font-black text-rose-600 mt-1">{stats.archivedRepos.toLocaleString()}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-subtle">
            <p className="text-xs font-semibold text-amber-500">Potentially Inactive (Signals)</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{stats.potentiallyInactive.toLocaleString()}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-subtle">
            <p className="text-xs font-semibold text-purple-500">Verified Post-Mortems</p>
            <p className="text-2xl font-black text-purple-600 mt-1">{stats.verifiedFailures.toLocaleString()}</p>
          </div>
        </div>

        {/* Informational Guidance Notice */}
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex items-start gap-3 text-xs text-blue-800">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Maintenance Signal Policy: </span>
            Inactive or archived repositories are tagged with maintenance signals from verified empirical research datasets (ESEM 2018). An inactive repository is not automatically assumed to have failed; explicit failure reasons are shown only when supported by source study data or verified user submissions.
          </div>
        </div>

        {/* Dead Projects Cards List */}
        <div className="space-y-4">
          {paginatedProjects.map(dp => {
            const hasVerifiedFailure = dp.verifiedFailureDetails && dp.failureReasons && dp.failureReasons.length > 0;
            const failure = hasVerifiedFailure ? dp.failureReasons![0] : null;

            return (
              <div
                key={dp.id}
                className="bg-white rounded-2xl border border-surface-border p-6 shadow-subtle hover:border-rose-300 transition-all space-y-4"
              >
                {/* Top Row: Thumbnail + Title + Status + Provenance */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                      <img
                        src={dp.images?.[0] || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=120&q=80'}
                        alt={dp.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/projects/${dp.id}`}
                          className="text-lg font-black text-dark hover:text-primary transition-colors"
                        >
                          {dp.name}
                        </Link>
                        <StatusBadge status={dp.status} size="sm" />
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border">
                          {dp.source}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {failure ? (
                          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            Verified Reason: {failure.factor}
                          </span>
                        ) : dp.maintenanceSignals?.isArchived ? (
                          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-300 flex items-center gap-1">
                            <Archive className="w-3 h-3 text-slate-500" />
                            Empirically Archived Repository
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3 text-amber-600" />
                            Maintenance Signal: Inactive Repository
                          </span>
                        )}

                        <span className="text-xs text-slate-400">|</span>
                        <span className="text-xs text-slate-500">{dp.domain}</span>
                        {dp.githubUrl && (
                          <>
                            <span className="text-xs text-slate-400">|</span>
                            <a
                              href={dp.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-primary font-semibold hover:underline"
                            >
                              GitHub Repository
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/projects/${dp.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-dark border border-slate-200 text-xs font-bold rounded-xl transition-colors whitespace-nowrap self-start sm:self-auto"
                  >
                    <span>View Intelligence</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Description / Maintenance Signal / Failure Summary */}
                <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 text-xs space-y-2">
                  <p className="text-slate-600 leading-relaxed">
                    {dp.description}
                  </p>

                  {/* If verified failure reasons exist, display transparent lessons */}
                  {failure && (
                    <div className="pt-2 border-t border-slate-200/60 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="font-bold text-rose-700 block mb-1">Root Cause Finding:</span>
                        <p className="text-slate-600">{failure.description}</p>
                      </div>
                      <div>
                        <span className="font-bold text-primary block mb-1">Recommended Alternative:</span>
                        <p className="text-slate-600">{failure.recommendedAlternative}</p>
                      </div>
                    </div>
                  )}

                  {/* If external archived repository without verified submission */}
                  {!failure && dp.maintenanceSignals && (
                    <div className="pt-2 border-t border-slate-200/60 text-slate-500">
                      <span className="font-semibold text-slate-700">Maintenance Context: </span>
                      {dp.maintenanceSignals.signalNotes || 'Identified as unmaintained/archived in research dataset.'}
                    </div>
                  )}
                </div>

                {/* Footer Attribution */}
                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>License: {dp.license || 'Open Source'} | Attribution: {dp.attribution || dp.source}</span>
                  <span>Imported: {dp.importedAt ? new Date(dp.importedAt).toLocaleDateString() : 'Active'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="bg-white rounded-2xl border border-surface-border p-4 shadow-subtle flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 disabled:opacity-40 flex items-center gap-1 hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <div className="text-xs font-bold text-slate-700">
              Page {currentPage} of {totalPages} ({filtered.length.toLocaleString()} items)
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 disabled:opacity-40 flex items-center gap-1 hover:bg-slate-50"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
