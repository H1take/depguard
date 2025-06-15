export interface PackageManager {
  name: string;
  getLatestVersion(packageName: string): Promise<string | null>;
  updatePackage(packageName: string, version: string): Promise<void>;
  install(): Promise<void>;
  getLockFile(): string;
  getPackageManager(): Promise<'npm' | 'yarn'>;
}

export type PackageManagerType = 'npm' | 'yarn'; 