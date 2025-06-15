import { YarnPackageManager } from '../../package-managers/yarn';
import axios from 'axios';
import { exec } from 'child_process';

jest.mock('axios');
jest.mock('child_process');

describe('YarnPackageManager', () => {
  let manager: YarnPackageManager;

  beforeEach(() => {
    manager = new YarnPackageManager();
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
    it('should execute yarn add command', async () => {
      (exec as unknown as jest.Mock).mockImplementation((cmd, callback) => {
        callback(null, { stdout: '', stderr: '' });
      });

      await manager.updatePackage('test-package', '2.0.0');
      expect(exec).toHaveBeenCalledWith(
        'yarn add test-package@2.0.0 --exact',
        expect.any(Function)
      );
    });
  });

  describe('install', () => {
    it('should execute yarn install command', async () => {
      (exec as unknown as jest.Mock).mockImplementation((cmd, callback) => {
        callback(null, { stdout: '', stderr: '' });
      });

      await manager.install();
      expect(exec).toHaveBeenCalledWith('yarn install', expect.any(Function));
    });
  });

  describe('getLockFile', () => {
    it('should return yarn.lock', () => {
      expect(manager.getLockFile()).toBe('yarn.lock');
    });
  });
}); 