import type { ModuleNode, ViteDevServer } from 'vite'
import type { ResolvedOptions } from './types'
import { resolve } from 'node:path'
import { slash } from '@antfu/utils'
import { debug, MODULE_ID_VIRTUAL } from '@better-pages-create/shared'
import micromatch from 'micromatch'

/**
 * 检查路径是否在页面目录中
 * @param path - 要检查的文件路径
 * @param options - 已解析的选项
 * @returns 是否在页面目录中
 */
function isPagesDir(path: string, options: ResolvedOptions) {
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

export { debug }
