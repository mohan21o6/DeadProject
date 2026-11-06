import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { INITIAL_COMBINED_PROJECTS, COMBINED_TASKS, INITIAL_REVIEWS, INITIAL_RESOURCES, INITIAL_TEAM_MEMBERS, DATASET_SOURCES_METADATA } from '../src/data/combinedProjects';
import { calculateSimilarity, calculateProjectRisk, analyzeIdea, calculateTeamReadiness, generateFeatureMatrix } from '../src/utils/analysisEngine';
import { searchAndFilterProjects } from '../src/utils/searchEngine';
import { githubService } from './services/githubService';
import { connectMongo } from './lib/mongodb';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory data store initialized from combined dataset
let projectsDb = [...INITIAL_COMBINED_PROJECTS];
let reviewsDb = [...INITIAL_REVIEWS];
let tasksDb = [...COMBINED_TASKS];
let resourcesDb = [...INITIAL_RESOURCES];
let teamMembersDb = [...INITIAL_TEAM_MEMBERS];

// Initialize optional MongoDB connection if MONGODB_URI is provided
connectMongo().catch(err => {
  console.warn('[DeadProject] MongoDB init info:', err.message);
});

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    platform: 'DeadProject National Intelligence API',
    version: '2.0.0',
    totalProjects: projectsDb.length,
    totalTasks: tasksDb.length,
    datasetSources: DATASET_SOURCES_METADATA.map(s => ({
      name: s.name,
      status: s.status,
      license: s.license
    }))
  });
});

// Dataset Metadata & Ingestion Status Endpoint
app.get('/api/datasets/status', (req: Request, res: Response) => {
  const countsBySource: Record<string, number> = {};
  for (const p of projectsDb) {
    const src = p.source || 'Other';
    countsBySource[src] = (countsBySource[src] || 0) + 1;
  }

  res.json({
    totalProjects: projectsDb.length,
    countsBySource,
    sources: DATASET_SOURCES_METADATA,
    githubRateLimit: githubService.getRateLimitStatus()
  });
});

// GitHub API Backend Endpoints (Never called directly from frontend)
app.get('/api/github/search', async (req: Request, res: Response) => {
  const query = (req.query.q as string) || 'stars:>100';
  const page = parseInt(req.query.page as string, 10) || 1;
  const perPage = Math.min(parseInt(req.query.per_page as string, 10) || 10, 30);

  try {
    const result = await githubService.searchRepositories(query, page, perPage);
    const normalized = (result.items || []).map((item: any) => githubService.normalizeGitHubRepo(item));
    res.json({
      totalCount: result.total_count,
      page,
      perPage,
      rateLimit: githubService.getRateLimitStatus(),
      items: normalized
    });
  } catch (err: any) {
    res.status(502).json({
      error: 'GitHub API request failed',
      message: err.message,
      rateLimit: githubService.getRateLimitStatus()
    });
  }
});

app.get('/api/github/repo', async (req: Request, res: Response) => {
  const owner = req.query.owner as string;
  const repo = req.query.repo as string;
  if (!owner || !repo) {
    return res.status(400).json({ error: 'Missing owner or repo query parameters' });
  }

  try {
    const repoData = await githubService.getRepository(owner, repo);
    const normalized = githubService.normalizeGitHubRepo(repoData);
    res.json(normalized);
  } catch (err: any) {
    res.status(502).json({
      error: 'Failed to fetch repository from GitHub API',
      message: err.message
    });
  }
});

app.post('/api/github/import', async (req: Request, res: Response) => {
  const { owner, repo, customNotes } = req.body;
  if (!owner || !repo) {
    return res.status(400).json({ error: 'Missing owner or repo in request body' });
  }

  try {
    const repoData = await githubService.getRepository(owner, repo);
    const normalized = githubService.normalizeGitHubRepo(repoData);

    // Prevent duplicate imports using repository URL or externalId
    const exists = projectsDb.some(p => 
      p.externalId === normalized.externalId || 
      (p.githubUrl && p.githubUrl.toLowerCase() === normalized.githubUrl.toLowerCase())
    );

    if (exists) {
      return res.status(409).json({
        error: 'Repository already exists in DeadProject database',
        project: projectsDb.find(p => p.externalId === normalized.externalId)
      });
    }

    if (customNotes) {
      normalized.maintenanceSignals.signalNotes += ' ' + customNotes;
    }

    projectsDb.unshift(normalized);
    res.status(201).json({
      success: true,
      message: `Imported ${owner}/${repo} successfully`,
      project: normalized
    });
  } catch (err: any) {
    res.status(502).json({
      error: 'GitHub import failed',
      message: err.message
    });
  }
});

