# @better-pages-create/react-router

Better Pages Create 的 React Router 集成包，提供基于文件系统的 React 路由功能。

## 安装

```bash
# npm
npm install @better-pages-create/react-router

# yarn
yarn add @better-pages-create/react-router

# pnpm
pnpm add @better-pages-create/react-router
```

## 使用

在您的 Vite 配置文件中添加插件：

```ts
import betterPagesPlugin from '@better-pages-create/react-router'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    betterPagesPlugin({
      // 配置选项
      dirs: ['src/pages'],
      extensions: ['tsx', 'jsx'],
      extendRoute(route, parent) {
        return route
      }
    }),
  ],
})
```

然后在您的应用中使用生成的路由：

```jsx
// src/App.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import routes from '~react-pages'

const router = createBrowserRouter(routes)

export default function App() {
  return <RouterProvider router={router} />
}
```

## 文件路由规则

- `src/pages/index.tsx` → `/`
- `src/pages/about/index.tsx` → `/about`
- `src/pages/users/[id].tsx` → `/users/:id`
- `src/pages/users/[...all].tsx` → `/users/*`
- `src/pages/blog/(group)/post/index.tsx` → `/blog/post`
- `src/pages/(auth)/login/index.tsx` → `/login` (带 auth 布局)
- `src/pages/layout.tsx` → 布局组件

## 文档

请参阅 [主项目文档](https://github.com/chen-ziwen/better-pages-create/blob/main/README.md) 获取更多信息。

## 许可证

MIT
