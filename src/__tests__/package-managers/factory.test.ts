import { PackageManagerFactory } from '../../package-managers/factory';
import { NpmPackageManager } from '../../package-managers/npm';
import { YarnPackageManager } from '../../package-managers/yarn';
import { existsSync } from 'fs';
import { join } from 'path';

jest.mock('fs');
jest.mock('path');

describe('PackageManagerFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (join as jest.Mock).mockImplementation((...args) => args.join('/'));
  });

  it('should create NpmPackageManager when no yarn.lock exists', async () => {
    (existsSync as jest.Mock).mockImplementation((path: string) => {
      if (path.includes('yarn.lock')) return false;
      if (path.includes('package-lock.json')) return true;
      return false;
    });

    const manager = await PackageManagerFactory.create();
    expect(manager).toBeInstanceOf(NpmPackageManager);
  });

  it('should create YarnPackageManager when yarn.lock exists', async () => {
    (existsSync as jest.Mock).mockImplementation((path: string) => {
      if (path.includes('yarn.lock')) return true;
      if (path.includes('package-lock.json')) return false;
      return false;
    });

    const manager = await PackageManagerFactory.create();
    expect(manager).toBeInstanceOf(YarnPackageManager);
  });
}); 