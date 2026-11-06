import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, CheckCircle2, Clock, Skull, TrendingUp, 
  PlusCircle, ArrowRight, GitBranch, MessageSquare, 
  CheckSquare, Bookmark, ShieldCheck, UserCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { StatusBadge } from '../components/common/StatusBadge';

export const UserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { projects } = useProjects();

  const userProjects = projects.slice(0, 5); // 5 projects
  const completedCount = userProjects.filter(p => p.status === 'Completed').length || 2;
  const activeCount = userProjects.filter(p => p.status === 'In Progress').length || 2;
  const abandonedCount = userProjects.filter(p => p.status === 'Abandoned' || p.status === 'Incomplete').length || 1;

  const successRate = Math.round((completedCount / (userProjects.length || 1)) * 100) || 80;

  const activities = [
    { id: '1', title: 'Created new project', desc: 'Initialized repository for Smart Attendance System', time: '2 days ago', icon: PlusCircle, color: 'text-primary' },
    { id: '2', title: 'Added GitHub repository', desc: 'Pushed production Docker & OpenCV models', time: '3 days ago', icon: GitBranch, color: 'text-indigo-600' },
    { id: '3', title: 'Completed a task', desc: 'Image upload feature for student registration', time: '4 days ago', icon: CheckSquare, color: 'text-emerald-600' },
    { id: '4', title: 'Received a review', desc: 'Sneha M. rated Smart Attendance System 4.0 ★', time: '5 days ago', icon: MessageSquare, color: 'text-amber-500' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 w-full">
      <div className="page-container space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-dark tracking-tight">My Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">
              Welcome back, <span className="font-bold text-primary">{user?.name || 'Devansh Reddy'}</span> ({user?.institution || 'IIT Madras'})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/idea-checker"
              className="px-4 py-2 bg-purple-50 text-primary hover:bg-purple-100 text-xs font-bold rounded-xl border border-purple-200 transition-colors"
            >
              Check New Idea
            </Link>
            <Link
              to="/create-project"
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Project</span>
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards (Matching Reference Screen 11) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-subtle space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Projects</span>
            <p className="text-3xl font-black text-dark">{userProjects.length}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-subtle space-y-1">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Completed</span>
            <p className="text-3xl font-black text-emerald-600">{completedCount}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-subtle space-y-1">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Active</span>
            <p className="text-3xl font-black text-blue-600">{activeCount}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-subtle space-y-1">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Abandoned</span>
            <p className="text-3xl font-black text-rose-600">{abandonedCount}</p>
          </div>

        </div>

        {/* Middle Section: Project Activity + Success Rate Ring (Matching Screen 11) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Project Activity (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-surface-border p-6 shadow-subtle space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-dark">Project Activity</h2>
              <span className="text-xs text-slate-400">Live Timeline</span>
            </div>

            <div className="space-y-4">
              {activities.map((act) => {
                const IconComponent = act.icon;
                return (
                  <div key={act.id} className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className={`p-2 rounded-xl bg-slate-100 ${act.color} mt-0.5`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs sm:text-sm font-bold text-dark">{act.title}</p>
                        <span className="text-[11px] text-slate-400">{act.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{act.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Success Rate Donut Metric (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-surface-border p-6 shadow-subtle flex flex-col items-center justify-center text-center space-y-4">
            <h2 className="text-sm font-bold text-dark uppercase tracking-wider">Success Rate</h2>

            {/* Circular Progress Gauge */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#EEF2FF"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#4F46E5"
                  strokeWidth="10"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * successRate) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-dark">{successRate}%</span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase">High Feasibility</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Based on completed deliverables vs abandoned prototypes in your workspace.
            </p>
          </div>

        </div>

        {/* My Projects Table Section */}
        <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-dark">My Projects Workspace</h2>
            <Link to="/create-project" className="text-xs font-bold text-primary hover:text-primary-hover">
              + New Project
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs sm:text-sm">
            {userProjects.map(p => (
              <div key={p.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors px-2 rounded-xl">
                <div>
                  <div className="flex items-center gap-2">
                    <Link to={`/projects/${p.id}`} className="font-bold text-dark hover:text-primary text-base">
                      {p.name}
                    </Link>
                    <StatusBadge status={p.status} size="sm" />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{p.description}</p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <Link
                    to={`/projects/${p.id}`}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-dark font-bold text-xs rounded-lg transition-colors"
                  >
                    Manage Workspace
                  </Link>
                  <Link
                    to="/team-skills"
                    className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-primary font-bold text-xs rounded-lg transition-colors"
                  >
                    Team Skills
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
