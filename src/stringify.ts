// 这个文件现在主要用于通用的字符串化功能
// React 特定的字符串化功能已移动到 src/react/stringify.ts

export function generateClientCode(_routes: any[], _options: any) {
  // 这是一个通用的生成函数，具体实现由各个解析器提供
  // React 解析器使用 src/react/stringify.ts 中的 generateReactClientCode
  throw new Error('generateClientCode should be implemented by specific resolvers')
}