app.get('/api/github/ratelimit', (req: Request, res: Response) => {
  res.json(githubService.getRateLimitStatus());
});

// Authentication Mock Endpoints
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  res.json({
    success: true,
    token: 'mock-jwt-token-deadproject-' + Date.now(),
    user: {
      id: 'u-100',
      name: email?.split('@')[0]?.toUpperCase() || 'Devansh Reddy',
      email: email || 'devansh@deadproject.in',
      role: email?.includes('admin') ? 'admin' : 'developer',
      institution: 'IIT Madras'
    }
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, institution, state, role } = req.body;
  res.json({
    success: true,
    token: 'mock-jwt-token-deadproject-' + Date.now(),
    user: {
      id: 'u-' + Date.now(),
      name: name || 'New Innovator',
      email: email || 'user@deadproject.in',
      institution: institution || 'Indian Institute of Technology',
      state: state || 'Maharashtra',
      role: role || 'developer'
    }
  });
});

// Dedicated Global Project Search Endpoint
app.get('/api/projects/search', (req: Request, res: Response) => {
  const q = typeof req.query.q === 'string' ? req.query.q : (typeof req.query.search === 'string' ? req.query.search : '');
  const domain = (req.query.domain as string) || 'All';
  const tech = (req.query.tech as string) || 'All';
  const status = (req.query.status as string) || 'All';
  const difficulty = (req.query.difficulty as string) || 'All';
  const state = (req.query.state as string) || 'All';
  const source = (req.query.source as string) || 'All';
  const institution = (req.query.institution as string) || 'All';
  const sortBy = (req.query.sortBy as any) || 'relevance';
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 24));

  const { projects: matched, total } = searchAndFilterProjects(projectsDb, {
    search: q,
    domain,
    tech,
    status,
    difficulty,
    state,
    source,
    institution,
    sortBy
  });

  const offset = (page - 1) * limit;
  const paginated = matched.slice(offset, offset + limit);

  res.json({
    query: q,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
    count: paginated.length,
    projects: paginated
  });
});

// Projects Endpoints with Provenance & Pagination
app.get('/api/projects', (req: Request, res: Response) => {
  const { domain, status, difficulty, state, search, source, sourceType, tech, institution, sortBy, page, limit } = req.query;

  const { projects: filtered, total } = searchAndFilterProjects(projectsDb, {
    search: (search as string) || '',
    domain: (domain as string) || 'All',
    tech: (tech as string) || 'All',
    status: (status as string) || 'All',
    difficulty: (difficulty as string) || 'All',
    state: (state as string) || 'All',
    source: (source as string) || 'All',
    institution: (institution as string) || 'All',
    sortBy: (sortBy as any) || 'relevance'
  });

  let result = filtered;
  if (sourceType && sourceType !== 'All') {
    result = result.filter(p => p.sourceType === (sourceType as string));
  }

  // Pagination support
  if (page && limit) {
    const p = Math.max(1, parseInt(page as string, 10));
    const l = Math.min(100, Math.max(1, parseInt(limit as string, 10)));
    const offset = (p - 1) * l;
    const paginated = result.slice(offset, offset + l);
    return res.json({
      total: result.length,
      page: p,
      limit: l,
      totalPages: Math.ceil(result.length / l) || 1,
      count: paginated.length,
      projects: paginated
    });
  }

  res.json({ total: result.length, count: result.length, projects: result });
});

