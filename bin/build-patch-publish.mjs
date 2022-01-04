#!/usr/bin/env node

import 'zx/globals';

const status = await $`git status`;
const matches = status
  .toString()
  .match(/nothing to commit, working tree clean/g);
if (!matches) {
  console.log(
    chalk.red('Clean up working tree before publishing a new version.'),
  );
  process.exit();
}

await $`npm run build`;
await $`npm version patch`;
await $`git push`;
await $`npm publish`;
