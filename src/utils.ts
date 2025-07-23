import type { ModuleNode, ViteDevServer } from 'vite'
import type { ConstRoute, PagesType, ResolvedOptions } from './types'
import { resolve } from 'node:path'
import { URLSearchParams } from 'node:url'
import { slash } from '@antfu/utils'
import Debug from 'debug'
import micromatch from 'micromatch'
import {
  COUNTSLASH_RE,
  MODULE_ID_VIRTUAL,
  PAGE_DEGREE_SPLITTER,
} from './constants'

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
  return extensions.length > 1 ? `{${extensions.join(',')}}` : extensions[0] || ''
}

/**
 * 计算字符串中斜杠的数量
 * @param value - 要计算的字符串
 * @returns 斜杠的数量
 */
export function countSlash(value: string) {
  return (value.match(COUNTSLASH_RE) || []).length
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
 * 标准化字符串大小写
 * @param str - 要处理的字符串
 * @param caseSensitive - 是否大小写敏感
 * @returns 处理后的字符串
 */
export function normalizeCase(str: string, caseSensitive: boolean) {
  if (!caseSensitive) {
    return str.toLocaleLowerCase()
  }
  return str
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
    moduleId,
    query,
    pageId,
  }
}

/**
 * 判断是否为路由组
 * @param name - 文件名
 * @returns 是否为路由组
 */
export function isRouteGroup(name: string) {
  const lastName = name.split(PAGE_DEGREE_SPLITTER).at(-1)

  return lastName?.startsWith('(') && lastName?.endsWith(')')
}

/**
 * 将路由名称分割为数组，每个元素为一个级别的路由名称。
 * @param name
 * @returns 路由名称数组
 */
export function splitRouterName(name: string) {
  const names = name.split(PAGE_DEGREE_SPLITTER)

  return names.reduce((prev, cur) => {
    const last = prev[prev.length - 1]
    const next = last ? `${last}${PAGE_DEGREE_SPLITTER}${cur}` : cur
    prev.push(next)
    return prev
  }, [] as string[])
}

/**
 * 生成导入映射，将路由匹配的页面文件导入为函数。
 * @param routes - 路由数组
 * @param type - 页面类型
 * @returns 导入映射字符串
 */
export function generateImportMap(routes: ConstRoute[], type: PagesType): string {
  const imports: string[] = []

  function collectImports(routeList: any[]) {
    for (const route of routeList) {
      if (route.matched?.[type]) {
        const importPath = route.matched[type]
        imports.push(`"${route.name}": () => import("${importPath}")`)
      }
      if (route.children) {
        collectImports(route.children)
      }
    }
  }

  collectImports(routes)
  return imports.join(',\n')
}
