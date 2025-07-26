import type { ConstRoute, PageRoute, ResolvedOptions, RouterFile, RouterNamePathMap, RouterTree } from '@better-pages-create/core'
import { join } from 'node:path'
import { slash } from '@antfu/utils'
import {
  GROUP_RE,
  isRouteGroup,
  NOT_FOUND_ROUTE,
  PAGE_DEGREE_SEPARATOR,
  PAGES_WITH_PATTERN,
  PARAM_RE,
  PATH_SEPARATOR,
  ROUTE_NAME_WITH_PARAMS_PATTERN,
  SPLAT_RE,
  splitRouterName,
  UNDERSCORE_RE,
} from '@better-pages-create/shared'
import { extractHandleFromFile } from './handle/extract'

/**
 * 将页面 glob 路径转换为路由文件信息
 */
export function transformPageGlobToRouterFile(pageRoute: PageRoute) {
  const { path: fullPath, route, suffix, pageDir } = pageRoute
  const glob = `${route}.${suffix}`
  const importPath = slash(join('/', pageDir, glob))

  // 解析目录和文件
  const [file, ...dirs] = glob.split(PATH_SEPARATOR).reverse()
  const filteredDirs = dirs.filter(dir => !dir.startsWith(PAGE_DEGREE_SEPARATOR)).reverse()

  // 处理特殊文件名
  if (PAGES_WITH_PATTERN.test(file)) {
    filteredDirs.push(file.replace(new RegExp(`\\.${suffix}$`), ''))
  }

  const routeName = filteredDirs.length === 0 ? 'root' : filteredDirs.join(PAGE_DEGREE_SEPARATOR).toLowerCase()

  const routePath = transformRouterNameToPath(routeName)

  // 提取出 handle 信息
  const handle = extractHandleFromFile(fullPath)

  return {
    componentName: routeName,
    fullPath,
    glob,
    importPath,
    routeName,
    routePath,
    suffix,
    handle,
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
    .replace(GROUP_RE, '')
    .replace(SPLAT_RE, '*')
    .replace(PARAM_RE, ':$1')
    .replace(UNDERSCORE_RE, '/')

  return `/${resolveName}`
}

/**
 * 将路由文件转换为名称路径映射
 */
export function transformRouterFilesToMaps(files: RouterFile[]) {
  const maps = new Map<string, string | null>()

  for (const { routeName, routePath } of files) {
    const names = splitRouterName(routeName)

    for (const name of names) {
      if (!maps.has(name)) {
        maps.set(name, routePath)
      }
    }
  }

  return maps
}

/**
 * 将条目转换为路由树
 */
export function transformRouterEntriesToTrees(
  maps: RouterNamePathMap,
  files: RouterFile[],
) {
  // 构建路由层级关系映射
  const routeHierarchy = new Map<string, Set<string>>()

  const entries = Array.from(maps.entries())
  entries.sort((a, b) => a[0].localeCompare(b[0]))

  entries.forEach((entry) => {
    const routeName = entry[0]
    const parts = routeName.split(PAGE_DEGREE_SEPARATOR)

    // 为每个层级建立父子关系
    for (let i = 0; i < parts.length; i++) {
      const currentRoute = parts.slice(0, i + 1).join(PAGE_DEGREE_SEPARATOR)
      const parentRoute = i > 0 ? parts.slice(0, i).join(PAGE_DEGREE_SEPARATOR) : null

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
    const { fullPath, matched, handle } = findMatchedFiles(files, routeName)

    const tree: RouterTree = {
      fullPath,
      matched,
      routeName,
      handle,
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
    .map(entry => entry[0])
    .filter(routeName => !routeName.includes(PAGE_DEGREE_SEPARATOR))

  const trees = topLevelRoutes.map(routeName => buildTree(routeName))

  const rootIndex = trees.findIndex(tree => tree.routeName === 'root')

  if (rootIndex !== -1 && trees[rootIndex].matched.layout) {
    const rootNode = trees[rootIndex]
    const newTrees = [{
      ...rootNode,
      children: trees.filter((_, index) => index !== rootIndex),
    }]

    const routes = newTrees[0].children || []

    const notFoundPath = routes.find((item: RouterTree) => item?.routeName === '404')
    if (notFoundPath) {
      NOT_FOUND_ROUTE.matched = notFoundPath.matched
    }

    routes.push(NOT_FOUND_ROUTE)

    return newTrees
  }

  const notFoundPath = trees.find((item: RouterTree) => item?.routeName === '404')
  if (notFoundPath) {
    NOT_FOUND_ROUTE.matched = notFoundPath.matched
  }

  trees.push(NOT_FOUND_ROUTE)

  return trees
}

/**
 * 转换路由树为常量路由
 */
export function transformRouteTreeToElegantConstRoute(
  tree: RouterTree,
  options: ResolvedOptions,
  parent?: ConstRoute,
): ConstRoute {
  const { extendRoute } = options
  const { children = [], matched, routeName, routePath, handle: constHandle } = tree

  const route: ConstRoute = {
    matched,
    name: routeName,
    path: routePath,
    handle: isRouteGroup(routeName) ? null : constHandle,
  }

  // 调用扩展路由函数
  if (extendRoute) {
    const extendedRoute = extendRoute(route, parent)
    if (extendedRoute) {
      if (isRouteGroup(routeName) && extendedRoute.handle) {
        const { handle, ...rest } = extendedRoute
        Object.assign(route, rest)
        route.handle = null
      }
      else {
        Object.assign(route, extendedRoute)
      }
    }
  }

  if (children.length) {
    route.children = children.map((child: RouterTree) => transformRouteTreeToElegantConstRoute(child, options, route))
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
    const { importPath, routeName, glob, suffix } = data[i]

    if (routeName !== currentName) {
      break
    }

    if (glob.endsWith(`layout.${suffix}`)) {
      matched.layout = importPath
    }
    else if (glob.endsWith(`index.${suffix}`) || ROUTE_NAME_WITH_PARAMS_PATTERN.test(glob)) {
      if (!isRouteGroup(routeName)) {
        matched.index = importPath
      }
    }
    else if (glob.endsWith(`loading.${suffix}`)) {
      matched.loading = importPath
    }
    else if (glob.endsWith(`error.${suffix}`)) {
      matched.error = importPath
    }
  }

  return { fullPath: data[startIndex].fullPath, matched, handle: data[startIndex].handle }
}
