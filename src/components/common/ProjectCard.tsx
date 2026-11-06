import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Eye, Bookmark, GitFork, ArrowRight, ShieldAlert, Archive, Database, UserCheck, Sparkles, Building2 } from 'lucide-react';
import { Project } from '../../types';
import { StatusBadge } from './StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../context/ProjectContext';

interface ProjectCardProps {
  project: Project;
  showSimilarity?: boolean;
  showCompareToggle?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  showSimilarity = false,
  showCompareToggle = true
}) => {
  const { toggleSaveProject, isProjectSaved } = useAuth();
  const { selectedComparisonIds, toggleCompareProject } = useProjects();

  const isSaved = isProjectSaved(project.id);
  const isCompared = selectedComparisonIds.includes(project.id);

  // Distinct Provenance Badge Styling
  const renderSourceBadge = () => {
    switch (project.sourceType) {
      case 'demo':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200" title="Demonstration showcase project">
            <Sparkles className="w-2.5 h-2.5" />
            Demo
          </span>
        );
      case 'external':
        if (project.source.includes('Zenodo')) {
          return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200" title="Zenodo 1313637 - ESEM 2018 Archived Repository (CC BY 4.0)">
              <Archive className="w-2.5 h-2.5" />
              Zenodo ESEM
            </span>
          );
        }
        if (project.source.includes('Project Tracker')) {
          return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200" title="Project Tracker Dataset (CC0 1.0 Public Domain)">
              <Database className="w-2.5 h-2.5" />
              Project Tracker
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200" title="GitHub REST API Imported Repository">
            <GitFork className="w-2.5 h-2.5" />
            GitHub API
          </span>
        );
      case 'user':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200" title="Community user submitted project">
            <UserCheck className="w-2.5 h-2.5" />
            User Submitted
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-surface-border hover:border-primary/40 shadow-subtle hover:shadow-card-hover transition-all duration-300 p-5 flex flex-col justify-between relative overflow-hidden">
      {/* Top Header Row */}
      <div className="flex items-start gap-4">
        {/* Project Thumbnail */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
          {project.images && project.images[0] ? (
            <img
              src={project.images[0]}
              alt={project.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xl">
              {project.name.charAt(0)}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Title, Techs & Status */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <Link
              to={`/projects/${project.id}`}
              className="text-base sm:text-lg font-bold text-text-primary hover:text-primary transition-colors truncate"
              title={project.name}
            >
              {project.name}
            </Link>
            <button
              onClick={() => toggleSaveProject(project.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                isSaved ? 'text-primary bg-primary-light' : 'text-slate-400 hover:text-primary hover:bg-slate-50'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save project'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Provenance & Domain Tags */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {renderSourceBadge()}
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
              {project.domain}
            </span>
            {project.maintenanceSignals?.activityStatus === 'potentially_inactive' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1" title={project.maintenanceSignals.signalNotes}>
                <ShieldAlert className="w-2.5 h-2.5" />
                Potentially Inactive
              </span>
            )}
            {project.maintenanceSignals?.isArchived && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1" title={project.maintenanceSignals.signalNotes}>
                <Archive className="w-2.5 h-2.5" />
                Archived Repo
              </span>
            )}
          </div>

          {/* Institution / Organization */}
          {(project.institution || project.organization) && (
            <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-2 truncate" title={project.organization || project.institution}>
              <Building2 className="w-3 h-3 text-primary flex-shrink-0" />
              <span className="truncate">{project.organization || project.institution}</span>
            </p>
          )}

          {/* Technology Badges */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {project.technologies.slice(0, 3).map((tech, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 hover:bg-primary-light hover:text-primary transition-colors"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-500">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-text-secondary line-clamp-2 mb-3">
            {project.description}
          </p>
        </div>
      </div>

      {/* Similarity Progress Bar (if enabled) */}
      {showSimilarity && project.similarityScore !== undefined && (
        <div className="my-2 p-2.5 rounded-xl bg-purple-50/70 border border-purple-100 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold text-primary flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Similarity Match
          </span>
          <div className="flex items-center gap-2 flex-1 max-w-[140px]">
            <div className="flex-1 h-2 bg-purple-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${project.similarityScore}%` }}
              />
            </div>
            <span className="text-xs font-bold text-primary">{project.similarityScore}%</span>
          </div>
        </div>
      )}

      {/* Card Footer: Ratings, Status & Actions */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {project.rating > 0 && (
            <div className="flex items-center gap-1 font-semibold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{project.rating}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>{(project.viewCount || 100) > 1000 ? `${((project.viewCount || 100) / 1000).toFixed(1)}k` : project.viewCount}</span>
          </div>
          {project.stars !== undefined && project.stars > 0 && (
            <div className="flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5 text-slate-400" />
              <span>{project.stars}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={project.status} size="sm" />
          
          {showCompareToggle && (
            <button
              onClick={() => toggleCompareProject(project.id)}
              className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                isCompared
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-primary/50'
              }`}
            >
              {isCompared ? 'Comparing ✓' : 'Compare'}
            </button>
          )}

          <Link
            to={`/projects/${project.id}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white transition-all shadow-2xs"
            title="View full project details"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
