import { Project, IdeaCheckResult, RiskAnalysis, RiskLevel, TeamMember, FeatureComparisonItem } from '../types';

/**
 * Tokenize and normalize text into clean unique words
 */
function tokenize(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);
  return new Set(words);
}

/**
 * Calculate Jaccard Similarity between two sets
 */
function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 && setB.size === 0) return 1.0;
  if (setA.size === 0 || setB.size === 0) return 0.0;
  
  let intersectionCount = 0;
  for (const item of setA) {
    if (setB.has(item)) {
      intersectionCount++;
    }
  }
  const unionCount = setA.size + setB.size - intersectionCount;
  return unionCount > 0 ? intersectionCount / unionCount : 0;
}

/**
 * Compute real mathematical similarity between an idea and an existing project
 */
export function calculateSimilarity(
  idea: { name: string; description: string; technologies: string[]; features: string[]; domain?: string },
  project: Project
): number {
  // 1. Text similarity (Name & Description) - weight 35%
  const ideaTokens = tokenize(`${idea.name} ${idea.description}`);
  const projectTokens = tokenize(`${project.name} ${project.description} ${project.problemStatement || ''} ${project.objective || ''}`);
  const textSim = jaccardSimilarity(ideaTokens, projectTokens);

  // 2. Technology overlap - weight 30%
  const ideaTechs = new Set(idea.technologies.map(t => t.toLowerCase().trim()));
  const projectTechs = new Set(project.technologies.map(t => t.toLowerCase().trim()));
  const techSim = jaccardSimilarity(ideaTechs, projectTechs);

  // 3. Features overlap - weight 25%
  const ideaFeatures = tokenize(idea.features.join(' '));
  const projectFeatures = tokenize(project.features.join(' '));
  const featureSim = jaccardSimilarity(ideaFeatures, projectFeatures);

  // 4. Domain match - weight 10%
  let domainMatch = 0;
  if (idea.domain && project.domain) {
    domainMatch = idea.domain.toLowerCase() === project.domain.toLowerCase() ? 1.0 : 0.0;
  } else {
    // If no domain provided, deduce from text
    domainMatch = textSim > 0.3 ? 0.8 : 0.2;
  }

  // Weighted composite score (0 - 100%)
  const compositeScore = (textSim * 0.35) + (techSim * 0.30) + (featureSim * 0.25) + (domainMatch * 0.10);
  
  // Normalize with non-linear scaling for better user-facing distribution
  const normalized = Math.min(Math.round(Math.pow(compositeScore, 0.75) * 100), 98);
  return Math.max(normalized, 12);
}

/**
 * Evaluate Project Risk based on explicit, transparent rule-based metrics
 */
export function calculateProjectRisk(project: {
  technologies: string[];
  hardwareRequirements?: string[];
  teamSize?: number;
  duration?: string;
  difficulty?: string;
  features?: string[];
}): RiskAnalysis {
  let riskScore = 30; // base score

  const hardwareCount = project.hardwareRequirements?.length || 0;
  const isHardwareHeavy = hardwareCount > 0;
  const techCount = project.technologies.length;
  const difficulty = (project.difficulty || 'Medium').toLowerCase();

  // Hardware risk
  let hardwareRisk: 'Low' | 'Medium' | 'High' = 'Low';
  if (hardwareCount > 2) {
    hardwareRisk = 'High';
    riskScore += 22;
  } else if (hardwareCount > 0) {
    hardwareRisk = 'Medium';
    riskScore += 12;
  }

  // Complexity risk
  let complexityRisk: 'Low' | 'Medium' | 'High' = 'Medium';
  if (difficulty === 'advanced' || difficulty === 'hard' || techCount >= 6) {
    complexityRisk = 'High';
    riskScore += 20;
  } else if (difficulty === 'beginner') {
    complexityRisk = 'Low';
    riskScore -= 10;
  }

  // Skills risk
  const advancedTechs = ['solidity', 'ros', 'pytorch', 'cuda', 'lorawan', 'three.js', 'webxr', 'opencv'];
  const hasAdvancedTech = project.technologies.some(t => advancedTechs.includes(t.toLowerCase()));
  let skillsRisk: 'Low' | 'Medium' | 'High' = hasAdvancedTech ? 'High' : 'Medium';
  if (hasAdvancedTech) riskScore += 15;

  // Time risk
  let timeRisk: 'Low' | 'Medium' | 'High' = 'Medium';
  if (project.duration && (project.duration.includes('12') || project.duration.includes('16') || project.duration.includes('Month'))) {
    timeRisk = 'High';
    riskScore += 12;
  }

  // Cost risk
  let costRisk: 'Low' | 'Medium' | 'High' = isHardwareHeavy ? 'High' : 'Low';
  if (costRisk === 'High') riskScore += 10;

  // Clamp risk score to 15 - 95
  const finalScore = Math.min(Math.max(riskScore, 18), 94);

  let level: RiskLevel = 'LOW';
  if (finalScore >= 75) level = 'CRITICAL';
  else if (finalScore >= 60) level = 'HIGH';
  else if (finalScore >= 40) level = 'MEDIUM';

  const recommendations: string[] = [];
  if (finalScore > 65) {
    recommendations.push('Reduce the overall project scope and build a core MVP first.');
  }
  if (isHardwareHeavy) {
    recommendations.push('Use cloud/software simulation (e.g. Wokwi or Gazebo) before purchasing physical hardware.');
  }
  if (skillsRisk === 'High') {
    recommendations.push('Ensure team has prior experience with specialized libraries or add an experienced mentor.');
  }
  if (recommendations.length === 0) {
    recommendations.push('Well scoped project with manageable risk profile. Proceed to sprint planning.');
  }

  return {
    score: finalScore,
    level,
    factors: {
      complexity: complexityRisk,
      time: timeRisk,
      cost: costRisk,
      hardware: hardwareRisk,
      skills: skillsRisk
    },
    recommendations
  };
}

