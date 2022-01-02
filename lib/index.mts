#!/usr/bin/env node

import { program } from 'commander';
import 'zx/globals'

import { Builder } from './Builder.mjs';
import { ProcessRunner } from './ProcessRunner.mjs';
import { getSourceAndDest } from './getSourceAndDest.mjs';
import { getLocalVersion } from './helpers/get-local-version.mjs';
import { validateNpmVersion } from './helpers/validate-npm-version.mjs';

program
  .version(getLocalVersion())
  .command('watch')
  .argument('<root-path>', 'Project root')
  .description('clone a repository into a newly created directory')
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
