import type { ResolvedOptions, UserOptions } from './types'
import { resolve } from 'node:path'
import process from 'node:process'
import { slash, toArray } from '@antfu/utils'
import { MODULE_IDS } from './constants'
import { getPageDirs } from './files'
import { reactResolver } from './resolvers'

/**
 * 解析页面目录配置
 * @param dirs - 用户配置的目录，可以是字符串或包含目录和基础路由的对象数组
 * @param root - 项目根目录路径
 * @param exclude - 需要排除的文件/目录模式数组
 * @returns 解析后的页面目录选项数组
 */
function resolvePageDirs(dirs: UserOptions['dirs'], root: string, exclude: string[]) {
  dirs = toArray(dirs)
  return dirs.flatMap((dir) => {
    const option = typeof dir === 'string' ? { dir, baseRoute: '' } : dir
    option.dir = slash(resolve(root, option.dir)).replace(`${root}/`, '')
    option.baseRoute = option.baseRoute.replace(/^\//, '').replace(/\/$/, '')

    return getPageDirs(option, root, exclude)
  })
}

/**
 * 获取页面解析器
 * @param originalResolver - 用户配置的解析器，可以是字符串或解析器对象
 * @returns 解析器对象
 */
function getResolver(originalResolver: UserOptions['resolver']) {
  let resolver = originalResolver || 'react'

  if (typeof resolver !== 'string')
    return resolver

  switch (resolver) {
    case 'react':
      resolver = reactResolver()
      break
    default:
      throw new Error(`Unsupported resolver: ${resolver}`)
  }
  return resolver
}

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
    alias = { '@': 'src' },
    extendRoute,
    onRoutesGenerated,
    onClientGenerated,
  } = userOptions

  const root = viteRoot || slash(process.cwd())

  const resolver = getResolver(userOptions.resolver)

  const extensions = userOptions.extensions || resolver.resolveExtensions()

  const extensionsRE = new RegExp(`\\.(${extensions.join('|')})$`)

  const resolvedDirs = resolvePageDirs(dirs, root, exclude)

  const moduleIds = userOptions.moduleId ? [userOptions.moduleId] : resolver.resolveModuleIds?.() || MODULE_IDS

  const resolvedOptions: ResolvedOptions = {
    dirs: resolvedDirs, // 已解析的页面目录列表
    moduleIds, // 模块 ID 列表
    root, // 项目根目录
    alias, // 项目别名
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
