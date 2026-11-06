import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, Heart, Github, Twitter, Linkedin, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B1020] text-slate-400 border-t border-slate-800 pt-16 pb-12 w-full">
      <div className="page-container">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-black text-lg shadow-md">
                D
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                DeadProject
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              <strong>"Know what exists. Learn what failed. Build what's next."</strong>
              <br />
              India's free national open intelligence & project research platform empowering students, developers, hackathon teams, and researchers.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-primary text-slate-300 hover:text-white flex items-center justify-center transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-primary text-slate-300 hover:text-white flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-primary text-slate-300 hover:text-white flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform Columns */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Discovery</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/explore" className="hover:text-white transition-colors">Explore All Projects</Link></li>
              <li><Link to="/idea-checker" className="hover:text-white transition-colors text-purple-400 font-medium">AI Idea Checker</Link></li>
              <li><Link to="/dead-projects" className="hover:text-white transition-colors">Dead Projects Archive</Link></li>
              <li><Link to="/similar-projects" className="hover:text-white transition-colors">Similar Projects Finder</Link></li>
              <li><Link to="/compare" className="hover:text-white transition-colors">Feature Matrix</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Management</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/create-project" className="hover:text-white transition-colors">Submit a Project</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Project Dashboard</Link></li>
              <li><Link to="/resources" className="hover:text-white transition-colors">Open Datasets & Repos</Link></li>
              <li><Link to="/national-directory" className="hover:text-white transition-colors">National Directory</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors">Admin Moderation</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">About & Legal</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">Platform Vision</Link></li>
              <li><span className="text-slate-500">Zero Cost Architecture</span></li>
              <li><span className="text-slate-500">Open Data Attribution</span></li>
              <li><span className="text-slate-500">Terms of Service</span></li>
              <li><span className="text-slate-500">Privacy Policy</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DeadProject Platform. Built with pride for Indian Innovators.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>National Tech Registry: Operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
