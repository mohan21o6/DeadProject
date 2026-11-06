/**
 * MongoDB / Mongoose Schema for DeadProject Application
 * Supports real dataset ingestion with deduplication and metadata provenance.
 */

export interface IProjectDocument {
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
  status: 'Completed' | 'In Progress' | 'Incomplete' | 'Abandoned' | 'Paused';
  difficulty: 'Beginner' | 'Medium' | 'Hard' | 'Advanced';
  teamSize: number;
  duration: string;
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
  failureReasons?: Array<{
    factor: string;
    title: string;
    description: string;
    lessonsLearned: string[];
    recommendedAlternative: string;
  }>;
  riskAnalysis?: {
    score: number;
    level: string;
    factors: {
      complexity: string;
      time: string;
      cost: string;
      hardware: string;
      skills: string;
    };
    recommendations: string[];
  };
  rating: number;
  reviewCount: number;
  viewCount: number;
  stars: number;
  isVerified?: boolean;
  isFeatured?: boolean;
  
  // Provenance & Metadata
  sourceType: 'demo' | 'external' | 'user';
  source: string;
  externalId?: string;
  importedAt?: Date | string;
  lastSyncedAt?: Date | string;
  license?: string;
  attribution?: string;
  maintenanceSignals?: {
    isArchived?: boolean;
    activityStatus?: 'active' | 'potentially_inactive' | 'archived' | 'unknown';
    lastCommitDate?: string;
    inactivityMonths?: number;
    openIssuesCount?: number;
    hasRecentActivity?: boolean;
    signalNotes?: string;
  };
  verifiedFailureDetails?: boolean;

  createdBy: {
    id: string;
    name: string;
    avatar: string;
    institution: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * MongoDB JSON Schema validator definition for direct Mongo collections
 */
export const MongoProjectCollectionSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id", "name", "slug", "description", "domain", "technologies", "status", "sourceType", "source"],
      properties: {
        id: { bsonType: "string", description: "Unique project identifier" },
        name: { bsonType: "string", description: "Normalized project name" },
        slug: { bsonType: "string" },
        description: { bsonType: "string" },
        domain: { bsonType: "string" },
        technologies: { bsonType: "array", items: { bsonType: "string" } },
        status: { enum: ["Completed", "In Progress", "Incomplete", "Abandoned", "Paused"] },
        sourceType: { enum: ["demo", "external", "user"] },
        source: { bsonType: "string" },
        externalId: { bsonType: "string" },
        githubUrl: { bsonType: "string" },
        importedAt: { bsonType: ["string", "date"] },
        lastSyncedAt: { bsonType: ["string", "date"] },
        license: { bsonType: "string" },
        attribution: { bsonType: "string" }
      }
    }
  },
  indexes: [
    { key: { externalId: 1 }, unique: true, sparse: true },
    { key: { githubUrl: 1 }, unique: true, sparse: true },
    { key: { source: 1 } },
    { key: { sourceType: 1 } },
    { key: { status: 1 } },
    { key: { domain: 1 } },
    { key: { technologies: 1 } },
    { key: { acronym: 1 } },
    { 
      key: { 
        name: "text", 
        acronym: "text", 
        description: "text", 
        technologies: "text", 
        keywords: "text", 
        tags: "text", 
        aliases: "text", 
        domain: "text", 
        category: "text", 
        institution: "text", 
        organization: "text" 
      },
      name: "ProjectSearchTextIndex",
      weights: {
        acronym: 15,
        name: 10,
        aliases: 8,
        keywords: 6,
        tags: 5,
        technologies: 4,
        organization: 3,
        institution: 3,
        domain: 2,
        category: 2,
        description: 1
      }
    }
  ]
};
