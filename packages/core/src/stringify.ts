// 匹配任意属性名的字符串值
const hasFunctionRE = /"[^"]+":("(.*?)")/g

// 匹配多行注释
const multilineCommentsRE = /\/\*(.|[\r\n])*?\*\//g

// 匹配单行注释
const singlelineCommentsRE = /\/\/.*/g

/**
 * 函数替换器
 * 在 JSON.stringify 过程中处理函数类型的值
 * @param _ - 键名（未使用）
 * @param value - 要处理的值
 * @returns 处理后的值
 */
function replaceFunction(_: any, value: any) {
  if (typeof value === 'function') {
    const fnBody = value.toString()
      .replace(multilineCommentsRE, '') // 移除多行注释
      .replace(singlelineCommentsRE, '') // 移除单行注释
      .replace(/(\s)/g, '') // 移除所有空格

    return `__FNC__${fnBody}`
  }

  return value
}

/**
 * 字符串化路由
 * 将路由对象转换为字符串，处理函数类型的值
 * @param preparedRoutes - 准备好的路由对象
 * @returns 字符串化后的路由对象
 */
export function stringifyRoutes(
  preparedRoutes: any[],
) {
  function functionReplacer(str: string, replaceStr: string, content: string) {
    if (content.startsWith('__FNC__')) {
      return str.replace(replaceStr, content.slice(7))
    }

    return str
  }

  const stringRoutes = JSON
    .stringify(preparedRoutes, replaceFunction)
    .replace(hasFunctionRE, functionReplacer)

  return {
    stringRoutes,
  }
}
