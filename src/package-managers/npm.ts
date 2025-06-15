import axios from 'axios';
import { exec } from 'child_process';
import { promisify } from 'util';
import { PackageManager } from '../types/package-manager';

const execAsync = promisify(exec);

export class NpmPackageManager implements PackageManager {
  name = 'npm';

  async getLatestVersion(packageName: string): Promise<string | null> {
    try {
      const res = await axios.get(`https://registry.npmjs.org/${packageName}/latest`);
      return res.data.version;
    } catch {
      return null;
    }
  }

  async updatePackage(packageName: string, version: string): Promise<void> {
    await execAsync(`npm install ${packageName}@${version} --save-exact`);
  }

  async install(): Promise<void> {
    await execAsync('npm install');
  }

  getLockFile(): string {
    return 'package-lock.json';
  }

  async getPackageManager(): Promise<'npm' | 'yarn'> {
    return 'npm';
  }
} 