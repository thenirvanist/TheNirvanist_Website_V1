import { build } from 'esbuild';
import { existsSync, mkdirSync } from 'fs';

// Ensure the functions directory exists
if (!existsSync('netlify/functions')) {
  mkdirSync('netlify/functions', { recursive: true });
}

// Build the Netlify function
build({
  entryPoints: ['server/netlify-function.js'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  outfile: 'netlify/functions/api.js',
  external: [
    '@neondatabase/serverless',
    'drizzle-orm',
    'express',
    'bcryptjs',
    'jsonwebtoken',
    'nodemailer',
    'openai',
    'zod'
  ],
  banner: {
    js: `
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
`
  }
}).catch(() => process.exit(1));