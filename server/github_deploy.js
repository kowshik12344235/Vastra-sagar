import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOKEN = process.env.GITHUB_TOKEN;
const REPO = 'kowshik12344235/Vastra-sagar';
const BRANCH = 'main';

if (!TOKEN) {
  console.error('❌ GITHUB_TOKEN not found in .env');
  process.exit(1);
}

async function uploadFile(filePath, content) {
  const relPath = path.relative(path.join(__dirname, '..'), filePath).replace(/\\/g, '/');
  
  // Skip node_modules, .git, etc.
  if (relPath.includes('node_modules') || relPath.startsWith('.git') || relPath === '.env' || relPath === 'package-lock.json') return;

  console.log(`Uploading ${relPath}...`);
  
  const url = `https://api.github.com/repos/${REPO}/contents/${relPath}`;
  
  // Check if file exists to get SHA
  let sha;
  try {
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${TOKEN}` }
    });
    if (res.ok) {
      const data = await res.json();
      sha = data.sha;
    }
  } catch (err) {}

  const body = {
    message: `Deploy: ${relPath} (Vercel Ready)`,
    content: Buffer.from(content).toString('base64'),
    branch: BRANCH
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    },
    body: JSON.stringify(body)
  });

  if (res.ok) {
    console.log(`✅ Uploaded ${relPath}`);
  } else {
    const err = await res.json();
    console.error(`❌ Failed to upload ${relPath}:`, err.message);
  }
}

async function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        await walkDir(fullPath);
      }
    } else {
      const content = fs.readFileSync(fullPath);
      await uploadFile(fullPath, content);
    }
  }
}

console.log('🚀 Starting secure Vercel-ready sync...');
walkDir(path.join(__dirname, '..')).then(() => {
  console.log('🎉 Sync complete! Your files are now on GitHub.');
  console.log('You can now go to Vercel and click "Deploy".');
});
