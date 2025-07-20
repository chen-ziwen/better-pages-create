/**
 * 工具函数文件
 * 包含插件使用的各种辅助函数和调试工具
 */

// 导入类型定义
import type { ModuleNode, ViteDevServer } from 'vite' // Vite 相关类型
import type { ResolvedOptions } from './types' // 插件选项类型

// 导入 Node.js 内置模块
import { resolve, win32 } from 'node:path' // 路径处理工具
import { URLSearchParams } from 'node:url' // URL 查询参数解析

// 导入第三方工具
import { slash } from '@antfu/utils' // 路径斜杠标准化
import Debug from 'debug' // 调试工具
import micromatch from 'micromatch' // 文件匹配工具

// 导入常量
import {
  cacheAllRouteRE, // 捕获所有路由正则
  countSlashRE, // 计算斜杠正则
  dynamicRouteRE, // 动态路由正则
  MODULE_ID_VIRTUAL, // 虚拟模块 ID
  nuxtCacheAllRouteRE, // Nuxt 捕获所有路由正则
  nuxtDynamicRouteRE, // Nuxt 动态路由正则
  replaceDynamicRouteRE, // 替换动态路由正则
  replaceIndexRE, // 替换 index 正则
} from './constants'

/**
 * 调试工具对象
 * 为不同模块提供独立的调试日志功能
 */
export const debug = {
  hmr: Debug('vite-plugin-pages:hmr'), // 热模块替换调试
  routeBlock: Debug('vite-plugin-pages:routeBlock'), // 路由块调试
  options: Debug('vite-plugin-pages:options'), // 选项调试
  pages: Debug('vite-plugin-pages:pages'), // 页面调试
  search: Debug('vite-plugin-pages:search'), // 搜索调试
  env: Debug('vite-plugin-pages:env'), // 环境调试
  cache: Debug('vite-plugin-pages:cache'), // 缓存调试
  resolver: Debug('vite-plugin-pages:resolver'), // 解析器调试
}

/**
 * 将文件扩展名数组转换为 glob 模式
 * @param extensions - 文件扩展名数组
 * @returns glob 模式字符串
 */
export function extsToGlob(extensions: string[]) {
  return extensions.length > 1
    ? `{${extensions.join(',')}}` // 多个扩展名：{js,ts,vue}
    : extensions[0] || '' // 单个扩展名或空字符串
}

/**
 * 计算字符串中斜杠的数量
 * @param value - 要计算的字符串
 * @returns 斜杠的数量
 */
export function countSlash(value: string) {
  return (value.match(countSlashRE) || []).length
}

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
    isPagesDir(path, options) // 在页面目录中
    && !micromatch.isMatch(path, options.exclude) // 不在排除列表中
    && options.extensionsRE.test(path) // 扩展名匹配
  )
}

/**
 * 检查路由路径是否为动态路由
 * @param routePath - 路由路径
 * @param nuxtStyle - 是否使用 Nuxt 风格，默认为 false
 * @returns 是否为动态路由
 */
export function isDynamicRoute(routePath: string, nuxtStyle = false) {
  return nuxtStyle
    ? nuxtDynamicRouteRE.test(routePath) // Nuxt 风格：_param
    : dynamicRouteRE.test(routePath) // Next 风格：[param]
}

/**
 * 检查路由路径是否为捕获所有路由
 * @param routePath - 路由路径
 * @param nuxtStyle - 是否使用 Nuxt 风格，默认为 false
 * @returns 是否为捕获所有路由
 */
export function isCatchAllRoute(routePath: string, nuxtStyle = false) {
  return nuxtStyle
    ? nuxtCacheAllRouteRE.test(routePath) // Nuxt 风格：_
    : cacheAllRouteRE.test(routePath) // Next 风格：[...param]
}

/**
 * 解析导入模式
 * @param filepath - 文件路径
 * @param options - 已解析的选项
 * @returns 导入模式（'sync' 或 'async'）
 */
