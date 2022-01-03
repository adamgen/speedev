import { execa, ExecaChildProcess } from 'execa';
import { log } from './log.mjs';

export class ProcessRunner {
  options: {
    dest: string;
  };
  spawnedInstance?: ExecaChildProcess;

  constructor(options: ProcessRunner['options']) {
    this.options = options;
  }

  run() {
    if (this.spawnedInstance) {
      log.success('Killing old zixi process');
      this.spawnedInstance.kill();
    }
    log.success('Starting a new zixi process');
    this.spawnedInstance = execa('node', [
      '--enable-source-maps',
      '--inspect',
      '-r',
      'dotenv/config',
      this.options.dest,
    ]);

    this.spawnedInstance.stdout.pipe(process.stdout);
    this.spawnedInstance.stderr.pipe(process.stderr);

    this.spawnedInstance.on('close', () => {});
  }
}
