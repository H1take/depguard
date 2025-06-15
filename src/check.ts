import fs from 'fs';
import path from 'path';
import semver from 'semver';
import chalk from 'chalk';
import { Config } from './config/config';
import { PackageManagerFactory } from './package-managers/factory';
import { PackageManager } from './types/package-manager';

export class Check {
  private config = new Config();
  private packageManager: PackageManager | null = null;

  constructor() {
    // Initialize package manager synchronously
    this.initializePackageManager().catch(error => {
      console.error('Failed to initialize package manager:', error);
      process.exit(1);
    });
  }

  private async initializePackageManager() {
    this.packageManager = await PackageManagerFactory.create();
  }

  public async checkUpdates(): Promise<void> {
    if (!this.packageManager) {
      throw new Error('Package manager not initialized');
    }

    const { exclude } = this.config.loadConfig();
    const pkgPath = path.resolve(process.cwd(), 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    console.log(chalk.blue(`\nChecking for outdated dependencies using ${this.packageManager.name}...\n`));

    const updates = {
      major: [] as Array<{ name: string; current: string; latest: string }>,
      minor: [] as Array<{ name: string; current: string; latest: string }>,
      patch: [] as Array<{ name: string; current: string; latest: string }>,
      compatible: [] as Array<{ name: string; current: string; latest: string }>,
      failed: [] as string[]
    };

    for (const [name, currentRange] of Object.entries<string>(deps)) {
      if (exclude.includes(name)) continue;

      const latest = await this.packageManager.getLatestVersion(name);
      if (!latest) {
        updates.failed.push(name);
        continue;
      }

      const current = currentRange.replace(/^[~^]/, '');
      const isCompatible = semver.satisfies(latest, currentRange);

      if (isCompatible) {
        updates.compatible.push({ name, current: currentRange, latest });
      } else {
        const currentMajor = semver.major(current);
        const latestMajor = semver.major(latest);
        const currentMinor = semver.minor(current);
        const latestMinor = semver.minor(latest);
        const currentPatch = semver.patch(current);
        const latestPatch = semver.patch(latest);

        if (latestMajor > currentMajor) {
          updates.major.push({ name, current: currentRange, latest });
        } else if (latestMinor > currentMinor) {
          updates.minor.push({ name, current: currentRange, latest });
        } else if (latestPatch > currentPatch) {
          updates.patch.push({ name, current: currentRange, latest });
        }
      }
    }

    // Print results
    if (updates.major.length > 0) {
      console.log(chalk.yellow('\n⚠ Major Updates:'));
      updates.major.forEach(({ name, current, latest }) => {
        console.log(`${chalk.bold(name.padEnd(20))} ${current.padEnd(10)} → ${chalk.bold(latest.padEnd(10))}`);
      });
    }

    if (updates.minor.length > 0) {
      console.log(chalk.cyan('\n↑ Minor Updates:'));
      updates.minor.forEach(({ name, current, latest }) => {
        console.log(`${chalk.bold(name.padEnd(20))} ${current.padEnd(10)} → ${chalk.bold(latest.padEnd(10))}`);
      });
    }

    if (updates.patch.length > 0) {
      console.log(chalk.green('\n↑ Patch Updates:'));
      updates.patch.forEach(({ name, current, latest }) => {
        console.log(`${chalk.bold(name.padEnd(20))} ${current.padEnd(10)} → ${chalk.bold(latest.padEnd(10))}`);
      });
    }

    if (updates.compatible.length > 0) {
      console.log(chalk.gray('\n✓ Compatible:'));
      updates.compatible.forEach(({ name, current, latest }) => {
        console.log(`${chalk.bold(name.padEnd(20))} ${current.padEnd(10)} → ${chalk.bold(latest.padEnd(10))}`);
      });
    }

    if (updates.failed.length > 0) {
      console.log(chalk.red('\n✗ Failed to fetch:'));
      updates.failed.forEach(name => {
        console.log(chalk.gray(name));
      });
    }

    console.log('');
  }
}
