import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';

import path from 'path';
import { defineConfig } from 'vite';

import manifest from './manifest.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      { find: '@background', replacement: path.resolve(__dirname, 'src/background') },
      { find: '@browsers', replacement: path.resolve(__dirname, 'src/shared/browsers') },
      { find: '@content', replacement: path.resolve(__dirname, 'src/content') },
      { find: '@popup', replacement: path.resolve(__dirname, 'src/popup') },
      { find: '@actions', replacement: path.resolve(__dirname, 'src/shared/actions') },
      { find: '@constants', replacement: path.resolve(__dirname, 'src/shared/constants') },
      { find: '@hooks', replacement: path.resolve(__dirname, 'src/shared/hooks') },
      { find: '@selectors', replacement: path.resolve(__dirname, 'src/shared/selectors') },
      { find: '@services', replacement: path.resolve(__dirname, 'src/shared/services') },
      { find: '@utils', replacement: path.resolve(__dirname, 'src/shared/utils') },
    ],
  },
});
