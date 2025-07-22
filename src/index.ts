import type { Plugin } from 'vite'
import type { UserOptions } from './types'
import { MODULE_ID_VIRTUAL, ROUTE_BLOCK_ID_VIRTUAL } from './constants'
import { PageContext } from './context'
import { parsePageRequest } from './utils'

function betterPagesPlugin(userOptions: UserOptions = {}): Plugin {
  let ctx: PageContext

  return {
    name: 'better-pages-create',
    enforce: 'pre',

    async configResolved(config) {
      if (
        !userOptions.resolver
        && config.plugins.find(i => i.name.includes('vite:react'))
      ) {
        userOptions.resolver = 'react'
      }

      ctx = new PageContext(userOptions, config.root)
      ctx.setLogger(config.logger)

      await ctx.searchGlob()
    },
    api: {
      getResolvedRoutes() {
        return ctx.options.resolver.getComputedRoutes(ctx)
      },
    },

    /**
     * 配置开发服务器钩子
     * 设置开发服务器相关功能，如热模块替换
     */
    configureServer(server) {
      ctx.setupViteServer(server)
    },

    /**
     * 模块 ID 解析钩子
     * 将虚拟模块 ID 解析为实际的模块路径
     */
    resolveId(id) {
      // 检查是否为页面模块 ID
      if (ctx.options.moduleIds.includes(id)) {
        return `${MODULE_ID_VIRTUAL}?id=${id}`
      }

      return null
    },

    /**
     * 模块加载钩子
     * 加载虚拟模块的内容
     */
    async load(id) {
      const {
        moduleId, // 模块 ID
        pageId, // 页面 ID
      } = parsePageRequest(id)

      // 加载页面路由模块
      if (moduleId === MODULE_ID_VIRTUAL && pageId && ctx.options.moduleIds.includes(pageId))
        return ctx.resolveRoutes() // 返回生成的路由代码

      // 加载路由块模块
      if (id === ROUTE_BLOCK_ID_VIRTUAL) {
        return {
          code: 'export default {};', // 返回空的默认导出
          map: null, // 无源映射
        }
      }

      return null // 不处理其他模块
    },
  }
}

export * from './types'

export { PageContext }
export default betterPagesPlugin
