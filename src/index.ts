/**
 * Vite 页面插件主入口文件
 * 实现基于文件系统的自动路由生成功能
 */

import type { Plugin } from 'vite'
import type { UserOptions } from './types'
import { MODULE_ID_VIRTUAL, ROUTE_BLOCK_ID_VIRTUAL } from './constants'
import { PageContext } from './context' // 页面上下文类
import { parsePageRequest } from './utils' // 请求解析工具

/**
 * 页面插件工厂函数
 * @param userOptions - 用户配置选项，默认为空对象
 * @returns Vite 插件对象
 */
function pagesPlugin(userOptions: UserOptions = {}): Plugin {
  let ctx: PageContext // 页面上下文实例

  return {
    name: 'vite-plugin-pages', // 插件名称
    enforce: 'pre', // 插件执行顺序：在其他插件之前执行

    /**
     * 配置解析完成钩子
     * 在 Vite 配置解析完成后调用，用于初始化插件
     */
    async configResolved(config) {
      // 自动检测 React 项目并设置解析器
      if (
        !userOptions.resolver // 用户未指定解析器
        && config.plugins.find(i => i.name.includes('vite:react')) // 存在 React 插件
      ) {
        userOptions.resolver = 'react' // 自动设置为 React 解析器
      }

      // 创建页面上下文实例
      ctx = new PageContext(userOptions, config.root)
      ctx.setLogger(config.logger) // 设置日志记录器
      await ctx.searchGlob() // 搜索页面文件
    },
    /**
     * 插件 API
     * 提供外部访问插件功能的接口
     */
    api: {
      /**
       * 获取已解析的路由
       * @returns 计算后的路由数组
       */
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
      if (ctx.options.moduleIds.includes(id))
        return `${MODULE_ID_VIRTUAL}?id=${id}`

      // // 检查是否为路由块查询
      // if (routeBlockQueryRE.test(id))
      //   return ROUTE_BLOCK_ID_VIRTUAL

      return null // 不处理其他 ID
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

export { syncIndexResolver } from './options'

export type {
  ReactRoute, // React 路由类型
} from './resolvers'

export {
  reactResolver, // React 解析器
} from './resolvers'

export * from './types'

export { PageContext }
export default pagesPlugin
