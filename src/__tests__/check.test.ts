import { Check } from '../check';
import { PackageManagerFactory } from '../package-managers/factory';
import { Config } from '../config/config';

jest.mock('../package-managers/factory');
jest.mock('../config/config');

describe('Check', () => {
  let check: Check;
  const mockConfig = {
    loadConfig: jest.fn().mockReturnValue({ exclude: [] })
  };

  const mockPackageManager = {
    getLatestVersion: jest.fn(),
    updatePackage: jest.fn(),
    install: jest.fn(),
    getLockFile: jest.fn(),
    getPackageManager: jest.fn()
  };

  beforeEach(() => {
    (Config as jest.Mock).mockImplementation(() => mockConfig);
    (PackageManagerFactory.create as jest.Mock).mockResolvedValue(mockPackageManager);
    check = new Check();
    jest.clearAllMocks();
  });

  describe('checkUpdates', () => {
    it('should check updates for all dependencies', async () => {
      const mockPackageJson = {
        dependencies: {
          'test-package': '^1.0.0'
        },
        devDependencies: {
          'dev-package': '~2.0.0'
        }
      };

      mockPackageManager.getLatestVersion.mockResolvedValue('2.0.0');

      // Mock fs.readFileSync
      jest.spyOn(require('fs'), 'readFileSync').mockReturnValue(JSON.stringify(mockPackageJson));

      // Mock console.log
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await check.checkUpdates();

      expect(consoleSpy).toHaveBeenCalled();
      expect(mockPackageManager.getLatestVersion).toHaveBeenCalledTimes(2);
    });

    it('should handle failed version fetches', async () => {
      const mockPackageJson = {
        dependencies: {
          'test-package': '^1.0.0'
        }
      };

      mockPackageManager.getLatestVersion.mockResolvedValue(null);

      // Mock fs.readFileSync
      jest.spyOn(require('fs'), 'readFileSync').mockReturnValue(JSON.stringify(mockPackageJson));

      // Mock console.log
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await check.checkUpdates();

      expect(consoleSpy).toHaveBeenCalled();
      expect(mockPackageManager.getLatestVersion).toHaveBeenCalledWith('test-package');
    });
  });
}); 