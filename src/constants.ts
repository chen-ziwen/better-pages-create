/**
 * 常量定义文件
 * 包含插件使用的各种常量、正则表达式和标识符
 */

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
 * 路由块查询正则表达式
 * 用于匹配 Vue 单文件组件中的路由块查询参数
 */
export const routeBlockQueryRE = /\?vue&type=route/

/**
 * Next.js 风格的动态路由正则表达式
 * 匹配格式：[param] 或 [slug]
 */
export const dynamicRouteRE = /^\[(.+)\]$/

/**
 * Next.js 风格的捕获所有路由正则表达式
 * 匹配格式：[...param] 或 [...slug]
 */
export const cacheAllRouteRE = /^\[\.{3}(.*)\]$/

/**
 * 替换动态路由的正则表达式
 * 用于提取动态路由参数名称
 */
export const replaceDynamicRouteRE = /^\[(?:\.{3})?(.*)\]$/

/**
 * Nuxt.js 风格的动态路由正则表达式
 * 匹配格式：_param 或 _slug
 */
export const nuxtDynamicRouteRE = /^_(.*)$/

/**
 * Nuxt.js 风格的捕获所有路由正则表达式
 * 匹配格式：_ (单个下划线)
 */
export const nuxtCacheAllRouteRE = /^_$/

/**
 * 计算斜杠数量的正则表达式
 * 用于统计路径中的斜杠字符
 */
export const countSlashRE = /\//g

/**
 * 替换 index 的正则表达式
 * 用于移除路径末尾的 /index 或 index
 */
export const replaceIndexRE = /\/?index$/
