import type { PageRoute } from './context'
import type { ConstRoute, ResolvedOptions, RouterFile, RouterNamePathEntry, RouterNamePathMap, RouterTree } from './types'
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

export function transformPageGlobToRouterFile(pageRoute: PageRoute, options: ResolvedOptions) {
  const { alias } = options

  const { path: fullPath, route, suffix, pageDir } = pageRoute

  const glob = `${route}.${suffix}`

  const importPath = slash(join(pageDir, glob))

  let importAliasPath = importPath

  const dirAndFile = glob.split(PATH_SPLITTER).reverse()

  const [file, ...dirs] = dirAndFile

  const aliasEntries = Object.entries(alias)

  // 处理路径别名
  aliasEntries.some((item) => {
    const [a, dir] = item
    const match = importPath.startsWith(dir)

    if (match) {
      importAliasPath = importAliasPath.replace(dir, a)
    }
    return match
  })

  // 去除 _ 开头的目录
  const filteredDirs = dirs.filter(dir => !dir.startsWith(PAGE_DEGREE_SPLITTER)).reverse()

  // file 是带有后缀名的， 去除后缀名后插入到数组
  if (PAGE_FILE_NAME_WITH_SQUARE_BRACKETS_PATTERN.test(file)) {
    filteredDirs.push(file.replace(new RegExp(`\\.${suffix}$`), ''))
  }

  let routeName = filteredDirs.join(PAGE_DEGREE_SPLITTER).toLocaleLowerCase()

  if (filteredDirs.length === 0) {
    routeName = 'root'
  }

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
 * 将文件名转换为 React Router 可识别的路由路径
 * @param name - 文件名
 * @returns React Router 路由路径
 */
export function transformRouterNameToPath(
  name: string,
) {
  if (name === 'root') {
    return '/'
  }

  if (isRouteGroup(name)) {
    return null
  }

  const resolveName = name
    // 去除路由组 去除路由组 (fileName) 或 (fileName)_
    .replace(...GROUP_RE)
    // 替换 [...param] 为 *
    .replace(...SPLAT_RE)
    // 替换 [param] 为 :param
    .replace(...PARAM_RE)
    // 替换 _ 为 /
    .replace(...PATH_REPLACER)

  return `/${resolveName}`
}

export function transformRouterFilesToMaps(files: RouterFile[], options: ResolvedOptions) {
  const maps: Map<string, string | null> = new Map()

  files.forEach((file) => {
    const { routeName, routePath } = file

    const names = splitRouterName(routeName)

    names.forEach((name) => {
      if (!maps.has(name)) {
        const isSameName = name === routeName

        const itemRouteName = isSameName ? name : options.routeNameTransformer(name)
        const itemRoutePath = isSameName ? routePath : options.routePathTransformer(itemRouteName, transformRouterNameToPath(name))

        maps.set(itemRouteName, itemRoutePath)
      }
    })
  })

  return maps
}

export function transformRouterMapsToEntries(maps: RouterNamePathMap) {
  const entries: RouterNamePathEntry[] = []

  maps.forEach((routePath, routeName) => {
    entries.push([routeName, routePath])
  })

  return entries.sort((a, b) => a[0].localeCompare(b[0]))
}

export function transformRouterEntriesToTrees(
  entries: RouterNamePathEntry[],
  maps: RouterNamePathMap,
  files: RouterFile[],
) {
  const treeWithClassify = new Map<string, string[][]>()

  entries.forEach(([routeName]) => {
    const isFirstLevel = !routeName.includes(PAGE_DEGREE_SPLITTER)

    if (isFirstLevel) {
      treeWithClassify.set(routeName, [])
    }
    else {
      const names = routeName.split(PAGE_DEGREE_SPLITTER)

      const firstLevelName = names[0]

      const levels = routeName.split(PAGE_DEGREE_SPLITTER).length

      const currentLevelChildren = treeWithClassify.get(firstLevelName) || []

      const child = currentLevelChildren[levels - 2] || []

      child.push(routeName)

      currentLevelChildren[levels - 2] = child

      treeWithClassify.set(firstLevelName, currentLevelChildren)
    }
  })

  const trees: RouterTree[] = []

  treeWithClassify.forEach((children, key) => {
    const { fullPath, matchedResult } = findMatchedFiles(files, key)

    const firstLevelRoute: RouterTree = {
      fullPath,
      matchedFiles: matchedResult,
      routeName: key,
      routePath: maps.get(key) || null,
    }

    const treeChildren = recursiveGetRouteTreeChildren(key, children, maps, files)

    if (treeChildren.length > 0) {
      firstLevelRoute.children = treeChildren
    }

    trees.push(firstLevelRoute)
  })

  const rootIndex = trees.findIndex(tree => tree.routeName === 'root')

  if (rootIndex !== -1 && trees[rootIndex].matchedFiles[0]) {
    const rootNode = trees[rootIndex]

    // 创建一个新的数组，将 rootNode 的 children 设置为其他所有节点
    const newTrees = [
      {
        ...rootNode, // 保留 root 节点的原有属性
        children: trees.filter((_, index) => index !== rootIndex), // 将除了 root 以外的所有节点作为 children
      },
    ]

    const routes = newTrees[0].children
    const notFoundPath = routes.find(item => item?.routeName === '404')

    if (notFoundPath) {
      NOT_FOUND_ROUTE.matchedFiles = notFoundPath.matchedFiles
    }

    routes.push(NOT_FOUND_ROUTE)
    return newTrees
  }

  const notFoundPath = trees.find(item => item?.routeName === '404')

  if (notFoundPath) {
    NOT_FOUND_ROUTE.matchedFiles = notFoundPath.matchedFiles
  }

  trees.push(NOT_FOUND_ROUTE)

  return trees
}

export function transformRouterTreesToRoutes(trees: RouterTree[], options: ResolvedOptions) {
  return trees.map(item => transformRouteTreeToElegantConstRoute(item, options))
}

function recursiveGetRouteTreeChildren(
  parentName: string,
  children: string[][],
  maps: RouterNamePathMap,
  files: RouterFile[],
) {
  if (children.length === 0) {
    return []
  }

  const [current, ...rest] = children

  const currentChildren = current.filter(name => name.startsWith(parentName) && name !== parentName)

  const trees = currentChildren.map((name) => {
    const { fullPath, matchedResult } = findMatchedFiles(files, name)
    const tree: RouterTree = {
      fullPath,
      matchedFiles: matchedResult,
      routeName: name,
      routePath: maps.get(name) || null,
    }

    const nextChildren = recursiveGetRouteTreeChildren(name, rest, maps, files)

    if (nextChildren.length > 0) {
      tree.children = nextChildren
    }

    return tree
  })

  return trees
}

function findMatchedFiles(data: RouterFile[], currentName: string) {
  // 结果数组，四个值都为 null
  // 分别对应: 0->layout, 1->index, 2->loading, 3->error
  const matchedResult: (string | null)[] = [null, null, null, null]

  // findIndex 找到当前 name 对应的下标
  const startIndex = data.findIndex(item => item.routeName === currentName)

  if (startIndex === -1) {
    // 找不到就直接返回全是 null 的数组
    return { fullPath: null, matchedResult }
  }

  // 最多匹配 3 个之后的元素(含自己共 4 个)
  const endIndex = Math.min(startIndex + 4, data.length - 1)

  // 从 startIndex 开始往后遍历，直到 endIndex
  for (let i = startIndex; i <= endIndex; i += 1) {
    const { importPath, routeName } = data[i]

    // 如果后面的 name 跟当前 name 不一样，则立即停止匹配
    if (routeName !== currentName) {
      break
    }

    const { glob } = data[i]

    // 如果 name 一直跟 currentName 一样，则根据文件结尾来判定要填哪一个
    if (glob.endsWith('layout.tsx')) {
      matchedResult[0] = routeName // 把 layout 填入第一个位置
    }
    else if (glob.endsWith('index.tsx') || ROUTE_NAME_WITH_PARAMS_PATTERN.test(glob)) {
      if (!isRouteGroup(routeName)) {
        matchedResult[1] = `/${importPath}` // 填入第二个位置
      }
    }
    else if (glob.endsWith('loading.tsx')) {
      matchedResult[2] = `/${importPath}` // 填入第三个位置
    }
    else if (glob.endsWith('error.tsx')) {
      matchedResult[3] = routeName // 填入第四个位置
    }
  }

  return { fullPath: data[startIndex].fullPath, matchedResult }
}

function transformRouteTreeToElegantConstRoute(tree: RouterTree, options: any) {
  const { onRouteMetaGen } = options

  const { children = [], matchedFiles, routeName, routePath } = tree

  const hasChildren = children.length > 0

  const route: ConstRoute = {
    matchedFiles,
    name: routeName,
    path: routePath,
  }

  if (isRouteGroup(routeName)) {
    route.handle = null
  }
  else {
    if (typeof onRouteMetaGen === 'function') {
      route.handle = onRouteMetaGen(routeName)
    }
  }

  if (hasChildren) {
    route.children = children.map(item => recursiveGetElegantConstRouteByChildTree(item, options))
  }

  return route
}

function recursiveGetElegantConstRouteByChildTree(
  childTree: RouterTree,
  options: any,
): ConstRoute {
  const { children = [], matchedFiles, routeName, routePath } = childTree

  const { onRouteMetaGen } = options

  const hasChildren = children.length > 0

  const route: ConstRoute = {
    matchedFiles,
    name: routeName,
    path: routePath,
  }

  if (isRouteGroup(routeName)) {
    route.handle = null
  }
  else {
    route.handle = onRouteMetaGen(routeName)
  }

  if (hasChildren) {
    const routeChildren = children.map(item => recursiveGetElegantConstRouteByChildTree(item, options))

    route.children = routeChildren
  }

  return route
}
