/**
 * GitHub REST API Service for DeadProject Backend
 * - Handles authentication via environment variable GITHUB_TOKEN
 * - Implements TTL in-memory caching to protect rate limits
 * - Tracks rate limit headers (x-ratelimit-remaining, x-ratelimit-reset)
 * - Computes maintenance signals without automatically claiming failure
 * - Normalizes data directly into DeadProject schema
 */

export interface GitHubRateLimitInfo {
  limit: number;
  remaining: number;
  resetDate: string;
}

export interface CachedItem<T> {
  data: T;
  cachedAt: number;
  ttlMs: number;
}

class GitHubService {
  private cache = new Map<string, CachedItem<any>>();
  private defaultTtlMs = 15 * 60 * 1000; // 15 minutes cache
  private rateLimitInfo: GitHubRateLimitInfo = {
    limit: 60,
    remaining: 60,
    resetDate: new Date().toISOString()
  };

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'DeadProject-Intelligence-App/1.0'
    };
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private updateRateLimits(headers: Headers) {
    const limit = headers.get('x-ratelimit-limit');
    const remaining = headers.get('x-ratelimit-remaining');
    const reset = headers.get('x-ratelimit-reset');
    if (limit) this.rateLimitInfo.limit = parseInt(limit, 10);
    if (remaining) this.rateLimitInfo.remaining = parseInt(remaining, 10);
    if (reset) {
      this.rateLimitInfo.resetDate = new Date(parseInt(reset, 10) * 1000).toISOString();
    }
  }

  public getRateLimitStatus(): GitHubRateLimitInfo {
    return { ...this.rateLimitInfo };
  }

  public async fetchWithCache<T>(url: string, ttlMs: number = this.defaultTtlMs): Promise<T> {
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.cachedAt < cached.ttlMs) {
      return cached.data as T;
    }

    try {
      const res = await fetch(url, {
        headers: this.getAuthHeaders()
      });

      this.updateRateLimits(res.headers);

      if (res.status === 403 || res.status === 429) {
        throw new Error(`GitHub API rate limit exceeded or access forbidden. Resets at ${this.rateLimitInfo.resetDate}`);
      }

      if (!res.ok) {
        throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      this.cache.set(url, { data, cachedAt: Date.now(), ttlMs });
      return data;
    } catch (err: any) {
      // Return cached item even if expired when network error occurs
      if (cached) {
        console.warn(`[GitHubService] Network error, serving stale cache for ${url}: ${err.message}`);
        return cached.data as T;
      }
      throw err;
    }
  }

  /**
   * Search public repositories
   */
  public async searchRepositories(query: string, page = 1, perPage = 10) {
    const encoded = encodeURIComponent(query);
    const url = `https://api.github.com/search/repositories?q=${encoded}&page=${page}&per_page=${perPage}&sort=stars&order=desc`;
    return this.fetchWithCache<any>(url);
  }

  /**
   * Get single repository details
   */
  public async getRepository(owner: string, repo: string) {
    const url = `https://api.github.com/repos/${owner}/${repo}`;
    return this.fetchWithCache<any>(url);
  }

  /**
   * Normalize GitHub payload into DeadProject Project Schema
   */
  public normalizeGitHubRepo(repoData: any): any {
    const pushedDate = repoData.pushed_at ? new Date(repoData.pushed_at) : new Date(repoData.updated_at);
    const monthsInactive = Math.max(0, Math.round((Date.now() - pushedDate.getTime()) / (1000 * 60 * 60 * 24 * 30)));
    
    // Maintenance signals evaluation
    const isArchived = Boolean(repoData.archived);
    let activityStatus: 'active' | 'potentially_inactive' | 'archived' = 'active';
    let signalNotes = 'Active commit history within the past 24 months.';

    if (isArchived) {
      activityStatus = 'archived';
      signalNotes = 'Repository is officially archived by its maintainers on GitHub.';
    } else if (monthsInactive >= 24) {
      activityStatus = 'potentially_inactive';
      signalNotes = `No code commits detected in the last ${monthsInactive} months. Repository is potentially inactive (not classified as failed).`;
    }

    // Technology array from language and topics
    const technologies: string[] = [];
    if (repoData.language) technologies.push(repoData.language);
    if (Array.isArray(repoData.topics)) {
      repoData.topics.forEach((t: string) => {
        if (!technologies.includes(t)) technologies.push(t);
      });
    }
    if (technologies.length === 0) technologies.push('Open Source');

    // Rule-based Domain Mapping
    let domain = 'Developer Tools';
    const textCorpus = `${repoData.name} ${repoData.description || ''} ${technologies.join(' ')}`.toLowerCase();
    if (textCorpus.includes('ai') || textCorpus.includes('machine learning') || textCorpus.includes('vision') || textCorpus.includes('llm') || textCorpus.includes('neural')) {
      domain = 'AI/ML';
    } else if (textCorpus.includes('web') || textCorpus.includes('react') || textCorpus.includes('vue') || textCorpus.includes('next') || textCorpus.includes('html') || textCorpus.includes('frontend')) {
      domain = 'Web Development';
    } else if (textCorpus.includes('mobile') || textCorpus.includes('android') || textCorpus.includes('ios') || textCorpus.includes('flutter')) {
      domain = 'Mobile Development';
    } else if (textCorpus.includes('security') || textCorpus.includes('auth') || textCorpus.includes('crypto') || textCorpus.includes('privacy')) {
      domain = 'Cybersecurity';
    } else if (textCorpus.includes('docker') || textCorpus.includes('cloud') || textCorpus.includes('kubernetes') || textCorpus.includes('devops')) {
      domain = 'DevOps & Cloud';
    } else if (textCorpus.includes('iot') || textCorpus.includes('sensor') || textCorpus.includes('arduino') || textCorpus.includes('hardware')) {
      domain = 'IoT & Robotics';
    }

    // Status: Do not classify as failed without evidence
    let status: 'Completed' | 'In Progress' | 'Abandoned' | 'Paused' = 'In Progress';
    if (isArchived) {
      status = 'Abandoned'; // Archived repo per official GitHub flag
    } else if (activityStatus === 'potentially_inactive') {
      status = 'Paused'; // Inactive, NOT failed
    }

    return {
      id: `gh-${repoData.id}`,
      name: repoData.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
      slug: repoData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: repoData.description || `Public repository ${repoData.full_name} on GitHub.`,
      domain,
      category: 'Public Repository',
      technologies,
      features: [
        'Public Version Control',
        `Stars: ${repoData.stargazers_count || 0}`,
        `Forks: ${repoData.forks_count || 0}`,
        `Open Issues: ${repoData.open_issues_count || 0}`
      ],
      status,
      difficulty: 'Medium',
      teamSize: 1,
      duration: 'Ongoing',
      year: new Date(repoData.created_at).getFullYear(),
      state: 'Global',
      city: 'Open Source',
      institution: repoData.owner?.login || 'GitHub Community',
      requiredSkills: technologies.slice(0, 5),
      images: [
        'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=800&q=80'
      ],
      githubUrl: repoData.html_url,
      rating: 0,
      reviewCount: 0,
      viewCount: repoData.watchers_count || 50,
      stars: repoData.stargazers_count || 0,
      
      // Provenance
      sourceType: 'external',
      source: 'GitHub REST API',
      externalId: `github:${repoData.id}`,
      importedAt: new Date().toISOString(),
      lastSyncedAt: new Date().toISOString(),
      license: repoData.license?.spdx_id || repoData.license?.name || 'Open Source',
      attribution: `GitHub Public Repository (${repoData.full_name})`,
      maintenanceSignals: {
        isArchived,
        activityStatus,
        lastCommitDate: pushedDate.toISOString(),
        inactivityMonths: monthsInactive,
        openIssuesCount: repoData.open_issues_count || 0,
        signalNotes
      },
      verifiedFailureDetails: false,
      failureReasons: [],

      createdBy: {
        id: `gh-user-${repoData.owner?.id || 'unknown'}`,
        name: repoData.owner?.login || 'Open Source Contributor',
        avatar: repoData.owner?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        institution: repoData.owner?.login || 'GitHub Community'
      },
      createdAt: repoData.created_at,
      updatedAt: repoData.updated_at
    };
  }
}

export const githubService = new GitHubService();
