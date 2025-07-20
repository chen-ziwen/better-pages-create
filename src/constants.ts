/**
 * 默认的模块 ID 列表
 * 这些 ID 用于在 Vite 中识别和导入生成的页面路由
 */
export const MODULE_IDS = [
  '~pages', // 通用页面模块 ID
  '~react-pages', // React 页面模块 ID
  'pages-generated', // 生成的页面模块 ID
  'virtual:generated-pages', // 虚拟生成页面模块 ID
  'virtual:generated-pages-react', // 虚拟生成 React 页面模块 ID
]

/**
 * 虚拟模块 ID - 用于生成的页面
 */
export const MODULE_ID_VIRTUAL = 'virtual:vite-plugin-pages/generated-pages'

/**
 * 虚拟模块 ID - 用于路由块
 */
export const ROUTE_BLOCK_ID_VIRTUAL = 'virtual:vite-plugin-pages/route-block'

/**
 * 路由导入名称模板
 * $1 会被替换为实际的导入标识符
 */
export const ROUTE_IMPORT_NAME = '__pages_import_$1__'

/**
 * 匹配格式 (fileName) 或 (fileName)_ 替换为 ""
 */
export const groupRE = [/^\([^)]+\)_?$/g, ''] as const

/**
 * 匹配格式 [...param] 替换为 *
 */
export const splatRE = [/\[\.{3}\w+\]/g, '*'] as const

/**
 * 匹配格式 [param] 替换为 :param
 */
export const paramRE = [/\[([^\]]+)\]/g, ':$1'] as const

/**
 * 匹配格式 -en 或 -[...lang] 替换为 param? 和 :param?
 */
export const optionalRE = [/^-(:?[\w-]+|\*)/, '$1?'] as const

/**
 * 统计斜杆数量，用于排序文件深度
 */
export const countSlashRE = /\//g

/**
 * 替换 index 的正则表达式
 * 用于移除路径末尾的 /index 或 index
 */
export const replaceIndexRE = /\/?index$/
