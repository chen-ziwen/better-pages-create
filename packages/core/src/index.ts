import type { Plugin } from 'vite'
import type { UserOptions } from './types'
import { MODULE_ID_VIRTUAL, parsePageRequest } from '@better-pages-create/shared'
import { PageContext } from './context'

/**
 * 创建核心插件
 * 这个函数创建一个基础的 Vite 插件，用于处理文件路由
 *
 * @param userOptions - 用户配置选项
 * @returns Vite 插件
 */
function createCorePlugin(userOptions: UserOptions = {}): Plugin {
  let ctx: PageContext

  return {
    name: 'better-pages-create',
    enforce: 'pre',

    async configResolved(config) {
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
        moduleId,
        pageId,
      } = parsePageRequest(id)

      if (moduleId === MODULE_ID_VIRTUAL && pageId && ctx.options.moduleIds.includes(pageId)) {
        return ctx.resolveRoutes() // 返回生成的客户端代码
      }
    },
  }
}

export * from './types'
export { MODULE_ID_VIRTUAL, PageContext }
export default createCorePlugin
