#!/usr/bin/env node

import { program } from 'commander';
import 'zx/globals';

import { Builder } from './Builder.mjs';
import { ProcessRunner } from './ProcessRunner.mjs';
import { getSourceAndDest } from './getSourceAndDest.mjs';
import { getLocalVersion } from './helpers/get-local-version.mjs';
import { validateNpmVersion } from './helpers/validate-npm-version.mjs';

program.version(getLocalVersion());

interface Options {
  inspectBrk: number;
  inspect: number;
  distDir: string;
  inspector: boolean;
}

const inspectMoreDetails = `For more details see https://nodejs.org/en/docs/guides/debugging-getting-started/#command-line-options`;

program
  .command('watch', { isDefault: true })
  .argument('<root-path>', 'Project root')
  .description('Close to instant build, and run a node script')
  .option('-d ,--dist-dir <dirname>', 'destination dir for build files', 'dist')
  .option(
    '--inspect-brk [number]',
    `Node inspect-brk option, optionally ad its port, defaults to node's default 9229. ${inspectMoreDetails}`,
  )
  .option(
    '--inspect [number]',
    `Node inspect option, optionally ad its port, defaults to node's default 9229. ${inspectMoreDetails}`,
  )
  .option('--no-inspector', `Prevent attaching an inspector`)
  .action(
    (baseDirectory, { distDir, inspect, inspectBrk, inspector }: Options) => {
      const { source, dest } = getSourceAndDest(baseDirectory, distDir);

      const builder = new Builder({ source, dest });
      if (typeof inspect === 'boolean') {
        inspect = 9229;
      } else if (typeof inspectBrk === 'boolean') {
        inspectBrk = 9229;
      }

      const runner = new ProcessRunner({
        dest,
        inspector: !inspector
          ? undefined
          : inspect
          ? `--inspect=${inspect}`
          : inspectBrk
          ? `--inspect-brk=${inspectBrk}`
          : `--inspect-brk=9229`,
      });

      builder.onBuild = () => {
        runner.run();
      };
      builder.build();
    },
  );

await validateNpmVersion();
program.parse();
