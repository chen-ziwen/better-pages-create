/**
 * 默认的模块 ID 列表
 * 这些 ID 用于在 Vite 中识别和导入生成的页面路由
 */
export const MODULE_IDS = [
  '~pages', // 通用页面模块 ID
  '~react-pages', // React 页面模块 ID
  'pages-generated', // 生成的页面模块 ID
  'virtual:generated-pages', // 虚拟生成页面模块 ID
  'virtual:better-pages-create', // 虚拟生成 React 页面模块 ID
]

/**
 * 虚拟模块 ID - 用于生成的页面
 */
export const MODULE_ID_VIRTUAL = 'virtual:better-pages-create/generated-pages'

/**
 * 虚拟模块 ID - 用于路由块
 */
export const ROUTE_BLOCK_ID_VIRTUAL = 'virtual:better-pages-create/route-block'

/**
 * 路径分隔符常量
 */
export const PATH_SEPARATOR = '/' // 统一的路径分隔符
export const PAGE_DEGREE_SEPARATOR = '_' // 页面层级分隔符

/**
 * 路由导入名称模板
 */
export const ROUTE_IMPORT_NAME = '__pages_import_$1__'

/**
 * 正则表达式常量
 */
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
