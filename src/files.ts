/**
 * 文件处理模块
 * 负责页面文件的发现和目录解析
 */

import type { PageOptions, ResolvedOptions } from './types'
import { join } from 'node:path'
import { slash } from '@antfu/utils' // 路径斜杠标准化
import { globSync } from 'tinyglobby' // 文件 glob 匹配
import { extsToGlob } from './utils' // 扩展名转 glob 模式

/**
 * 解析页面目录
 * 根据给定的 glob 模式解析页面目录
 * @param PageOptions - 页面选项配置
 * @param root - 项目根目录
 * @param exclude - 排除的文件/目录模式
 * @returns 解析后的页面目录选项数组
 */
export function getPageDirs(PageOptions: PageOptions, root: string, exclude: string[]): PageOptions[] {
  const dirs = globSync(slash(PageOptions.dir), {
    ignore: exclude, // 忽略的模式
    onlyDirectories: true, // 只匹配目录
    dot: true, // 包含以点开头的目录
    expandDirectories: false, // 不展开目录
    cwd: root, // 工作目录
  })

  // 将匹配的目录转换为页面目录选项
  const pageDirs = dirs.map(dir => ({
    ...PageOptions, // 继承原有选项
    dir: dir.replace(/\/$/, ''), // 移除目录路径末尾的斜杠
  }))

  return pageDirs
}

/**
 * 获取页面文件
 * 解析给定上下文中的有效页面文件
 * @param path - 搜索路径
 * @param options - 已解析的选项
 * @param pageOptions - 页面选项（可选）
 * @returns 页面文件路径数组
 */
export function getPageFiles(path: string, options: ResolvedOptions, pageOptions?: PageOptions): string[] {
  const {
    exclude,
    extensions,
  } = options

  // 将扩展名转换为 glob 模式
  const ext = extsToGlob(extensions)
  // 使用自定义文件模式或默认模式
  const pattern = pageOptions?.filePattern ?? `**/*.${ext}`

  // 使用 glob 匹配文件
  const files = globSync(pattern, {
    ignore: exclude, // 忽略的模式
    onlyFiles: true, // 只匹配文件
    cwd: path, // 工作目录
  }).map(p => slash(join(path, p))) // 拼接完整路径并标准化

  return files
}
