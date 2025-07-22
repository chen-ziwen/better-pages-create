// 导入类型定义：导入模式解析器、已解析选项、用户选项
import type { ResolvedOptions, UserOptions } from './types'
// 导入 Node.js 内置模块
import { resolve } from 'node:path' // 路径解析工具
import process from 'node:process' // 进程相关工具
// 导入工具函数：路径斜杠标准化、数组转换工具
import { slash, toArray } from '@antfu/utils'

// 导入常量：模块 ID 列表
import { MODULE_IDS } from './constants'
// 导入文件处理函数：获取页面目录
import { getPageDirs } from './files'
// 导入解析器：React 解析器
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
  // 使用 flatMap 处理每个目录配置，并将结果扁平化
  return dirs.flatMap((dir) => {
    // 字符串转为 { dir: 目录路径, baseRoute: '' }
    const option = typeof dir === 'string' ? { dir, baseRoute: '' } : dir

    // 标准化目录路径：解析绝对路径，转换斜杠格式，移除根目录前缀
    option.dir = slash(resolve(root, option.dir)).replace(`${root}/`, '')
    // 标准化基础路由：移除开头和结尾的斜杠
    option.baseRoute = option.baseRoute.replace(/^\//, '').replace(/\/$/, '')

    // 调用 getPageDirs 函数获取实际的页面目录列表
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
    dirs = ['src/pages'], // 页面目录，默认为 'src/pages'
    exclude = ['**/components/**', '**/modules/**'], // 排除的文件/目录模式
    caseSensitive = false, // 路由是否大小写敏感，默认为 false
    routeNameSeparator = '_', // 路由名称分隔符，默认为 '_'
    alias = { '@': 'src' }, // 项目别名
    extendRoute, // 扩展路由的函数
    onRoutesGenerated, // 路由生成后的回调函数
    onClientGenerated, // 客户端代码生成后的回调函数
    routeNameTransformer = name => name,
    routePathTransformer = (_transformedName, path) => path,
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
    routeNameTransformer, // 路由名称转换器
    routePathTransformer, // 路由路径转换器
    extendRoute, // 扩展路由的函数
    onRoutesGenerated, // 路由生成后的回调函数
    onClientGenerated, // 客户端代码生成后的回调函数
  }

  return resolvedOptions
}
