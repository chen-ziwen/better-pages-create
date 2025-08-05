import type { ModuleNode, ViteDevServer } from 'vite'
import type { ResolvedOptions, UserOptions } from './types'
import { resolve } from 'node:path'
import { slash, toArray } from '@antfu/utils'
import { debug, MODULE_ID_VIRTUAL } from '@better-pages-create/shared'
import micromatch from 'micromatch'
import { getPageDirs } from './files'

export function isPagesDir(path: string, options: ResolvedOptions) {
  for (const page of options.dirs) {
    const dirPath = slash(resolve(options.root, page.dir))
    if (path.startsWith(dirPath))
      return true
  }
  return false
}

export function isTarget(path: string, options: ResolvedOptions) {
  return (
    isPagesDir(path, options)
    && !micromatch.isMatch(path, options.exclude)
    && options.extensionsRE.test(path)
  )
}

export function invalidatePagesModule(server: ViteDevServer) {
  const { moduleGraph } = server
  const mods = moduleGraph.getModulesByFile(MODULE_ID_VIRTUAL)
  if (mods) {
    const seen = new Set<ModuleNode>()
    mods.forEach((mod) => {
      moduleGraph.invalidateModule(mod, seen)
    })
  }
}

export function resolvePageDirs(dirs: UserOptions['dirs'], root: string, exclude: string[]) {
  dirs = toArray(dirs)
  return dirs.flatMap((dir) => {
    const option = typeof dir === 'string' ? { dir, baseRoute: '' } : dir
    option.dir = slash(resolve(root, option.dir)).replace(`${root}/`, '')
    option.baseRoute = option.baseRoute.replace(/^\//, '').replace(/\/$/, '')

    return getPageDirs(option, root, exclude)
  })
}

export { debug }
