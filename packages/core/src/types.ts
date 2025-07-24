import type { Awaitable } from '@antfu/utils'
import type { PageContext } from './context'

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export type CustomBlock = Record<string, any>

export type InternalPageResolvers = 'react'

export interface PageOptions {
  dir: string
  baseRoute: string
  filePattern?: string
}

export interface PageRoute {
  path: string
  route: string
  suffix: string
  pageDir: string
}

export interface PageResolver {
  resolveModuleIds: () => string[]
  resolveExtensions: () => string[]
  resolveRoutes: (ctx: PageContext) => Awaitable<string>
  getComputedRoutes: (ctx: PageContext) => Awaitable<ConstRoute[]>

  stringify?: {
    dynamicImport?: (importPath: string) => string
    component?: (importName: string) => string
    final?: (code: string) => string
  }

  hmr?: {
    added?: (ctx: PageContext, path: string) => Awaitable<void>
    removed?: (ctx: PageContext, path: string) => Awaitable<void>
    changed?: (ctx: PageContext, path: string) => Awaitable<void>
  }
}

interface Options {
  dirs: string | (string | PageOptions)[]
  extensions: string[]
  exclude: string[]
  routeNameSeparator: string
  caseSensitive: boolean
  moduleId: string
  resolver: InternalPageResolvers | PageResolver
  extendRoute?: (route: ConstRoute, parent: ConstRoute | undefined) => ConstRoute | void
  onRoutesGenerated?: (routes: ConstRoute[]) => Awaitable<ConstRoute[] | void>
  onClientGenerated?: (clientCode: string) => Awaitable<string | void>
}

export type UserOptions = Partial<Options>

export type RouterNamePathMap = Map<string, string | null>

export type RouterNamePathEntry = [string, string | null]

export interface ResolvedOptions extends Omit<Options, 'pagesDir' | 'replaceSquareBrackets' | 'syncIndex' | 'moduleId'> {
  root: string
  dirs: PageOptions[]
  resolver: PageResolver
  extensionsRE: RegExp
  moduleIds: string[]
}

export interface RouterFile {
  componentName: string
  fullPath: string
  glob: string
  importPath: string
  routeName: string
  routePath: string | null
  suffix: string
  handle?: Record<string, any> | null
}

export interface RouterOption {
  cwd: string
  log: boolean
  pageDir: string
  pageExcludePatterns: string[]
  pagePatterns: string[]
  routeNameTransformer: (routeName: string) => string
  routePathTransformer: (transformedName: string, path: string | null) => string | null
}

export interface RouterTree {
  children?: RouterTree[]
  fullPath: string | null
  matched: Record<string, string>
  routeName: string
  routePath: string | null
  handle?: Record<string, any> | null
}

export interface CustomRouteConfig {
  entries: RouterNamePathEntry[]
  firstLevelRoutes: string[]
  lastLevelRoutes: string[]
}

export type RouteMeta = Record<string | number, unknown>

export interface ConstRoute {
  children?: ConstRoute[]
  matched: Record<string, string>
  name: string
  path?: string | null
  handle?: Record<string, any> | null
}

export type PagesType = 'layout' | 'index' | 'loading' | 'error'
