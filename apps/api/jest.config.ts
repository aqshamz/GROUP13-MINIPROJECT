/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node', 
  clearMocks: true, 
  coverageProvider: 'v8', 
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], 
  roots: ['<rootDir>/tests'], 
  testMatch: ['**/*.test.ts'], 
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json', 
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Add this line to map @/ to src/
  },
 
};

export default config;
