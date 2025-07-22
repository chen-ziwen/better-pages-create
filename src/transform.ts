import type { PageRoute } from './context'
import type {
  ConstRoute,
  ResolvedOptions,
  RouterFile,
  RouterNamePathEntry,
  RouterNamePathMap,
  RouterTree,
} from './types'
import { join } from 'node:path'
import { slash } from '@antfu/utils'
import {
  GROUP_RE,
  NOT_FOUND_ROUTE,
  PAGE_DEGREE_SPLITTER,
  PAGE_FILE_NAME_WITH_SQUARE_BRACKETS_PATTERN,
  PARAM_RE,
  PATH_REPLACER,
  PATH_SPLITTER,
  ROUTE_NAME_WITH_PARAMS_PATTERN,
  SPLAT_RE,
} from './constants'
import { isRouteGroup, splitRouterName } from './utils'

/**
 * 将页面 glob 路径转换为路由文件信息
 */
export function transformPageGlobToRouterFile(pageRoute: PageRoute, options: ResolvedOptions) {
  const { alias } = options
  const { path: fullPath, route, suffix, pageDir } = pageRoute
  const glob = `${route}.${suffix}`
  const importPath = slash(join(pageDir, glob))

  // 处理路径别名
  let importAliasPath = importPath
  for (const [aliasKey, dir] of Object.entries(alias)) {
    if (importPath.startsWith(dir)) {
      importAliasPath = importAliasPath.replace(dir, aliasKey)
      break
    }
  }

  // 解析目录和文件
  const [file, ...dirs] = glob.split(PATH_SPLITTER).reverse()
  const filteredDirs = dirs
    .filter(dir => !dir.startsWith(PAGE_DEGREE_SPLITTER))
    .reverse()

  // 处理特殊文件名
  if (PAGE_FILE_NAME_WITH_SQUARE_BRACKETS_PATTERN.test(file)) {
    filteredDirs.push(file.replace(new RegExp(`\\.${suffix}$`), ''))
  }

  const routeName = filteredDirs.length === 0 ? 'root' : filteredDirs.join(PAGE_DEGREE_SPLITTER).toLowerCase()

  const routePath = transformRouterNameToPath(routeName)

  return {
    fullPath,
    glob,
    importAliasPath,
    importPath,
    routeName,
    routePath,
  } as RouterFile
}

/**
 * 构建 React 路由路径
 */
export function transformRouterNameToPath(name: string) {
  if (name === 'root') {
    return '/'
  }

  if (isRouteGroup(name)) {
    return null
  }

  const resolveName = name
    .replace(...GROUP_RE)
    .replace(...SPLAT_RE)
    .replace(...PARAM_RE)
    .replace(...PATH_REPLACER)

  return `/${resolveName}`
}

/**
 * 将路由文件转换为名称路径映射
 */
export function transformRouterFilesToMaps(files: RouterFile[], options: ResolvedOptions) {
  const maps = new Map<string, string | null>()

  for (const { routeName, routePath } of files) {
    const names = splitRouterName(routeName)

    for (const name of names) {
      if (!maps.has(name)) {
        const isSameName = name === routeName
        const itemRouteName = isSameName ? name : options.routeNameTransformer(name)
        const itemRoutePath = isSameName ? routePath : options.routePathTransformer(itemRouteName, transformRouterNameToPath(name))

        maps.set(itemRouteName, itemRoutePath)
      }
    }
  }

  return maps
}

/**
 * 将映射转换为条目数组
 */
export function transformRouterMapsToEntries(maps: RouterNamePathMap) {
  return Array.from(maps.entries()).sort(([a], [b]) => a.localeCompare(b))
}

/**
 * 将条目转换为路由树
 */
