// jest.config.ts
import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  modulePathIgnorePatterns: ['build'],
  setupFilesAfterEnv: ['./api/test/unitConfig.ts'],
};
export default config;
