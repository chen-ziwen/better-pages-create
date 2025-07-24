import type { UserOptions } from '@better-pages-create/core'
import type { Plugin } from 'vite'
import betterPagesPlugin from '@better-pages-create/core'
import { reactResolver } from '@better-pages-create/react-router'

function createBetterPagesPlugin(userOptions: UserOptions = {}): Plugin {
  // 如果未指定解析器，默认使用 React 解析器
  if (!userOptions.resolver) {
    userOptions.resolver = reactResolver()
  }

  return betterPagesPlugin(userOptions)
}

// 选择性地导出核心包的内容，避免重复导出
export {
  PageContext,
  stringifyRoutes,
} from '@better-pages-create/core'

export * from '@better-pages-create/react-router'
export * from '@better-pages-create/utils'

export default createBetterPagesPlugin
