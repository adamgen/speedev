import { nodeExternalsPlugin } from 'esbuild-node-externals';
import { build, BuildOptions, BuildResult } from 'esbuild';
import { log } from './log.js';

const outputStatusIfExists = (result: BuildResult | null) => {
  if (!result) {
    return;
  }
  const { warnings, errors } = result;
  if ((errors && errors.length) || (warnings && warnings.length)) {
    console.log({ errors, warnings });
  }
};

export class Builder {
  options: {
    source: string;
    dest: string;
  };

  constructor(options: Builder['options']) {
    this.options = options;
  }

  onBuild() {}

  build() {
    const esbuildOptions: BuildOptions = {
      entryPoints: [this.options.source],
      bundle: true,
      sourcemap: true,
      platform: 'node',
      outfile: this.options.dest,
      plugins: [nodeExternalsPlugin()],
    };

    build(esbuildOptions).then((result) => {
      log.success('\nFinished initial build 🙌\n');
      outputStatusIfExists(result);
      this.onBuild();
    });
    build({
      ...esbuildOptions,
      watch: {
        onRebuild: (error, result) => {
          if (error) {
            log.error('watch build failed:', error);
          } else {
            // eslint-disable-next-line no-unused-vars
            log.success('Source rebuild with success');
            outputStatusIfExists(result);
            this.onBuild();
          }
        },
      },
    });
  }
}
