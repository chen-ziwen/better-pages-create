/**
 * 页面上下文模块
 * 管理页面文件的发现、路由生成和热模块替换
 */

import type { Logger, ViteDevServer } from 'vite'
import type { PageOptions, ResolvedOptions, UserOptions } from './types'
import { join, resolve } from 'node:path'
import process from 'node:process'
import { slash, toArray } from '@antfu/utils' // 路径和数组工具
import { getPageFiles } from './files' // 文件获取
import { resolveOptions } from './options' // 选项解析
import { debug, invalidatePagesModule, isTarget } from './utils' // 调试和工具函数

/**
 * 页面路由接口
 * 表示单个页面的路由信息
 */
export interface PageRoute {
  path: string // 文件系统路径
  route: string // 路由路径
  suffix: string // 文件扩展名
  pageDir: string // 页面目录
}

/**
 * 页面上下文类
 * 核心类，负责管理页面发现、路由生成和开发服务器集成
 */
export class PageContext {
  private mServer: ViteDevServer | undefined // Vite 开发服务器实例
  private mPageRouteMap = new Map<string, PageRoute>() // 页面路由映射表

  rawOptions: UserOptions // 原始用户选项
  root: string // 项目根目录
  options: ResolvedOptions // 已解析的选项
  logger?: Logger // 日志记录器

  /**
   * 构造函数
   * @param userOptions - 用户配置选项
   * @param viteRoot - Vite 项目根目录，默认为当前工作目录
   */
  constructor(userOptions: UserOptions, viteRoot: string = process.cwd()) {
    this.rawOptions = userOptions // 保存原始选项
    this.root = slash(viteRoot) // 标准化根目录路径
    debug.env('root', this.root) // 调试输出根目录
    this.options = resolveOptions(userOptions, this.root) // 解析选项
    debug.options(this.options) // 调试输出解析后的选项
  }

  /**
   * 设置日志记录器
   * @param logger - Vite 日志记录器实例
   */
  setLogger(logger: Logger) {
    this.logger = logger
  }

  /**
   * 设置 Vite 开发服务器
   * @param server - Vite 开发服务器实例
   */
  setupViteServer(server: ViteDevServer) {
    if (this.mServer === server) {
      return // 如果是同一个服务器实例，直接返回
    }

    this.mServer = server
    this.setupWatcher(server.watcher) // 设置文件监听器
  }

  /**
   * 设置文件监听器
   * 监听页面文件的添加、删除和修改事件
   * @param watcher - Vite 文件监听器
   */
  setupWatcher(watcher: ViteDevServer['watcher']) {
    // 监听文件删除事件
    watcher.on('unlink', async (path) => {
      path = slash(path) // 标准化路径
      if (!isTarget(path, this.options)) // 检查是否为目标文件
        return
      await this.removePage(path) // 移除页面
      this.onUpdate() // 触发更新
    })

    // 监听文件添加事件
    watcher.on('add', async (path) => {
      path = slash(path) // 标准化路径
      if (!isTarget(path, this.options)) // 检查是否为目标文件
        return
        // 找到对应的页面目录配置
      const page = this.options.dirs.find(i => path.startsWith(slash(resolve(this.root, i.dir))))!
      await this.addPage(path, page) // 添加页面
      this.onUpdate() // 触发更新
    })

    // 监听文件修改事件
    watcher.on('change', async (path) => {
      path = slash(path) // 标准化路径
      if (!isTarget(path, this.options)) // 检查是否为目标文件
        return
      const page = this.mPageRouteMap.get(path) // 获取页面信息
      if (page)
      // 调用解析器的热模块替换处理函数
        await this.options.resolver.hmr?.changed?.(this, path)
    })
  }

  /**
   * 添加页面
   * 将页面文件添加到路由映射表中
   * @param path - 页面文件路径（可以是单个路径或路径数组）
   * @param pageDir - 页面目录配置layout
   */
  async addPage(path: string | string[], pageDir: PageOptions) {
    debug.pages('add', path)

    for (const p of toArray(path)) {
      // 页面目录的绝对路径
      const pageDirPath = slash(resolve(this.root, pageDir.dir))

      // 查找匹配的文件扩展名
      const extension = this.options.extensions.find(ext => p.endsWith(`.${ext}`))

      if (!extension) {
        continue
      }

      // 生成路由路径：基础路由 + 相对路径（去除扩展名）
      const route = slash(join(pageDir.baseRoute, p.replace(`${pageDirPath}/`, '').replace(`.${extension}`, '')))

      // 添加到路由映射表
      this.mPageRouteMap.set(p, {
        path: p,
        route,
        suffix: extension,
        pageDir: pageDir.dir,
      })

      // 调用解析器的热模块替换添加处理函数
      await this.options.resolver.hmr?.added?.(this, p)
    }
  }

  /**
   * 移除页面
   * 从路由映射表中移除页面文件
   * @param path - 页面文件路径
   */
  async removePage(path: string) {
    debug.pages('remove', path)
    this.mPageRouteMap.delete(path) // 从映射表中删除
    // 调用解析器的热模块替换移除处理函数
    await this.options.resolver.hmr?.removed?.(this, path)
  }

  /**
   * 更新处理
   * 当页面发生变化时，使相关模块失效并触发页面重新加载
   */
  onUpdate() {
    if (!this.mServer) {
      return // 如果没有开发服务器，直接返回
    }

    invalidatePagesModule(this.mServer) // 使页面模块失效
    debug.hmr('Reload generated pages.')
    // 发送全页面重新加载消息
    this.mServer.ws.send({
      type: 'full-reload',
    })
  }

  /**
   * 解析路由
   * 调用解析器生成路由代码
   * @returns 生成的路由代码字符串
   */
  async resolveRoutes() {
    return this.options.resolver.resolveRoutes(this)
  }

  /**
   * 搜索页面文件
   * 使用 glob 模式搜索所有页面目录中的页面文件
   */
  async searchGlob() {
    // 遍历所有页面目录，获取文件列表
    const pageDirFiles = this.options.dirs.map((page) => {
      const pagesDirPath = slash(resolve(this.options.root, page.dir)) // 页面目录绝对路径
      const files = getPageFiles(pagesDirPath, this.options, page) // 获取页面文件
      debug.search(page.dir, files)
      return {
        ...page,
        files: files.map(file => slash(file)),
      }
    })

    // 将所有找到的页面文件添加到路由映射表
    for (const page of pageDirFiles) {
      await this.addPage(page.files, page)
    }

    debug.cache(this.pageRouteMap)
  }

  /**
   * 调试工具 getter
   * @returns 调试工具对象
   */
  get debug() {
    return debug
  }

  /**
   * 页面路由映射表 getter
   * @returns 页面路由映射表
   */
  get pageRouteMap() {
    return this.mPageRouteMap
  }
}
