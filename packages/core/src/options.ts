import type { PageResolver, ResolvedOptions, UserOptions } from './types'
import process from 'node:process'
import { slash } from '@antfu/utils'
import { MODULE_IDS } from '@better-pages-create/shared'
import { resolvePageDirs } from './utils'

/**
 * 解析用户选项，将用户配置转换为完整的已解析选项
 * @param userOptions - 用户提供的配置选项
 * @param viteRoot - Vite 项目根目录（可选）
 * @returns 完整的已解析选项对象
 */
export function resolveOptions(userOptions: UserOptions, viteRoot?: string): ResolvedOptions {
  const {
    dirs = ['src/pages'],
    exclude = ['**/components/**', '**/modules/**'],
    caseSensitive = false,
    routeNameSeparator = '_',
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
    dirs: resolvedDirs, // 已解析的页面目录列表
    moduleIds, // 模块 ID 列表
    root, // 项目根目录
    extensions, // 支持的文件扩展名列表
    exclude, // 排除的文件/目录模式
    caseSensitive, // 路由大小写敏感性
    resolver, // 页面解析器实例
    extensionsRE, // 文件扩展名匹配正则表达式
    routeNameSeparator, // 路由名称分隔符
    extendRoute, // 扩展路由的函数
    onRoutesGenerated, // 路由生成后的回调函数
    onClientGenerated, // 客户端代码生成后的回调函数
  }

  return resolvedOptions
}
