export type ProjectStatus = 'Completed' | 'In Progress' | 'Incomplete' | 'Abandoned' | 'Paused';
export type ProjectDifficulty = 'Beginner' | 'Medium' | 'Hard' | 'Advanced';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'TESTING' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ResourceType = 'GitHub' | 'YouTube' | 'Live Demo' | 'Documentation' | 'Dataset' | 'Research Paper' | 'Tutorial';
export type ProjectSourceType = 'demo' | 'external' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'developer' | 'mentor' | 'admin' | 'researcher';
  institution: string;
  state: string;
  city: string;
  avatar: string;
  bio?: string;
  skills: string[];
  savedProjects: string[];
  createdAt: string;
}

export interface FailureDetail {
  factor: 'Time' | 'Technical complexity' | 'Hardware' | 'Budget' | 'Team' | 'Skills' | 'Planning' | 'Market fit' | 'Lack of knowledge' | 'Regulatory';
  title: string;
  description: string;
  lessonsLearned: string[];
  recommendedAlternative: string;
}

export interface RiskFactorBreakdown {
  complexity: 'Low' | 'Medium' | 'High';
  time: 'Low' | 'Medium' | 'High';
  cost: 'Low' | 'Medium' | 'High';
  hardware: 'Low' | 'Medium' | 'High';
  skills: 'Low' | 'Medium' | 'High';
}

export interface RiskAnalysis {
  score: number; // 0 - 100
  level: RiskLevel;
  factors: RiskFactorBreakdown;
  recommendations: string[];
}

export interface ProjectImage {
  url: string;
  caption?: string;
  isPrimary?: boolean;
}

export interface MaintenanceSignals {
  isArchived?: boolean;
  activityStatus?: 'active' | 'potentially_inactive' | 'archived' | 'unknown';
  lastCommitDate?: string;
  inactivityMonths?: number;
  openIssuesCount?: number;
  hasRecentActivity?: boolean;
  signalNotes?: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  acronym?: string;
  shortName?: string;
  aliases?: string[];
  keywords?: string[];
  tags?: string[];
  organization?: string;
  relatedIndustries?: string[];
  applicationAreas?: string[];
  description: string;
  problemStatement?: string;
  objective?: string;
  domain: string;
  category: string;
  technologies: string[];
  features: string[];
  status: ProjectStatus;
  difficulty: ProjectDifficulty;
  teamSize: number;
  duration: string; // e.g., "6 Weeks", "3 Months"
  year: number;
  state: string;
  city: string;
  institution: string;
  requiredSkills: string[];
  hardwareRequirements?: string[];
  softwareRequirements?: string[];
  images: string[];
  githubUrl?: string;
  youtubeUrl?: string;
  liveDemoUrl?: string;
  documentationUrl?: string;
  datasetUrl?: string;
  researchPaperUrl?: string;
  failureReasons?: FailureDetail[];
  riskAnalysis?: RiskAnalysis;
  rating: number;
  reviewCount: number;
  viewCount: number;
  stars: number;
  similarityScore?: number;
  isVerified?: boolean;
  isFeatured?: boolean;
  
  // Provenance & External Dataset Metadata
  sourceType: ProjectSourceType;
  source: string; // 'Demo Data', 'Zenodo (ESEM 2018)', 'Project Tracker', 'GitHub REST API', 'User Submission'
  externalId?: string; // Stable ID for deduplication
  importedAt?: string; // ISO date of initial import
  lastSyncedAt?: string; // ISO date of last synchronization
  license?: string; // 'CC BY 4.0', 'CC0 1.0', 'MIT', etc.
  attribution?: string; // Attribution and citation compliance
  maintenanceSignals?: MaintenanceSignals; // Inactivity signals without false failure claims
  verifiedFailureDetails?: boolean; // True only when supported by source data or verified user submission

  createdBy: {
    id: string;
    name: string;
    avatar: string;
    institution: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userInstitution: string;
  rating: number;
  comment: string;
  helpfulCount: number;
  unhelpfulCount: number;
  date: string;
  userVote?: 'helpful' | 'unhelpful';
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: {
    name: string;
    avatar: string;
  };
  dueDate?: string;
  tags?: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
  skills: string[];
}

export interface FeatureComparisonItem {
  feature: string;
  description: string;
  opportunityRate?: number;
  insight?: string;
  availability: Record<string, 'AVAILABLE' | 'NOT_AVAILABLE' | 'PARTIAL'>;
}

export interface ResourceItem {
  id: string;
  title: string;
  type: ResourceType;
  projectId: string;
  projectName: string;
  domain: string;
  url: string;
  description: string;
  stars?: number;
  author?: string;
  language?: string;
}

export interface IdeaCheckResult {
  projectName: string;
  similarityScore: number;
  riskScore: number;
  riskLevel: RiskLevel;
  similarProjects: Array<{
    id: string;
    name: string;
    similarity: number;
    status: ProjectStatus;
    domain: string;
    stars: number;
  }>;
  existingCommonFeatures: string[];
  rareOrMissingFeatures: string[];
  recommendations: string[];
  skillGaps: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'review' | 'task';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalProjects: number;
  completedProjects: number;
  inProgressProjects: number;
  incompleteProjects: number;
  abandonedProjects: number;
  pendingReviewProjects: number;
  reportedItems: number;
  totalViews: number;
  domainBreakdown: { name: string; count: number; percentage: number }[];
  failureBreakdown: { reason: string; count: number; percentage: number }[];
  sourceBreakdown?: { source: string; count: number; percentage: number }[];
}
