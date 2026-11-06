import { Project } from '../types';

/**
 * DeadProject National Intelligence Search Engine
 * Comprehensive multi-field, acronym-aware, synonym-expanding search & relevance engine.
 */

// Common generic modifiers that should not solely trigger a positive match in multi-word queries
const COMMON_MODIFIERS = new Set([
  'system', 'management', 'based', 'using', 
  'online', 'real', 'time', 'live', 'new', 'app', 'platform', 'tool', 
  'project', 'solution', 'service'
]);

// Verified Domain & Acronym Expansion Dictionary
export const ACRONYM_SYNONYM_MAP: Record<string, string[]> = {
  // Public Transport & Transit Telematics
  'rtc': ['apsrtc', 'tsrtc', 'ksrtc', 'road transport corporation', 'bus transport', 'transit', 'vtc', 'public transit', 'fleet telematics', 'passenger information system', 'transport'],
  'apsrtc': ['rtc', 'andhra pradesh state road transport corporation', 'bus tracking', 'public transit', 'vtc', 'transport'],
  'vtc': ['vehicle tracking controller', 'vehicle tracking', 'rtc', 'transport telematics', 'ais-140', 'public transport', 'transit', 'vehicle transit', 'transport'],
  'tsrtc': ['rtc', 'telangana state road transport corporation', 'bus tracking', 'public transit', 'transport'],
  'ksrtc': ['rtc', 'karnataka state road transport corporation', 'bus tracking', 'public transit', 'transport'],

  // AI, Data Science & Machine Learning
  'ai': ['artificial intelligence', 'machine learning', 'deep learning', 'neural network', 'computer vision', 'nlp', 'llm'],
  'ml': ['machine learning', 'deep learning', 'artificial intelligence', 'ai'],
  'nlp': ['natural language processing', 'text analysis', 'llm', 'ai'],
  'cv': ['computer vision', 'image processing', 'opencv', 'object detection'],

  // Smart Agriculture / Farming
  'smart farming': ['smart agriculture', 'agritech', 'precision agriculture', 'hydroponics', 'precision farming', 'smart farm'],
  'farming': ['agriculture', 'agritech', 'farm', 'hydroponics'],
  'agriculture': ['farming', 'agritech', 'agro', 'hydroponics'],
  'hydroponics': ['smart farming', 'vertical farming', 'nutrient dosing', 'soilless farming', 'agriculture'],

  // Attendance & Biometrics
  'attendance': ['attendance management', 'face attendance', 'biometric attendance', 'roll call', 'attendance tracker', 'smart attendance'],
  'attendance management': ['attendance', 'smart attendance', 'student attendance', 'facial attendance', 'attendance tracking'],
  'biometric': ['face recognition', 'fingerprint', 'attendance', 'rfid'],

  // Tech Stacks & Languages
  'java': ['java', 'spring', 'spring boot', 'jvm', 'jsp'],
  'python': ['python', 'python3', 'py'],
  'iot': ['internet of things', 'embedded', 'sensors', 'arduino', 'raspberry pi', 'esp32', 'mqtt'],
  'ev': ['electric vehicle', 'charging station', 'bms', 'battery management'],
  'vr': ['virtual reality', 'ar', 'three.js', 'virtual classroom', 'augmented reality']
};

