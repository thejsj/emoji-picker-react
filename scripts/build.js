const { build } = require('esbuild');
const fs = require('fs-extra');
const path = require('path');

// SVG to base64 plugin
const svgBase64Plugin = {
  name: 'svg-base64',
  setup(build) {
    build.onLoad({ filter: /\.svg$/ }, async (args) => {
      const svg = await fs.readFile(args.path, 'utf8');
      const base64 = Buffer.from(svg).toString('base64');
      return {
        contents: `export default "data:image/svg+xml;base64,${base64}";`,
        loader: 'js',
      };
    });
  },
};

// Common external dependencies
const external = ['react', 'react-dom', 'flairup'];

async function buildAll() {
  // Ensure dist directory exists
  await fs.ensureDir('dist');

  console.log('Building ESM...');
  await build({
    entryPoints: ['src/index.tsx'],
    bundle: true,
    format: 'esm',
    outfile: 'dist/emoji-picker-react.esm.js',
    sourcemap: true,
    external,
    plugins: [svgBase64Plugin],
  });

  console.log('Building CJS (development)...');
  await build({
    entryPoints: ['src/index.tsx'],
    bundle: true,
    format: 'cjs',
    outfile: 'dist/emoji-picker-react.cjs.development.js',
    sourcemap: true,
    external,
    plugins: [svgBase64Plugin],
    define: { 'process.env.NODE_ENV': '"development"' },
  });

  console.log('Building CJS (production)...');
  await build({
    entryPoints: ['src/index.tsx'],
    bundle: true,
    format: 'cjs',
    outfile: 'dist/emoji-picker-react.cjs.production.min.js',
    sourcemap: true,
    minify: true,
    external,
    plugins: [svgBase64Plugin],
    define: { 'process.env.NODE_ENV': '"production"' },
  });

  // Generate TypeScript declarations
  console.log('Generating TypeScript declarations...');
  const { execSync } = require('child_process');
  try {
    execSync('tsc -p tsconfig.build.json', { stdio: 'inherit' });
  } catch (err) {
    console.error('TypeScript declaration generation had issues:', err.message);
  }

  console.log('Creating CJS entry wrapper...');
  const wrapper = `'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./emoji-picker-react.cjs.production.min.js')
} else {
  module.exports = require('./emoji-picker-react.cjs.development.js')
}`;

  await fs.writeFile(path.join(__dirname, '../dist/index.js'), wrapper, 'utf8');
  console.log('Build completed successfully!');
}

buildAll().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
