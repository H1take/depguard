export interface PackageManager {
  name: string;
  initialize(): Promise<void>;
  getLatestVersion(packageName: string): Promise<string | null>;
  updatePackage(packageName: string, version: string): Promise<void>;
  updateAllPackages(packages: Array<{ name: string; version: string }>): Promise<void>;
  install(): Promise<void>;
  getLockFile(): string;
}

export type PackageManagerType = 'npm' | 'yarn'; 