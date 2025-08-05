import type { PageOptions, ResolvedOptions } from './types'
import { join } from 'node:path'
import { slash } from '@antfu/utils'
import { extsToGlob } from '@better-pages-create/shared'
import { globSync } from 'tinyglobby'

export function getPageDirs(PageOptions: PageOptions, root: string, exclude: string[]): PageOptions[] {
  const dirs = globSync(slash(PageOptions.dir), {
    ignore: exclude,
    onlyDirectories: true,
    dot: true,
    expandDirectories: false,
    cwd: root,
  })

  const pageDirs = dirs.map(dir => ({
    ...PageOptions,
    dir: dir.replace(/\/$/, ''),
  }))

  return pageDirs
}

export function getPageFiles(path: string, options: ResolvedOptions, pageOptions?: PageOptions): string[] {
  const { exclude, extensions } = options

  const ext = extsToGlob(extensions)
  const pattern = pageOptions?.filePattern ?? `**/*.${ext}`

  const files = globSync(pattern, {
    ignore: exclude,
    onlyFiles: true,
    cwd: path,
  }).map(p => slash(join(path, p)))

  return files
}
