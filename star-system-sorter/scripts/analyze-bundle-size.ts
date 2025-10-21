#!/usr/bin/env tsx
/**
 * Bundle Size Analysis Script
 * 
 * Analyzes the production build to verify bundle size increase is <50KB gzipped
 * Compares against baseline and reports on key chunks
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { gzipSync } from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface FileSize {
  name: string;
  size: number;
  gzipSize: number;
}

interface BundleAnalysis {
  totalSize: number;
  totalGzipSize: number;
  files: FileSize[];
  jsFiles: FileSize[];
  cssFiles: FileSize[];
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

function getGzipSize(filePath: string): number {
  const content = fs.readFileSync(filePath);
  const gzipped = gzipSync(content, { level: 9 });
  return gzipped.length;
}

function analyzeDirectory(dirPath: string): BundleAnalysis {
  const files: FileSize[] = [];
  let totalSize = 0;
  let totalGzipSize = 0;

  function walkDir(currentPath: string) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.isFile()) {
        const stats = fs.statSync(fullPath);
        const size = stats.size;
        const gzipSize = getGzipSize(fullPath);
        const relativeName = path.relative(dirPath, fullPath);

        files.push({
          name: relativeName,
          size,
          gzipSize
        });

        totalSize += size;
        totalGzipSize += gzipSize;
      }
    }
  }

  walkDir(dirPath);

  const jsFiles = files.filter(f => f.name.endsWith('.js'));
  const cssFiles = files.filter(f => f.name.endsWith('.css'));

  return {
    totalSize,
    totalGzipSize,
    files,
    jsFiles,
    cssFiles
  };
}

function main() {
  const distPath = path.join(__dirname, '..', 'dist');

  if (!fs.existsSync(distPath)) {
    console.error('❌ Error: dist/ directory not found. Run `npm run build` first.');
    process.exit(1);
  }

  console.log('📦 Analyzing bundle size...\n');

  const analysis = analyzeDirectory(distPath);

  // Sort files by gzip size (largest first)
  const sortedFiles = [...analysis.files].sort((a, b) => b.gzipSize - a.gzipSize);

  console.log('=== Bundle Size Analysis ===\n');
  console.log(`Total Size: ${formatBytes(analysis.totalSize)}`);
  console.log(`Total Gzipped: ${formatBytes(analysis.totalGzipSize)}`);
  console.log(`Compression Ratio: ${((1 - analysis.totalGzipSize / analysis.totalSize) * 100).toFixed(1)}%\n`);

  console.log('=== JavaScript Files ===');
  const jsTotal = analysis.jsFiles.reduce((sum, f) => sum + f.gzipSize, 0);
  console.log(`Total JS (gzipped): ${formatBytes(jsTotal)}\n`);
  
  analysis.jsFiles
    .sort((a, b) => b.gzipSize - a.gzipSize)
    .forEach(file => {
      console.log(`  ${file.name}`);
      console.log(`    Raw: ${formatBytes(file.size)} | Gzipped: ${formatBytes(file.gzipSize)}`);
    });

  console.log('\n=== CSS Files ===');
  const cssTotal = analysis.cssFiles.reduce((sum, f) => sum + f.gzipSize, 0);
  console.log(`Total CSS (gzipped): ${formatBytes(cssTotal)}\n`);
  
  analysis.cssFiles
    .sort((a, b) => b.gzipSize - a.gzipSize)
    .forEach(file => {
      console.log(`  ${file.name}`);
      console.log(`    Raw: ${formatBytes(file.size)} | Gzipped: ${formatBytes(file.gzipSize)}`);
    });

  console.log('\n=== Largest Files (Top 10) ===');
  sortedFiles.slice(0, 10).forEach((file, index) => {
    console.log(`${index + 1}. ${file.name}`);
    console.log(`   Raw: ${formatBytes(file.size)} | Gzipped: ${formatBytes(file.gzipSize)}`);
  });

  // Check for Why 2.0 + Dossier specific chunks
  console.log('\n=== Why 2.0 + Dossier Related Files ===');
  const loreFiles = sortedFiles.filter(f => 
    f.name.includes('Dossier') || 
    f.name.includes('Why') ||
    f.name.includes('lore') ||
    f.name.includes('Evidence') ||
    f.name.includes('Contribution')
  );

  if (loreFiles.length > 0) {
    const loreTotal = loreFiles.reduce((sum, f) => sum + f.gzipSize, 0);
    console.log(`Estimated Why 2.0 + Dossier size: ${formatBytes(loreTotal)}\n`);
    loreFiles.forEach(file => {
      console.log(`  ${file.name}`);
      console.log(`    Raw: ${formatBytes(file.size)} | Gzipped: ${formatBytes(file.gzipSize)}`);
    });
  } else {
    console.log('Note: Specific chunks not identified (may be bundled in main chunk)');
  }

  // Performance assessment
  console.log('\n=== Performance Assessment ===');
  
  const mainJsFiles = analysis.jsFiles.filter(f => f.name.includes('index') || f.name.includes('main'));
  const mainJsSize = mainJsFiles.reduce((sum, f) => sum + f.gzipSize, 0);
  
  console.log(`Main JS bundle (gzipped): ${formatBytes(mainJsSize)}`);
  
  if (mainJsSize < 150 * 1024) {
    console.log('✅ Main bundle is under 150KB (good)');
  } else if (mainJsSize < 250 * 1024) {
    console.log('⚠️  Main bundle is 150-250KB (acceptable)');
  } else {
    console.log('❌ Main bundle exceeds 250KB (consider code splitting)');
  }

  // Baseline comparison (approximate MVP baseline: ~100KB gzipped)
  const baselineGzipSize = 100 * 1024; // 100KB baseline
  const increase = analysis.totalGzipSize - baselineGzipSize;
  
  console.log(`\nEstimated increase from baseline: ${formatBytes(increase)}`);
  
  if (increase < 50 * 1024) {
    console.log('✅ Bundle size increase is under 50KB gzipped (requirement met)');
  } else {
    console.log(`❌ Bundle size increase exceeds 50KB gzipped (${formatBytes(increase - 50 * 1024)} over limit)`);
  }

  console.log('\n=== Summary ===');
  console.log(`Total bundle size (gzipped): ${formatBytes(analysis.totalGzipSize)}`);
  console.log(`JavaScript (gzipped): ${formatBytes(jsTotal)}`);
  console.log(`CSS (gzipped): ${formatBytes(cssTotal)}`);
  console.log(`Number of files: ${analysis.files.length}`);
}

main();
