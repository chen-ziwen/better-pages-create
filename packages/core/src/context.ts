import type { Logger, ViteDevServer } from 'vite'
import type { PageOptions, PageRoute, ResolvedOptions, UserOptions } from './types'
import { join, resolve } from 'node:path'
import process from 'node:process'
import { slash, toArray } from '@antfu/utils'
import { getPageFiles } from './files'
import { resolveOptions } from './options'
import { debug, invalidatePagesModule, isTarget } from './utils'

export class PageContext {
  private mServer: ViteDevServer | undefined
  private mPageRouteMap = new Map<string, PageRoute>()

  rawOptions: UserOptions
  root: string
  options: ResolvedOptions
  logger?: Logger

  constructor(userOptions: UserOptions, viteRoot: string = process.cwd()) {
    this.rawOptions = userOptions
    this.root = slash(viteRoot)
    debug.env('root', this.root)
    this.options = resolveOptions(userOptions, this.root)
    debug.options(this.options)
  }

  setLogger(logger: Logger) {
    this.logger = logger
  }

  setupViteServer(server: ViteDevServer) {
    if (this.mServer === server) {
      return
    }

    this.mServer = server
    this.setupWatcher(server.watcher)
  }

  setupWatcher(watcher: ViteDevServer['watcher']) {
    watcher.on('unlink', async (path) => {
      path = slash(path)

      if (!isTarget(path, this.options)) {
        return
      }

      await this.removePage(path)
      this.onUpdate()
    })

    watcher.on('add', async (path) => {
      path = slash(path)

      if (!isTarget(path, this.options)) {
        return
      }

      const page = this.options.dirs.find(i => path.startsWith(slash(resolve(this.root, i.dir))))!

      await this.addPage(path, page)

      this.onUpdate()
    })

    watcher.on('change', async (path) => {
      path = slash(path)

      if (!isTarget(path, this.options)) {
        return
      }

      const page = this.mPageRouteMap.get(path)

      if (page) {
        await this.options.resolver.hmr?.changed?.(this, path)
      }
    })
  }

  async addPage(path: string | string[], pageDir: PageOptions) {
    debug.pages('add', path)

    for (const p of toArray(path)) {
      const pageDirPath = slash(resolve(this.root, pageDir.dir))

      const extension = this.options.extensions.find(ext => p.endsWith(`.${ext}`))

      if (!extension) {
        continue
      }

      const route = slash(join(pageDir.baseRoute, p.replace(`${pageDirPath}/`, '').replace(`.${extension}`, '')))

      const glob = `${route}.${extension}`

      const importPath = slash(join('/', pageDir.dir, glob))

      this.mPageRouteMap.set(p, {
        path: p,
        glob,
        importPath,
        route,
        suffix: extension,
        pageDir: pageDir.dir,
      })

      await this.options.resolver.hmr?.added?.(this, p)
    }
  }

  async removePage(path: string) {
    debug.pages('remove', path)

    this.mPageRouteMap.delete(path)

    await this.options.resolver.hmr?.removed?.(this, path)
  }

  onUpdate() {
    if (!this.mServer) {
      return
    }

    invalidatePagesModule(this.mServer)
    debug.hmr('Reload generated pages.')
    this.mServer.ws.send({ type: 'full-reload' })
  }

  async resolveRoutes() {
    return this.options.resolver.resolveRoutes(this)
  }

  async searchGlob() {
    const pageDirFiles = this.options.dirs.map((page) => {
      const pagesDirPath = slash(resolve(this.options.root, page.dir))
      const files = getPageFiles(pagesDirPath, this.options, page)
      debug.search(page.dir, files)
      return {
        ...page,
        files: files.map(file => slash(file)),
      }
    })

    for (const page of pageDirFiles) {
      await this.addPage(page.files, page)
    }

    debug.cache(this.pageRouteMap)
  }

  get debug(): typeof debug {
    return debug
  }

  get pageRouteMap() {
    return this.mPageRouteMap
  }
}
