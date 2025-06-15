import { execSync } from 'child_process';
import { YarnPackageManager } from '../../package-managers/yarn';

jest.mock('child_process', () => ({
  execSync: jest.fn()
}));

describe('YarnPackageManager', () => {
  let manager: YarnPackageManager;

  beforeEach(() => {
    manager = new YarnPackageManager();
    jest.clearAllMocks();
  });

  describe('getLatestVersion', () => {
    it('should return latest version when successful', async () => {
      (execSync as jest.Mock).mockReturnValue('2.0.0\n');

      const result = await manager.getLatestVersion('test-package');
      expect(result).toBe('2.0.0');
      expect(execSync).toHaveBeenCalledWith('yarn info test-package version', { encoding: 'utf-8' });
    });

    it('should return null when version fetch fails', async () => {
      (execSync as jest.Mock).mockImplementation(() => {
        throw new Error('Failed to fetch version');
      });

      const result = await manager.getLatestVersion('test-package');
      expect(result).toBeNull();
      // Reset mock after error test
      (execSync as jest.Mock).mockReset();
    });
  });

  describe('updatePackage', () => {
    it('should execute yarn add command', async () => {
      (execSync as jest.Mock).mockReturnValue(undefined);
      await manager.updatePackage('test-package', '2.0.0');
      expect(execSync).toHaveBeenCalledWith('yarn add test-package@2.0.0', { stdio: 'inherit' });
    });
  });

  describe('updateAllPackages', () => {
    it('should execute yarn add command with multiple packages', async () => {
      (execSync as jest.Mock).mockReturnValue(undefined);
      await manager.updateAllPackages([
        { name: 'package1', version: '1.0.0' },
        { name: 'package2', version: '2.0.0' }
      ]);
      expect(execSync).toHaveBeenCalledWith('yarn add package1@1.0.0 package2@2.0.0', { stdio: 'inherit' });
    });
  });

  describe('install', () => {
    it('should execute yarn install command', async () => {
      (execSync as jest.Mock).mockReturnValue(undefined);
      await manager.install();
      expect(execSync).toHaveBeenCalledWith('yarn install', { stdio: 'inherit' });
    });
  });

  describe('getLockFile', () => {
    it('should return yarn.lock', () => {
      expect(manager.getLockFile()).toBe('yarn.lock');
    });
  });
}); 