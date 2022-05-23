import {readFileSync, writeFileSync} from 'fs';
import {glob} from 'glob';

import {updatePackageJsonStructure} from './update-package-json-structure';

const INDENTATION = 4;

export function syncVersions(
    filesOrDirectories: string[],
    version: string,
    ignores: string[] = [],
): void {
    const patterns = filesOrDirectories.map(pattern =>
        pattern.endsWith('.json')
            ? pattern
            : `${pattern}/**/*(package.json|package-lock.json)`,
    );

    const files = patterns
        .map(pattern => glob.sync(pattern, {ignore: '**/node_modules/**'}))
        .flatMap(files => files);

    for (const file of files) {
        const packageJson = JSON.parse(readFileSync(file).toString());
        const isPackageLockJson = file.endsWith('-lock.json');

        updatePackageJsonStructure(packageJson, version, isPackageLockJson, ignores);
        writeFileSync(file, `${JSON.stringify(packageJson, null, INDENTATION)}\n`);
        console.info('\x1b[32m%s\x1b[0m', `[synchronized]:`, file);
    }
}