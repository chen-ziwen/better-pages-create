# @better-pages-create/core

Better Pages Create 的核心功能包，提供文件路由系统的基础功能。

## 安装

```bash
# npm
npm install @better-pages-create/core

# yarn
yarn add @better-pages-create/core

# pnpm
pnpm add @better-pages-create/core
```

## 使用

这个包通常不直接使用，而是通过其他集成包（如`@better-pages-create/react-router`）使用。

如果您想创建自己的集成，可以直接使用此包：

```ts
import type { PageResolver, UserOptions } from '@better-pages-create/core'
import betterPagesPlugin from '@better-pages-create/core'

// 创建您自己的解析器
const myResolver: PageResolver = {
  // 实现解析器接口...
  // 包含路由生成(或伪路由) 和客户端代码生成
}

// 创建插件
function createMyPlugin(options: UserOptions = {}) {
  options.resolver = myResolver
  return betterPagesPlugin(options)
}
```

## 文档

请参阅 [主项目文档](https://github.com/chen-ziwen/better-pages-create/blob/main/README.md) 获取更多信息。

## 许可证

MIT