export function transformRouterEntriesToTrees(
  entries: RouterNamePathEntry[],
  maps: RouterNamePathMap,
  files: RouterFile[],
) {
  // 构建路由层级关系映射
  const routeHierarchy = new Map<string, Set<string>>()

  entries.forEach(([routeName]) => {
    const parts = routeName.split(PAGE_DEGREE_SPLITTER)

    // 为每个层级建立父子关系
    for (let i = 0; i < parts.length; i++) {
      const currentRoute = parts.slice(0, i + 1).join(PAGE_DEGREE_SPLITTER)
      const parentRoute = i > 0 ? parts.slice(0, i).join(PAGE_DEGREE_SPLITTER) : null

      if (parentRoute) {
        if (!routeHierarchy.has(parentRoute)) {
          routeHierarchy.set(parentRoute, new Set())
        }
        routeHierarchy.get(parentRoute)!.add(currentRoute)
      }
    }
  })

  // 构建树结构
  const buildTree = (routeName: string): RouterTree => {
    const { fullPath, matched } = findMatchedFiles(files, routeName)

    const tree: RouterTree = {
      fullPath,
      matched,
      routeName,
      routePath: maps.get(routeName) || null,
    }

    const children = routeHierarchy.get(routeName)
    if (children && children.size > 0) {
      tree.children = Array.from(children).map(childName => buildTree(childName))
    }

    return tree
  }

  // 找到所有顶级路由（没有父级的路由）
  const topLevelRoutes = entries
    .map(([routeName]) => routeName)
    .filter(routeName => !routeName.includes(PAGE_DEGREE_SPLITTER))

  const trees = topLevelRoutes.map(routeName => buildTree(routeName))

  const rootIndex = trees.findIndex(tree => tree.routeName === 'root')

  if (rootIndex !== -1 && trees[rootIndex].matched.layout) {
    const rootNode = trees[rootIndex]
    const newTrees = [{
      ...rootNode,
      children: trees.filter((_, index) => index !== rootIndex),
    }]

    const routes = newTrees[0].children

    const notFoundPath = routes.find(item => item?.routeName === '404')
    if (notFoundPath) {
      NOT_FOUND_ROUTE.matched = notFoundPath.matched
    }
    routes.push(NOT_FOUND_ROUTE)

    return newTrees
  }

  const notFoundPath = trees.find(item => item?.routeName === '404')
  if (notFoundPath) {
    NOT_FOUND_ROUTE.matched = notFoundPath.matched
  }
  trees.push(NOT_FOUND_ROUTE)
  return trees
}

/**
 * 转换路由树为常量路由
 */
export function transformRouteTreeToElegantConstRoute(tree: RouterTree, options: ResolvedOptions) {
  return buildConstRoute(tree, options)
}

/**
 * 构建常量路由（统一处理函数）
 */
function buildConstRoute(
  tree: RouterTree,
  options: ResolvedOptions,
  parent?: ConstRoute,
): ConstRoute {
  const { extendRoute } = options
  const { children = [], matched, routeName, routePath } = tree

  const route: ConstRoute = {
    matched,
    name: routeName,
    path: routePath,
    handle: isRouteGroup(routeName) ? null : {},
  }

  // 调用扩展路由函数
  if (extendRoute) {
    const extendedRoute = extendRoute(route, parent)
    extendedRoute && Object.assign(route, extendedRoute)
  }

  // 递归处理子路由
  if (children.length > 0) {
    route.children = children.map(child => buildConstRoute(child, options, route))
  }

  return route
}

/**
 * 查找匹配的文件
 */
function findMatchedFiles(data: RouterFile[], currentName: string) {
  const matched: Record<string, string> = {}

  const startIndex = data.findIndex(item => item.routeName === currentName)
  if (startIndex === -1) {
    return { fullPath: null, matched }
  }

  const endIndex = Math.min(startIndex + 4, data.length)

  for (let i = startIndex; i < endIndex; i++) {
    const { importAliasPath, routeName, glob } = data[i]

    if (routeName !== currentName)
      break

    if (glob.endsWith('layout.tsx')) {
      matched.layout = importAliasPath // 使用别名路径
    }
    else if (glob.endsWith('index.tsx') || ROUTE_NAME_WITH_PARAMS_PATTERN.test(glob)) {
      if (!isRouteGroup(routeName)) {
        matched.index = importAliasPath // 使用别名路径
      }
    }
    else if (glob.endsWith('loading.tsx')) {
      matched.loading = importAliasPath // 使用别名路径
    }
    else if (glob.endsWith('error.tsx')) {
      matched.error = importAliasPath // 使用别名路径
    }
  }

  return { fullPath: data[startIndex].fullPath, matched }
}
