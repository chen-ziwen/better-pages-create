import react from '@vitejs/plugin-react'
import pagesPlugin from 'better-pages-create'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    pagesPlugin({
      // 指定页面目录
      dirs: ['src/pages'],
      // 使用 React 解析器
      resolver: 'react',
      // 路由风格，支持 'next'、'nuxt'、'remix'
      routeStyle: 'next',
      // 支持的文件扩展名
      extensions: ['tsx', 'jsx', 'ts', 'js'],
      // 导入模式：同步导入首页，异步导入其他页面
      importMode: (filepath) => {
        // 首页同步导入，其他页面异步导入以支持代码分割
        return filepath.includes('index') ? 'sync' : 'async'
      },
      // 扩展路由配置
      extendRoute(route) {
        // 可以在这里添加自定义的路由属性
        return route
      },
      // 路由生成后的回调
      onRoutesGenerated(routes) {
        console.log('Generated routes:', routes)
        return routes
      },
    }),
  ],
  server: {
    port: 3000,
    open: true,
  },
})
