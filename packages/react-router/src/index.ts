import type { UserOptions } from '@better-pages-create/core'
import type { Plugin } from 'vite'
import betterPagesPlugin from '@better-pages-create/core'
import { reactResolver } from './resolver'

export * from './resolver'
export * from './stringify'
export * from './transform'
export function createReactRouterPlugin(userOptions: UserOptions = {}): Plugin {
  userOptions.resolver = reactResolver()

  const plugin = betterPagesPlugin(userOptions)

  return plugin
}

export default createReactRouterPlugin
