export const MODULE_IDS = [
  '~pages',
  'virtual:better-pages-create',
]

export const MODULE_ID_VIRTUAL = 'virtual:better-pages-create/generated-pages'

export const PATH_SEPARATOR = '/'
export const PAGE_DEGREE_SEPARATOR = '_'

export const ROUTE_IMPORT_NAME = '__pages_import_$1__'

export const SLASH_RE = /\//g
export const GROUP_RE = /\([^)]+\)_?/g
export const PARAM_RE = /\[([^\]]+)\]/g
export const SPLAT_RE = /\[\.{3}\w+\]/g
export const UNDERSCORE_RE = /_/g
export const PAGES_WITH_PATTERN = /^\[(?:\.{3})?\w+\]\.(.+)$/
export const ROUTE_NAME_WITH_PARAMS_PATTERN = /\/\[([^\]]+)\]\.(.+)$/

export const NOT_FOUND_ROUTE = {
  fullPath: '*',
  importPath: '',
  matched: {},
  routeName: 'notFound',
  routePath: '*',
}
