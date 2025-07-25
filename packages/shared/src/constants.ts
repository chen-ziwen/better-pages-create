// 用于在 Vite 中识别和导入生成的页面路由
export const MODULE_IDS = [
  '~pages',
  'virtual:better-pages-create',
]

// 唯一标识 虚拟模块 ID
export const MODULE_ID_VIRTUAL = 'virtual:better-pages-create/generated-pages'

export const PATH_SEPARATOR = '/' // 统一的路径分隔符
export const PAGE_DEGREE_SEPARATOR = '_' // 页面层级分隔符

// 路由导入名称模板
export const ROUTE_IMPORT_NAME = '__pages_import_$1__'

export const SLASH_RE = /\//g // 匹配所有斜杠
export const GROUP_RE = /\([^)]+\)_?/g // 匹配路由组格式 (fileName) 或 (fileName)_
export const PARAM_RE = /\[([^\]]+)\]/g // 匹配路由参数 [param]
export const SPLAT_RE = /\[\.{3}\w+\]/g // 匹配展开参数 [...param]
export const UNDERSCORE_RE = /_/g // 匹配下划线
export const PAGES_WITH_PATTERN = /^\[(?:\.{3})?\w+\]\.(.+)$/ // 匹配特殊页面文件
export const ROUTE_NAME_WITH_PARAMS_PATTERN = /\/\[([^\]]+)\]\.(.+)$/ // 匹配带参数的路由名

export const NOT_FOUND_ROUTE = {
  fullPath: '*',
  importPath: '',
  matched: {},
  routeName: 'notFound',
  routePath: '*',
}
