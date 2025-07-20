# Better Pages Create - React 示例

这是一个展示 `better-pages-create` 插件功能的完整 React 应用示例。该插件提供了基于文件系统的自动路由生成功能，类似于 Next.js 的页面路由。

## 🚀 快速开始

### 安装依赖

```bash
# 在项目根目录安装依赖
pnpm install

# 进入示例目录
cd example/react

# 安装示例项目依赖
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

应用将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
pnpm build
```

### 预览生产版本

```bash
pnpm preview
```

## 📁 项目结构

```
example/react/
├── src/
│   ├── pages/                    # 页面目录（自动生成路由）
│   │   ├── index.tsx            # 首页 → /
│   │   ├── about.tsx            # 关于页面 → /about
│   │   ├── dashboard.tsx        # 仪表板 → /dashboard
│   │   ├── blog/
│   │   │   ├── index.tsx        # 博客布局 → /blog
│   │   │   └── [slug].tsx       # 博客详情 → /blog/:slug
│   │   └── users/
│   │       ├── index.tsx        # 用户布局 → /users
│   │       ├── create.tsx       # 创建用户 → /users/create
│   │       ├── [id].tsx         # 用户详情 → /users/:id
│   │       └── [id]/
│   │           └── edit.tsx     # 编辑用户 → /users/:id/edit
│   ├── App.tsx                  # 主应用组件
│   ├── main.tsx                 # 应用入口
│   └── index.css                # 全局样式
├── vite.config.ts               # Vite 配置
├── package.json
└── README.md
```

## 🎯 功能特性

### 1. 自动路由生成

基于文件系统自动生成路由，无需手动配置：

- `pages/index.tsx` → `/`
- `pages/about.tsx` → `/about`
- `pages/blog/index.tsx` → `/blog`
- `pages/blog/[slug].tsx` → `/blog/:slug`

### 2. 嵌套路由

支持多层嵌套路由和布局组件：

```
users/
├── index.tsx        # 用户布局组件
├── create.tsx       # /users/create
├── [id].tsx         # /users/:id (用户详情布局)
└── [id]/
    └── edit.tsx     # /users/:id/edit
```

### 3. 动态路由

使用 `[param]` 语法创建动态路由：

- `[slug].tsx` → `:slug` 参数
- `[id].tsx` → `:id` 参数

### 4. 代码分割

自动为每个页面生成独立的代码块，提高加载性能。

### 5. TypeScript 支持

完整的 TypeScript 类型支持，包括路由参数类型推断。

## ⚙️ 配置说明

### Vite 配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pagesPlugin from 'better-pages-create'

export default defineConfig({
  plugins: [
    react(),
    pagesPlugin({
      // 页面目录
      dirs: ['src/pages'],
      // 解析器类型
      resolver: 'react',
      // 路由风格：next | nuxt | remix
      routeStyle: 'next',
      // 支持的文件扩展名
      extensions: ['tsx', 'jsx', 'ts', 'js'],
      // 导入模式
      importMode: (filepath) => {
        return filepath.includes('index') ? 'sync' : 'async'
      }
    })
  ]
})
```

### 路由使用

```typescript
// App.tsx
import routes from '~react-pages'

function App() {
  return (
    <Routes>
      {routes}
    </Routes>
  )
}
```

## 📖 示例页面说明

### 首页 (`/`)
- 展示插件的主要功能
- 提供导航到其他示例页面的链接
- 显示基本的使用方法

### 关于页面 (`/about`)
- 简单的静态页面示例
- 展示基本的文件路由功能

### 博客 (`/blog`)
- 嵌套路由示例
- 布局组件 + 子路由
- 动态路由参数 (`[slug]`)

### 用户管理 (`/users`)
- 复杂的多层嵌套路由
- 展示 CRUD 操作的路由结构
- 三层嵌套路由示例

### 仪表板 (`/dashboard`)
- 受保护页面示例
- 展示实际应用中的复杂页面

## 🔧 自定义配置

### 修改页面目录

```typescript
pagesPlugin({
  dirs: ['src/views', 'src/components/pages']
})
```

### 自定义路由风格

```typescript
pagesPlugin({
  routeStyle: 'nuxt' // 使用 Nuxt.js 风格的路由
})
```

### 扩展路由配置

```typescript
pagesPlugin({
  extendRoute(route, parent) {
    // 为特定路由添加元数据
    if (route.path === '/dashboard') {
      route.meta = { requiresAuth: true }
    }
    return route
  }
})
```

## 🚀 部署

### 构建

```bash
pnpm build
```

### 部署到静态托管

构建后的文件在 `dist` 目录中，可以部署到任何静态文件托管服务：

- Vercel
- Netlify
- GitHub Pages
- 阿里云 OSS
- 腾讯云 COS

### 服务器配置

由于使用了客户端路由，需要配置服务器将所有路由重定向到 `index.html`：

#### Nginx

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

#### Apache

```apache
RewriteEngine On
RewriteRule ^(?!.*\.).*$ /index.html [L]
```

## 📚 更多资源

- [Vite 官方文档](https://vitejs.dev/)
- [React Router 官方文档](https://reactrouter.com/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
