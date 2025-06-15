// Main classes
export { Check } from './check';
export { Update } from './update';
export { Config } from './config/config';

// Package managers
export { PackageManagerFactory } from './package-managers/factory';
export { NpmPackageManager } from './package-managers/npm';
export { YarnPackageManager } from './package-managers/yarn';

// Types
export type { PackageManager } from './types/package-manager';
export type { IConfig } from './types/config.type';
export type { IUpdateOptions, IUpdatePackage } from './types/update.type';
