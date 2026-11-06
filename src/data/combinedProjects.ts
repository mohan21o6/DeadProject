import { Project, Task } from '../types';
import { INITIAL_PROJECTS, INITIAL_TASKS, INITIAL_REVIEWS, INITIAL_RESOURCES, INITIAL_TEAM_MEMBERS } from './seedProjects';
import importedData from './importedProjects.json';

export interface DatasetSourceMetadata {
  id: string;
  name: string;
  provider: string;
  url: string;
  license: string;
  licenseUrl: string;
  totalRecords: number | string;
  status: 'Integrated' | 'Active (Backend API)' | 'Manual Download Required';
  description: string;
  fieldsMapped: string[];
  notes: string;
}

export const DATASET_SOURCES_METADATA: DatasetSourceMetadata[] = [
  {
    id: 'zenodo-1313637',
    name: 'Identifying Unmaintained Projects in GitHub',
    provider: 'Zenodo (ESEM 2018 - Jailton Coelho, Marco Tulio Valente, Luciana L. Silva, Emad Shihab)',
    url: 'https://zenodo.org/records/1313637',
    license: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    totalRecords: 1002,
    status: 'Integrated',
    description: 'Empirical research dataset identifying confirmed unmaintained and archived GitHub repositories across multiple software ecosystems.',
    fieldsMapped: ['Repository Path', 'Archived Status', 'Normalized Project Name', 'Extracted Tech Stack', 'Domain Classification', 'GitHub URL', 'Maintenance Signals'],
    notes: 'Successfully normalized and imported into DeadProject schema. Maintenance signals correctly classify repositories as archived without inventing unverified failure causes.'
  },
  {
    id: 'project-tracker',
    name: 'Multi-tenant Workspaces, Members, Projects and Tasks',
    provider: 'Database Sample (databasesample.com)',
    url: 'https://databasesample.com/datasets/project-tracker',
    license: 'Creative Commons Zero 1.0 Universal (CC0 1.0 Public Domain)',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    totalRecords: 150,
    status: 'Integrated',
    description: 'Normalized relational dataset containing multi-tenant workspaces, engineering projects, active sprint tasks, and collaboration comments.',
    fieldsMapped: ['Project Name', 'Workspace Link', 'Status (active/completed/on_hold)', '400 Ingested Kanban Tasks', 'Domain', 'Creation Timestamp'],
    notes: 'Fully integrated with deduplication and field mapping. Associated 400 real tasks linked directly to DeadProject Kanban board.'
  },
  {
    id: 'github-rest-api',
    name: 'GitHub REST API Repository Intelligence',
    provider: 'GitHub Inc.',
    url: 'https://docs.github.com/en/rest/repos',
    license: 'GitHub API Terms of Service / Public Repository Licenses',
    licenseUrl: 'https://docs.github.com/en/site-policy/github-terms/github-terms-of-service',
    totalRecords: 'On-Demand / Search',
    status: 'Active (Backend API)',
    description: 'Live metadata on public repositories including descriptions, primary languages, topic tags, star counts, fork counts, creation dates, and commit recency.',
    fieldsMapped: ['Repository Metadata', 'Languages & Topics', 'Stars & Forks', 'Commit Recency', 'Inactivity Months', 'Archival Flag'],
    notes: 'Configured strictly through the backend (never exposed directly on frontend). Features in-memory TTL caching, pagination, rate-limit header parsing, and commit recency maintenance signals.'
  },
  {
    id: 'national-transport-telematics',
    name: 'National Public Transport Telematics & RTC Initiatives',
    provider: 'Central Institute of Road Transport (CIRT) & State RTCs (APSRTC / TSRTC)',
    url: 'https://data.gov.in/sector/transport',
    license: 'Open Government Data (OGD) / CC BY 4.0',
    licenseUrl: 'https://data.gov.in/terms-of-use',
    totalRecords: 3,
    status: 'Integrated',
    description: 'Empirical transport telematics records from state road transport corporations (RTC, APSRTC) and AIS-140 vehicle tracking controllers (VTC).',
    fieldsMapped: ['Project Name', 'Acronym', 'Aliases', 'Transit Telematics Keywords', 'Hardware & CAN Bus Specs', 'State RTC Agency'],
    notes: 'Verified real records for state bus fleet tracking and telemetry units with complete technical provenance and accurate transport domain metadata.'
  },
  {
    id: 'mendeley-xxf9nh6y9s',
    name: 'The Death Spiral of Open Source Projects',
    provider: 'Mendeley Data (Mohit Kaushik, Kuljit Kaur Chahal - J. Syst. Softw. 2026)',
    url: 'https://data.mendeley.com/datasets/xxf9nh6y9s/2',
    license: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    totalRecords: 3472,
    status: 'Manual Download Required',
    description: 'Post-mortem replication package containing nearly 4 million pull requests and 6.3 million comments contrasting inactive cohorts against active cohorts.',
    fieldsMapped: ['Pull Request Dynamics', 'Review Latency', 'Inactive Cohort Metadata', 'Mortality Indicators'],
    notes: 'Due to multi-million PR scale (multi-gigabyte archive) and Mendeley Cloudflare verification, this dataset requires manual download from the Mendeley web portal into src/data/mendeley/. An ingestion template is prepared.'
  }
];

// Combine demo projects with imported external datasets
export const INITIAL_COMBINED_PROJECTS: Project[] = [
  ...INITIAL_PROJECTS,
  ...(importedData.projects as unknown as Project[])
];

// Combine starter tasks with imported tasks from Project Tracker
export const COMBINED_TASKS: Task[] = [
  ...INITIAL_TASKS,
  ...(importedData.tasks as unknown as Task[])
];

export { INITIAL_REVIEWS, INITIAL_RESOURCES, INITIAL_TEAM_MEMBERS };
