import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Review, Task, ResourceItem, TeamMember, IdeaCheckResult } from '../types';
import {
  INITIAL_COMBINED_PROJECTS,
  COMBINED_TASKS,
  INITIAL_REVIEWS,
  INITIAL_RESOURCES,
  INITIAL_TEAM_MEMBERS,
  DATASET_SOURCES_METADATA,
  DatasetSourceMetadata
} from '../data/combinedProjects';
import { analyzeIdea, calculateProjectRisk, calculateTeamReadiness } from '../utils/analysisEngine';

interface ProjectContextType {
  projects: Project[];
  reviews: Review[];
  tasks: Task[];
  resources: ResourceItem[];
  teamMembers: TeamMember[];
  selectedComparisonIds: string[];
  datasetSources: DatasetSourceMetadata[];
  isBackendConnected: boolean;
  
  // Project actions
  getProjectById: (id: string) => Project | undefined;
  getProjectBySlug: (slug: string) => Project | undefined;
  createProject: (projectData: Partial<Project>) => Project;
  updateProject: (id: string, projectData: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  verifyProject: (id: string) => void;
  importGitHubRepository: (owner: string, repo: string, notes?: string) => Promise<{ success: boolean; message: string; project?: Project }>;
  
  // Reviews
  getProjectReviews: (projectId: string) => Review[];
  addReview: (projectId: string, rating: number, comment: string, user: { name: string; avatar: string; institution: string }) => void;
  voteReview: (reviewId: string, type: 'helpful' | 'unhelpful') => void;
  
  // Tasks
  getProjectTasks: (projectId: string) => Task[];
  addTask: (projectId: string, task: Omit<Task, 'id' | 'projectId'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  
  // Team
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  removeTeamMember: (id: string) => void;
  
  // Comparison
  toggleCompareProject: (projectId: string) => void;
  clearComparison: () => void;
  
  // Idea Checker
  checkIdea: (idea: { name: string; description: string; technologies: string[]; features: string[]; domain?: string }) => IdeaCheckResult;
  createProjectFromIdea: (ideaResult: IdeaCheckResult, ideaData: { name: string; description: string; technologies: string[]; features: string[]; domain: string }) => Project;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('deadproject_projects_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_COMBINED_PROJECTS.length) {
          return parsed;
        }
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_COMBINED_PROJECTS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('deadproject_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_REVIEWS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('deadproject_tasks_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= COMBINED_TASKS.length) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return COMBINED_TASKS;
  });

