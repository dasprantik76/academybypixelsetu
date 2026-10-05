import { cp, mkdir, rm } from 'node:fs/promises';

const outputDirectory = new URL('./public/', import.meta.url);
const publicFiles = [
  'index.html',
  'admin.html',
  'superadmin.html',
  'superadmin-style.css',
  'superadmin-script.js',
  'admin-config.js',
  'admin-script.js',
  'certificate-canvas.js',
  'admin-style.css',
  'assets',
  'public-site'
];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

await Promise.all(
  publicFiles.map(file => cp(new URL(file, import.meta.url), new URL(file, outputDirectory), { recursive: true }))
);
