#!/usr/bin/env node

import { readFileSync, cpSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const contentRoot = join(rootDir, '..', 'content');
const sdkRoot = join(rootDir, '..', 'sdk');

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

// Sync SDK docs
const sdkTargetDir = join(rootDir, 'src', 'sdk-docs');
const sdkFiles = [
  { src: join(sdkRoot, 'README.md'), dest: join(sdkTargetDir, 'README.md') },
  { src: join(sdkRoot, 'docs', 'API.md'), dest: join(sdkTargetDir, 'API.md') },
  { src: join(sdkRoot, 'docs', 'LOCAL_DEVELOPMENT.md'), dest: join(sdkTargetDir, 'LOCAL_DEVELOPMENT.md') },
  { src: join(sdkRoot, 'docs', 'ROADMAP.md'), dest: join(sdkTargetDir, 'ROADMAP.md') },
];

mkdirSync(sdkTargetDir, { recursive: true });
for (const { src, dest } of sdkFiles) {
  if (existsSync(src)) {
    cpSync(src, dest);
  }
}
console.log(`  Synced SDK docs`);

console.log('Done.');
