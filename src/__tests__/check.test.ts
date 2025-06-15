import fs from 'fs';
import path from 'path';
import { Check } from '../check';
import { Update } from '../update';
import { Config } from '../config/config';
import { PackageManagerFactory } from '../package-managers/factory';
import type { IUpdateOptions, IUpdatePackage } from '../types/update.type';
import type { IConfig } from '../types/config.type';
import type { PackageManager } from '../types/package-manager';

jest.mock('fs');
jest.mock('path');
jest.mock('../package-managers/factory');

describe('Check', () => {
  let check: Check;
  let mockPackageManager: PackageManager;

  beforeEach(() => {
    mockPackageManager = {
      name: 'npm',
      initialize: jest.fn().mockResolvedValue(undefined),
      getLatestVersion: jest.fn(),
      updatePackage: jest.fn(),
      updateAllPackages: jest.fn(),
      install: jest.fn(),
      getLockFile: jest.fn().mockReturnValue('package-lock.json')
    };

    (PackageManagerFactory.createSync as jest.Mock).mockReturnValue(mockPackageManager);
    (path.resolve as jest.Mock).mockReturnValue('/test/package.json');
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({
      dependencies: {
        'package1': '^1.0.0',
        'package2': '^2.0.0'
      },
      devDependencies: {
        'package3': '^3.0.0'
      }
    }));

    check = new Check();
  });

  describe('checkUpdates', () => {
    it('should check updates for all dependencies', async () => {
      (mockPackageManager.getLatestVersion as jest.Mock)
        .mockResolvedValueOnce('2.0.0')
        .mockResolvedValueOnce('3.0.0')
        .mockResolvedValueOnce('4.0.0');

      await check.checkUpdates();

      expect(mockPackageManager.getLatestVersion).toHaveBeenCalledTimes(3);
      expect(mockPackageManager.getLatestVersion).toHaveBeenCalledWith('package1');
      expect(mockPackageManager.getLatestVersion).toHaveBeenCalledWith('package2');
      expect(mockPackageManager.getLatestVersion).toHaveBeenCalledWith('package3');
    });

    it('should handle failed version fetches', async () => {
      (mockPackageManager.getLatestVersion as jest.Mock)
        .mockResolvedValueOnce('2.0.0')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce('4.0.0');

      await check.checkUpdates();

      expect(mockPackageManager.getLatestVersion).toHaveBeenCalledTimes(3);
    });
  });
}); 