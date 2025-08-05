import type { Plugin } from 'vite'
import type { UserOptions } from './types'
import { MODULE_ID_VIRTUAL, parsePageRequest } from '@better-pages-create/shared'
import { PageContext } from './context'

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

    configureServer(server) {
      ctx.setupViteServer(server)
    },

    resolveId(id) {
      if (ctx.options.moduleIds.includes(id)) {
        return `${MODULE_ID_VIRTUAL}?id=${id}`
      }

      return null
    },

    async load(id) {
      const {
        moduleId,
        pageId,
      } = parsePageRequest(id)

      if (moduleId === MODULE_ID_VIRTUAL && pageId && ctx.options.moduleIds.includes(pageId)) {
        return ctx.resolveRoutes()
      }
    },
  }
}

export * from './types'
export { MODULE_ID_VIRTUAL, PageContext }
export default createCorePlugin
