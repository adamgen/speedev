import { execa, ExecaChildProcess } from 'execa';
import { log } from './log.mjs';
import path from 'path';

export class ProcessRunner {
  options: {
    dest: string;
    inspector: string;
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
    const { inspector } = this.options;

    let nodeArgs = [
      '--enable-source-maps',
      '-r',
      'dotenv/config',
      this.options.dest,
    ];

    if (inspector) {
      nodeArgs = [inspector, ...nodeArgs];
    }

    this.spawnedInstance = execa('node', nodeArgs);

    this.spawnedInstance.stdout.pipe(process.stdout);
    this.spawnedInstance.stderr.pipe(process.stderr);

    this.spawnedInstance.on('close', () => {});
  }
}
