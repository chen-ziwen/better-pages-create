import type { Plugin } from 'vite'
import type { UserOptions } from './types'
import { MODULE_ID_VIRTUAL, ROUTE_BLOCK_ID_VIRTUAL, routeBlockQueryRE } from './constants'

import { PageContext } from './context'
import { parsePageRequest } from './utils'

function pagesPlugin(userOptions: UserOptions = {}): Plugin {
  let ctx: PageContext

  return {
    name: 'vite-plugin-pages',
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
    configureServer(server) {
      ctx.setupViteServer(server)
    },
    resolveId(id) {
      if (ctx.options.moduleIds.includes(id))
        return `${MODULE_ID_VIRTUAL}?id=${id}`

      if (routeBlockQueryRE.test(id))
        return ROUTE_BLOCK_ID_VIRTUAL

      return null
    },
    async load(id) {
      const {
        moduleId,
        pageId,
      } = parsePageRequest(id)

      if (moduleId === MODULE_ID_VIRTUAL && pageId && ctx.options.moduleIds.includes(pageId))
        return ctx.resolveRoutes()

      if (id === ROUTE_BLOCK_ID_VIRTUAL) {
        return {
          code: 'export default {};',
          map: null,
        }
      }

      return null
    },
  }
}

export { syncIndexResolver } from './options'
export type {
  ReactRoute,
} from './resolvers'

export {
  reactResolver,
} from './resolvers'
export * from './types'
export { PageContext }
export default pagesPlugin
