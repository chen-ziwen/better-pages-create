import type { ModuleNode, ViteDevServer } from 'vite'
import type { ResolvedOptions, UserOptions } from './types'
import { resolve } from 'node:path'
import { slash, toArray } from '@antfu/utils'
import { debug, MODULE_ID_VIRTUAL } from '@better-pages-create/shared'
import micromatch from 'micromatch'
import { getPageDirs } from './files'

/**
 * 检查路径是否在页面目录中
 * @param path - 要检查的文件路径
 * @param options - 已解析的选项
 * @returns 是否在页面目录中
 */
export function isPagesDir(path: string, options: ResolvedOptions) {
  for (const page of options.dirs) {
    const dirPath = slash(resolve(options.root, page.dir))
    if (path.startsWith(dirPath))
      return true
  }
  return false
}

/**
 * 检查文件是否为目标页面文件
 * 需要满足：在页面目录中、不在排除列表中、扩展名匹配
 * @param path - 文件路径
 * @param options - 已解析的选项
 * @returns 是否为目标页面文件
 */
export function isTarget(path: string, options: ResolvedOptions) {
  return (
    isPagesDir(path, options)
    && !micromatch.isMatch(path, options.exclude)
    && options.extensionsRE.test(path)
  )
}

/**
 * 使页面模块失效
 * 在开发模式下，当页面文件发生变化时，需要使相关模块失效以触发重新加载
 * @param server - Vite 开发服务器实例
 */
export function invalidatePagesModule(server: ViteDevServer) {
  const { moduleGraph } = server
  const mods = moduleGraph.getModulesByFile(MODULE_ID_VIRTUAL)
  if (mods) {
    const seen = new Set<ModuleNode>()
    mods.forEach((mod) => {
      moduleGraph.invalidateModule(mod, seen) // 使模块失效
    })
  }
}

/**
 * 解析页面目录配置
 * @param dirs - 用户配置的目录，可以是字符串或包含目录和基础路由的对象数组
 * @param root - 项目根目录路径
 * @param exclude - 需要排除的文件/目录模式数组
 * @returns 解析后的页面目录选项数组
 */
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