/**
 * Check Idea against entire corpus of projects
 */
export function analyzeIdea(
  idea: { name: string; description: string; technologies: string[]; features: string[]; domain?: string },
  allProjects: Project[]
): IdeaCheckResult {
  // Score every project
  const scored = allProjects.map(p => ({
    id: p.id,
    name: p.name,
    similarity: calculateSimilarity(idea, p),
    status: p.status,
    domain: p.domain,
    stars: p.stars
  }));

  // Sort descending
  scored.sort((a, b) => b.similarity - a.similarity);
  const topSimilar = scored.slice(0, 5);
  const highestSim = topSimilar[0]?.similarity || 45;

  // Canonical feature library
  const standardFeatures = [
    'User Authentication & 2FA',
    'Admin Dashboard & Analytics',
    'Exportable PDF/Excel Reports',
    'Real-time WebSocket Alerts',
    'Mobile Application (Android/iOS)',
    'Automated Email & WhatsApp Notifications',
    'Predictive AI Forecasting',
    'Offline-First Mode & Sync',
    'Role-Based Access Control (RBAC)',
    'Public REST API & Webhooks'
  ];

  const userFeaturesLower = idea.features.map(f => f.toLowerCase());
  
  const existingCommonFeatures: string[] = [];
  const rareOrMissingFeatures: string[] = [];

  standardFeatures.forEach(feat => {
    const featLower = feat.toLowerCase();
    const isProvidedByUser = userFeaturesLower.some(uf => uf.includes(featLower.split(' ')[0]) || featLower.includes(uf));
    
    if (isProvidedByUser) {
      existingCommonFeatures.push(feat);
    } else {
      rareOrMissingFeatures.push(feat);
    }
  });

  const risk = calculateProjectRisk({
    technologies: idea.technologies,
    features: idea.features,
    difficulty: idea.technologies.length > 5 ? 'Hard' : 'Medium'
  });

  const recommendations: string[] = [];
  if (highestSim > 75) {
    recommendations.push(`High overlap detected with existing projects (${topSimilar[0].name} at ${highestSim}%). Focus on innovative differentiators.`);
  }
  if (rareOrMissingFeatures.length > 0) {
    recommendations.push(`Consider adding ${rareOrMissingFeatures.slice(0, 2).join(' and ')} to significantly differentiate your project from college peers.`);
  }
  recommendations.push('Include automated unit tests and an interactive live web demo to stand out in hackathons and job evaluations.');

  return {
    projectName: idea.name || 'Untitled Project Idea',
    similarityScore: highestSim,
    riskScore: risk.score,
    riskLevel: risk.level,
    similarProjects: topSimilar,
    existingCommonFeatures: existingCommonFeatures.length > 0 ? existingCommonFeatures : ['Basic Authentication', 'CRUD Dashboard', 'Local Database'],
    rareOrMissingFeatures: rareOrMissingFeatures.slice(0, 4),
    recommendations,
    skillGaps: idea.technologies.slice(0, 3)
  };
}

/**
 * Calculate Team Readiness Score and Missing Skills
 */
