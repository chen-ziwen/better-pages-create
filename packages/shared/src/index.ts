import { slash } from '@antfu/utils'
import Debug from 'debug'
import micromatch from 'micromatch'
import serializeJavascript from 'serialize-javascript'

export * from './constants'

export const debug = {
  hmr: Debug('better-pages-create:hmr'),
  routeBlock: Debug('better-pages-create:routeBlock'),
  options: Debug('better-pages-create:options'),
  pages: Debug('better-pages-create:pages'),
  search: Debug('better-pages-create:search'),
  env: Debug('better-pages-create:env'),
  cache: Debug('better-pages-create:cache'),
  resolver: Debug('better-pages-create:resolver'),
}

export function extsToGlob(extensions: string[]) {
  return extensions.length > 1 ? `{${extensions.join(',')}}` : extensions[0] || ''
}

export function countSlash(value: string) {
  return (value.match(/\//g) || []).length
}

export function parsePageRequest(id: string) {
  const [moduleId, rawQuery] = id.split('?', 2)
  const query = new URLSearchParams(rawQuery)
  const pageId = query.get('id')
  return {
    moduleId,
    query,
    pageId,
  }
}

export function isRouteGroup(name: string) {
  const lastName = name.split('_').at(-1)
  return lastName?.startsWith('(') && lastName?.endsWith(')')
}

export function splitRouterName(name: string, separator = '_') {
  const names = name.split(separator)

  return names.reduce((prev, cur) => {
    const last = prev[prev.length - 1]
    const next = last ? `${last}${separator}${cur}` : cur
    prev.push(next)
    return prev
  }, [] as string[])
}

export { micromatch, serializeJavascript as serialize, slash }
