/**
 * 字符串化模块
 * 负责将路由对象转换为可执行的 JavaScript 代码
 */

// 导入类型定义
import type { ResolvedOptions } from './types' // 插件选项类型

// 导入常量
import { ROUTE_IMPORT_NAME } from './constants' // 路由导入名称模板

// 导入工具函数
import { resolveImportMode } from './utils' // 导入模式解析

// 正则表达式：匹配组件或元素属性
const componentRE = /"(?:component|element)":("(.*?)")/g

// 正则表达式：匹配函数属性（如 props、beforeEnter）
const hasFunctionRE = /"(?:props|beforeEnter)":("(.*?)")/g

// 正则表达式：匹配多行注释
const multilineCommentsRE = /\/\*(.|[\r\n])*?\*\//g

// 正则表达式：匹配单行注释
const singlelineCommentsRE = /\/\/.*/g

/**
 * 函数替换器
 * 在 JSON.stringify 过程中处理函数类型的值
 * @param _ - 键名（未使用）
 * @param value - 要处理的值
 * @returns 处理后的值
 */
function replaceFunction(_: any, value: any) {
  if (typeof value === 'function' || typeof value === 'function') {
    // 获取函数体并清理注释和空格
    const fnBody = value.toString()
      .replace(multilineCommentsRE, '') // 移除多行注释
      .replace(singlelineCommentsRE, '') // 移除单行注释
      .replace(/(\s)/g, '') // 移除所有空格

    // 检查是否为 ES6 箭头函数
    if (fnBody.length < 8 || fnBody.substring(0, 8) !== 'function')
      return `_NuFrRa_${fnBody}` // 标记箭头函数

    return fnBody // 返回函数体
  }

  return value // 非函数值直接返回
}

/**
 * Creates a stringified Vue Router route definition.
 */
export function stringifyRoutes(
  preparedRoutes: any[],
  options: ResolvedOptions,
) {
  const importsMap: Map<string, string> = new Map()

  function getImportString(path: string, importName: string) {
    const mode = resolveImportMode(path, options)
    return mode === 'sync'
      ? `import ${importName} from "${path}"`
      : `const ${importName} = ${
        options.resolver.stringify?.dynamicImport?.(path) || `() => import("${path}")`
      }`
  }

  function componentReplacer(str: string, replaceStr: string, path: string) {
    let importName = importsMap.get(path)

    if (!importName)
      importName = ROUTE_IMPORT_NAME.replace('$1', `${importsMap.size}`)

    importsMap.set(path, importName)

    importName = options.resolver.stringify?.component?.(importName) || importName

    return str.replace(replaceStr, importName)
  }

  function functionReplacer(str: string, replaceStr: string, content: string) {
    if (content.startsWith('function'))
      return str.replace(replaceStr, content)

    if (content.startsWith('_NuFrRa_'))
      return str.replace(replaceStr, content.slice(8))

    return str
  }

  const stringRoutes = JSON
    .stringify(preparedRoutes, replaceFunction)
    .replace(componentRE, componentReplacer)
    .replace(hasFunctionRE, functionReplacer)

  const imports = Array.from(importsMap).map(args => getImportString(...args))

  return {
    imports,
    stringRoutes,
  }
}

export function generateClientCode(routes: any[], options: ResolvedOptions) {
  const { imports, stringRoutes } = stringifyRoutes(routes, options)
  const code = `${imports.join(';\n')};\n\nconst routes = ${stringRoutes};\n\nexport default routes;`
  return options.resolver.stringify?.final?.(code) || code
}
