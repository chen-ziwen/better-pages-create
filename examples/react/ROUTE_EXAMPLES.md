# 路由案例说明

这个示例展示了 `better-pages-create` 的文件系统路由功能。

## 🔧 buildReactRoutePath 函数功能

`buildReactRoutePath` 函数位于 `src/utils.ts` 中，支持以下路由解析规则：

1. **路由组** - `(fileName)` 或 `(fileName)_` → 移除括号部分
2. **Splat 路由** - `[...param]` → `*`
3. **动态参数** - `[param]` → `:param`
4. **可选参数** - `-[param]` → `:param?`

## 📁 新增的路由示例

### 1. 路由组 (Route Groups)

路由组使用括号包围，用于组织相关页面，但不会出现在最终的 URL 中。

#### 文件结构：
```
src/pages/
├── (auth)/
│   ├── login.tsx      → /login
│   └── register.tsx   → /register
└── (dashboard)/
    └── stats.tsx      → /stats
```

#### 示例页面：
- **登录页面** (`/login`) - 来自 `(auth)/login.tsx`
  - 完整的登录表单
  - 展示路由组功能说明
  - 链接到注册页面

- **注册页面** (`/register`) - 来自 `(auth)/register.tsx`
  - 用户注册表单
  - 表单验证示例
  - 链接到登录页面

- **统计页面** (`/stats`) - 来自 `(dashboard)/stats.tsx`
  - 数据统计展示
  - 路由组功能详细说明
  - 模拟统计数据

#### 使用场景：
- 组织相关功能页面（如认证相关页面）
- 共享布局或样式
- 逻辑分组，便于代码管理

### 2. Splat 路由 (Catch-all Routes)

Splat 路由使用 `[...param]` 语法捕获路径中的所有剩余段。

#### 文件结构：
```
src/pages/
├── docs/
│   └── [...path].tsx     → /docs/*
└── files/
    └── [...segments].tsx → /files/*
```

#### 示例页面：
- **文件浏览器** (`/files/*`) - 来自 `files/[...segments].tsx`
  - 模拟文件系统浏览
  - 面包屑导航
  - 路径段解析展示
  - 支持多级目录结构

#### 路径示例：
- `/files/` → segments = []
- `/files/documents` → segments = ["documents"]
- `/files/images/2023/vacation` → segments = ["images", "2023", "vacation"]

#### 使用场景：
- 文件浏览器
- 文档系统的嵌套页面
- 多级分类页面
- 404 页面（捕获所有未匹配路径）

### 3. 可选参数 (Optional Parameters)

可选参数使用 `-[param]` 语法创建，转换为 `:param?`。

#### 文件结构：
```
src/pages/
├── shop/
│   └── -[category].tsx  → /shop/:category?
└── posts/
    └── -[lang].tsx      → /posts/:lang?
```

#### 示例页面：

##### 商店页面 (`/shop/:category?`)
- **无参数** (`/shop`) - 显示所有商品分类
- **有参数** (`/shop/electronics`) - 显示特定分类商品
- 支持的分类：electronics, clothing, books, home, sports
- 动态商品展示
- 分类筛选功能

##### 多语言博客 (`/posts/:lang?`)
- **默认语言** (`/posts`) - 中文博客
- **指定语言** (`/posts/en`) - 英文博客
- 支持语言：zh (中文), en (English), ja (日本語), ko (한국어)
- 语言切换功能
- 多语言内容展示

#### 路径示例：
```
商店页面：
/shop → category = undefined (显示所有分类)
/shop/electronics → category = "electronics"
/shop/clothing → category = "clothing"

博客页面：
/posts → lang = undefined (默认中文)
/posts/en → lang = "en"
/posts/ja → lang = "ja"
```

#### 使用场景：
- 商品分类页面（可显示所有分类或特定分类）
- 多语言支持（可选语言参数）
- 分页功能（可选页码参数）
- 搜索结果（可选搜索关键词）

## 🎯 技术实现要点

### 1. 路由组实现
```typescript
// 正则表达式：/^\([^)]+\)_?$/g
// 匹配 (fileName) 或 (fileName)_ 并替换为空字符串
export const GROUP_RE = [/^\([^)]+\)_?$/g, ''] as const
```

### 2. Splat 路由实现
```typescript
// 正则表达式：/\[\.{3}\w+\]/g
// 匹配 [...param] 并替换为 *
export const SPLAT_RE = [/\[\.{3}\w+\]/g, '*'] as const
```

### 3. 动态参数实现
```typescript
// 正则表达式：/\[([^\]]+)\]/g
// 匹配 [param] 并替换为 :param
export const PARAM_RE = [/\[([^\]]+)\]/g, ':$1'] as const
```

### 4. 可选参数实现
```typescript
// 正则表达式：/^-(:?[\w-]+|\*)/
// 匹配 -[param] 或 -param 并替换为 param? 或 :param?
export const OPTIONAL_RE = [/^-(:?[\w-]+|\*)/, '$1?'] as const
```

## 🚀 如何测试

1. 启动开发服务器：
```bash
cd examples/react
pnpm dev
```

2. 访问示例页面：
- 首页：http://localhost:3000
- 路由组：http://localhost:3000/login, http://localhost:3000/stats
- Splat 路由：http://localhost:3000/files/documents/2023
- 可选参数：http://localhost:3000/shop/electronics, http://localhost:3000/posts/en

3. 查看路由生成结果：
- 访问 http://localhost:3000/debug 查看完整的路由结构

## 📚 相关文档

- [React Router 官方文档](https://reactrouter.com/)
- [Vite 插件开发指南](https://vitejs.dev/guide/api-plugin.html)
- [文件系统路由约定](https://nextjs.org/docs/routing/introduction)

## 🤝 贡献

如果您有更好的路由示例想法，欢迎提交 PR 或 Issue！
