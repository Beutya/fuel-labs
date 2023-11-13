import { execSync } from 'child_process';
import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const initialDependencies: { file: string; contents: string }[] = [];

/**
 * - Needs refactoring
 * - Make dynamic for package names and replacements
 */
const hardlinkDeps = () => {
  const packagesDir = join(__dirname, '../packages/');
  const packages = readdirSync(packagesDir).filter(p => !p.startsWith('.'));
  const packagesSupportingBrowserTesting = ['fuel-gauge'];

  packagesSupportingBrowserTesting.forEach((packageName) => {
    const packageFilePath = join(packagesDir, `${packageName}/package.json`);
    const fileContents = readFileSync(packageFilePath, 'utf8');
    initialDependencies.push({ file: packageFilePath, contents: fileContents });

    const lines = fileContents.split('\n');
    lines.forEach((line, index) => {
      if (line.includes('workspace:*')) {
        packages.forEach((pckg) => {
          if (line.includes(`@fuel-ts/${pckg}`)) {
            lines[index] = line.replace('workspace:*', `file:../${pckg}`);
          }
          else if (line.includes('fuels')) {
            lines[index] = line.replace('workspace:*', `file:../fuels`);
          }
        });
      }
      writeFileSync(packageFilePath, lines.join('\n'));
    });
  });
};

const symlinkDeps = () =>
  initialDependencies.forEach(({ file, contents }) => writeFileSync(file, contents));

(() => {
  hardlinkDeps();

  // execSync('pnpm install');

  // execSync('vitest --run --coverage --config vite.browser.config.ts $(scripts/tests-find.sh --browser)');


  setTimeout(() => {
    symlinkDeps();
  }, 10000);
    

  // execSync('pnpm install');
})();