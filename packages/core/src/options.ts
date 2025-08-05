import type { PageResolver, ResolvedOptions, UserOptions } from './types'
import process from 'node:process'
import { slash } from '@antfu/utils'
import { MODULE_IDS } from '@better-pages-create/shared'
import { resolvePageDirs } from './utils'

export function resolveOptions(userOptions: UserOptions, viteRoot?: string): ResolvedOptions {
  const {
    dirs = ['src/pages'],
    exclude = ['**/components/**', '**/modules/**'],
    extendRoute,
    onRoutesGenerated,
    onClientGenerated,
  } = userOptions

  const root = viteRoot || slash(process.cwd())

  const resolver = userOptions.resolver as PageResolver

  const extensions = userOptions.extensions || resolver.resolveExtensions()

  const extensionsRE = new RegExp(`\\.(${extensions.join('|')})$`)

  const resolvedDirs = resolvePageDirs(dirs, root, exclude)

  const moduleIds = userOptions.moduleId ? [userOptions.moduleId] : resolver.resolveModuleIds() || MODULE_IDS

  const resolvedOptions: ResolvedOptions = {
    dirs: resolvedDirs,
    moduleIds,
    root,
    extensions,
    exclude,
    resolver,
    extensionsRE,
    extendRoute,
    onRoutesGenerated,
    onClientGenerated,
  }

  return resolvedOptions
}
