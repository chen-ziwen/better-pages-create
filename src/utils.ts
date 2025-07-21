/**
 * 工具函数文件
 * 包含插件使用的各种辅助函数和调试工具
 */

import type { ModuleNode, ViteDevServer } from 'vite'
import type { ResolvedOptions } from './types'
import { resolve } from 'node:path' // 路径处理工具
import { URLSearchParams } from 'node:url' // URL 查询参数解析
import { slash } from '@antfu/utils' // 路径斜杠标准化
import Debug from 'debug' // 调试工具
import micromatch from 'micromatch' // 文件匹配工具
import {
  countSlashRE, // 计算斜杠正则
  groupRE,
  MODULE_ID_VIRTUAL, // 虚拟模块 ID
  optionalRE,
  paramRE,
  splatRE,
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
 * 构建 React 路由路径
 * 将文件名转换为 React Router 可识别的路由路径
 * @param name - 文件名
 * @returns React Router 路由路径
 */
export function buildReactRoutePath(
  name: string,
) {
  if (name === 'root') {
    return '/'
  }

  return name
    // 去除路由组 去除路由组 (fileName) 或 (fileName)_
    .replace(...groupRE)
    // 替换 [...param] 为 *
    .replace(...splatRE)
    // 替换 [param] 为 :param
    .replace(...paramRE)
    .split('/')
    .filter(Boolean)
    // -[lang] 或 -en 转换为 :lang? 和 :en?
    .map(node => node.replace(...optionalRE))
    .join('/')
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

/**
 * 判断是否为路由组
 * @param name - 文件名
 * @returns 是否为路由组
 */
export function isRouteGroup(name: string) {
  const lastName = name.split('_').at(-1)

  return lastName?.startsWith('(') && lastName?.endsWith(')')
}

// export function buildRouteTree(routes: RouteRecordNormalized[], ctx: PageContext): RouteRecordNormalized[] {
//   const { childFullPath } = ctx.options

//   return routes.map((route) => {
//     if (route.children && route.children.length > 0) {
//       route.children = route.children.map((child) => {
//         if (childFullPath) {
//           // 拼接父路由路径
//           const parentPath = route.path === '/' ? '' : route.path
//           child.path = `${parentPath}${child.path}`
//         }
//         return child
//       })

//       // 递归处理嵌套子路由
//       route.children = buildRouteTree(route.children, ctx)
//     }
//     return route
//   })
// }

// export function buildFullPath(parentPath: string, childPath: string): string {
//   // 处理根路径
//   if (parentPath === '/') {
//     return childPath.startsWith('/') ? childPath : `/${childPath}`
//   }

//   // 处理子路径已经是绝对路径的情况
//   if (childPath.startsWith('/')) {
//     return childPath
//   }

//   // 拼接父子路径
//   return `${parentPath}/${childPath}`.replace(/\/+/g, '/')
// }
