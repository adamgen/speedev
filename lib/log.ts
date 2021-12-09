import chalk from 'chalk';

export const log = {
  error: (...args) => {
    console.error(chalk.red('[error]'), ...args);
  },
  success: (...args) => {
    console.log(chalk.green('[success]'), ...args);
  },
};
