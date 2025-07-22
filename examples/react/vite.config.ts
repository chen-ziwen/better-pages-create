import react from '@vitejs/plugin-react'
import betterPagesPlugin from 'better-pages-create'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    betterPagesPlugin({
      // 指定页面目录
      dirs: ['src/pages'],
      // 支持的文件扩展名
      extensions: ['tsx', 'jsx'],
      // 扩展路由配置 可以识别到每个路由项
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
        console.log('Generated routes:', JSON.stringify(routes, null, 2))
        return routes
      },
    }),
  ],
  server: {
    port: 3000,
  },
})
