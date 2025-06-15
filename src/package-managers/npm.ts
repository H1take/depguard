import { execSync } from 'child_process';
import { PackageManager } from '../types/package-manager';

export class NpmPackageManager implements PackageManager {
  public name = 'npm';

  public async initialize(): Promise<void> {
    // No initialization needed for npm
  }

  public async getLatestVersion(packageName: string): Promise<string | null> {
    try {
      const output = execSync(`npm view ${packageName} version`, { encoding: 'utf-8' });
      return output.trim();
    } catch (error) {
      return null;
    }
  }

  public async updatePackage(packageName: string, version: string): Promise<void> {
    execSync(`npm install ${packageName}@${version}`, { stdio: 'inherit' });
  }

  public async updateAllPackages(packages: Array<{ name: string; version: string }>): Promise<void> {
    const updates = packages.map(pkg => `${pkg.name}@${pkg.version}`).join(' ');
    execSync(`npm install ${updates}`, { stdio: 'inherit' });
  }

  public async install(): Promise<void> {
    execSync('npm install', { stdio: 'inherit' });
  }

  public getLockFile(): string {
    return 'package-lock.json';
  }

  async getPackageManager(): Promise<'npm' | 'yarn'> {
    return 'npm';
  }
} 