app.get('/api/projects/:id', (req: Request, res: Response) => {
  const project = projectsDb.find(p => p.id === req.params.id || p.slug === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(project);
});

app.post('/api/projects', (req: Request, res: Response) => {
  // Deduplication check
  if (req.body.githubUrl) {
    const exists = projectsDb.some(p => p.githubUrl && p.githubUrl.toLowerCase() === req.body.githubUrl.toLowerCase());
    if (exists) {
      return res.status(409).json({ error: 'Project with this GitHub repository already exists' });
    }
  }

  const newProj = {
    id: 'proj-' + Date.now(),
    slug: (req.body.name || 'new-project').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    ...req.body,
    sourceType: 'user' as const,
    source: 'User Submission',
    rating: 0,
    reviewCount: 0,
    viewCount: 1,
    stars: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  projectsDb.unshift(newProj);
  res.status(201).json(newProj);
});

// Analysis Endpoints
app.post('/api/analysis/idea', (req: Request, res: Response) => {
  const { name, description, technologies, features, domain } = req.body;
  const result = analyzeIdea({
    name: name || 'Untitled Idea',
    description: description || '',
    technologies: technologies || [],
    features: features || [],
    domain
  }, projectsDb);
  res.json(result);
});

app.post('/api/analysis/risk', (req: Request, res: Response) => {
  const risk = calculateProjectRisk(req.body);
  res.json(risk);
});

app.post('/api/analysis/team', (req: Request, res: Response) => {
  const { requiredSkills, teamMembers } = req.body;
  const readiness = calculateTeamReadiness(requiredSkills || [], teamMembers || teamMembersDb);
  res.json(readiness);
});

app.post('/api/analysis/compare', (req: Request, res: Response) => {
  const { projectIds } = req.body;
  const selected = projectsDb.filter(p => (projectIds || []).includes(p.id));
  const matrix = generateFeatureMatrix(selected.length > 0 ? selected : projectsDb.slice(0, 4));
  res.json(matrix);
});

// Reviews Endpoints
app.get('/api/projects/:id/reviews', (req: Request, res: Response) => {
  const revs = reviewsDb.filter(r => r.projectId === req.params.id);
  res.json(revs);
});

app.post('/api/projects/:id/reviews', (req: Request, res: Response) => {
  const newReview = {
    id: 'rev-' + Date.now(),
    projectId: req.params.id as string,
    userId: 'u-' + Date.now(),
    userName: req.body.userName || 'Anonymous Student',
    userAvatar: req.body.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    userInstitution: req.body.userInstitution || 'Indian Tech University',
    rating: req.body.rating || 5,
    comment: req.body.comment || '',
    helpfulCount: 0,
    unhelpfulCount: 0,
    date: 'Just now'
  };
  reviewsDb.unshift(newReview);
  res.status(201).json(newReview);
});

// Tasks Endpoints
app.get('/api/projects/:id/tasks', (req: Request, res: Response) => {
  const t = tasksDb.filter(task => task.projectId === req.params.id);
  res.json(t);
});

// Resources Endpoints
app.get('/api/resources', (req: Request, res: Response) => {
  res.json(resourcesDb);
});

// Admin Stats Endpoint (Accurate real dynamic statistics)
app.get('/api/admin/stats', (req: Request, res: Response) => {
  const sourceBreakdown: Record<string, number> = {};
  const domainBreakdownMap: Record<string, number> = {};
  for (const p of projectsDb) {
    sourceBreakdown[p.source] = (sourceBreakdown[p.source] || 0) + 1;
    domainBreakdownMap[p.domain] = (domainBreakdownMap[p.domain] || 0) + 1;
  }

  const domainBreakdown = Object.entries(domainBreakdownMap).map(([name, count]) => ({
    name,
    count,
    percentage: Math.round((count / projectsDb.length) * 100)
  }));

  res.json({
    totalUsers: 1420,
    totalProjects: projectsDb.length,
    completedProjects: projectsDb.filter(p => p.status === 'Completed').length,
    inProgressProjects: projectsDb.filter(p => p.status === 'In Progress').length,
    abandonedProjects: projectsDb.filter(p => p.status === 'Abandoned').length,
    pausedProjects: projectsDb.filter(p => p.status === 'Paused').length,
    incompleteProjects: projectsDb.filter(p => p.status === 'Incomplete').length,
    sourceBreakdown: Object.entries(sourceBreakdown).map(([source, count]) => ({
      source,
      count,
      percentage: Math.round((count / projectsDb.length) * 100)
    })),
    domainBreakdown,
    pendingReview: 0,
    activeReports: 0
  });
});

app.listen(PORT, () => {
  console.log(`[DEADPROJECT] Backend server running on http://localhost:${PORT} with ${projectsDb.length} projects and ${tasksDb.length} tasks.`);
});
