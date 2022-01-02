import axios from 'axios';
import { getLocalVersion } from './get-local-version.mjs';

export const validateNpmVersion = async () => {
    try {
        const response = await axios.get(
            'https://registry.npmjs.org/speedev',
        );
        const remoteLatest = response.data['dist-tags'].latest;

        const packageJsonVersion = getLocalVersion();
        if (packageJsonVersion !== remoteLatest) {
            console.log(chalk.yellow(`Newer version available! \n\tlocal: ${packageJsonVersion}\n\tremote: ${remoteLatest}\nnpm i -g speedev${remoteLatest}`));
        }
    } catch (e) {
        console.log(
            chalk.red(`Can't validate npm version. Error: ${e.message}`),
        );
    }
};
