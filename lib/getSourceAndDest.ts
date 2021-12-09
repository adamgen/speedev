import * as path from 'path';
import * as fs from 'fs';

export const getSourceAndDest = (baseDirectory: string) => {
  const sourceDir = path.join(process.cwd(), baseDirectory);
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Can't find file ${sourceDir}`);
  }

  process.chdir(sourceDir);
  const source = path.join(sourceDir, './src/index.ts');

  if (!fs.existsSync(source)) {
    throw new Error(`Can't find file ${source}`);
  }

  const dest = path.join(sourceDir, '_spdbld');

  return { source, dest };
};
