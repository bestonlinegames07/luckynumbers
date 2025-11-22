#!/usr/bin/env node

/**
 * Deploy script: Copy build directory to docs folder for GitHub Pages
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = __dirname;
const buildDir = path.join(rootDir, 'build');
const docsDir = path.join(rootDir, 'docs');

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function deploy() {
  try {
    console.log('🚀 Deploying to GitHub Pages...');
    console.log(`📦 Copying ${buildDir} to ${docsDir}`);
    
    // Remove old docs directory
    try {
      await fs.rm(docsDir, { recursive: true, force: true });
    } catch (e) {
      // Directory might not exist, that's okay
    }
    
    // Copy build to docs
    await copyDir(buildDir, docsDir);
    
    // Create .nojekyll file to prevent Jekyll processing
    await fs.writeFile(path.join(docsDir, '.nojekyll'), '');
    
    console.log('✅ Images and all files copied to docs/');
    
    console.log('✅ Deployment files ready in docs/ folder');
    console.log('\n📝 Next steps:');
    console.log('   1. git add docs/');
    console.log('   2. git commit -m "Deploy to GitHub Pages"');
    console.log('   3. git push origin main');
    console.log('\n⚙️  Then configure GitHub Pages:');
    console.log('   - Go to repository Settings > Pages');
    console.log('   - Source: Deploy from a branch');
    console.log('   - Branch: main, folder: /docs');
    
  } catch (error) {
    console.error('❌ Deployment error:', error.message);
    process.exit(1);
  }
}

deploy();

