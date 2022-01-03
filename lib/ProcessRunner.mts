import { execa, ExecaChildProcess } from 'execa';
import { log } from './log.mjs';
import path from 'path';

export class ProcessRunner {
  options: {
    dest: string;
  };
  spawnedInstance?: ExecaChildProcess;

  constructor(options: ProcessRunner['options']) {
    this.options = options;
  }

  run() {
    let processName = 'process';
    try {
      processName = fs.readJSONSync(
        path.join(process.cwd(), `/package.json`),
      ).name;
    } catch (e) {}

    if (this.spawnedInstance) {
      log.success(`Killing old ${processName} process`);
      this.spawnedInstance.kill();
    }
    log.success(`Starting a new ${processName} process`);
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
