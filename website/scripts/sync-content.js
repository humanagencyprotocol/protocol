#!/usr/bin/env node

import { readFileSync, writeFileSync, cpSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const contentRoot = join(rootDir, '..', 'content');
const demoRoot = join(rootDir, '..', 'demo');

// Read version from package.json
const pkg = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf-8'));
const version = pkg.version;

console.log(`Syncing content for HAP v${version}...`);

// Sync main docs from current version
const sourceDir = join(contentRoot, version);
const targetDir = join(rootDir, 'src', 'content', 'docs');

if (existsSync(sourceDir)) {
  mkdirSync(targetDir, { recursive: true });
  cpSync(sourceDir, targetDir, { recursive: true });
  console.log(`  Copied ${sourceDir} -> ${targetDir}`);
} else {
  console.error(`  Warning: Content directory not found: ${sourceDir}`);
}

// Sync Demo README (with frontmatter injection)
const demoReadme = join(demoRoot, 'README.md');
const demoTarget = join(targetDir, 'demo.md');

if (existsSync(demoReadme)) {
  let content = readFileSync(demoReadme, 'utf-8');

  // Remove the H1 title (will be in frontmatter)
  content = content.replace(/^# HAP Deploy Gate Demo\n+/, '');

  // Add frontmatter
  const frontmatter = `---
title: "Deploy Gate Demo"
version: "Version ${version}"
date: "January 2026"
---

`;

  writeFileSync(demoTarget, frontmatter + content);
  console.log(`  Synced Demo README -> ${demoTarget}`);
} else {
  console.error(`  Warning: Demo README not found: ${demoReadme}`);
}

console.log('Done.');