export function normalizeText(text?: string | null): string {
  if (!text) return '';
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

export function tokenize(text?: string | null): string[] {
  if (!text) return [];
  return normalizeText(text)
    .split(/[\s,._\-/]+/)
    .map(t => t.trim())
    .filter(t => t.length > 0);
}

export interface SearchMatchResult {
  matches: boolean;
  score: number;
  matchedFields: string[];
}

/**
 * Calculate multi-field relevance score for a project against a search query.
 */
export function scoreProjectSearch(project: Project, rawQuery: string): SearchMatchResult {
  const query = normalizeText(rawQuery);
  if (!query) {
    return { matches: true, score: 1, matchedFields: [] };
  }

  const queryTokens = tokenize(query);
  const matchedFields: string[] = [];

  const pName = normalizeText(project.name);
  const pAcronym = normalizeText(project.acronym);
  const pShort = normalizeText(project.shortName);
  const pDesc = normalizeText(project.description);
  const pDomain = normalizeText(project.domain);
  const pCategory = normalizeText(project.category);
  const pInst = normalizeText(project.institution);
  const pOrg = normalizeText(project.organization);
  const pAliases = (project.aliases || []).map(normalizeText);
  const pKeywords = (project.keywords || []).map(normalizeText);
  const pTags = (project.tags || []).map(normalizeText);
  const pTechs = (project.technologies || []).map(normalizeText);
  const pSkills = (project.requiredSkills || []).map(normalizeText);
  const pIndustries = (project.relatedIndustries || []).map(normalizeText);
  const pAppAreas = (project.applicationAreas || []).map(normalizeText);

  // Set of all distinct normalized tokens present in the project
  const allProjectTokens = new Set<string>([
    ...tokenize(pName),
    ...tokenize(pAcronym),
    ...tokenize(pShort),
    ...tokenize(pDesc),
    ...tokenize(pDomain),
    ...tokenize(pCategory),
    ...tokenize(pInst),
    ...tokenize(pOrg),
    ...pAliases.flatMap(tokenize),
    ...pKeywords.flatMap(tokenize),
    ...pTags.flatMap(tokenize),
    ...pTechs.flatMap(tokenize),
    ...pSkills.flatMap(tokenize),
    ...pIndustries.flatMap(tokenize),
    ...pAppAreas.flatMap(tokenize)
  ]);

  let score = 0;
  let hasDistinctiveMatch = false;

  // 1. Acronym Matching (High priority for queries like 'RTC', 'APSRTC', 'VTC', 'AI')
  if (pAcronym) {
    if (pAcronym === query) {
      score += 260;
      hasDistinctiveMatch = true;
      matchedFields.push('acronym-exact');
    } else if (pAcronym.includes(query) || query.includes(pAcronym)) {
      score += 140;
      hasDistinctiveMatch = true;
      matchedFields.push('acronym-partial');
    }
  }

  // 2. Exact or Distinct Word Match in Title
  if (pName === query) {
    score += 220;
    hasDistinctiveMatch = true;
    matchedFields.push('title-exact');
  } else if (pName.startsWith(query)) {
    score += 160;
    hasDistinctiveMatch = true;
    matchedFields.push('title-prefix');
  } else if (tokenize(pName).includes(query)) {
    score += 140;
    hasDistinctiveMatch = true;
    matchedFields.push('title-word');
  } else if (pName.includes(query) && query.length >= 4) {
    score += 70;
    hasDistinctiveMatch = true;
    matchedFields.push('title-substring');
  }

  // 3. Short Name & Project Aliases
  if (pShort) {
    if (pShort === query) {
      score += 150;
      hasDistinctiveMatch = true;
      matchedFields.push('shortName');
    } else if (tokenize(pShort).includes(query)) {
      score += 120;
      hasDistinctiveMatch = true;
      matchedFields.push('shortName-word');
    }
  }

  for (const alias of pAliases) {
    if (alias === query) {
      score += 170;
      hasDistinctiveMatch = true;
      matchedFields.push('alias-exact');
      break;
    } else if (tokenize(alias).includes(query)) {
      score += 120;
      hasDistinctiveMatch = true;
      matchedFields.push('alias-word');
      break;
    } else if (alias.includes(query) && query.length >= 4) {
      score += 65;
      hasDistinctiveMatch = true;
      matchedFields.push('alias-substring');
      break;
    }
  }

  // 4. Keywords & Tags Matching
  for (const kw of pKeywords) {
    if (kw === query) {
      score += 110;
      hasDistinctiveMatch = true;
      matchedFields.push('keyword-exact');
      break;
    } else if (tokenize(kw).includes(query)) {
      score += 80;
      hasDistinctiveMatch = true;
      matchedFields.push('keyword-word');
      break;
    }
  }

  for (const tag of pTags) {
    if (tag === query) {
      score += 95;
      hasDistinctiveMatch = true;
      matchedFields.push('tag-exact');
      break;
    } else if (tokenize(tag).includes(query)) {
      score += 70;
      hasDistinctiveMatch = true;
      matchedFields.push('tag-word');
      break;
    }
  }

  // 5. Technologies Stack Matching
  for (const tech of pTechs) {
    if (tech === query) {
      score += 100;
      hasDistinctiveMatch = true;
      matchedFields.push('tech-exact');
      break;
    } else if (tokenize(tech).includes(query)) {
      score += 75;
      hasDistinctiveMatch = true;
      matchedFields.push('tech-word');
      break;
    }
  }

  for (const skill of pSkills) {
    if (skill === query) {
      score += 85;
      hasDistinctiveMatch = true;
      matchedFields.push('skill-exact');
      break;
    } else if (tokenize(skill).includes(query)) {
      score += 65;
      hasDistinctiveMatch = true;
      matchedFields.push('skill-word');
      break;
    }
  }

  // 6. Category, Domain, Related Industries & Application Areas
  if (pDomain === query || tokenize(pDomain).includes(query)) {
    score += 65;
    hasDistinctiveMatch = true;
    matchedFields.push('domain');
  }

  if (pCategory === query || tokenize(pCategory).includes(query)) {
    score += 60;
    hasDistinctiveMatch = true;
    matchedFields.push('category');
  }

  for (const ind of pIndustries) {
    if (ind === query || tokenize(ind).includes(query)) {
      score += 55;
      hasDistinctiveMatch = true;
      matchedFields.push('industry');
      break;
    }
  }

  for (const area of pAppAreas) {
    if (area === query || tokenize(area).includes(query)) {
      score += 55;
      hasDistinctiveMatch = true;
      matchedFields.push('applicationArea');
      break;
    }
  }

  // 7. Institution & Organization
  if (pInst === query || tokenize(pInst).includes(query)) {
    score += 55;
    hasDistinctiveMatch = true;
    matchedFields.push('institution');
  }

  if (pOrg === query || tokenize(pOrg).includes(query)) {
    score += 65;
    hasDistinctiveMatch = true;
    matchedFields.push('organization');
  }

  // 8. Description / Overview Matching (distinct word matches)
  if (tokenize(pDesc).includes(query)) {
    score += 40;
    hasDistinctiveMatch = true;
    matchedFields.push('description');
  }

  // 9. Semantic Synonym & Acronym Dictionary Expansion
  const synonyms = ACRONYM_SYNONYM_MAP[query] || [];
  for (const syn of synonyms) {
    if (pAcronym === syn) {
      score += 120;
      hasDistinctiveMatch = true;
      matchedFields.push('synonym-acronym');
    }
    if (tokenize(pName).includes(syn) || pName === syn) {
      score += 90;
      hasDistinctiveMatch = true;
      matchedFields.push('synonym-name');
    }
    if (pKeywords.includes(syn) || pTags.includes(syn)) {
      score += 80;
      hasDistinctiveMatch = true;
      matchedFields.push('synonym-tag');
    }
    for (const alias of pAliases) {
      if (tokenize(alias).includes(syn) || alias === syn) {
        score += 75;
        hasDistinctiveMatch = true;
        matchedFields.push('synonym-alias');
        break;
      }
    }
    if (pTechs.includes(syn) || pSkills.includes(syn)) {
      score += 75;
      hasDistinctiveMatch = true;
      matchedFields.push('synonym-tech');
    }
  }

  // 10. Multi-Token Query Evaluation (e.g. 'Smart Farming', 'Attendance Management')
  if (queryTokens.length > 1) {
    // Check if the full phrase matches as an alias, keyword, category, or title
    const queryFull = query;
    if (pAliases.includes(queryFull) || pKeywords.includes(queryFull) || pTags.includes(queryFull) || pName.includes(queryFull)) {
      score += 220;
      hasDistinctiveMatch = true;
      matchedFields.push('multi-token-phrase');
    } else {
      const distinctiveTokens = queryTokens.filter(t => !COMMON_MODIFIERS.has(t));
      const tokensToCheck = distinctiveTokens.length > 0 ? distinctiveTokens : queryTokens;

      let matchedDistinctive = 0;
      for (const dt of tokensToCheck) {
        const syns = ACRONYM_SYNONYM_MAP[dt] || [];
        const hasDirect = allProjectTokens.has(dt);
        const hasSyn = syns.some(s => allProjectTokens.has(s));
        if (hasDirect || hasSyn) {
          matchedDistinctive++;
        }
      }

      // Require all distinctive tokens to match for a multi-word search to be valid
      if (matchedDistinctive === tokensToCheck.length) {
        score += 190;
        hasDistinctiveMatch = true;
        matchedFields.push('multi-token-complete');
      }
    }
  }

  return {
    matches: hasDistinctiveMatch && score > 0,
    score,
    matchedFields
  };
}

export interface ProjectFilterOptions {
  search?: string;
  domain?: string;
  tech?: string;
  status?: string;
  difficulty?: string;
  state?: string;
  source?: string;
  institution?: string;
  sortBy?: 'relevance' | 'newest' | 'stars' | 'views';
}

/**
 * Filter, search, and sort a list of projects with relevance ranking.
 */
export function searchAndFilterProjects(
  projects: Project[],
  options: ProjectFilterOptions
): { projects: Project[]; total: number } {
  const {
    search = '',
    domain = 'All',
    tech = 'All',
    status = 'All',
    difficulty = 'All',
    state = 'All',
    source = 'All',
    institution = 'All',
    sortBy = 'relevance'
  } = options;

  let results: Array<{ project: Project; score: number }> = [];

  const rawQuery = search.trim();

  for (const project of projects) {
    // 1. Domain Filter
    if (domain !== 'All' && project.domain.toLowerCase() !== domain.toLowerCase()) {
      continue;
    }

    // 2. Technology Filter
    if (tech !== 'All') {
      const hasTech = project.technologies?.some(t => t.toLowerCase() === tech.toLowerCase());
      if (!hasTech) continue;
    }

    // 3. Status Filter
    if (status !== 'All' && project.status.toLowerCase() !== status.toLowerCase()) {
      continue;
    }

    // 4. Difficulty Filter
    if (difficulty !== 'All' && project.difficulty.toLowerCase() !== difficulty.toLowerCase()) {
      continue;
    }

    // 5. State / Location Filter (Crucial for India map click interaction)
    if (state !== 'All' && project.state.toLowerCase() !== state.toLowerCase()) {
      continue;
    }

    // 6. Source Filter
    if (source !== 'All' && project.source.toLowerCase() !== source.toLowerCase()) {
      continue;
    }

    // 7. Institution Filter
    if (institution !== 'All' && project.institution.toLowerCase() !== institution.toLowerCase()) {
      continue;
    }

    // 8. Search Relevance Scoring
    if (rawQuery) {
      const matchRes = scoreProjectSearch(project, rawQuery);
      if (matchRes.matches) {
        results.push({ project, score: matchRes.score });
      }
    } else {
      results.push({ project, score: 1 });
    }
  }

  // Sort results
  if (rawQuery && sortBy === 'relevance') {
    results.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if ((b.project.stars || 0) !== (a.project.stars || 0)) {
        return (b.project.stars || 0) - (a.project.stars || 0);
      }
      return (b.project.rating || 0) - (a.project.rating || 0);
    });
  } else if (sortBy === 'newest') {
    results.sort((a, b) => new Date(b.project.createdAt || 0).getTime() - new Date(a.project.createdAt || 0).getTime());
  } else if (sortBy === 'stars') {
    results.sort((a, b) => (b.project.stars || 0) - (a.project.stars || 0));
  } else if (sortBy === 'views') {
    results.sort((a, b) => (b.project.viewCount || 0) - (a.project.viewCount || 0));
  } else {
    results.sort((a, b) => b.score - a.score);
  }

  return {
    projects: results.map(r => r.project),
    total: results.length
  };
}
