import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import axios from 'axios';
import semver from 'semver';
import chalk from 'chalk';
import { IUpdateOptions, IUpdatePackage } from './types/update.type';
import { Config } from './config/config';

export class Update {
  private config = new Config();

  public getPackageManager(): 'yarn' | 'npm' {
    return fs.existsSync(path.resolve(process.cwd(), 'yarn.lock')) ? 'yarn' : 'npm';
  }

  public async getLatestVersion(pkg: string): Promise<string | null> {
    try {
      const res = await axios.get(`https://registry.npmjs.org/${pkg}/latest`);
      return res.data.version;
    } catch {
      return null;
    }
  }

  public async updateDependencies(options: IUpdateOptions = {}): Promise<void> {
    const { safe = false } = options;
    const { exclude } = this.config.loadConfig();
    const pkgPath = path.resolve(process.cwd(), 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    const packageManager = this.getPackageManager();

    const updated: IUpdatePackage[] = [];

    for (const [name, currentRange] of Object.entries<string>(deps)) {
      if (exclude.includes(name)) continue;

      const latest = await this.getLatestVersion(name);
      if (!latest) continue;

      const current = currentRange.replace(/^[~^]/, '');
      const isCompatible = semver.satisfies(latest, currentRange);
      if (safe && !isCompatible) continue;

      const version = safe ? `^${latest}` : latest;
      const cmd =
        packageManager === 'yarn'
          ? `yarn add ${name}@${version}`
          : `npm install ${name}@${version}`;

      console.log(`Updating ${name} → ${version}`);
      execSync(cmd, { stdio: 'inherit' });

      updated.push({ name, currentRange, updatedVersion: version });
    }

    this.generateReport(updated);
    console.log(chalk.green('\nAll dependencies updated.\n'));
  }

  private generateReport(updated: IUpdatePackage[]): void {
    const reportPath = path.resolve(process.cwd(), 'report.json');
    fs.writeFileSync(reportPath, JSON.stringify(updated, null, 2));
    console.log(chalk.green('Report written to report.json'));
  }
}
