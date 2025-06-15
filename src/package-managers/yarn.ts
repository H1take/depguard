import { execSync } from 'child_process';
import { PackageManager } from '../types/package-manager';

export class YarnPackageManager implements PackageManager {
  public name = 'yarn';

  public async initialize(): Promise<void> {
    // No initialization needed for yarn
  }

  public async getLatestVersion(packageName: string): Promise<string | null> {
    try {
      const output = execSync(`yarn info ${packageName} version`, { encoding: 'utf-8' });
      return output.trim();
    } catch (error) {
      return null;
    }
  }

  public async updatePackage(packageName: string, version: string): Promise<void> {
    execSync(`yarn add ${packageName}@${version}`, { stdio: 'inherit' });
  }

  public async updateAllPackages(packages: Array<{ name: string; version: string }>): Promise<void> {
    const updates = packages.map(pkg => `${pkg.name}@${pkg.version}`).join(' ');
    execSync(`yarn add ${updates}`, { stdio: 'inherit' });
  }

  public async install(): Promise<void> {
    execSync('yarn install', { stdio: 'inherit' });
  }

  public getLockFile(): string {
    return 'yarn.lock';
  }

  async getPackageManager(): Promise<'npm' | 'yarn'> {
    return 'yarn';
  }
} 