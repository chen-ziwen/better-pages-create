# Better Pages Create

一个基于 Vite 的文件路由生成插件，让项目的路由管理更简单、更直观。目前只支持 `react-router`，但可根据自己的需求自行实现其他框架路由的解析器。

![npm version](https://img.shields.io/badge/npm->=8.0.0-blue)
[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/chen-ziwen/better-pages-create/blob/main/LICENSE)

## 特性

- 📁 **基于文件系统的路由** - 目录结构即路由结构
- 🚀 **零配置** - 开箱即用，无需复杂配置
- 🔄 **热更新** - 自动检测文件变化，实时更新路由和元信息
- 🧩 **嵌套布局** - 支持多层嵌套布局组件
- 🔀 **动态路由** - 支持参数化路由（如 `[id].tsx`）
- 🧠 **智能索引** - 自动处理 index 文件作为默认路由
- 🎯 **路由组** - 使用 `(groupName)` 创建路由组
- 🛠️ **完全类型化** - 使用 TypeScript 提供完整类型支持
- 🔌 **可扩展架构** - 核心与框架分离，支持自定义路由解析器
- 🏷️ **路由元数据** - 通过注释添加路由元信息

## 安装

```bash
# npm
npm install @better-pages-create/react-router

# yarn
yarn add @better-pages-create/react-router

# pnpm
pnpm add @better-pages-create/react-router
```

## 快速开始

### 1. 配置 Vite

在 `vite.config.ts` 中添加插件：

```typescript
import createReactRouterPlugin from '@better-pages-create/react-router'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    createReactRouterPlugin({
      // 可选配置
      dirs: ['src/pages'],
      exclude: ['**/components/**'],
      extendRoute(route, parent) {
         // 添加自定义元数据
         if (route.path?.includes('/admin/')) {
            route.handle = { 
              ...route.handle, 
              requiresAuth: true, 
              role: 'Chiko' 
            }
         }
         return route
      },
      onRoutesGenerated(routes) {
         // 添加全局错误处理路由
         routes.push({
           path: '*',
           name: 'not-found',
           component: './NotFound.tsx'
         })
         return routes
      },
      onClientGenerated(code) {
         // 添加自定义导入或逻辑
         return `
           // 添加路由守卫
           import { setupGuards } from './guards'
     
           ${code}
     
           // 在导出前设置路由守卫
           setupGuards(routes)
         `
      }
    })
  ]
})
```

### 2. 创建路由文件

创建 `src/router.tsx` 文件：

```tsx
import { createBrowserRouter } from 'react-router-dom'
// routes 是根据文件结构自动生成的路由结构
import routes from '~react-pages'

export default createBrowserRouter(routes)
```

### 3. 在主入口使用路由

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
```

## 文件系统路由规则

### 基本路由

- `src/pages/home/index.tsx` → `/home`
- `src/pages/about/index.tsx` → `/about`
- `src/pages/contact/index.tsx` → `/contact`

### 动态路由

- `src/pages/users/[id].tsx` → `/users/:id`
- `src/pages/posts/[...slug].tsx` → `/posts/*`

### 嵌套布局

- `src/pages/layout.tsx` → 根布局
- `src/pages/dashboard/layout.tsx` → Dashboard 布局

### 路由组

路由组不会影响 URL 路径，但可以共享布局。

- `src/pages/(auth)/login/index.tsx` → `/login`
- `src/pages/(auth)/register/index.tsx` → `/register`

### 下划线前缀路由

带下划线前缀的文件夹用于组织和归类相关文件，但不会在 URL 路径中产生额外的路径段。

- `src/pages/_exception/404/index.tsx` → `/404`
- `src/pages/_utils/helpers/index.tsx` → `/helpers`


### 特殊文件

特殊文件会在内部进行处理，每个路由文件夹下都可以定义这几个名称的文件。

- `index.tsx` - 默认路由
- `layout.tsx` - 布局组件
- `error.tsx` - 错误处理组件
- `loading.tsx` - 加载状态组件
  
### 路由元数据

你可以通过在组件文件中添加特殊注释 `@handle` 来为路由添加元数据：

```tsx
// 目前 @handle {} 大括号中的数据必须是 JSON 格式
// 后续版本可能会优化这个问题

/**
 * @handle {
 *   "role": "Chiko",
 *   "auth": true,
 *   "menu": {
 *     "title": "Dashboard",
 *     "icon": "chart"
 *   }
 * }
 */

import React from 'react'

export default function Dashboard() {
  return <div>Dashboard Page</div>
}
```

这些元数据将被自动提取并添加到生成的路由对象中的 `handle` 属性中，可以在路由守卫或组件中访问：

```tsx
// 在组件中使用
import { useMatches } from 'react-router-dom'

// 在路由组件中访问handle属性
function MenuTitle() {
  const matches = useMatches()
  const activeRoute = matches[matches.length - 1]

  return <h1>{activeRoute.handle?.menu?.title || 'Untitled'}</h1>
}
```

## 配置选项

```typescript
interface UserOptions {
  // 页面目录，可以是字符串或配置对象数组
  dirs?: string | (string | PageOptions)[]

  // 模块 ID 列表
  moduleIds?: string[]

  // 要排除的文件/目录模式
  exclude?: string[]

  // 路由文件的后缀名
  extensions?: string[]

  // 自定义路由解析器
  resolver?: PageResolver

  // 扩展路由的函数
  extendRoute?: (route: ConstRoute, parent: ConstRoute | undefined) => ConstRoute | void

  // 路由生成后的回调函数
  onRoutesGenerated?: (routes: ConstRoute[]) => Awaitable<ConstRoute[] | void>

  // 客户端代码生成后的回调函数
  onClientGenerated?: (clientCode: string) => Awaitable<string | void>
}
```

## 高级功能

### 自定义路由解析器

Better Pages Create 采用了模块化设计，核心逻辑与框架实现分离，你可以轻松创建适用于其他框架（如 Vue Router、Solid Router 等）的路由解析器。

#### 1. 创建自定义路由解析器

```typescript
import { PageContext, PageResolver } from '@better-pages-create/core'

export function vueResolver(): PageResolver {
  return {
    // 定义模块ID，用于虚拟模块导入
    resolveModuleIds() {
      return ['~vue-pages', 'virtual:vue-pages']
    },

    // 支持的文件扩展名
    resolveExtensions() {
      return ['vue', 'tsx', 'jsx', 'ts', 'js']
    },

    // 生成路由代码
    async resolveRoutes(ctx: PageContext) {
      const routes = await this.getComputedRoutes(ctx)
      // 生成适用于 Vue Router 的代码
      return generateVueRouterCode(routes, ctx.options)
    },

    // 计算路由结构
    async getComputedRoutes(ctx: PageContext) {
      // 转换为 Vue Router 路由结构
      return computeVueRoutes(ctx)
    }
  }
}
```

#### 2. 路由转换和代码生成

你需要实现路由转换逻辑，将文件系统结构转换为特定框架的路由格式，并生成相应的客户端代码：

```typescript
function computeVueRoutes(ctx: PageContext) {
  // 实现路由计算逻辑
}

function generateVueRouterCode(routes, options) {
  // 生成 Vue Router 代码
  return `
    import { createRouter } from 'vue-router'

    const routes = ${JSON.stringify(routes, null, 2)}

    export default routes
  `
}
```

#### 3. 创建框架特定插件

```typescript
import type { Plugin } from 'vite'
import betterPagesPlugin, { UserOptions } from '@better-pages-create/core'

import { vueResolver } from './resolver'

export function createVueRouterPlugin(userOptions: UserOptions = {}): Plugin {
  // 设置自定义解析器
  userOptions.resolver = vueResolver()

  // 使用核心插件
  return betterPagesPlugin(userOptions)
}
```

## 示例

查看 [examples/react](https://github.com/chen-ziwen/better-pages-create/tree/main/examples/react) 目录获取完整示例。

## 许可证

MIT

## 贡献

欢迎提交 `Issues` 和 `Pull Requests` ！

## 致谢

灵感来自以下项目:

- [vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages) 
- [elegant-router](https://github.com/soybeanjs/elegant-router) 