export function resolveImportMode(filepath: string, options: ResolvedOptions) {
  const mode = options.importMode
  if (typeof mode === 'function')
    return mode(filepath, options) // 如果是函数，调用函数获取模式
  return mode // 如果是字符串，直接返回
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
 * 标准化字符串大小写
 * @param str - 要处理的字符串
 * @param caseSensitive - 是否大小写敏感
 * @returns 处理后的字符串
 */
export function normalizeCase(str: string, caseSensitive: boolean) {
  if (!caseSensitive)
    return str.toLocaleLowerCase() // 不敏感时转为小写
  return str // 敏感时保持原样
}

/**
 * 标准化路由名称
 * 处理动态路由的名称，提取参数名称
 * @param name - 原始名称
 * @param isDynamic - 是否为动态路由
 * @param nuxtStyle - 是否使用 Nuxt 风格，默认为 false
 * @returns 标准化后的名称
 */
export function normalizeName(
  name: string,
  isDynamic: boolean,
  nuxtStyle = false,
) {
  if (!isDynamic)
    return name // 非动态路由直接返回原名称

  return nuxtStyle
    ? name.replace(nuxtDynamicRouteRE, '$1') || 'all' // Nuxt 风格：_param -> param
    : name.replace(replaceDynamicRouteRE, '$1') // Next 风格：[param] -> param
}

/**
 * 构建 React 路由路径
 * 将文件名转换为 React Router 可识别的路由路径
 * @param node - 文件名节点
 * @param nuxtStyle - 是否使用 Nuxt 风格，默认为 false
 * @returns React Router 路由路径
 */
export function buildReactRoutePath(
  node: string,
  nuxtStyle = false,
): string | undefined {
  const isDynamic = isDynamicRoute(node, nuxtStyle) // 检查是否为动态路由
  const isCatchAll = isCatchAllRoute(node, nuxtStyle) // 检查是否为捕获所有路由
  const normalizedName = normalizeName(node, isDynamic, nuxtStyle) // 标准化名称

  if (isDynamic) {
    if (isCatchAll)
      return '*' // 捕获所有路由返回 '*'

    return `:${normalizedName}` // 动态路由返回 ':param'
  }

  return `${normalizedName}` // 静态路由返回原名称
}

/**
 * 构建 React Remix 路由路径
 * 基于 Remix 的路由约定将文件名转换为路由路径
 * 参考：https://github.dev/remix-run/remix/blob/264e3f8884c5cafd8d06acc3e01153b376745b7c/packages/remix-dev/config/routesConvention.ts#L105
 * @param node - 文件名节点
 * @returns Remix 风格的路由路径
 */
export function buildReactRemixRoutePath(node: string): string | undefined {
  // 转义序列的开始和结束字符
  const escapeStart = '['
  const escapeEnd = ']'
  let result = '' // 最终的路由路径结果
  let rawSegmentBuffer = '' // 原始段缓冲区

  let inEscapeSequence = 0 // 是否在转义序列中
  let skipSegment = false // 是否跳过当前段

  // 逐字符处理文件名
  for (let i = 0; i < node.length; i++) {
    const char = node.charAt(i)
    const lastChar = i > 0 ? node.charAt(i - 1) : undefined
    const nextChar = i < node.length - 1 ? node.charAt(i + 1) : undefined

    /**
     * 检查是否为新的转义序列开始
     * 条件：不在转义序列中 && 当前字符是 '[' && 前一个字符不是 '['
     */
    function isNewEscapeSequence() {
      return (
        !inEscapeSequence && char === escapeStart && lastChar !== escapeStart
      )
    }

    /**
     * 检查是否为转义序列结束
     * 条件：在转义序列中 && 当前字符是 ']' && 下一个字符不是 ']'
     */
    function isCloseEscapeSequence() {
      return inEscapeSequence && char === escapeEnd && nextChar !== escapeEnd
    }

    /**
     * 检查是否为布局段的开始
     * 条件：当前字符是 '_' && 下一个字符是 '_' && 缓冲区为空
     */
    function isStartOfLayoutSegment() {
      return char === '_' && nextChar === '_' && !rawSegmentBuffer
    }

    // 如果正在跳过段，检查是否遇到段分隔符
    if (skipSegment) {
      if (char === '/' || char === '.' || char === win32.sep)
        skipSegment = false // 遇到分隔符时停止跳过

      continue
    }

    // 处理转义序列开始
    if (isNewEscapeSequence()) {
      inEscapeSequence++
      continue
    }

    // 处理转义序列结束
    if (isCloseEscapeSequence()) {
      inEscapeSequence--
      continue
    }

    // 在转义序列中，直接添加字符到结果
    if (inEscapeSequence) {
      result += char
      continue
    }

    // 处理路径分隔符
    if (char === '/' || char === win32.sep || char === '.') {
      // 如果当前段是 'index' 且结果以 'index' 结尾，则移除 index
      if (rawSegmentBuffer === 'index' && result.endsWith('index'))
        result = result.replace(replaceIndexRE, '')
      else result += '/' // 否则添加路径分隔符

      rawSegmentBuffer = '' // 清空段缓冲区
      continue
    }

    // 处理布局段开始（以 __ 开头的段）
    if (isStartOfLayoutSegment()) {
      skipSegment = true // 跳过布局段
      continue
    }

    // 将字符添加到段缓冲区
    rawSegmentBuffer += char

    // 处理 Remix 的动态路由标记 '$'
    if (char === '$') {
      // 如果是最后一个字符，表示捕获所有路由，使用 '*'
      // 否则表示动态参数，使用 ':'
      result += typeof nextChar === 'undefined' ? '*' : ':'
      continue
    }

    // 将字符添加到结果中
    result += char
  }

  // 处理结尾的 index 段
  if (rawSegmentBuffer === 'index' && result.endsWith('index'))
    result = result.replace(replaceIndexRE, '')

  // 返回结果，如果为空则返回 undefined
  return result || undefined
}

/**
 * 解析页面请求
 * 从请求 ID 中提取模块 ID、查询参数和页面 ID
 * @param id - 请求 ID 字符串
 * @returns 解析后的请求信息对象
 */
export function parsePageRequest(id: string) {
  const [moduleId, rawQuery] = id.split('?', 2) // 分割模块 ID 和查询字符串
  const query = new URLSearchParams(rawQuery) // 解析查询参数
  const pageId = query.get('id') // 获取页面 ID
  return {
    moduleId, // 模块 ID
    query, // 查询参数对象
    pageId, // 页面 ID
  }
}
