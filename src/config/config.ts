import fs from 'fs';
import path from 'path';
import { IConfig } from '../types/config.type';

export class Config {
  private configPath = path.resolve(process.cwd(), 'dep-checker.config.json');

  public loadConfig(): IConfig {
    if (fs.existsSync(this.configPath)) {
      const raw = fs.readFileSync(this.configPath, 'utf-8');
      return JSON.parse(raw);
    }

    return {
      exclude: [],
    };
  }
}
