import type { PageRoute } from './context'
import type { BetterRouterFile, BetterRouterOption, ResolvedOptions } from './types'
import { join } from 'node:path'
import { slash } from '@antfu/utils'
import {
  GROUP_RE,
  PAGE_DEGREE_SPLITTER,
  PAGE_FILE_NAME_WITH_SQUARE_BRACKETS_PATTERN,
  PARAM_RE,
  PATH_REPLACER,
  PATH_SPLITTER,
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
  }
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

export function transformRouterFilesToMaps(files: BetterRouterFile[], options: BetterRouterOption) {
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
