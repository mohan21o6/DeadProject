import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, ArrowRight, Sparkles, AlertTriangle, Layers, 
  CheckCircle2, Compass, ShieldCheck, ChevronRight,
  TrendingUp, Activity, Terminal, Cpu, Database, Award,
  Cpu as Microchip, Lightbulb, MapPin, Skull
} from 'lucide-react';
import { IndiaHeroNetwork } from '../components/common/IndiaHeroNetwork';
import { ProjectCard } from '../components/common/ProjectCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { useProjects } from '../context/ProjectContext';

export const LandingPage: React.FC = () => {
  const [heroSearch, setHeroSearch] = useState('');
  const [activeDomain, setActiveDomain] = useState('AI/ML');
  const { projects } = useProjects();
  const navigate = useNavigate();

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/explore?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  const domainCategories = [
    { id: 'AI/ML', name: 'AI/ML', icon: '🤖', count: 123 },
    { id: 'Web', name: 'Web', icon: '🌐', count: 76 },
    { id: 'Mobile', name: 'Mobile', icon: '📱', count: 45 },
    { id: 'IoT', name: 'IoT', icon: '📡', count: 98 },
    { id: 'Healthcare', name: 'Healthcare', icon: '❤️', count: 34 },
    { id: 'Agriculture', name: 'Agriculture', icon: '🌱', count: 28 },
    { id: 'Cybersecurity', name: 'Cybersecurity', icon: '🛡️', count: 22 },
    { id: 'Blockchain', name: 'Blockchain', icon: '⛓️', count: 18 },
  ];

  const featuredProjects = projects.filter(p => p.isFeatured || p.rating >= 4.3).slice(0, 4);
  const deadProjectsList = projects.filter(p => p.status === 'Abandoned' || p.status === 'Incomplete' || p.status === 'Paused').slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F8FAFC] w-full">
      
      {/* 1. HERO SECTION (Wide Responsive Layout) */}
      <section className="relative bg-[#0B1020] text-white pt-12 pb-24 overflow-hidden border-b border-slate-800 w-full">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[160px] pointer-events-none" />

        <div className="page-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">
            
            {/* Left Content (7 cols in desktop) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>National Project Intelligence & Research Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.12] text-white">
                Know what exists.<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-200">
                  Learn what failed.
                </span><br />
                Build what's next.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
                A free national platform to discover, compare, learn and manage projects. For students, developers, colleges and innovators across India.
              </p>

              {/* Main Wide Search Bar */}
              <form onSubmit={handleHeroSearch} className="pt-2 max-w-2xl">
                <div className="flex items-center bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/40 transition-all shadow-2xl">
                  <Search className="w-5 h-5 text-purple-300 ml-3 flex-shrink-0" />
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="Search for projects (e.g. RTC, APSRTC, AI attendance, smart farming...)"
                    className="w-full bg-transparent px-3.5 py-2.5 text-sm sm:text-base text-white placeholder:text-slate-400 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-7 py-3 bg-primary hover:bg-primary-hover text-white font-bold text-sm rounded-xl transition-all shadow-md flex-shrink-0"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Statistics Strip */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-slate-800/80 max-w-2xl">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-white">12,840+</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Total Projects</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-emerald-400">7,420</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Completed</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-blue-400">2,810</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">In Progress</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-rose-400">1,730</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Abandoned / Dead</p>
                </div>
              </div>
            </div>

            {/* Right Interactive Visual Graphic (5 cols in desktop) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <IndiaHeroNetwork />
            </div>

          </div>
        </div>
      </section>

      {/* 2. DOMAIN EXPLORATION BAR (Full-width dynamic grid) */}
      <section className="py-10 -mt-8 page-container relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {domainCategories.map((dom) => {
            const isSel = activeDomain === dom.id;
            return (
              <button
                key={dom.id}
                onClick={() => {
                  setActiveDomain(dom.id);
                  navigate(`/explore?domain=${encodeURIComponent(dom.id)}`);
                }}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 group ${
                  isSel
                    ? 'bg-white border-primary shadow-card ring-2 ring-primary/20'
                    : 'bg-white border-surface-border hover:border-primary/40 hover:shadow-subtle'
                }`}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{dom.icon}</span>
                <span className="text-xs font-bold text-dark group-hover:text-primary transition-colors">{dom.name}</span>
                <span className="text-[10px] text-slate-400 font-medium">{dom.count} projects</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. CORE VALUE PROPOSITION: "Why DeadProject?" */}
      <section className="py-16 page-container">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-primary mb-2">
            The Missing Layer in Indian Engineering
          </h2>
          <p className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
            Stop Rebuilding The Same Dead Projects.
          </p>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            Every year, lakhs of Indian engineering students rebuild the exact same attendance systems, weather stations, and chatbots without knowing what already succeeded or where others got stuck.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 rounded-2xl border border-surface-border hover:border-primary/30 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-primary flex items-center justify-center mb-5 font-bold">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-dark mb-2">1. Check Before You Build</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Enter your project idea and instantly find similar Indian college projects, GitHub repos, and existing features to identify genuine innovation gaps.
              </p>
            </div>
            <Link to="/idea-checker" className="text-xs font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all pt-2">
              Test your idea now <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-surface-border hover:border-rose-300 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-5 font-bold">
                <Skull className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-dark mb-2">2. Learn From Failures</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Explore post-mortems of incomplete and abandoned projects. Understand why hardware failed, why budgets ran out, and avoid common technical traps.
              </p>
            </div>
            <Link to="/dead-projects" className="text-xs font-bold text-rose-600 flex items-center gap-1 hover:gap-2 transition-all pt-2">
              Explore Dead Projects <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-surface-border hover:border-indigo-300 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5 font-bold">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-dark mb-2">3. Plan, Team & Manage</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Analyze team skill readiness, evaluate complexity risk scores, and manage sprint tasks with an integrated agile Kanban board.
              </p>
            </div>
            <Link to="/dashboard" className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:gap-2 transition-all pt-2">
              Open Project Workspace <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* 4. FEATURED PROJECTS PREVIEW (Wide Responsive Grid) */}
      <section className="py-16 bg-slate-50/70 border-y border-surface-border w-full">
        <div className="page-container">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Top Verified Submissions</span>
              <h2 className="text-2xl sm:text-3xl font-black text-dark">Trending Projects Across India</h2>
            </div>
            <Link
              to="/explore"
              className="text-sm font-bold text-primary hover:text-primary-hover flex items-center gap-1.5"
            >
              View all 342+ projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProjects.map(proj => (
              <ProjectCard key={proj.id} project={proj} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. DEAD PROJECTS SIGNATURE SHOWCASE (Full-width card) */}
      <section className="py-16 page-container">
        <div className="bg-gradient-to-br from-[#0B1020] to-[#151C33] rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4 mb-10 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
              <Skull className="w-3.5 h-3.5" />
              <span>Signature Feature: Failure Intelligence</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              Dead Projects: Don't Repeat Their Mistakes.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Read transparent technical post-mortems of projects that failed due to sensor drift, ESC motor burnouts, lack of knowledge, or time limits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {deadProjectsList.map(dp => {
              const mainFailure = dp.failureReasons && dp.failureReasons[0];
              return (
                <div key={dp.id} className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 flex flex-col justify-between hover:bg-white/15 transition-all">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h4 className="font-bold text-white text-base truncate">{dp.name}</h4>
                      <StatusBadge status={dp.status} size="sm" />
                    </div>
                    <p className="text-xs text-rose-300 font-semibold mb-1">
                      Reason: {mainFailure?.factor || 'Technical complexity'}
                    </p>
                    <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                      {mainFailure?.description || dp.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{dp.institution}</span>
                    <Link
                      to={`/projects/${dp.id}`}
                      className="text-xs font-bold text-purple-300 hover:text-white flex items-center gap-1"
                    >
                      Read Post-Mortem <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center relative z-10">
            <Link
              to="/dead-projects"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-dark font-bold text-sm rounded-xl hover:bg-slate-100 transition-colors shadow-lg"
            >
              Explore Failure Database <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="py-20 text-center page-container">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
            Ready to build your next breakthrough project?
          </h2>
          <p className="text-slate-600 text-base max-w-xl mx-auto">
            Join thousands of Indian engineering students and researchers using DeadProject to innovate faster with complete clarity.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/explore"
              className="px-8 py-3.5 bg-primary hover:bg-primary-hover text-white font-bold text-sm rounded-xl shadow-card transition-all hover:scale-105"
            >
              Explore Projects
            </Link>
            <Link
              to="/create-project"
              className="px-8 py-3.5 bg-white border border-surface-border hover:border-primary text-dark font-bold text-sm rounded-xl hover:bg-slate-50 transition-all"
            >
              Start a Project
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
