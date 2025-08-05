import type { ConstRoute, CustomBlock, PageContext, PageResolver } from '@better-pages-create/core'
import { countSlash } from '@better-pages-create/shared'
import { dequal } from 'dequal'
import colors from 'picocolors'
import { extractHandleFromFile } from './extract'
import { generateReactClientCode } from './stringify'
import {
  transformPageGlobToRouterFile,
  transformRouterEntriesToTrees,
  transformRouterFilesToMaps,
  transformRouteTreeToElegantConstRoute,
} from './transform'

async function computeReactRoutes(ctx: PageContext, customBlockMap: Map<string, CustomBlock>): Promise<ConstRoute[]> {
  const { onRoutesGenerated } = ctx.options

  const pageRoutes = [...ctx.pageRouteMap.values()].sort((a, b) => countSlash(a.route) - countSlash(b.route))

  const files = pageRoutes.map(page => transformPageGlobToRouterFile(page, customBlockMap))

  const maps = transformRouterFilesToMaps(files)

  const trees = transformRouterEntriesToTrees(maps, files)

  let routes = trees.map(tree => transformRouteTreeToElegantConstRoute(tree, ctx.options))

  if (onRoutesGenerated) {
    const result = await onRoutesGenerated(routes)
    if (result) {
      routes = result
    }
  }

  return routes
}

async function resolveReactRoutes(ctx: PageContext, customBlockMap: Map<string, CustomBlock>) {
  const finalRoutes = await computeReactRoutes(ctx, customBlockMap)

  let client = generateReactClientCode(finalRoutes)
  client = (await ctx.options.onClientGenerated?.(client)) || client

  return client
}

export function reactResolver(): PageResolver {
  const customBlockMap = new Map<string, CustomBlock>()

  async function checkCustomBlockChange(ctx: PageContext, path: string) {
    const exitsCustomBlock = customBlockMap.get(path)
    let customBlock: CustomBlock | null
    try {
      customBlock = extractHandleFromFile(path)
    }
    catch (error: any) {
      ctx.logger?.error(colors.red(`[better-pages-create] ${error.message}`))
      return
    }

    if (!exitsCustomBlock && !customBlock) {
      return
    }

    if (!customBlock) {
      customBlockMap.delete(path)
      ctx.debug.routeBlock('%s deleted', path)
      return
    }

    if (!exitsCustomBlock || !dequal(exitsCustomBlock, customBlock)) {
      ctx.debug.routeBlock('%s old: %O', path, exitsCustomBlock)
      ctx.debug.routeBlock('%s new: %O', path, customBlock)
      customBlockMap.set(path, customBlock)
      ctx.onUpdate()
    }
  }

  return {
    resolveModuleIds() {
      return ['~react-pages', 'virtual:better-pages-create']
    },
    resolveExtensions() {
      return ['tsx', 'jsx', 'ts', 'js']
    },
    async resolveRoutes(ctx) {
      return resolveReactRoutes(ctx, customBlockMap)
    },
    async getComputedRoutes(ctx) {
      return computeReactRoutes(ctx, customBlockMap)
    },
    hmr: {
      added: async (ctx, path) => {
        checkCustomBlockChange(ctx, path)
      },
      changed: async (ctx, path) => {
        checkCustomBlockChange(ctx, path)
      },
      removed: async (_, path) => {
        customBlockMap.delete(path)
      },
    },
  }
}
