import type { PageContext } from '../context'
import type { Optional, PageResolver, ResolvedOptions } from '../types'
import { generateClientCode } from '../stringify'

export interface ReactRouteBase {
  caseSensitive?: boolean // 是否大小写敏感
  children?: ReactRouteBase[] // 子路由数组
  element?: string // 组件元素
  Component?: string // 组件实例
  index?: boolean // 是否为索引路由
  path?: string // 路由路径
  rawRoute: string // 原始路由字符串
}

/**
 * React 路由接口
 * 继承基础路由接口，用于最终的路由对象
 */
export interface ReactRoute extends Omit<Optional<ReactRouteBase, 'rawRoute' | 'path'>, 'children'> {
  children?: ReactRoute[] // 子路由数组
}

/**
 * 准备路由数据
 * 对路由进行最终处理，包括路径标准化、扩展路由等
 * @param routes - 路由数组
 * @param options - 已解析的选项
 * @param parent - 父路由（可选）
 * @returns 处理后的路由数组
 */
function prepareRoutes(
  routes: ReactRoute[],
  options: ResolvedOptions,
  parent?: ReactRoute,
) {
  for (const route of routes) {
    // 如果有父路由，移除子路由路径开头的斜杠
    if (parent)
      route.path = route.path?.replace(/^\//, '')

    // 递归处理子路由
    if (route.children)
      route.children = prepareRoutes(route.children, options, route)

    // 删除原始路由字段（仅用于内部处理）
    delete route.rawRoute

    // 应用用户自定义的路由扩展函数
    Object.assign(route, options.extendRoute?.(route, parent) || {})
  }

  return routes
}

/**
 * 计算 React 路由
 * 将页面文件转换为 React Router 可用的路由结构
 * @param ctx - 页面上下文
 * @returns React 路由数组
 */
async function computeReactRoutes(ctx: PageContext): Promise<ReactRoute[]> {
  // const { caseSensitive, importPath } = ctx.options

  // 获取所有页面路由并按路径深度排序（用于热模块替换）
  // const pageRoutes = [...ctx.pageRouteMap.values()].sort((a, b) => countSlash(a.route) - countSlash(b.route))

  const routes: ReactRouteBase[] = [] // 最终的路由数组

  // const file = pageRoutes.map(page => transformPageGlobToRouterFile(page, ctx.options))

  // const map = transformRouterFilesToMaps(file, ctx.options)

  // console.log('file ===>', file)
  // console.log('map ===>', map)

  // 准备最终路由（排序、处理动态路由等）
  let finalRoutes = prepareRoutes(routes, ctx.options)

  // 调用用户自定义的路由生成后处理函数
  finalRoutes = (await ctx.options.onRoutesGenerated?.(finalRoutes)) || finalRoutes

  return finalRoutes
}

/**
 * 解析 React 路由
 * 生成最终的客户端代码
 * @param ctx - 页面上下文
 * @returns 生成的客户端代码字符串
 */
async function resolveReactRoutes(ctx: PageContext) {
  const finalRoutes = await computeReactRoutes(ctx) // 计算路由
  let client = generateClientCode(finalRoutes, ctx.options) // 生成客户端代码
  // 调用用户自定义的客户端代码生成后处理函数
  client = (await ctx.options.onClientGenerated?.(client)) || client
  return client
}

/**
 * React 解析器工厂函数
 * 创建并返回 React 项目专用的页面解析器
 * @returns React 页面解析器实例
 */
export function reactResolver(): PageResolver {
  return {
    /**
     * 解析模块 ID
     * @returns React 相关的模块 ID 数组
     */
    resolveModuleIds() {
      return ['~react-pages', 'virtual:better-pages-create']
    },

    /**
     * 解析支持的文件扩展名
     * @returns React 项目支持的文件扩展名数组
     */
    resolveExtensions() {
      return ['tsx', 'jsx', 'ts', 'js']
    },

    /**
     * 解析路由
     * @param ctx - 页面上下文
     * @returns 生成的路由代码字符串
     */
    async resolveRoutes(ctx) {
      return resolveReactRoutes(ctx)
    },

    /**
     * 获取计算后的路由
     * @param ctx - 页面上下文
     * @returns 计算后的路由对象数组
     */
    async getComputedRoutes(ctx) {
      return computeReactRoutes(ctx)
    },

    /**
     * 字符串化配置
     * 定义如何将路由转换为 React 代码
     */
    stringify: {
      // 组件渲染函数：将路径转换为 React.createElement 调用
      component: path => `React.createElement(${path})`,
      // 动态导入函数：将路径转换为 React.lazy 包装的动态导入
      dynamicImport: path => `React.lazy(() => import("${path}"))`,
      // 最终代码处理：添加 React 导入语句
      final: code => `import React from "react";\n${code}`,
    },
  }
}
