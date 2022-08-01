import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/components/index.js'),
      name: 'seed-ui',
      formats: ['es', 'umd'],
      fileName: (format) => `seed-ui.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-router-dom', '@emotion/styled', 'lodash'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-router-dom': 'react-router-dom',
          '@emotion/styled': 'styled',
          lodash: '_',
        },
      },
    },
  },
});
