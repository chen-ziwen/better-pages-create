import { slash } from '@antfu/utils'
import Debug from 'debug'
import micromatch from 'micromatch'

export * from './constants'

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
  return (value.match(/\//g) || []).length
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
 * 判断是否为路由组
 * @param name - 文件名
 * @returns 是否为路由组
 */
export function isRouteGroup(name: string) {
  const lastName = name.split('_').at(-1)
  return lastName?.startsWith('(') && lastName?.endsWith(')')
}

/**
 * 将路由名称分割为数组，每个元素为一个级别的路由名称。
 * @param name
 * @returns 路由名称数组
 */
export function splitRouterName(name: string, separator = '_') {
  const names = name.split(separator)

  return names.reduce((prev, cur) => {
    const last = prev[prev.length - 1]
    const next = last ? `${last}${separator}${cur}` : cur
    prev.push(next)
    return prev
  }, [] as string[])
}

export { micromatch, slash }
