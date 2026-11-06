import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, Filter, RotateCcw, ArrowUpDown, ChevronLeft, ChevronRight, 
  Database, GitPullRequest, ExternalLink, Sparkles, CheckCircle2,
  Loader2, X, AlertCircle, RefreshCw, MapPin
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { ProjectCard } from '../components/common/ProjectCard';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { searchAndFilterProjects } from '../utils/searchEngine';
import { Project } from '../types';

export const ExplorePage: React.FC = () => {
  const { projects, datasetSources, importGitHubRepository, isBackendConnected } = useProjects();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial parameters from URL
  const urlSearch = searchParams.get('search') || searchParams.get('q') || '';
  const urlDomain = searchParams.get('domain') || 'All';
  const urlTech = searchParams.get('tech') || 'All';
  const urlStatus = searchParams.get('status') || 'All';
  const urlState = searchParams.get('state') || 'All';
  const urlDifficulty = searchParams.get('difficulty') || 'All';
  const urlSource = searchParams.get('source') || 'All';
  const urlSort = (searchParams.get('sortBy') as 'relevance' | 'newest' | 'stars' | 'views') || 'relevance';

  // Local input state (for immediate typing feedback)
  const [inputQuery, setInputQuery] = useState(urlSearch);

  // Active query state used for filtering / API requests
  const [activeQuery, setActiveQuery] = useState(urlSearch);
  const [selectedSource, setSelectedSource] = useState(urlSource);
  const [selectedDomain, setSelectedDomain] = useState(urlDomain);
  const [selectedTech, setSelectedTech] = useState(urlTech);
  const [selectedStatus, setSelectedStatus] = useState(urlStatus);
  const [selectedState, setSelectedState] = useState(urlState);
  const [selectedDifficulty, setSelectedDifficulty] = useState(urlDifficulty);
  const [sortBy, setSortBy] = useState<'relevance' | 'newest' | 'stars' | 'views'>(urlSort);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Results state from backend or client fallback
  const [searchResults, setSearchResults] = useState<Project[]>([]);
  const [totalResultCount, setTotalResultCount] = useState(0);

  // GitHub Import Modal State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importRepoInput, setImportRepoInput] = useState('');
  const [importNotes, setImportNotes] = useState('');
  const [importStatus, setImportStatus] = useState<{ loading: boolean; message?: string; success?: boolean }>({ loading: false });

  // AbortController reference to cancel outdated search requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync state when URL search params change (e.g. from Hero search or India Map click)
  useEffect(() => {
    const q = searchParams.get('search') || searchParams.get('q') || '';
    const dom = searchParams.get('domain') || 'All';
    const tech = searchParams.get('tech') || 'All';
    const st = searchParams.get('status') || 'All';
    const stateVal = searchParams.get('state') || 'All';
    const diff = searchParams.get('difficulty') || 'All';
    const src = searchParams.get('source') || 'All';
    const sort = (searchParams.get('sortBy') as any) || 'relevance';

    setInputQuery(q);
    setActiveQuery(q);
    setSelectedDomain(dom);
    setSelectedTech(tech);
    setSelectedStatus(st);
    setSelectedState(stateVal);
    setSelectedDifficulty(diff);
    setSelectedSource(src);
    setSortBy(sort);
    setCurrentPage(1);
  }, [searchParams]);

  // Update URL helper
  const updateURLParams = useCallback((params: Record<string, string>) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, val]) => {
      if (!val || val === 'All') {
        nextParams.delete(key);
      } else {
        nextParams.set(key, val);
      }
    });
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  // Debounced search input handler (300ms debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputQuery !== activeQuery) {
        setActiveQuery(inputQuery);
        updateURLParams({ search: inputQuery.trim() });
        setCurrentPage(1);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputQuery, activeQuery, updateURLParams]);

  // Immediate Search Submission (Enter key or Search button click)
  const handleImmediateSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setActiveQuery(inputQuery);
    updateURLParams({ search: inputQuery.trim() });
    setCurrentPage(1);
  };

  // Extract unique filter lists dynamically
  const sources = useMemo(() => {
    const list = Array.from(new Set(projects.map(p => p.source || 'Other'))).sort();
    return ['All', ...list];
  }, [projects]);

  const domains = useMemo(() => {
    const list = Array.from(new Set(projects.map(p => p.domain))).filter(Boolean).sort();
    return ['All', ...list];
  }, [projects]);

  const technologies = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach(p => p.technologies?.forEach(t => techSet.add(t)));
    return ['All', ...Array.from(techSet).sort()];
  }, [projects]);

  const states = useMemo(() => {
    const stateSet = new Set<string>();
    projects.forEach(p => { if (p.state) stateSet.add(p.state); });
    return ['All', ...Array.from(stateSet).sort()];
  }, [projects]);

  const statuses = ['All', 'Completed', 'In Progress', 'Incomplete', 'Abandoned', 'Paused'];
  const difficulties = ['All', 'Beginner', 'Medium', 'Hard', 'Advanced'];

  // Search & Filter Execution: Calls backend API when connected, with client fallback
  useEffect(() => {
    // Cancel any in-flight outdated request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setApiError(null);

    // If backend is connected, perform real backend search
    if (isBackendConnected) {
      const params = new URLSearchParams();
      if (activeQuery.trim()) params.set('q', activeQuery.trim());
      if (selectedDomain !== 'All') params.set('domain', selectedDomain);
      if (selectedTech !== 'All') params.set('tech', selectedTech);
      if (selectedStatus !== 'All') params.set('status', selectedStatus);
      if (selectedState !== 'All') params.set('state', selectedState);
      if (selectedDifficulty !== 'All') params.set('difficulty', selectedDifficulty);
      if (selectedSource !== 'All') params.set('source', selectedSource);
      params.set('sortBy', sortBy);

      fetch(`http://localhost:5000/api/projects/search?${params.toString()}`, {
        signal: controller.signal
      })
        .then(res => {
          if (!res.ok) throw new Error(`Backend search error (${res.status})`);
          return res.json();
        })
        .then(data => {
          setSearchResults(data.projects || []);
          setTotalResultCount(data.total || 0);
          setIsLoading(false);
        })
        .catch(err => {
          if (err.name === 'AbortError') return; // Ignore intentionally cancelled requests
          console.warn('[ExplorePage] Backend search request failed, using client engine fallback:', err.message);
          
          // Seamless client engine fallback
          const local = searchAndFilterProjects(projects, {
            search: activeQuery,
            domain: selectedDomain,
            tech: selectedTech,
            status: selectedStatus,
            difficulty: selectedDifficulty,
            state: selectedState,
            source: selectedSource,
            sortBy
          });
          setSearchResults(local.projects);
          setTotalResultCount(local.total);
          setIsLoading(false);
        });
    } else {
      // Local client-side search engine execution
      const local = searchAndFilterProjects(projects, {
        search: activeQuery,
        domain: selectedDomain,
        tech: selectedTech,
        status: selectedStatus,
        difficulty: selectedDifficulty,
        state: selectedState,
        source: selectedSource,
        sortBy
      });
      setSearchResults(local.projects);
      setTotalResultCount(local.total);
      setIsLoading(false);
    }

    return () => {
      controller.abort();
    };
  }, [
    activeQuery, selectedDomain, selectedTech, selectedStatus, 
    selectedState, selectedDifficulty, selectedSource, sortBy, 
    projects, isBackendConnected
  ]);

  // Paginated slice
  const totalPages = Math.ceil(searchResults.length / pageSize) || 1;
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return searchResults.slice(start, start + pageSize);
  }, [searchResults, currentPage]);

  const handleResetFilters = () => {
    setInputQuery('');
    setActiveQuery('');
    setSelectedSource('All');
    setSelectedDomain('All');
    setSelectedTech('All');
    setSelectedStatus('All');
    setSelectedState('All');
    setSelectedDifficulty('All');
    setSortBy('relevance');
    setCurrentPage(1);
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  // Real Dynamic Statistics (NO fake numbers)
  const statusCounts = useMemo(() => {
    return {
      completed: projects.filter(p => p.status === 'Completed').length,
      inProgress: projects.filter(p => p.status === 'In Progress').length,
      incomplete: projects.filter(p => p.status === 'Incomplete').length,
      abandoned: projects.filter(p => p.status === 'Abandoned').length,
      paused: projects.filter(p => p.status === 'Paused').length,
    };
  }, [projects]);

  const domainStatsData = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach(p => {
      if (p.domain) counts[p.domain] = (counts[p.domain] || 0) + 1;
    });
    const palette = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#EC4899', '#8B5CF6'];
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value], i) => ({
        name,
        value,
        color: palette[i % palette.length]
      }));
  }, [projects]);

  const handleGitHubImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parts = importRepoInput.trim().replace(/^https?:\/\/github\.com\//i, '').replace(/\/$/, '').split('/');
    if (parts.length < 2) {
      setImportStatus({ loading: false, success: false, message: 'Please enter "owner/repo" or a full GitHub repository URL.' });
      return;
    }
    const [owner, repo] = parts;
    setImportStatus({ loading: true, message: 'Contacting backend GitHub API service...' });

    const res = await importGitHubRepository(owner, repo, importNotes);
    if (res.success) {
      setImportStatus({ loading: false, success: true, message: res.message });
      setImportRepoInput('');
      setImportNotes('');
      setTimeout(() => setShowImportModal(false), 2000);
    } else {
      setImportStatus({ loading: false, success: false, message: res.message });
    }
  };

  const hasActiveFilters = Boolean(
    activeQuery.trim() || 
    selectedDomain !== 'All' || 
    selectedTech !== 'All' || 
    selectedStatus !== 'All' || 
    selectedState !== 'All' || 
    selectedDifficulty !== 'All' || 
    selectedSource !== 'All'
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="page-container space-y-6">
        
        {/* Header & Intelligence Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-primary text-xs font-bold mb-2">
              <Database className="w-3.5 h-3.5" />
              <span>Multi-Source Intelligence Hub ({projects.length.toLocaleString()} Verified Projects)</span>
            </div>
            <h1 className="text-3xl font-black text-dark tracking-tight">Explore Real Projects</h1>
            <p className="text-sm text-slate-500 mt-1">
              Search real datasets from Zenodo (ESEM 2018), Project Tracker (CC0), National Transport Telematics, and GitHub with full provenance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="px-4 py-2 bg-dark hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors"
            >
              <GitPullRequest className="w-3.5 h-3.5" />
              Import via GitHub API
            </button>
          </div>
        </div>

        {/* Dataset Sources Attribution Card */}
        <div className="bg-white rounded-2xl border border-surface-border p-4 shadow-subtle flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Integrated Sources:</span>
            {datasetSources.map(ds => (
              <a
                key={ds.id}
                href={ds.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 hover:border-primary/50 text-slate-700 transition-colors"
              >
                <span className="font-semibold">{ds.name}</span>
                <span className="text-[10px] text-slate-400">({ds.license})</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            ))}
          </div>
          <div className="text-[11px] text-slate-500 font-medium flex items-center gap-2">
            <span>Search Engine:</span>
            <span className={isBackendConnected ? "text-emerald-600 font-bold" : "text-purple-600 font-bold"}>
              {isBackendConnected ? "● Backend API (localhost:5000)" : "● Intelligent In-Memory Mode"}
            </span>
          </div>
        </div>

        {/* Filter Controls Panel */}
        <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-subtle space-y-4">
          
          {/* Main Global Search Input Form */}
          <form onSubmit={handleImmediateSearch} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Search projects by name, acronym (RTC, VTC, AI), tech, domain, or organization..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-sm text-dark placeholder:text-slate-400 outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all shadow-2xs font-medium"
              />
              {inputQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setInputQuery('');
                    setActiveQuery('');
                    updateURLParams({ search: '' });
                    setCurrentPage(1);
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-xs flex items-center gap-2 flex-shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </>
              )}
            </button>
          </form>

          {/* Filters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 pt-2 border-t border-slate-100">
            {/* Domain Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Domain</label>
              <select
                value={selectedDomain}
                onChange={e => {
                  setSelectedDomain(e.target.value);
                  updateURLParams({ domain: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-dark font-medium outline-none focus:border-primary"
              >
                {domains.map(d => <option key={d} value={d}>{d === 'All' ? 'All Domains' : d}</option>)}
              </select>
            </div>

            {/* Technology Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Technology</label>
              <select
                value={selectedTech}
                onChange={e => {
                  setSelectedTech(e.target.value);
                  updateURLParams({ tech: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-dark font-medium outline-none focus:border-primary"
              >
                {technologies.slice(0, 40).map(t => <option key={t} value={t}>{t === 'All' ? 'All Technologies' : t}</option>)}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
              <select
                value={selectedStatus}
                onChange={e => {
                  setSelectedStatus(e.target.value);
                  updateURLParams({ status: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-dark font-medium outline-none focus:border-primary"
              >
                {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
              </select>
            </div>

            {/* State Filter (Enables India map selection filter) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">State / Region</label>
              <select
                value={selectedState}
                onChange={e => {
                  setSelectedState(e.target.value);
                  updateURLParams({ state: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-dark font-medium outline-none focus:border-primary"
              >
                {states.map(st => <option key={st} value={st}>{st === 'All' ? 'All States (India)' : st}</option>)}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={e => {
                  setSelectedDifficulty(e.target.value);
                  updateURLParams({ difficulty: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-dark font-medium outline-none focus:border-primary"
              >
                {difficulties.map(d => <option key={d} value={d}>{d === 'All' ? 'All Levels' : d}</option>)}
              </select>
            </div>

            {/* Dataset Source Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Source Dataset</label>
              <select
                value={selectedSource}
                onChange={e => {
                  setSelectedSource(e.target.value);
                  updateURLParams({ source: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-dark font-medium outline-none focus:border-primary"
              >
                {sources.map(s => <option key={s} value={s}>{s === 'All' ? 'All Sources' : s}</option>)}
              </select>
            </div>

            {/* Reset Filter Button */}
            <div className="flex items-end">
              <button
                onClick={handleResetFilters}
                className="w-full h-[36px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                title="Reset all search filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
              <span className="font-bold text-slate-500 text-[11px]">Active Filters:</span>
              {activeQuery.trim() && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 font-semibold">
                  <span>Search: &ldquo;{activeQuery}&rdquo;</span>
                  <button
                    onClick={() => {
                      setInputQuery('');
                      setActiveQuery('');
                      updateURLParams({ search: '' });
                    }}
                    className="hover:text-purple-950"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedState !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 font-semibold">
                  <MapPin className="w-3 h-3" />
                  <span>State: {selectedState}</span>
                  <button
                    onClick={() => {
                      setSelectedState('All');
                      updateURLParams({ state: 'All' });
                    }}
                    className="hover:text-indigo-950"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedDomain !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold">
                  <span>Domain: {selectedDomain}</span>
                  <button
                    onClick={() => {
                      setSelectedDomain('All');
                      updateURLParams({ domain: 'All' });
                    }}
                    className="hover:text-blue-950"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedTech !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                  <span>Tech: {selectedTech}</span>
                  <button
                    onClick={() => {
                      setSelectedTech('All');
                      updateURLParams({ tech: 'All' });
                    }}
                    className="hover:text-emerald-950"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedStatus !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-semibold">
                  <span>Status: {selectedStatus}</span>
                  <button
                    onClick={() => {
                      setSelectedStatus('All');
                      updateURLParams({ status: 'All' });
                    }}
                    className="hover:text-amber-950"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-primary hover:underline ml-2"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Results Info & Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Searching intelligence records...</span>
              </div>
            ) : (
              <>
                <span className="text-base font-bold text-dark">
                  {searchResults.length.toLocaleString()} {searchResults.length === 1 ? 'Project' : 'Projects'} Found
                  {activeQuery.trim() ? ` for "${activeQuery}"` : ''}
                </span>
                <span className="text-xs text-slate-400">
                  (Page {currentPage} of {totalPages})
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e: any) => {
                setSortBy(e.target.value);
                updateURLParams({ sortBy: e.target.value });
              }}
              className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-dark outline-none focus:border-primary shadow-2xs"
            >
              <option value="relevance">Most Relevant (Default)</option>
              <option value="newest">Newest First</option>
              <option value="stars">Most Stars</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>

        {/* Main Content Layout: Left Grid + Right Real Stats Sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Projects Card Grid (9 cols on xl) */}
          <div className="xl:col-span-9 space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(idx => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-slate-200 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-3/4" />
                        <div className="h-3 bg-slate-200 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="h-3 bg-slate-200 rounded w-full" />
                    <div className="h-3 bg-slate-200 rounded w-5/6" />
                  </div>
                ))}
              </div>
            ) : paginatedProjects.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {paginatedProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-surface-border p-12 text-center space-y-4 shadow-subtle">
                <div className="w-14 h-14 rounded-full bg-purple-50 text-primary mx-auto flex items-center justify-center">
                  <Search className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark">
                    No projects found {activeQuery.trim() ? `matching "${activeQuery}"` : 'with active filters'}
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
                    Try searching by recognized acronyms (e.g. <span className="font-semibold text-primary">RTC</span>, <span className="font-semibold text-primary">APSRTC</span>, <span className="font-semibold text-primary">VTC</span>, <span className="font-semibold text-primary">AI</span>), technology keywords (<span className="font-semibold text-primary">Python</span>, <span className="font-semibold text-primary">Java</span>), or reset active filters.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                  >
                    Reset All Filters
                  </button>
                  {activeQuery && (
                    <button
                      onClick={() => {
                        setInputQuery('');
                        setActiveQuery('');
                        updateURLParams({ search: '' });
                      }}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                    >
                      Clear Search Query
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && !isLoading && (
              <div className="bg-white rounded-2xl border border-surface-border p-4 shadow-subtle flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 disabled:opacity-40 flex items-center gap-1 hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                <div className="text-xs font-bold text-slate-700">
                  Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, searchResults.length)} of {searchResults.length.toLocaleString()}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 disabled:opacity-40 flex items-center gap-1 hover:bg-slate-50 transition-colors"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Right Statistics Sidebar (3 cols on xl) */}
          <div className="xl:col-span-3 space-y-5">
            
            {/* Real Domain Distribution Donut */}
            <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-subtle">
              <h3 className="text-sm font-bold text-dark mb-4">Domain Distribution</h3>
              <div className="relative h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={domainStatsData} cx="50%" cy="50%" innerRadius={50} outerRadius={68} paddingAngle={4} dataKey="value">
                      {domainStatsData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-black text-dark">{projects.length.toLocaleString()}</span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total</span>
                </div>
              </div>
              <div className="space-y-2 mt-3 pt-3 border-t border-slate-100">
                {domainStatsData.map(item => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-medium text-slate-600 truncate max-w-[120px]">{item.name}</span>
                    </div>
                    <span className="font-bold text-dark">{item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Real Status Counts Breakdown */}
            <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-subtle space-y-4">
              <h3 className="text-sm font-bold text-dark">Lifecycle Status</h3>
              {[
                { label: 'Completed', value: statusCounts.completed, pct: `${Math.round((statusCounts.completed / (projects.length || 1)) * 100)}%`, color: 'bg-emerald-500', textColor: 'text-emerald-600' },
                { label: 'In Progress', value: statusCounts.inProgress, pct: `${Math.round((statusCounts.inProgress / (projects.length || 1)) * 100)}%`, color: 'bg-blue-500', textColor: 'text-blue-600' },
                { label: 'Abandoned / Archived', value: statusCounts.abandoned, pct: `${Math.round((statusCounts.abandoned / (projects.length || 1)) * 100)}%`, color: 'bg-rose-500', textColor: 'text-rose-600' },
                { label: 'Paused / Inactive', value: statusCounts.paused, pct: `${Math.round((statusCounts.paused / (projects.length || 1)) * 100)}%`, color: 'bg-purple-500', textColor: 'text-purple-600' },
                { label: 'Incomplete', value: statusCounts.incomplete, pct: `${Math.round((statusCounts.incomplete / (projects.length || 1)) * 100)}%`, color: 'bg-amber-500', textColor: 'text-amber-600' }
              ].map(row => (
                <div key={row.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-600">{row.label}</span>
                    <span className={`font-bold ${row.textColor}`}>{row.value.toLocaleString()} ({row.pct})</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${row.color} rounded-full`} style={{ width: row.pct }} />
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* GitHub Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-surface-border p-6 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setShowImportModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-dark mb-1">Import Public Repository</h2>
            <p className="text-xs text-slate-500 mb-4">
              Enter a GitHub repository URL to import repository metadata, commit recency, and maintenance signals.
            </p>

            <form onSubmit={handleGitHubImportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Repository URL or &ldquo;owner/repo&rdquo;</label>
                <input
                  type="text"
                  value={importRepoInput}
                  onChange={e => setImportRepoInput(e.target.value)}
                  placeholder="e.g. facebook/react or https://github.com/torvalds/linux"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-dark outline-none focus:border-primary focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Custom Notes / Context (Optional)</label>
                <textarea
                  value={importNotes}
                  onChange={e => setImportNotes(e.target.value)}
                  placeholder="Add notes about inactivity or empirical reasons..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-dark outline-none focus:border-primary focus:bg-white"
                />
              </div>

              {importStatus.message && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${importStatus.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                  {importStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                  <span>{importStatus.message}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={importStatus.loading}
                  className="px-5 py-2 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs"
                >
                  {importStatus.loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {importStatus.loading ? 'Importing...' : 'Confirm Import'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
