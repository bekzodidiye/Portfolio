import fs from 'fs';
import path from 'path';

function fixImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixImports(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      // Replace extensionless relative imports with .js
      content = content.replace(/from\s+['"](\.[^'"]+?)['"]/g, (match, p1) => {
        if (p1.endsWith('.js') || p1.endsWith('.ts')) return match;
        return `from '${p1}.js'`;
      });
      // Handle import type
      // Also handle multiline imports like:
      // import {
      //   A,
      //   B
      // } from './db';
      fs.writeFileSync(fullPath, content);
    }
  }
}

fixImports('./api');
console.log('Fixed imports in api/');
