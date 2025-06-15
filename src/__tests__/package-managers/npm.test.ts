import { execSync } from 'child_process';
import { NpmPackageManager } from '../../package-managers/npm';

jest.mock('child_process', () => ({
  execSync: jest.fn()
}));

describe('NpmPackageManager', () => {
  let manager: NpmPackageManager;

  beforeEach(() => {
    manager = new NpmPackageManager();
    jest.clearAllMocks();
  });

  describe('getLatestVersion', () => {
    it('should return latest version when successful', async () => {
      (execSync as jest.Mock).mockReturnValue('2.0.0\n');

      const result = await manager.getLatestVersion('test-package');
      expect(result).toBe('2.0.0');
      expect(execSync).toHaveBeenCalledWith('npm view test-package version', { encoding: 'utf-8' });
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
    it('should execute npm install command', async () => {
      (execSync as jest.Mock).mockReturnValue(undefined);
      await manager.updatePackage('test-package', '2.0.0');
      expect(execSync).toHaveBeenCalledWith('npm install test-package@2.0.0', { stdio: 'inherit' });
    });
  });

  describe('updateAllPackages', () => {
    it('should execute npm install command with multiple packages', async () => {
      (execSync as jest.Mock).mockReturnValue(undefined);
      await manager.updateAllPackages([
        { name: 'package1', version: '1.0.0' },
        { name: 'package2', version: '2.0.0' }
      ]);
      expect(execSync).toHaveBeenCalledWith('npm install package1@1.0.0 package2@2.0.0', { stdio: 'inherit' });
    });
  });

  describe('install', () => {
    it('should execute npm install command', async () => {
      (execSync as jest.Mock).mockReturnValue(undefined);
      await manager.install();
      expect(execSync).toHaveBeenCalledWith('npm install', { stdio: 'inherit' });
    });
  });

  describe('getLockFile', () => {
    it('should return package-lock.json', () => {
      expect(manager.getLockFile()).toBe('package-lock.json');
    });
  });
}); 