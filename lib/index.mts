#!/usr/bin/env node

import { program } from 'commander';
import 'zx/globals';

import { Builder } from './Builder.mjs';
import { ProcessRunner } from './ProcessRunner.mjs';
import { getSourceAndDest } from './getSourceAndDest.mjs';
import { getLocalVersion } from './helpers/get-local-version.mjs';
import { validateNpmVersion } from './helpers/validate-npm-version.mjs';

program.version(getLocalVersion());

program.command('watch', { isDefault: true })
  .argument('<root-path>', 'Project root')
  .description('Close to instant build, and run a node script')
  .action((baseDirectory) => {
    const { source, dest } = getSourceAndDest(baseDirectory);

    const builder = new Builder({ source, dest });
    const runner = new ProcessRunner({ dest });

    builder.onBuild = () => {
      runner.run();
    };
    builder.build();
  });

await validateNpmVersion();
program.parse();
