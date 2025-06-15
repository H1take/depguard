import { PackageManager, PackageManagerType } from '../types/package-manager';
import { NpmPackageManager } from './npm';
import { YarnPackageManager } from './yarn';
import { existsSync } from 'fs';
import { join } from 'path';

export class PackageManagerFactory {
  static async create(): Promise<PackageManager> {
    const packageManager = await this.detectPackageManager();
    return packageManager === 'yarn' ? new YarnPackageManager() : new NpmPackageManager();
  }

  private static async detectPackageManager(): Promise<PackageManagerType> {
    const yarnLockExists = existsSync(join(process.cwd(), 'yarn.lock'));
    const packageLockExists = existsSync(join(process.cwd(), 'package-lock.json'));

    if (yarnLockExists && !packageLockExists) {
      return 'yarn';
    }
    return 'npm';
  }
} 