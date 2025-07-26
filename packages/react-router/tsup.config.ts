import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  minify: true,
  outDir: 'dist',
  external: [
    '@better-pages-create/core',
    '@better-pages-create/shared',
    'react',
    'react-router-dom',
    'extract-comments',
  ],
})