  const [resources] = useState<ResourceItem[]>(INITIAL_RESOURCES);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
  const [selectedComparisonIds, setSelectedComparisonIds] = useState<string[]>([]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('deadproject_projects_v3', JSON.stringify(projects));
    } catch (e) {
      // ignore storage quota issues with large datasets
    }
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('deadproject_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem('deadproject_tasks_v2', JSON.stringify(tasks));
    } catch (e) {}
  }, [tasks]);

  // Attempt backend health check
  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'online') {
          setIsBackendConnected(true);
        }
      })
      .catch(() => {
        setIsBackendConnected(false);
      });
  }, []);

  const getProjectById = (id: string) => {
    return projects.find(p => p.id === id || p.slug === id);
  };

  const getProjectBySlug = (slug: string) => {
    return projects.find(p => p.slug === slug || p.id === slug);
  };

  const createProject = (projectData: Partial<Project>): Project => {
    const id = 'proj-' + Date.now();
    const newRisk = calculateProjectRisk({
      technologies: projectData.technologies || [],
      hardwareRequirements: projectData.hardwareRequirements,
      teamSize: projectData.teamSize,
      duration: projectData.duration,
      difficulty: projectData.difficulty,
      features: projectData.features
    });

    const newProject: Project = {
      id,
      name: projectData.name || 'Untitled Project',
      slug: (projectData.name || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: projectData.description || 'No description provided.',
      problemStatement: projectData.problemStatement,
      objective: projectData.objective,
      domain: projectData.domain || 'Software',
      category: projectData.category || 'General',
      technologies: projectData.technologies || ['React', 'Node.js'],
      features: projectData.features || ['Core Architecture Prototype'],
      status: projectData.status || 'In Progress',
      difficulty: projectData.difficulty || 'Medium',
      teamSize: projectData.teamSize || 2,
      duration: projectData.duration || '8 Weeks',
      year: projectData.year || new Date().getFullYear(),
      state: projectData.state || 'Maharashtra',
      city: projectData.city || 'Mumbai',
      institution: projectData.institution || 'Indian Institute of Technology',
      requiredSkills: projectData.requiredSkills || projectData.technologies || [],
      hardwareRequirements: projectData.hardwareRequirements || [],
      softwareRequirements: projectData.softwareRequirements || [],
      images: projectData.images && projectData.images.length > 0 ? projectData.images : [
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
      ],
      githubUrl: projectData.githubUrl || '',
      youtubeUrl: projectData.youtubeUrl || '',
      liveDemoUrl: projectData.liveDemoUrl || '',
      documentationUrl: projectData.documentationUrl || '',
      rating: 0,
      reviewCount: 0,
      viewCount: 1,
      stars: 1,
      riskAnalysis: newRisk,
      
      // Provenance
      sourceType: 'user',
      source: 'User Submission',
      importedAt: new Date().toISOString(),
      lastSyncedAt: new Date().toISOString(),
      license: 'User Submitted',
      attribution: 'Registered by user on DeadProject',
      verifiedFailureDetails: Boolean(projectData.failureReasons && projectData.failureReasons.length > 0),
      failureReasons: projectData.failureReasons || [],

      createdBy: projectData.createdBy || {
        id: 'u-100',
        name: 'Devansh Reddy',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        institution: 'IIT Madras'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProjects(prev => [newProject, ...prev]);
    return newProject;
  };

  const importGitHubRepository = async (owner: string, repo: string, notes?: string) => {
    // Check duplicates locally first
    const repoUrl = `https://github.com/${owner}/${repo}`.toLowerCase();
    const existing = projects.find(p => p.githubUrl && p.githubUrl.toLowerCase() === repoUrl);
    if (existing) {
      return {
        success: false,
        message: `Repository ${owner}/${repo} already exists in DeadProject.`,
        project: existing
      };
    }

    try {
      // Call backend endpoint (GitHub API called via backend, not directly from frontend)
      const res = await fetch('http://localhost:5000/api/github/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner, repo, customNotes: notes })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Backend responded with status ${res.status}`);
      }

      const data = await res.json();
      if (data.project) {
        setProjects(prev => [data.project, ...prev]);
        return {
          success: true,
          message: `Successfully imported ${owner}/${repo} into DeadProject with maintenance signals.`,
          project: data.project
        };
      }
      throw new Error('No project payload returned from backend.');
    } catch (err: any) {
      return {
        success: false,
        message: `Backend GitHub import failed: ${err.message}`
      };
    }
  };

  const updateProject = (id: string, projectData: Partial<Project>) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, ...projectData, updatedAt: new Date().toISOString() };
      }
      return p;
    }));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const verifyProject = (id: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) return { ...p, isVerified: true };
      return p;
    }));
  };

  const getProjectReviews = (projectId: string) => {
    return reviews.filter(r => r.projectId === projectId);
  };

  const addReview = (
    projectId: string,
    rating: number,
    comment: string,
    user: { name: string; avatar: string; institution: string }
  ) => {
    const newRev: Review = {
      id: 'rev-' + Date.now(),
      projectId,
      userId: 'u-' + Date.now(),
      userName: user.name || 'Anonymous Innovator',
      userAvatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      userInstitution: user.institution || 'Indian Tech University',
      rating,
      comment,
      helpfulCount: 0,
      unhelpfulCount: 0,
      date: 'Just now'
    };

    setReviews(prev => [newRev, ...prev]);

    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const projectReviews = [...getProjectReviews(projectId), newRev];
        const avg = projectReviews.reduce((acc, curr) => acc + curr.rating, 0) / projectReviews.length;
        return {
          ...p,
          rating: Number(avg.toFixed(1)),
          reviewCount: projectReviews.length
        };
      }
      return p;
    }));
  };

  const voteReview = (reviewId: string, type: 'helpful' | 'unhelpful') => {
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        if (type === 'helpful') {
          return { ...r, helpfulCount: r.helpfulCount + 1, userVote: 'helpful' };
        } else {
          return { ...r, unhelpfulCount: r.unhelpfulCount + 1, userVote: 'unhelpful' };
        }
      }
      return r;
    }));
  };

  const getProjectTasks = (projectId: string) => {
    return tasks.filter(t => t.projectId === projectId);
  };

  const addTask = (projectId: string, taskData: Omit<Task, 'id' | 'projectId'>) => {
    const newTask: Task = {
      id: 'task-' + Date.now(),
      projectId,
      ...taskData
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) return { ...t, ...updates };
      return t;
    }));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const addTeamMember = (member: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      id: 'tm-' + Date.now(),
      ...member
    };
    setTeamMembers(prev => [...prev, newMember]);
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  const toggleCompareProject = (projectId: string) => {
    setSelectedComparisonIds(prev => {
      if (prev.includes(projectId)) {
        return prev.filter(id => id !== projectId);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), projectId];
      }
      return [...prev, projectId];
    });
  };

  const clearComparison = () => {
    setSelectedComparisonIds([]);
  };

  const checkIdea = (idea: { name: string; description: string; technologies: string[]; features: string[]; domain?: string }) => {
    return analyzeIdea(idea, projects);
  };

  const createProjectFromIdea = (
    ideaResult: IdeaCheckResult,
    ideaData: { name: string; description: string; technologies: string[]; features: string[]; domain: string }
  ): Project => {
    return createProject({
      name: ideaData.name,
      description: ideaData.description,
      domain: ideaData.domain,
      technologies: ideaData.technologies,
      features: [...ideaData.features, ...ideaResult.rareOrMissingFeatures.slice(0, 2)],
      difficulty: ideaResult.riskLevel === 'HIGH' || ideaResult.riskLevel === 'CRITICAL' ? 'Hard' : 'Medium',
      status: 'In Progress'
    });
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        reviews,
        tasks,
        resources,
        teamMembers,
        selectedComparisonIds,
        datasetSources: DATASET_SOURCES_METADATA,
        isBackendConnected,
        getProjectById,
        getProjectBySlug,
        createProject,
        updateProject,
        deleteProject,
        verifyProject,
        importGitHubRepository,
        getProjectReviews,
        addReview,
        voteReview,
        getProjectTasks,
        addTask,
        updateTask,
        deleteTask,
        addTeamMember,
        removeTeamMember,
        toggleCompareProject,
        clearComparison,
        checkIdea,
        createProjectFromIdea
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
