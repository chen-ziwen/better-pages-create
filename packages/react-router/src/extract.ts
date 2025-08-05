import { readFileSync } from 'node:fs'
import extractComments from 'extract-comments'

export function extractHandleFromFile(filePath: string): Record<string, any> | null {
  try {
    const content = readFileSync(filePath, 'utf-8')
    return extractHandleFromContent(content)
  }
  catch (error: any) {
    console.warn(`Failed to read file ${filePath}: ${error.message}`)
    return null
  }
}

export function extractHandleFromContent(content: string): Record<string, any> | null {
  try {
    const comments = extractComments(content)

    for (const comment of comments) {
      const commentText = comment.value || comment.raw || ''

      if (commentText.includes('@handle')) {
        const jsonMatch = commentText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          try {
            const handle = JSON.parse(jsonMatch[0])
            if (validateHandle(handle)) {
              return handle
            }
          }
          catch (parseError) {
            console.warn('Failed to parse handle JSON:', parseError)
          }
        }
      }
    }

    return null
  }
  catch {
    return null
  }
}

export function validateHandle(handle: any): handle is Record<string, any> {
  return typeof handle === 'object' && handle !== null && !Array.isArray(handle)
}

export function mergeHandles(...handles: (Record<string, any> | null)[]): Record<string, any> | null {
  const validHandles = handles.filter(validateHandle)

  if (validHandles.length === 0) {
    return null
  }

  if (validHandles.length === 1) {
    return validHandles[0]
  }

  return validHandles.reduce((merged, current) => deepMerge(merged, current), {})
}

function deepMerge(target: Record<string, any>, source: Record<string, any>): Record<string, any> {
  const result = { ...target }

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key]
      const targetValue = result[key]

      const isSourceObject = typeof sourceValue === 'object' && sourceValue !== null && !Array.isArray(sourceValue)
      const isTargetObject = typeof targetValue === 'object' && targetValue !== null && !Array.isArray(targetValue)

      if (isSourceObject && isTargetObject) {
        result[key] = deepMerge(targetValue, sourceValue)
      }
      else {
        result[key] = sourceValue
      }
    }
  }

  return result
}

export function extractAndMergeHandles(filePaths: string[]): Record<string, any> | null {
  return mergeHandles(...filePaths.map(extractHandleFromFile))
}
