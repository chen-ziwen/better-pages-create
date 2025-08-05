# @better-pages-create/shared

Better Pages Create 的共享工具包，提供核心包和集成包共用的工具函数。

## 安装

```bash
npm install @better-pages-create/shared
```

## 使用

这个包主要供内部使用，通常不需要直接导入。如果您正在开发自己的集成，可以使用此包中的工具：

```js
import { countSlash, debug, extsToGlob } from '@better-pages-create/shared'

// 使用调试工具
debug.pages('Processing pages...')

// 将扩展名数组转换为glob模式
const glob = extsToGlob(['tsx', 'jsx']) // 返回 "{tsx,jsx}"

// 计算路径中的斜杠数量
const depth = countSlash('/users/profile') // 返回 2
```

## 文档

请参阅 [主项目文档](https://github.com/chen-ziwen/better-pages-create/blob/main/README.md) 获取更多信息。

## 许可证

MIT
