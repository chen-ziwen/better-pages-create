import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
    // 忽略extract-comments模块的类型检查
    compilerOptions: {
      skipLibCheck: true,
    },
  },
  clean: true,
  sourcemap: true,
  treeshake: true,
  outDir: 'dist',
  external: ['@better-pages-create/core', '@better-pages-create/utils', 'react', 'react-router-dom'],
  noExternal: ['extract-comments'],
})
