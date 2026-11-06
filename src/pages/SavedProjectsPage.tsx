import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { ProjectCard } from '../components/common/ProjectCard';

export const SavedProjectsPage: React.FC = () => {
  const { user } = useAuth();
  const { projects } = useProjects();

  const savedProjectsList = projects.filter(p => user?.savedProjects.includes(p.id));

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="page-container space-y-6">
        <div>
          <h1 className="text-3xl font-black text-dark tracking-tight">Saved Projects</h1>
          <p className="text-sm text-slate-500 mt-1">Bookmarked research projects for inspiration and reference.</p>
        </div>

        {savedProjectsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProjectsList.map(p => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-surface-border p-12 text-center space-y-3">
            <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-dark">No saved projects yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click the bookmark icon on any project card in Explorer to save it to your library.
            </p>
            <Link to="/explore" className="inline-block px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl">
              Explore Projects
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
