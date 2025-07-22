import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import betterPagesPlugin from 'better-pages-create'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    react(),
    betterPagesPlugin({
      // 指定页面目录
      dirs: ['src/pages'],
      // 支持的文件扩展名
      extensions: ['tsx', 'jsx'],
      // 配置别名，与 vite 配置保持一致
      alias: {
        '@': 'src',
        '~': '.',
      },
      // 扩展路由配置
      extendRoute(route) {
        route.handle = {
          ...route.handle,
          // 添加自定义属性
          i18nKey: route.name,
        }
        return route
      },
      // 路由生成后的回调
      onRoutesGenerated(routes) {
        console.log('Generated routes:', routes)
        return routes
      },
      // 客户端代码生成后的回调
      onClientGenerated(clientCode) {
        console.log('Generated client code length:', clientCode.length)
        return clientCode
      },
    }),
  ],
  server: {
    port: 3000,
  },
})