export function calculateTeamReadiness(
  requiredSkills: string[],
  teamMembers: TeamMember[]
): {
  overallReadiness: number;
  skillBreakdown: Array<{ skill: string; coverage: number; status: 'Covered' | 'Partial' | 'Missing'; members: string[] }>;
  recommendations: string[];
} {
  if (requiredSkills.length === 0) {
    return {
      overallReadiness: 100,
      skillBreakdown: [],
      recommendations: ['No special technical skills required for this scope.']
    };
  }

  let totalCoverageSum = 0;
  const breakdown = requiredSkills.map(reqSkill => {
    const reqLower = reqSkill.toLowerCase().trim();
    const matchingMembers: string[] = [];

    teamMembers.forEach(member => {
      const hasSkill = member.skills.some(s => s.toLowerCase().includes(reqLower) || reqLower.includes(s.toLowerCase()));
      if (hasSkill) {
        matchingMembers.push(member.name);
      }
    });

    let coverage = 0;
    let status: 'Covered' | 'Partial' | 'Missing' = 'Missing';

    if (matchingMembers.length >= 2) {
      coverage = 95;
      status = 'Covered';
    } else if (matchingMembers.length === 1) {
      coverage = 80;
      status = 'Covered';
    } else {
      // Check partial related skills
      coverage = 20;
      status = 'Missing';
    }

    totalCoverageSum += coverage;

    return {
      skill: reqSkill,
      coverage,
      status,
      members: matchingMembers
    };
  });

  const overallReadiness = Math.round(totalCoverageSum / requiredSkills.length);

  const missing = breakdown.filter(b => b.status === 'Missing');
  const recommendations: string[] = [];

  if (missing.length > 0) {
    recommendations.push(`Your team is missing expertise in: ${missing.map(m => m.skill).join(', ')}.`);
    recommendations.push(`Add team members proficient in ${missing[0].skill} or allocate 1-2 weeks for foundational tutorials.`);
  } else {
    recommendations.push('Great team readiness! Your current roster has full coverage for all required technical domains.');
  }

  return {
    overallReadiness,
    skillBreakdown: breakdown,
    recommendations
  };
}

/**
 * Generate Comparative Feature Matrix
 */
export function generateFeatureMatrix(
  projects: Project[]
): FeatureComparisonItem[] {
  const canonicalFeatures = [
    { name: 'Face Recognition', desc: 'Real-time biometric vision verification' },
    { name: 'Attendance Tracking', desc: 'Automatic attendance logging and roll-calls' },
    { name: 'Admin Dashboard', desc: 'Comprehensive management controls & role assignment' },
    { name: 'Reports & Analytics', desc: 'Exportable data, charts, and historical trends' },
    { name: 'Mobile App', desc: 'Native or responsive Android/iOS companion application' },
    { name: 'Real-time Alerts', desc: 'WebSocket/SMS/WhatsApp instant push notifications' },
    { name: 'User Authentication', desc: 'Secure JWT, OAuth, or biometric login protection' },
    { name: 'Public REST API', desc: 'Third-party integration endpoints with rate limiting' },
    { name: 'Offline Mode', desc: 'Edge processing capability when internet is down' },
    { name: 'Automated Dosing / Actuators', desc: 'Physical relay triggers and hardware control' }
  ];

  return canonicalFeatures.map(feat => {
    const availability: Record<string, 'AVAILABLE' | 'NOT_AVAILABLE' | 'PARTIAL'> = {};
    let availableCount = 0;

    projects.forEach(p => {
      const featLower = feat.name.toLowerCase();
      const hasFeat = p.features.some(f => f.toLowerCase().includes(featLower) || featLower.includes(f.toLowerCase().split(' ')[0]));
      
      if (hasFeat) {
        availability[p.id] = 'AVAILABLE';
        availableCount++;
      } else {
        // Check partial match in tech stack
        const techMatch = p.technologies.some(t => featLower.includes(t.toLowerCase()));
        if (techMatch) {
          availability[p.id] = 'PARTIAL';
          availableCount += 0.5;
        } else {
          availability[p.id] = 'NOT_AVAILABLE';
        }
      }
    });

    const rate = Math.round((availableCount / (projects.length || 1)) * 100);
    const insight = rate <= 30
      ? `Opportunity: Present in only ${Math.round(availableCount)} of ${projects.length} compared projects.`
      : `Common: Standard baseline feature across ${rate}% of projects.`;

    return {
      feature: feat.name,
      description: feat.desc,
      opportunityRate: rate,
      insight,
      availability
    };
  });
}
