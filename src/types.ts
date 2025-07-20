/**
 * 类型定义文件
 * 包含插件使用的所有 TypeScript 类型定义
 */

// 导入外部类型
import type { Awaitable } from '@antfu/utils' // 可等待类型（Promise 或同步值）
import type { PageContext } from './context' // 页面上下文类型
import type { ReactRoute } from './resolvers' // React 路由类型

/**
 * 可选属性工具类型
 * 将类型 T 中的指定属性 K 变为可选
 */
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

/**
 * 导入模式类型
 * sync: 同步导入，async: 异步导入
 */
export type ImportMode = 'sync' | 'async'

/**
 * 导入模式解析器函数类型
 * 根据文件路径和插件选项决定使用同步还是异步导入
 */
export type ImportModeResolver = (filepath: string, pluginOptions: ResolvedOptions) => ImportMode

/**
 * 解析后的 JSX 接口
 * 包含 JSX 代码的值和位置信息
 */
export interface ParsedJSX {
  value: string // JSX 代码字符串
  loc: {
    start: {
      line: number // 起始行号
    }
  }
}

/**
 * 自定义块类型
 * 用于存储任意的自定义配置数据
 */
export type CustomBlock = Record<string, any>

/**
 * 内置页面解析器类型
 * 支持的框架类型
 */
export type InternalPageResolvers = 'vue' | 'react' | 'solid'

/**
 * 页面选项接口
 * 定义单个页面目录的配置选项
 */
export interface PageOptions {
  /**
   * 页面基础目录
   * @default 'src/pages'
   */
  dir: string
  /**
   * 页面基础路由
   * 用于设置该目录下页面的路由前缀
   */
  baseRoute: string
  /**
   * 页面文件匹配模式（可选）
   * @example `**\/*.page.vue`
   */
  filePattern?: string
}

/**
 * 页面解析器接口
 * 定义页面解析器必须实现的方法和可选功能
 */
export interface PageResolver {
  /**
   * 解析模块 ID 列表
   * 返回该解析器支持的模块标识符
   */
  resolveModuleIds: () => string[]

  /**
   * 解析支持的文件扩展名
   * 返回该解析器能处理的文件扩展名列表
   */
  resolveExtensions: () => string[]

  /**
   * 解析路由
   * 根据页面上下文生成路由代码字符串
   */
  resolveRoutes: (ctx: PageContext) => Awaitable<string>

  /**
   * 获取计算后的路由
   * 返回处理后的路由对象数组
   */
  getComputedRoutes: (ctx: PageContext) => Awaitable<ReactRoute[]>

  /**
   * 字符串化选项（可选）
   * 定义如何将路由转换为代码字符串
   */
  stringify?: {
    /**
     * 动态导入字符串化函数
     * 定义如何生成动态导入语句
     */
    dynamicImport?: (importPath: string) => string

    /**
     * 组件字符串化函数
     * 定义如何生成组件引用代码
     */
    component?: (importName: string) => string

    /**
     * 最终代码处理函数
     * 对生成的完整代码进行最后的处理
     */
    final?: (code: string) => string
  }

  /**
   * 热模块替换选项（可选）
   * 定义文件变化时的处理逻辑
   */
  hmr?: {
    /**
     * 文件添加时的处理函数
     */
    added?: (ctx: PageContext, path: string) => Awaitable<void>

    /**
     * 文件删除时的处理函数
     */
    removed?: (ctx: PageContext, path: string) => Awaitable<void>

    /**
     * 文件修改时的处理函数
     */
    changed?: (ctx: PageContext, path: string) => Awaitable<void>
  }
}

/**
 * 插件选项接口
 * 定义插件的完整配置选项
 */
interface Options {
  /**
   * 搜索页面组件的目录路径
   * 可以是单个字符串或字符串/PageOptions 对象的数组
   * @default 'src/pages'
   */
  dirs: string | (string | PageOptions)[]

  /**
   * 页面组件的有效文件扩展名
   * @default ['vue', 'js']
   */
  extensions: string[]

  /**
   * 解析页面时要排除的路径 glob 模式列表
   */
  exclude: string[]

  /**
   * 直接导入路由或作为异步组件导入
   * @default 'root index file => "sync", others => "async"'
   */
  importMode: ImportMode | ImportModeResolver

  /**
   * 从绝对路径或相对路径导入页面组件
   * @default 'relative'
   */
  importPath: 'absolute' | 'relative'

  /**
   * 生成的路由名称的分隔符
   * @default '-'
   */
  routeNameSeparator: string

  /**
   * 路由路径的大小写敏感性
   * @default false
   */
  caseSensitive: boolean

  /**
   * 设置默认的路由块解析器，或在 SFC 路由块中使用 `<route lang=xxx>`
   * @default 'json5'
   */
  routeBlockLang: 'json5' | 'json' | 'yaml' | 'yml'

  /**
   * 路由导入的模块 ID
   * @default '~pages'
   */
  moduleId: string

  /**
   * 生成路由的解析器
   * 可以是内置解析器名称或自定义解析器对象
   * @default 'auto detect'
   */
  resolver: InternalPageResolvers | PageResolver

  /**
   * 扩展路由记录的函数
   * 允许用户自定义修改生成的路由对象
   */
  extendRoute?: (route: any, parent: any | undefined) => any | void

  /**
   * 自定义生成的路由
   * 在路由生成完成后调用，允许用户进一步处理路由数组
   */
  onRoutesGenerated?: (routes: any[]) => Awaitable<any[] | void>

  /**
   * 自定义生成的客户端代码
   * 在客户端代码生成完成后调用，允许用户修改最终的代码字符串
   */
  onClientGenerated?: (clientCode: string) => Awaitable<string | void>
}

/**
 * 用户选项类型
 * 将 Options 接口的所有属性变为可选，供用户配置使用
 */
export type UserOptions = Partial<Options>

/**
 * 已解析选项接口
 * 继承 Options 接口，但排除一些已废弃的属性，并添加解析后的新属性
 */
export interface ResolvedOptions extends Omit<Options, 'pagesDir' | 'replaceSquareBrackets' | 'syncIndex' | 'moduleId'> {
  /**
   * 解析为 Vite 配置中的 `root` 值
   * 项目的根目录路径
   * @default config.root
   */
  root: string

  /**
   * 已解析的页面目录列表
   * 将用户配置转换为标准的 PageOptions 对象数组
   */
  dirs: PageOptions[]

  /**
   * 已解析的页面解析器
   * 实际使用的解析器实例
   */
  resolver: PageResolver

  /**
   * 匹配文件扩展名的正则表达式
   * 根据 extensions 数组生成的正则表达式
   */
  extensionsRE: RegExp

  /**
   * 路由导入的模块 ID 列表
   * 支持多个模块 ID，而不是单个 moduleId
   */
  moduleIds: string[]
}
