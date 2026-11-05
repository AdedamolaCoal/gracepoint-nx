#!/usr/bin/env node

// Filter out legacy Yarn v1 arguments injected by hosting providers like Render
const filteredArgs = process.argv.slice(2).filter(arg => {
  return arg !== '--production=false' &&
         arg !== '--production=true' &&
         arg !== '--ignore-engines' &&
         arg !== '--frozen-lockfile' &&
         !arg.startsWith('--production=');
});

process.argv = [process.argv[0], process.argv[1], ...filteredArgs];

// Delegate to actual Yarn 4 binary
require('./yarn-4.14.1.cjs');
