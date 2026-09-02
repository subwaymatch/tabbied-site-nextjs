#!/usr/bin/env node
// Make someone an admin, by email. The first one has to come from here: no
// page can grant the role before any admin exists, and a role granted by a
// deploy step would be a role in git.
//
//   npm run admin:grant -- you@example.com            # local D1
//   npm run admin:grant -- you@example.com --remote   # production
//
// After the first, /admin/users does this in the browser.
import { spawnSync } from 'node:child_process';

const [email, ...flags] = process.argv.slice(2);

if (!email || !email.includes('@')) {
  console.error('usage: npm run admin:grant -- <email> [--remote]');
  process.exit(1);
}

const remote = flags.includes('--remote');
const sql = `UPDATE user SET role = 'admin' WHERE email = '${email.replace(/'/g, "''")}'; SELECT email, role FROM user WHERE email = '${email.replace(/'/g, "''")}';`;
const result = spawnSync(
  'npx',
  ['wrangler', 'd1', 'execute', 'tabbied', remote ? '--remote' : '--local', '--command', sql],
  { stdio: 'inherit' }
);

process.exit(result.status ?? 1);
