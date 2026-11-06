import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Star, Eye, Bookmark, GitFork, ExternalLink, Calendar, MapPin, Building,
  Users, Clock, AlertTriangle, ShieldCheck, CheckCircle2, ChevronRight, MessageSquare,
  Sparkles, Layers, ListTodo, Plus, ShieldAlert, Archive, Database, UserCheck, FileText,
  HelpCircle, Info
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, RiskBadge } from '../components/common/StatusBadge';
import { SimilarityBar } from '../components/common/SimilarityBar';
import { calculateSimilarity } from '../utils/analysisEngine';
import { TaskStatus, TaskPriority } from '../types';

export const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    projects,
    getProjectById,
    getProjectReviews,
    addReview,
    voteReview,
    getProjectTasks,
    addTask,
    updateTask,
    selectedComparisonIds,
    toggleCompareProject
  } = useProjects();
  const { user, isProjectSaved, toggleSaveProject } = useAuth();

  const project = getProjectById(id || '');
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'reviews' | 'similar'>('overview');

  // Review Modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  // Task Modal state
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskColumn, setNewTaskColumn] = useState<TaskStatus>('TODO');

  if (!project) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-surface-border p-8 max-w-md w-full text-center space-y-4 shadow-subtle">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center font-bold text-xl">
            !
          </div>
          <h2 className="text-xl font-black text-dark">Project Not Found</h2>
          <p className="text-xs text-slate-500">The requested repository or project does not exist in the database.</p>
          <Link to="/explore" className="inline-block px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-xs">
            Return to Explore
          </Link>
        </div>
      </div>
    );
  }

  const isSaved = isProjectSaved(project.id);
  const isCompared = selectedComparisonIds.includes(project.id);
  const projectReviews = getProjectReviews(project.id);
  const projectTasks = getProjectTasks(project.id);

  // Compute similar projects across datasets
  const similarProjects = projects
    .filter(p => p.id !== project.id)
    .map(p => ({
      ...p,
      similarity: calculateSimilarity(project, p)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addReview(project.id, newRating, newComment, {
      name: user?.name || 'Anonymous Innovator',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      institution: user?.institution || 'Indian Tech University'
    });
    setNewComment('');
    setShowReviewModal(false);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask(project.id, {
      title: newTaskTitle,
      description: 'Custom sprint task added by innovator',
      status: newTaskColumn,
      priority: 'HIGH' as TaskPriority,
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]
    });
    setNewTaskTitle('');
    setShowAddTaskModal(false);
  };

  const renderSourceBadge = () => {
    switch (project.sourceType) {
      case 'demo':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
            <Sparkles className="w-3.5 h-3.5" />
            Demo Showcase
          </span>
        );
      case 'external':
        if (project.source.includes('Zenodo')) {
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
              <Archive className="w-3.5 h-3.5" />
              Zenodo ESEM 2018 Dataset
            </span>
          );
        }
        if (project.source.includes('Project Tracker')) {
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
              <Database className="w-3.5 h-3.5" />
              Project Tracker Dataset (CC0)
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
            <GitFork className="w-3.5 h-3.5" />
            GitHub REST API
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
            <UserCheck className="w-3.5 h-3.5" />
            User Submission
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="page-container space-y-6">

        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Explorer</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleCompareProject(project.id)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                isCompared
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-primary/50'
              }`}
            >
              {isCompared ? 'Comparing ✓' : 'Add to Compare'}
            </button>
            <button
              onClick={() => toggleSaveProject(project.id)}
              className={`p-2 rounded-xl border transition-colors ${
                isSaved ? 'bg-primary-light border-primary/30 text-primary' : 'bg-white border-slate-200 text-slate-400 hover:text-primary'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save project'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Dataset Provenance & Attribution Alert */}
        <div className="bg-white rounded-2xl border border-surface-border p-4 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            {renderSourceBadge()}
            <div>
              <span className="font-bold text-dark">{project.source}</span>
              <span className="text-slate-400 mx-2">|</span>
              <span className="text-slate-600 font-medium">Attribution: {project.attribution || 'Open Project Intelligence'}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-500 text-[11px]">
            {project.license && (
              <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
                License: {project.license}
              </span>
            )}
            {project.externalId && <span>ID: <code className="bg-slate-100 px-1 py-0.5 rounded">{project.externalId}</code></span>}
            {project.importedAt && <span>Imported: {new Date(project.importedAt).toLocaleDateString()}</span>}
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl border border-surface-border p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={project.status} size="md" />
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  {project.domain}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  {project.difficulty} Level
                </span>
                {project.maintenanceSignals?.isArchived && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 flex items-center gap-1">
                    <Archive className="w-3.5 h-3.5" />
                    Archived Repository
                  </span>
                )}
                {project.maintenanceSignals?.activityStatus === 'potentially_inactive' && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Potentially Inactive
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-dark tracking-tight">
                {project.name}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-4xl">
                {project.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{project.institution}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{project.city}, {project.state}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{project.year}</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Badge */}
            <div className="flex lg:flex-col items-center justify-around lg:justify-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 min-w-[200px]">
              {project.rating > 0 && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 font-black text-amber-500 text-xl">
                    <Star className="w-5 h-5 fill-current" />
                    <span>{project.rating}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{project.reviewCount} Reviews</span>
                </div>
              )}
              <div className="text-center">
                <span className="text-xl font-black text-dark">{project.stars || 0}</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">GitHub Stars</span>
              </div>
              <div className="text-center">
                <span className="text-xl font-black text-dark">{project.viewCount || 100}</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Views</span>
              </div>
            </div>
          </div>

          {/* Links & External Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-dark hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-xs"
              >
                <GitFork className="w-4 h-4" />
                <span>View on GitHub</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-xs"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200">
          {[
            { id: 'overview', label: 'Overview & Architecture', icon: Layers },
            { id: 'tasks', label: `Kanban Tasks (${projectTasks.length})`, icon: ListTodo },
            { id: 'reviews', label: `Community Reviews (${projectReviews.length})`, icon: MessageSquare },
            { id: 'similar', label: `Similar Projects (${similarProjects.length})`, icon: Sparkles }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 -mb-[2px] transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-dark'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              
              {/* Maintenance Signals Panel (Transparent, non-invented) */}
              {project.maintenanceSignals && (
                <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-subtle space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-bold text-dark">Maintenance & Activity Signals</h3>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
                    <p><span className="font-semibold text-slate-700">Archival Status: </span>{project.maintenanceSignals.isArchived ? 'Archived repository' : 'Active repository'}</p>
                    <p><span className="font-semibold text-slate-700">Activity Level: </span>{project.maintenanceSignals.activityStatus || 'Active'}</p>
                    {project.maintenanceSignals.lastCommitDate && (
                      <p><span className="font-semibold text-slate-700">Last Code Commit: </span>{new Date(project.maintenanceSignals.lastCommitDate).toLocaleDateString()}</p>
                    )}
                    <p><span className="font-semibold text-slate-700">Notes: </span>{project.maintenanceSignals.signalNotes || 'No anomalies recorded.'}</p>
                  </div>
                </div>
              )}

              {/* Technologies */}
              <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-subtle space-y-3">
                <h3 className="text-sm font-bold text-dark">Technologies & Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map(tech => (
                    <span key={tech} className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features List */}
              <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-subtle space-y-3">
                <h3 className="text-sm font-bold text-dark">Key Features & Architecture</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {project.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Failure Reasons ONLY when verified */}
              {project.verifiedFailureDetails && project.failureReasons && project.failureReasons.length > 0 && (
                <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-subtle space-y-4">
                  <div className="flex items-center gap-2 text-rose-700">
                    <AlertTriangle className="w-4 h-4" />
                    <h3 className="text-sm font-bold">Verified Post-Mortem Analysis</h3>
                  </div>
                  {project.failureReasons.map((fr, idx) => (
                    <div key={idx} className="space-y-2 text-xs">
                      <div className="font-bold text-rose-800">{fr.title} ({fr.factor})</div>
                      <p className="text-slate-600">{fr.description}</p>
                      {fr.lessonsLearned && fr.lessonsLearned.length > 0 && (
                        <div className="p-3 bg-rose-50 rounded-xl space-y-1">
                          <span className="font-bold text-rose-700 block">Lessons Learned:</span>
                          <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                            {fr.lessonsLearned.map((ll, i) => <li key={i}>{ll}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Right Details Column */}
            <div className="space-y-6">
              
              {/* Creator Info */}
              <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-subtle space-y-4">
                <h3 className="text-sm font-bold text-dark">Maintainer / Author</h3>
                <div className="flex items-center gap-3">
                  <img
                    src={project.createdBy.avatar}
                    alt={project.createdBy.name}
                    className="w-12 h-12 rounded-xl object-cover border"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-dark">{project.createdBy.name}</h4>
                    <p className="text-xs text-slate-500">{project.createdBy.institution}</p>
                  </div>
                </div>
              </div>

              {/* Dataset Attribution Box */}
              <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-subtle space-y-3 text-xs">
                <h3 className="text-sm font-bold text-dark">Dataset Attribution & Compliance</h3>
                <div className="space-y-1.5 text-slate-600">
                  <p><span className="font-semibold">Provider: </span>{project.source}</p>
                  <p><span className="font-semibold">License: </span>{project.license || 'Open Data'}</p>
                  <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
                    {project.attribution || 'Data served under academic open-access terms.'}
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Kanban Tasks */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-dark">Project Task Pipeline</h3>
                <p className="text-xs text-slate-500">Track tasks ingested from dataset or manage custom sprint work.</p>
              </div>
              <button
                onClick={() => setShowAddTaskModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(['TODO', 'IN_PROGRESS', 'TESTING', 'DONE'] as TaskStatus[]).map(col => {
                const colTasks = projectTasks.filter(t => t.status === col);
                const colTitles = { TODO: 'To Do', IN_PROGRESS: 'In Progress', TESTING: 'Testing', DONE: 'Done' };
                return (
                  <div key={col} className="bg-white rounded-2xl border border-surface-border p-4 shadow-subtle space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-xs font-extrabold text-dark tracking-wide">
                        {colTitles[col]} ({colTasks.length})
                      </span>
                    </div>

                    <div className="space-y-2.5 min-h-[160px]">
                      {colTasks.map(t => (
                        <div key={t.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2 hover:border-primary/40 transition-colors">
                          <p className="text-xs font-bold text-dark">{t.title}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-2">{t.description}</p>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-primary">
                              {t.priority}
                            </span>
                            <select
                              value={t.status}
                              onChange={(e) => updateTask(t.id, { status: e.target.value as TaskStatus })}
                              className="text-[10px] font-semibold bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-600 outline-none"
                            >
                              <option value="TODO">To Do</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="TESTING">Testing</option>
                              <option value="DONE">Done</option>
                            </select>
                          </div>
                        </div>
                      ))}
                      {colTasks.length === 0 && (
                        <div className="h-24 flex items-center justify-center text-xs text-slate-400 italic">
                          No tasks in this lane
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-dark">Community Reviews & Feedback</h3>
                <p className="text-xs text-slate-500">Read verified insights or share reproducibility reports.</p>
              </div>
              <button
                onClick={() => setShowReviewModal(true)}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Write a Review
              </button>
            </div>

            <div className="space-y-3">
              {projectReviews.map(r => (
                <div key={r.id} className="bg-white p-5 rounded-2xl border border-surface-border shadow-subtle space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={r.userAvatar} alt={r.userName} className="w-8 h-8 rounded-full border" />
                      <div>
                        <h4 className="text-xs font-bold text-dark">{r.userName}</h4>
                        <span className="text-[10px] text-slate-400">{r.userInstitution}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{r.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{r.comment}</p>
                </div>
              ))}
              {projectReviews.length === 0 && (
                <div className="bg-white p-8 rounded-2xl border text-center text-xs text-slate-400">
                  No community reviews posted yet for this repository.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Similar Projects */}
        {activeTab === 'similar' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-subtle">
              <h3 className="text-sm font-bold text-dark mb-4">Rule-Based Similar Projects Across Datasets</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                      <th className="pb-3">Project</th>
                      <th className="pb-3">Source Dataset</th>
                      <th className="pb-3 w-48">Similarity Overlap</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {similarProjects.map(sp => (
                      <tr key={sp.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3">
                          <Link to={`/projects/${sp.id}`} className="font-bold text-dark hover:text-primary block">
                            {sp.name}
                          </Link>
                          <span className="text-[11px] text-slate-400 line-clamp-1">{sp.domain}</span>
                        </td>
                        <td className="py-3 text-slate-600 font-medium">
                          {sp.source}
                        </td>
                        <td className="py-3 pr-4">
                          <SimilarityBar percentage={sp.similarity} />
                        </td>
                        <td className="py-3">
                          <StatusBadge status={sp.status} size="sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-dark/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-dark">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewRating(s)}
                      className="p-1 text-amber-500 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-6 h-6 ${s <= newRating ? 'fill-current' : 'text-slate-200'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Comment & Feedback</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share insights about this project's architecture, hardware, or ease of reproduction..."
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-primary focus:bg-white"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-xl hover:bg-primary-hover shadow-xs"
                >
                  Post Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-dark/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-dark">Add New Task</h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Task Title</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Integrate WebSocket live face stream"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-primary focus:bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Lane</label>
                <select
                  value={newTaskColumn}
                  onChange={(e) => setNewTaskColumn(e.target.value as TaskStatus)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold outline-none focus:border-primary"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="TESTING">Testing</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-xl hover:bg-primary-hover shadow-xs"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
