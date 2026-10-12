import react from '@vitejs/plugin-react';
import path from 'node:path';
import fs from 'node:fs';
import { defineConfig } from 'vite';

// 토큰 단일 소스(seedTheme.css)를 dist 로 복사한다.
// 런타임엔 seedTheme.js 가 ?raw 로 인라인 주입하지만, dist 의 실제 .css 가 있어야
// 소비 앱 IDE 가 var(--seed-*) 를 해석할 수 있다.
const copySeedThemeCss = () => ({
  name: 'copy-seed-theme-css',
  closeBundle() {
    const from = path.resolve(__dirname, 'src/styles/seedTheme.css');
    const to = path.resolve(__dirname, 'dist/seedTheme.css');
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
  },
});

export default defineConfig({
  plugins: [
    react(),
    copySeedThemeCss(),
    // react({
    //   babel: {
    //     plugins: ['babel-plugin-react-compiler'],
    //   },
    // }),
  ],
  build: {
    lib: {
      // 멀티 엔트리: 메인(seed-ui)과 Dashboard(gridstack 포함)를 분리 빌드.
      // umd는 멀티 엔트리 불가 → es만. (소비앱은 번들러(vite) 사용으로 es 소비)
      entry: {
        'seed-ui': path.resolve(__dirname, 'src/components/index.js'),
        dashboard: path.resolve(__dirname, 'src/components/Dashboard.jsx'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        /^react($|\/)/,
        /^react-dom($|\/)/,
        /^react-router-dom($|\/)/,
        /^@emotion\//,
        'lodash',
        'zustand',
        /^react-icons/,
        /^lodash\//,
        // gridstack은 Dashboard 전용 → external+optional peer. 메인 번들서 제외
        /^gridstack($|\/)/,
      ],
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name][extname]',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-router-dom': 'react-router-dom',
          '@emotion/styled': 'styled',
          '@emotion/react': 'emotionReact',
          lodash: '_',
          zustand: 'zustand',
        },
      },
    },
  },
});
