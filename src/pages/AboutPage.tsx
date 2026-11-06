import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Globe, Heart, ShieldCheck, ArrowRight, Lightbulb, Users } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="page-container space-y-12">
        
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-primary text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platform Manifesto</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-dark tracking-tight leading-tight">
            Know what exists.<br />
            <span className="text-primary">Learn what failed.</span><br />
            Build what's next.
          </h1>
          <p className="text-slate-600 text-base max-w-2xl mx-auto leading-relaxed">
            DeadProject is India's first open project intelligence repository and sprint planning engine created to eliminate redundant college engineering projects.
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-subtle space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-primary flex items-center justify-center font-bold mb-3">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-dark">100% Free-First Architecture</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Engineered with zero expensive closed-source dependencies, enabling any university student in India to research, fork, and manage projects without financial barriers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-subtle space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold mb-3">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-dark">Failure as First-Class Intelligence</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We treat abandoned hardware builds, sensor drift issues, and scope creep post-mortems as essential learning assets rather than hidden embarrassment.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 rounded-3xl bg-[#0B1020] text-white text-center space-y-4 shadow-xl">
          <h2 className="text-2xl font-bold">Start exploring Indian projects today</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Discover verified architectures, review datasets, and build solutions that truly move Indian engineering forward.
          </p>
          <div className="pt-2">
            <Link to="/explore" className="px-6 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md transition-all inline-block">
              Explore All Projects
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
