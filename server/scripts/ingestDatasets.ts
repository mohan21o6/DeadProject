/**
 * Standalone Ingestion Script
 * Executes ingestion of Zenodo and Project Tracker datasets, applies deduplication,
 * normalizes fields, and writes to src/data/importedProjects.json.
 */
import fs from 'fs';
import path from 'path';
import { IngestionEngine } from '../services/ingestionService.js';
import { INITIAL_PROJECTS } from '../../src/data/seedProjects.js';

const engine = new IngestionEngine();

// Register initial demo projects to prevent conflicts
engine.registerExistingProjects(INITIAL_PROJECTS);

console.log('[Ingestion] Ingesting Zenodo (ESEM 2018) unmaintained projects dataset...');
const zenodoCsvPath = path.resolve('src/data/zenodo_unmaintained.csv');
const zenodoRes = engine.ingestZenodoCSV(zenodoCsvPath);
console.log(`[Ingestion] Zenodo: ${zenodoRes.result.imported} imported, ${zenodoRes.result.skippedDuplicates} duplicates.`);

console.log('[Ingestion] Ingesting Project Tracker dataset...');
const ptJsonPath = path.resolve('src/data/project_tracker_raw.json');
const ptRes = engine.ingestProjectTracker(ptJsonPath);
console.log(`[Ingestion] Project Tracker: ${ptRes.result.imported} imported, ${ptRes.tasks.length} tasks linked.`);

const mendeleyStatus = engine.getMendeleyStatus();
console.log(`[Ingestion] Mendeley Status: ${mendeleyStatus.status} - ${mendeleyStatus.notes}`);

// Combine imported datasets
const allImported = [
  ...ptRes.projects,
  ...zenodoRes.projects
];

const outPayload = {
  metadata: {
    generatedAt: new Date().toISOString(),
    totalImported: allImported.length,
    countsBySource: {
      'Zenodo (ESEM 2018)': zenodoRes.projects.length,
      'Project Tracker': ptRes.projects.length
    },
    sources: [
      zenodoRes.result,
      ptRes.result,
      mendeleyStatus
    ]
  },
  projects: allImported,
  tasks: ptRes.tasks
};

const outPath = path.resolve('src/data/importedProjects.json');
fs.writeFileSync(outPath, JSON.stringify(outPayload, null, 2), 'utf8');
console.log(`[Ingestion] SUCCESS! Written ${allImported.length} normalized projects and ${ptRes.tasks.length} tasks to ${outPath}`);
