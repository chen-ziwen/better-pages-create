import type { PageContext } from '../context'
import type { ConstRoute, PageResolver } from '../types'
import { generateClientCode } from '../stringify'
import {
  transformPageGlobToRouterFile,
  transformRouterEntriesToTrees,
  transformRouterFilesToMaps,
  transformRouteTreeToElegantConstRoute,
} from '../transform'
import { countSlash } from '../utils'

/**
 * 计算 React 路由
 * 将页面文件转换为 React Router 可用的路由结构
 * @param ctx - 页面上下文
 * @returns React 路由数组
 */
async function computeReactRoutes(ctx: PageContext): Promise<ConstRoute[]> {
  const { onRoutesGenerated } = ctx.options

  // 获取所有页面路由并按路径深度排序（用于热模块替换）
  const pageRoutes = [...ctx.pageRouteMap.values()].sort((a, b) => countSlash(a.route) - countSlash(b.route))

  // 将页面路由转换为路由文件信息
  const files = pageRoutes.map(page => transformPageGlobToRouterFile(page, ctx.options))

  const maps = transformRouterFilesToMaps(files)

  // 将路由条目转换为路由树
  const trees = transformRouterEntriesToTrees(maps, files)

  // 将路由树转换为路由结构
  let routes = trees.map(tree => transformRouteTreeToElegantConstRoute(tree, ctx.options))

  // 可以对整体的路由进行处理
  if (onRoutesGenerated) {
    const result = await onRoutesGenerated(routes)
    if (result) {
      routes = result
    }
  }

  return routes
}

/**
 * 解析 React 路由
 * 生成最终的客户端代码
 * @param ctx - 页面上下文
 * @returns 生成的客户端代码字符串
 */
async function resolveReactRoutes(ctx: PageContext) {
  // 计算路由
  const finalRoutes = await computeReactRoutes(ctx)
  // 生成客户端代码 (就是直接生成文件,里面填充需要的代码)
  let client = generateClientCode(finalRoutes, ctx.options)
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
      // 最终代码处理：只添加 React 导入，不添加类型导入
      final: code => `import React from "react";\n${code}`,
    },
  }
}
