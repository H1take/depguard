import axios from 'axios';
import { exec } from 'child_process';
import { promisify } from 'util';
import { PackageManager } from '../types/package-manager';

const execAsync = promisify(exec);

export class YarnPackageManager implements PackageManager {
  name = 'yarn';

  async getLatestVersion(packageName: string): Promise<string | null> {
    try {
      const res = await axios.get(`https://registry.npmjs.org/${packageName}/latest`);
      return res.data.version;
    } catch {
      return null;
    }
  }

  async updatePackage(packageName: string, version: string): Promise<void> {
    await execAsync(`yarn add ${packageName}@${version} --exact`);
  }

  async install(): Promise<void> {
    await execAsync('yarn install');
  }

  getLockFile(): string {
    return 'yarn.lock';
  }

  async getPackageManager(): Promise<'npm' | 'yarn'> {
    return 'yarn';
  }
} 