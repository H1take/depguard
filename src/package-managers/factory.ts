import fs from 'fs';
import path from 'path';
import { NpmPackageManager } from './npm';
import { YarnPackageManager } from './yarn';
import { PackageManager } from '../types/package-manager';

export class PackageManagerFactory {
  public static async create(): Promise<PackageManager> {
    const packageManager = this.createSync();
    await packageManager.initialize();
    return packageManager;
  }

  public static createSync(): PackageManager {
    const cwd = process.cwd();
    const hasYarnLock = fs.existsSync(path.join(cwd, 'yarn.lock'));
    const hasPackageLock = fs.existsSync(path.join(cwd, 'package-lock.json'));

    if (hasYarnLock) {
      return new YarnPackageManager();
    } else if (hasPackageLock) {
      return new NpmPackageManager();
    } else {
      // Default to npm if no lock file is found
      return new NpmPackageManager();
    }
  }
} 