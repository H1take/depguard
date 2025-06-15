import { NpmPackageManager } from '../../package-managers/npm';
import axios from 'axios';
import { exec } from 'child_process';

jest.mock('axios');
jest.mock('child_process');

describe('NpmPackageManager', () => {
  let manager: NpmPackageManager;

  beforeEach(() => {
    manager = new NpmPackageManager();
    jest.clearAllMocks();
  });

  describe('getLatestVersion', () => {
    it('should return latest version when successful', async () => {
      const mockResponse = { data: { version: '2.0.0' } };
      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await manager.getLatestVersion('test-package');
      expect(result).toBe('2.0.0');
      expect(axios.get).toHaveBeenCalledWith('https://registry.npmjs.org/test-package/latest');
    });

    it('should return null when request fails', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await manager.getLatestVersion('test-package');
      expect(result).toBeNull();
    });
  });

  describe('updatePackage', () => {
    it('should execute npm install command', async () => {
      (exec as unknown as jest.Mock).mockImplementation((cmd, callback) => {
        callback(null, { stdout: '', stderr: '' });
      });

      await manager.updatePackage('test-package', '2.0.0');
      expect(exec).toHaveBeenCalledWith(
        'npm install test-package@2.0.0 --save-exact',
        expect.any(Function)
      );
    });
  });

  describe('install', () => {
    it('should execute npm install command', async () => {
      (exec as unknown as jest.Mock).mockImplementation((cmd, callback) => {
        callback(null, { stdout: '', stderr: '' });
      });

      await manager.install();
      expect(exec).toHaveBeenCalledWith('npm install', expect.any(Function));
    });
  });

  describe('getLockFile', () => {
    it('should return package-lock.json', () => {
      expect(manager.getLockFile()).toBe('package-lock.json');
    });
  });
}); 