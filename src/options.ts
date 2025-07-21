// 导入类型定义：导入模式解析器、已解析选项、用户选项
import type { ImportModeResolver, ResolvedOptions, UserOptions } from './types'
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
  // 将目录配置转换为数组格式（如果是单个字符串则转为数组）
  dirs = toArray(dirs)
  // 使用 flatMap 处理每个目录配置，并将结果扁平化
  return dirs.flatMap((dir) => {
    // 如果目录配置是字符串，则转换为标准的选项对象格式
    // 否则直接使用已有的对象配置
    const option = typeof dir === 'string'
      ? { dir, baseRoute: '' } // 字符串转为 { dir: 目录路径, baseRoute: '' }
      : dir

    // 标准化目录路径：解析绝对路径，转换斜杠格式，移除根目录前缀
    option.dir = slash(resolve(root, option.dir)).replace(`${root}/`, '')
    // 标准化基础路由：移除开头和结尾的斜杠
    option.baseRoute = option.baseRoute.replace(/^\//, '').replace(/\/$/, '')

    // 调用 getPageDirs 函数获取实际的页面目录列表
    return getPageDirs(option, root, exclude)
  })
}

/**
 * 同步索引解析器：决定页面组件的导入模式
 * 对于根路由的 index 页面使用同步导入，其他页面使用异步导入
 * @param filepath - 文件路径
 * @param options - 已解析的选项配置
 * @returns 'sync' 表示同步导入，'async' 表示异步导入
 */
export const syncIndexResolver: ImportModeResolver = (filepath, options) => {
  // 遍历所有页面目录配置
  for (const page of options.dirs) {
    // 如果是根路由（baseRoute 为空）且文件路径是 index 页面
    if (page.baseRoute === '' && filepath.startsWith(`/${page.dir}/index`))
      return 'sync' // 返回同步导入模式
  }
  return 'async' // 其他情况返回异步导入模式
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
  // 从用户选项中解构配置，并设置默认值
  const {
    dirs = ['src/pages'], // 页面目录，默认为 'src/pages'
    routeBlockLang = 'json5', // 路由块语言，默认为 'json5'
    exclude = ['**/components/**', '**/modules/**'], // 排除的文件/目录模式
    caseSensitive = false, // 路由是否大小写敏感，默认为 false
    routeNameSeparator = '-', // 路由名称分隔符，默认为 '-'
    childFullPath = false, // 子路径是否为完整路径，默认为 false
    extendRoute, // 扩展路由的函数
    onRoutesGenerated, // 路由生成后的回调函数
    onClientGenerated, // 客户端代码生成后的回调函数
  } = userOptions

  // 确定项目根目录：使用传入的 viteRoot 或当前工作目录
  const root = viteRoot || slash(process.cwd())

  // 确定导入模式：使用用户配置的导入模式或默认的同步索引解析器
  const importMode = userOptions.importMode || syncIndexResolver

  // 确定导入路径类型：使用用户配置的导入路径或默认的相对路径
  const importPath = userOptions.importPath || 'relative'

  // 获取页面解析器实例
  const resolver = getResolver(userOptions.resolver)

  // 确定支持的文件扩展名：使用用户配置的扩展名或解析器提供的扩展名
  const extensions = userOptions.extensions || resolver.resolveExtensions()

  // 创建用于匹配文件扩展名的正则表达式
  const extensionsRE = new RegExp(`\\.(${extensions.join('|')})$`)

  // 解析页面目录配置
  const resolvedDirs = resolvePageDirs(dirs, root, exclude)

  // 确定模块 ID 列表：使用用户配置的单个模块 ID 或解析器提供的模块 ID 列表或默认的模块 ID 列表
  const moduleIds = userOptions.moduleId
    ? [userOptions.moduleId] // 如果用户指定了单个模块 ID，转为数组
    : resolver.resolveModuleIds?.() || MODULE_IDS // 否则使用解析器提供的或默认的模块 ID 列表

  // 构建完整的已解析选项对象
  const resolvedOptions: ResolvedOptions = {
    dirs: resolvedDirs, // 已解析的页面目录列表
    routeBlockLang, // 路由块语言（json5/json/yaml/yml）
    moduleIds, // 模块 ID 列表
    root, // 项目根目录
    childFullPath, // 子路径是否为完整路径
    extensions, // 支持的文件扩展名列表
    importMode, // 导入模式（同步/异步）
    importPath, // 导入路径类型（绝对/相对）
    exclude, // 排除的文件/目录模式
    caseSensitive, // 路由大小写敏感性
    resolver, // 页面解析器实例
    extensionsRE, // 文件扩展名匹配正则表达式
    extendRoute, // 扩展路由的函数
    onRoutesGenerated, // 路由生成后的回调函数
    onClientGenerated, // 客户端代码生成后的回调函数
    routeNameSeparator, // 路由名称分隔符
  }

  // 返回完整的已解析选项
  return resolvedOptions
}
