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
 * 路由导入名称模板
 * $1 会被替换为实际的导入标识符
 */
export const ROUTE_IMPORT_NAME = '__pages_import_$1__'

/**
 * 匹配格式 (fileName) 或 (fileName)_ 替换为 ""
 */
export const GROUP_RE = [/^\([^)]+\)_?$/g, ''] as const

/**
 * 匹配格式 [...param] 替换为 *
 */
export const SPLAT_RE = [/\[\.{3}\w+\]/g, '*'] as const

/**
 * 匹配格式 [param] 替换为 :param
 */
export const PARAM_RE = [/\[([^\]]+)\]/g, ':$1'] as const

/**
 * 将 _ 替换成 /
 */
export const PATH_REPLACER = [/_/g, '/'] as const

/**
 * 统计斜杆数量，用于排序文件深度
 */
export const COUNTSLASH_RE = /\//g

export const REPLACEINDEX_RE = /\/?index$/

export const PATH_SPLITTER = '/'

export const PAGE_DEGREE_SPLITTER = '_'

export const PAGE_FILE_NAME_WITH_SQUARE_BRACKETS_PATTERN = /^\[(?:\.{3})?\w+\]\.(.+)$/

export const PAGE_DIR_NAME_PATTERN = /^[\w-]+[0-9a-z]$/i

export const PAGE_FILE_NAME_PATTERN = /^[0-9a-zA-Z][0-9a-zA-Z-]+[0-9a-zA-Z]\.[a-z]+$/

export const UPPERCASE_LETTER_PATTERN = /[A-Z]/g

export const ROUTE_NAME_WITH_PARAMS_PATTERN = /\/\[([^\]]+)\]\.tsx$/

export const NOT_FOUND_ROUTE = {
  fullPath: '*',
  importPath: '',
  matched: {},
  routeName: 'notFound',
  routePath: '*',
}
